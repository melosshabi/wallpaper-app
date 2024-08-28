import { Dimensions, Image, Pressable, StyleSheet, Text, View, useColorScheme, FlatList, TextInput, Keyboard, Alert, BackHandler, } from 'react-native'
import Animated, { runOnUI, useAnimatedStyle, useSharedValue, withTiming, Easing } from 'react-native-reanimated'
import React, { useEffect, useState } from 'react'
import {auth, db, storage} from '../lib/firebase-config'
import colors from '../lib/colors'
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore'
import { useNavigation } from '@react-navigation/native'
import { sendPasswordResetEmail, signOut, updateEmail, updateProfile } from 'firebase/auth'
import Snackbar from 'react-native-snackbar'
import { launchImageLibrary } from 'react-native-image-picker'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

export default function Profile() {

    const navigation = useNavigation()
    const [favoriteWallpapers, setFavoriteWallpapers] = useState<FavoriteWallpapers[]>([])
    const darkMode = useColorScheme() === 'dark'
    const [showEditForm, setShowEditForm] = useState<boolean>(false)
    const [username, setUsername] = useState<string>("")
    const [email, setEmail] = useState("")
    useEffect(() => {

        auth.onAuthStateChanged(() => {
            if(auth.currentUser){
                setUsername(auth.currentUser?.displayName as string)
                setEmail(auth.currentUser?.email as string)
            }else{
                // @ts-ignore
                navigation.navigate("SignUp", undefined)
            }
        })
        
        async function fetchFavorites(){
            let tempArr: FavoriteWallpapers[] = []
            const photosColRef = collection(db, 'favoritePhotos')
            const photosQuery = query(photosColRef, where("userId", "==", auth.currentUser?.uid))
            const photosSnap = await getDocs(photosQuery)
            photosSnap.forEach(photo => {
                tempArr.push({  userId:photo.data().userId,
                                photoUrl:photo.data().photoUrl,
                                username:photo.data().username, 
                                id:photo.id})
            })
            setFavoriteWallpapers([...tempArr])
        }
        fetchFavorites()
    }, [])

    const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false)
    Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true))
    Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false))

    const [newProfilePicture, setNewProfilePicture] = useState<{url:string, mediaName:string} | null>(null)
    function showImageSelector(){
        launchImageLibrary({mediaType:'photo'}, res => {
            if(res.assets && res.assets[0]){
                setNewProfilePicture({
                    url:res.assets[0].uri as string,
                    mediaName:res.assets[0].fileName as string
                })
            }
        })
    }
    const [savingChanges, setSavingChanges] = useState<boolean>(false)
    async function turnImageToBlob(url:string){
        const picture = await fetch(url)
        const blob = await picture.blob()
        return blob
    }
    async function saveChanges(){
        setSavingChanges(true)
        if(newProfilePicture){
            const blob = await turnImageToBlob(newProfilePicture.url)
            const storageRef = ref(storage, `ProfilePictures/Picture${auth?.currentUser?.uid}`)
            const metadata = {
                customMetadata:{
                    'uploaderId':auth?.currentUser?.uid as string,
                    'uploaderName':auth?.currentUser?.displayName as string
                }
            }
            await uploadBytes(storageRef, blob, metadata)
            .catch(err => {
                if(err.code === 'storage/quota-exceeded'){
                    Snackbar.show({
                        text:"The daily quota for the database has been exceeded",
                        duration:Snackbar.LENGTH_LONG
                    })
                }else if(err.code === 'storage/unauthorized'){
                    Snackbar.show({
                        text:"Picture DB Permission Denied",
                        duration:Snackbar.LENGTH_LONG
                    })
                }
                setSavingChanges(false)
            })
            const uploadedPictureUrl = await getDownloadURL(storageRef)
            // @ts-ignore
            await updateProfile(auth?.currentUser, {displayName:username, photoURL:uploadedPictureUrl})
            await updateEmail(auth.currentUser!, email)
            .catch(err => {
                if(err.code === 'auth/requires-recent-login'){
                    Alert.alert('Database error', 'Database requires a recent login before updating your email', [
                        {
                            text:"Cancel",
                            onPress: () => {
                                setSavingChanges(false)
                                setShowEditForm(false)
                            }
                        },
                        {
                            text:"Re-Log in",
                            onPress: async () => {
                                await signOut(auth)
                                // @ts-ignore
                                navigation.navigate("SignIn", undefined)
                            }
                        }
                    ])
                }
            })
            Snackbar.show({
                text:"Profile Updated",
                duration:Snackbar.LENGTH_LONG
            })
        }else{
            // @ts-ignore
            await updateProfile(auth?.currentUser!, {displayName:username})
            await updateEmail(auth.currentUser!, email)
            Snackbar.show({
                text:"Profile Updated",
                duration:Snackbar.LENGTH_LONG
            })
        }
        setSavingChanges(false)
        setShowEditForm(false)
    }
    async function resetPassword(){
        if(Keyboard.isVisible()) Keyboard.dismiss()
        sendPasswordResetEmail(auth, auth.currentUser?.email as string)
        .then(() => {
            Snackbar.show({
                text:"Password reset email sent",
                duration:Snackbar.LENGTH_LONG
            })
        })
    }
    // Select mode is what allows the user to select the wallpapers they have added to their favorites 
    // and remove multiple wallpapers from their favorites at the same time
    const [selectMode, setSelectMode] = useState<boolean>(false)
    const [selectedWallpapers, setSelectedWallpapers] = useState<string[]>([])
    const wallpaperScale = useSharedValue(1)
    const deleteButtonScale = useSharedValue(0.1)
    const deleteButtonRotate = useSharedValue(-100)
    const animationStylesForDeleteButton = useAnimatedStyle(() => {
        return {
            transform:[{scale:deleteButtonScale.value}, {rotate:`${deleteButtonRotate.value}deg`}]
        }
    })
    const selectModeWallpaperAnimStyle = useAnimatedStyle(() => {
        return {
            transform:[{scale:wallpaperScale.value}]
        }
    })
    enum AnimActions {
        grow,
        shrink
    }
    async function animateWallpapers(action:AnimActions){
        'worklet'
        if(action === AnimActions.shrink){
            wallpaperScale.value = withTiming(.9, {
                duration:50,
                easing:Easing.linear
            })
        }else if(action === AnimActions.grow){
            wallpaperScale.value = withTiming(1, {
                duration:50,
                easing:Easing.linear
            })
        }
    }
    async function animateDeleteButton(action:AnimActions){
        'worklet'
        if(action === AnimActions.grow){
            deleteButtonScale.value = withTiming(1, {
                duration:400,
                easing:Easing.elastic(2)
            })
            deleteButtonRotate.value = withTiming(0, {
                duration:400,
                easing:Easing.elastic(2)
            })
        }else if(action === AnimActions.shrink){
            deleteButtonScale.value = withTiming(0, {
                duration:400,
                easing:Easing.elastic(2)
            })
            deleteButtonRotate.value = withTiming(-100, {
                duration:400,
                easing:Easing.elastic(2)
            })
        }
    }

    useEffect(() => {
        if(selectMode){
            runOnUI(animateWallpapers)(AnimActions.shrink)
        }else{
            runOnUI(animateWallpapers)(AnimActions.grow)
        }

        if(selectedWallpapers.length > 0){
            runOnUI(animateDeleteButton)(AnimActions.grow)
        }else{
            runOnUI(animateDeleteButton)(AnimActions.shrink)
        }
    }, [selectMode, selectedWallpapers])

    function toggleSelectMode(){
        setSelectMode(true)
    }
    BackHandler.addEventListener('hardwareBackPress', () => {
        if(selectMode){
            setSelectMode(false)
            return true
        }
        return true
    })
    
    function handleWallpaperPress(wallpaperUrl:string){
        if(selectMode){
            if(selectedWallpapers.includes(wallpaperUrl))
            {
                const tempArr = [...selectedWallpapers]
                const newArr = tempArr.filter(url => url !== wallpaperUrl)
                setSelectedWallpapers([...newArr])
            }
            else setSelectedWallpapers(prev => [...prev, wallpaperUrl])
        }else{
            // @ts-ignore
            navigation.navigate('WallpaperDetails', {wallpaperUrl, navigatedFromProfile:true})
        }
    }
    async function removeFavoriteWallpapers(){
        setSelectMode(false)
        const newArr = [...favoriteWallpapers]
        // This array will hold the document IDs that will be used to delete the documents from the database
        const wallpapersToRemove: string[] = []
        favoriteWallpapers.forEach(wallpaper => {
            if(selectedWallpapers.includes(wallpaper.photoUrl)){
                wallpapersToRemove.push(wallpaper.id)
            }
        })
        // The array below will hold the wallpaper objects that the user does not want to delete
        const filteredArr = newArr.filter(wallpaper => !wallpapersToRemove.includes(wallpaper.id))
        setFavoriteWallpapers(filteredArr)
        setSelectedWallpapers([])
        wallpapersToRemove.forEach(async wallpaperId => {
            const docRef = doc(db, 'favoritePhotos', wallpaperId)
            await deleteDoc(docRef)
        })
        
    }
  return (
    <View style={[styles.profileScreen, darkMode ? styles.darkProfileScreen : styles.lightProfileScreen]}>

        <View style={[styles.profileHeader, darkMode ? styles.darkProfileHeader : {}]}>
            <View style={styles.profilePictureWrapper}>
                <Image style={styles.profilePicture} source={auth.currentUser?.photoURL ? {uri:auth.currentUser.photoURL} : !auth.currentUser?.photoURL && !darkMode ? require("../images/blackUser.png") : !auth.currentUser?.photoURL && darkMode ? require('../images/whiteUser.png') : auth.currentUser?.photoURL} />
            </View>

            <View style={styles.usernameWrapper}>
                <Text style={[styles.username, darkMode ? {color:colors.white} : {color:colors.black}]}>{auth.currentUser?.displayName}</Text>
                <Pressable onPress={() => setShowEditForm(true)} style={({pressed}) => [styles.editButton, darkMode ? styles.darkModeButton : styles.lightModeButton, pressed ? {backgroundColor:colors.lightGray} : {}]}>
                    <Text style={[ darkMode ? styles.darkEditButtonText : styles.lightEditButtonText]}>Edit Profile</Text>
                </Pressable>
            </View>

        </View>

        <View>

            <View style={[styles.profileScreenBodyTop, darkMode ? styles.darkProfileScreenBodyTop : styles.lightProfileScreenBodyTop]}>
                <Image style={styles.heartIcon} source={darkMode ? require('../images/emptyWhiteHeart.png') : require('../images/emptyBlackHeart.png')}/>
            </View>

            {/* Favorite saved images */}
            <View style={styles.profileScreenBodyBottom}>
                <FlatList data={favoriteWallpapers} numColumns={2} 
                    renderItem={({item}) => (
                        <Pressable style={styles.photosWrappers} 
                            // @ts-ignore
                            onPress={() => handleWallpaperPress(item.photoUrl)}
                            onLongPress={() => toggleSelectMode()}
                            >
                            <Animated.Image source={{uri:item.photoUrl}} style={[styles.wallpapers, selectModeWallpaperAnimStyle]}/>
                            {selectMode && 
                                <View style={[styles.checkmarkWrapper, selectedWallpapers.includes(item.photoUrl) && {backgroundColor:colors.orange}]}>
                                    {selectedWallpapers.includes(item.photoUrl) && <Image style={styles.checkmark} source={require('../images/whiteCheckmark.png')}/>}
                                </View>
                            }
                        </Pressable>
                    )}
                />
            </View>

        </View>

        {/* The button that removes the selected wallpapers from the users' favorites */}
        {
        selectMode && 
        <Pressable onPress={() => removeFavoriteWallpapers()}>
            <Animated.View style={[styles.deleteButton, animationStylesForDeleteButton]}>
            <Image style={styles.trashIcon} source={require('../images/whiteTrash.png')}/>
            </Animated.View>
        </Pressable>
        }

        {/* Edit Profile Form */}
        { showEditForm && <Pressable onPress={() => setShowEditForm(false)} 
            style={styles.editFormWrapper}>
            <Pressable onPress={() => {}} style={[styles.editForm, keyboardVisible && {transform:[{translateY:-150}], backgroundColor:'red'},darkMode ? styles.darkModeEditForm : styles.lightModeEditForm]}>
                <View style={styles.editFormProfilePictureWrapper}>
                    {
                        !newProfilePicture ?
                            <Image style={styles.profilePicture} source={auth.currentUser?.photoURL ? {uri:auth.currentUser?.photoURL} : !auth.currentUser?.photoURL && darkMode ? require('../images/whiteUser.png') : require('../images/blackUser.png')}/>
                            :
                            <Image style={styles.profilePicture} source={{uri:newProfilePicture.url}}/>
                    }
                    <Pressable onPress={() => showImageSelector()} style={({pressed}) => [pressed && {opacity:.8},styles.pictureButton, darkMode ? styles.darkModeButton : styles.lightModeButton]}>
                        <Text style={darkMode ? styles.blackText : styles.whiteText}>Choose new picture</Text>
                    </Pressable>
                </View>
                <View style={styles.userInfo}>
                    <TextInput
                    value={username}
                    onChangeText={setUsername}
                    placeholder='Username'
                    style={styles.userInfoInputs}
                    />
                    <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder='Email'
                    style={styles.userInfoInputs}
                    autoCapitalize='none'
                    />
                    <Pressable onPress={() => saveChanges()} disabled={savingChanges} style={({pressed}) => [styles.formButtons, pressed && {opacity:.7}, darkMode ? styles.darkModeFormButtons : styles.lightModeFormButtons]}>
                        <Text style={darkMode ? styles.blackText : styles.whiteText}>{savingChanges ? 'Saving' : 'Save Changes'}</Text>
                    </Pressable>

                    <Pressable onPress={() => resetPassword()} style={({pressed}) => [styles.formButtons, pressed && {opacity:.7},darkMode ? styles.darkModeFormButtons : styles.lightModeFormButtons]}>
                        <Text style={darkMode ? styles.blackText : styles.whiteText}>Reset Password</Text>
                    </Pressable>
                </View>
            </Pressable>
        </Pressable>}
    </View>
  )
}

const dvw = Dimensions.get("window").width
const dvh = Dimensions.get('window').height
const styles = StyleSheet.create({
    profileScreen:{
        height:dvh
    },
    darkProfileScreen:{
        backgroundColor:colors.black
    },
    lightProfileScreen:{
        backgroundColor:colors.white
    },
    profileHeader:{
        borderBottomWidth:1,
        height:dvh / 6,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    darkProfileHeader:{
        borderBottomColor:colors.white
    },
    profilePictureWrapper:{
        marginRight:20
    },
    profilePicture:{
        width:60,
        height:60,
        borderRadius:50,
        marginRight:15
    },
    usernameWrapper:{
        alignItems:'center',
    },
    username:{
        textAlign:'center',
        marginBottom:10
    },
    editButton:{
        paddingVertical:5,
        paddingHorizontal:10,
        borderRadius:8
    },
    darkModeButton:{
        backgroundColor:colors.white,
    },
    lightModeButton:{
        backgroundColor:colors.black
    },
    darkEditButtonText:{
        color:colors.black,
    },
    lightEditButtonText:{
        color:colors.white
    },
    profileScreenBodyTop:{
        width:dvw / 3,
        alignItems:'center',
        marginLeft:dvw / 2.8,
    },
    darkProfileScreenBodyTop:{
        borderBottomColor:colors.white,
        borderBottomWidth:1,
    },
    lightProfileScreenBodyTop:{
        borderBottomColor:colors.black,
        borderBottomWidth:1,
    },
    profileScreenBodyBottom:{
        height:dvh / 1.45,
    },
    heartIcon:{
        width:35,
        height:35,
        marginVertical:10,
    },
    photosWrappers:{
        width:dvw / 2.2,
        height:280,
        marginLeft:10,
        marginVertical:10,
        position:'relative',
        alignItems:'flex-end',
        justifyContent:'flex-end'
    },
    wallpapers:{
        width:dvw / 2.2,
        height:280,
        borderRadius:10,
        position:'absolute'
    },
    checkmarkWrapper:{
        width:30,
        height:30,
        position:'absolute',
        top:15,
        right:10,
        borderRadius:50,
        borderWidth:1,
        borderColor:'white',
        alignItems:'center',
        justifyContent:'center'
    },
    checkmark:{
        width:20,
        height:20
    },
    deleteButton:{
        width:50, 
        height:50, 
        backgroundColor:'orange', 
        position:'absolute', 
        right:20, 
        bottom:40, 
        borderRadius:50, 
        justifyContent:'center', 
        alignItems:'center',
        elevation:4,
        shadowColor:'white'
    },
    trashIcon:{
        width:25,
        height:25
    },
    editFormWrapper:{
        position:'absolute',
        width:dvw,
        height:dvh,
        top:0,
        backgroundColor:'rgba(0, 0, 0, .8)',
        alignItems:'center',
        justifyContent:'center'
    },
    editForm:{
        height:dvh / 1.7,
        width:dvw / 1.1,
        alignItems:'center'
    },
    darkModeEditForm:{
        backgroundColor:colors.black,
        shadowColor:colors.white,
        elevation:5,
        borderRadius:10,
        borderWidth:1,
        borderColor:colors.white,
        padding:15,
    },
    lightModeEditForm:{
        backgroundColor:colors.white
    },
    editFormProfilePictureWrapper:{
        flexDirection:'row',
        alignItems:"center",
        marginBottom:50
    },
    pictureButton:{
        padding:10,
        borderRadius:10
    },
    userInfo:{
        width:'80%',
        // backgroundColor:'red'
    },
    userInfoInputs:{
        borderBottomColor:'white',
        borderBottomWidth:1,
        marginVertical:5
    },
    formButtons:{
        marginTop:50,
        alignSelf:'center',
        padding:10,
        borderRadius:8
    },
    darkModeFormButtons:{
        backgroundColor:colors.white
    },
    lightModeFormButtons:{
        backgroundColor:colors.black
    },
    blackText:{
        color:colors.black
    },
    whiteText:{
        color:colors.white
    }
})