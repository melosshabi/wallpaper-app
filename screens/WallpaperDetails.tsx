import { StyleSheet, Text, View, useColorScheme, Image, Dimensions, Pressable, BackHandler } from 'react-native'
import React, { useEffect, useState } from 'react'
import { DrawerScreenProps } from '@react-navigation/drawer'
import colors from '../lib/colors'
import { useNavigation } from '@react-navigation/native'
import RNFetchBlob from 'rn-fetch-blob'
// @ts-ignore
import ManageWallpaper, { TYPE } from 'react-native-manage-wallpaper';
import Snackbar from 'react-native-snackbar'
import { auth, db } from '../lib/firebase-config'
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore'
import SignUpPopUp from '../components/SignUpPopUp'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

type WallpaperDetailsProps = DrawerScreenProps<ComponentProps, 'WallpaperDetails'>

const dvw = Dimensions.get('window').width
const dvh = Dimensions.get('window').height

export default function WallpaperDetails({route}: WallpaperDetailsProps) {
    
    const darkMode = useColorScheme() === 'dark'
    const navigation = useNavigation()

    const [isWallpaperInFavorites, setIsWallpaperInFavorites] = useState(false)
    useEffect(() => {
        auth.onAuthStateChanged(async () => {
            if(auth.currentUser){
                const favoritesCollection = collection(db, 'favoritePhotos')
                const wallpaperQuery = query(favoritesCollection, where("userId", "==", auth.currentUser.uid), where("photoUrl", "==", route.params.wallpaperUrl))
                const wallpaperDocs = await getDocs(wallpaperQuery)
                if(!wallpaperDocs.empty){
                    wallpaperDocs.forEach(doc => {
                        if(doc.data().photoUrl === route.params.wallpaperUrl){
                            setIsWallpaperInFavorites(true)
                        }
                    })
                }
            }
        })
    }, [])
    
    async function downloadImage(url:string){
        const date = new Date()
        const pictureDir = RNFetchBlob.fs.dirs.PictureDir
        RNFetchBlob.config({
            addAndroidDownloads:{
                useDownloadManager:true,
                mime:'image',
                path:`${pictureDir}/Mela Wallpapers/${Math.floor(date.getTime() + date.getSeconds() / 2)}.jpg`,
                description:"Wallpaper download",
                notification:true,
                mediaScannable:true
            }
        }).fetch('GET', url)
    }

    const [showWallpaperTypes, setShowWallpaperTypes] = useState<boolean>(false)
    const wallpaperTypesScale = useSharedValue(0)
    const wallpaperTypesAnimStyle = useAnimatedStyle(() => {
        return {
            transform:[{scale:wallpaperTypesScale.value}]
        }
    })
    enum WallpaperTypesActions {
        show,
        hide
    }
    function toggleWallpaperTypes(action: WallpaperTypesActions){
        if(action === WallpaperTypesActions.show){
            setShowWallpaperTypes(true)
            wallpaperTypesScale.value = withTiming(1, {
                duration:300,
                easing:Easing.elastic(2)
            })
        }else{
            wallpaperTypesScale.value = withTiming(0, {
                duration:300,
                easing:Easing.elastic(2)
            })
            setShowWallpaperTypes(false)
        }
    }
    function setWallpaper(wallpaperType: TYPE.HOME | TYPE.LOCK | TYPE.BOTH, uri:string){
        setShowWallpaperTypes(false)
        ManageWallpaper.setWallpaper({
            uri:`${uri}.png`
        },
        () => Snackbar.show({
            text:"Wallpaper changed",
            duration:Snackbar.LENGTH_SHORT
        }),
        wallpaperType
        )
    }
    BackHandler.addEventListener('hardwareBackPress', () =>{
        if(showWallpaperTypes){
            setShowWallpaperTypes(false)
            return true
        }
        if(route.params.navigatedFromProfile){
            // @ts-ignore
            navigation.navigate('Profile', undefined)
            return true
        }
        navigation.goBack()
        return true
    })
    const [showPopUp, setShowPopUp] = useState<boolean>(false)

    async function addToFavorites(photoUrl:string){
        if(auth.currentUser){
            const favoritesCollection = collection(db, 'favoritePhotos')
            const wallpaperQuery = query(favoritesCollection, where("userId", "==", auth.currentUser.uid), where("photoUrl", "==", photoUrl))
            const wallpaperDocs = await getDocs(wallpaperQuery)
            if(!wallpaperDocs.empty){
                if(wallpaperDocs.docs[0].data().photoUrl === photoUrl){
                    Snackbar.show({
                        text:'Wallpaper is already on your favorites',
                        duration:Snackbar.LENGTH_LONG
                    })
                    return
                }
            }
            await addDoc(favoritesCollection, {
                userId:auth.currentUser.uid,
                username:auth.currentUser.displayName,
                photoUrl
            })
                Snackbar.show({
                    text:'Wallpaper Saved',
                    duration:Snackbar.LENGTH_LONG
                })
                setIsWallpaperInFavorites(true)
        }else{
            setShowPopUp(true)
        }
    }
    async function removeFromFavorites(photoUrl:string){
        if(auth.currentUser){
            const favoritesCollection = collection(db, 'favoritePhotos')
            const wallpaperQuery = query(favoritesCollection, where("userId", "==", auth.currentUser.uid), where("photoUrl", "==", photoUrl))
            const wallpaperDocs = await getDocs(wallpaperQuery)
            wallpaperDocs.docs.forEach(async document => {
                if(document.data().photoUrl === route.params.wallpaperUrl){
                    const wallpaperDoc = doc(db, 'favoritePhotos', document.id)
                    await deleteDoc(wallpaperDoc)
                    Snackbar.show({
                        text:"Wallpaper removed from favorites",
                        duration:Snackbar.LENGTH_LONG,
                    })
                    setIsWallpaperInFavorites(false)
                }
            })
        }
    }
  return (
    <View style={styles.wallpaperWrapper}>
        <Pressable onPress={() => toggleWallpaperTypes(WallpaperTypesActions.hide)} style={[styles.blackView, !showWallpaperTypes ? styles.invisibleElem : {}]}></Pressable>
        <Image style={styles.wallpaper} source={{uri:route.params.wallpaperUrl}}/>

        <View style={styles.wallpaperHeader}>
            <Pressable onPress={() => {
                // @ts-ignore
                if(route.params.navigatedFromProfile) navigation.navigate('Profile', undefined)
                else navigation.goBack()
            }} style={({pressed}) => [styles.backBtn, pressed ? {backgroundColor: darkMode ? colors.transparentWhite : colors.lightGray} : {}] } >
                <Image style={styles.backArrow} source={require('../images/whiteArrow.png')} />
            </Pressable>
        </View>

        <Animated.View style={[styles.wallpaperTypesWrapper, !showWallpaperTypes ? styles.invisibleElem : {}, wallpaperTypesAnimStyle]}>
            <Pressable onPress={() => setWallpaper(TYPE.HOME, route.params.wallpaperUrl)} style={({pressed}) => [styles.wallpaperTypesButtons, pressed ? {backgroundColor:colors.transparentWhite} : {}]}>
                <Image style={styles.wallpaperTypesImages} source={require('../images/phone.png')}/><Text style={{color:'white'}}>Homescreen</Text></Pressable>
            <Pressable onPress={() => setWallpaper(TYPE.LOCK, route.params.wallpaperUrl)} style={({pressed}) => [styles.wallpaperTypesButtons, pressed ? {backgroundColor:colors.transparentWhite} : {}]}>
                <Image style={styles.wallpaperTypesImages} source={require('../images/lock.png')}/><Text style={{color:'white'}}>Lockscreen</Text></Pressable>
            <Pressable onPress={() => setWallpaper(TYPE.BOTH, route.params.wallpaperUrl)} style={({pressed}) => [styles.wallpaperTypesButtons, pressed ? {backgroundColor:colors.transparentWhite} : {}]}>
                <Image style={[styles.wallpaperTypesImages ]} source={require('../images/phone.png')}/>
                <Image style={[styles.wallpaperTypesImages, styles.lock]} source={require('../images/lock.png')}/>
                <Text style={{color:'white', transform:[{translateX:-15}]}}>Both</Text></Pressable>
        </Animated.View>

        <View style={styles.actionsWrapper}>
            <Pressable onPress={() => downloadImage(route.params.wallpaperUrl)} style={({pressed}) => [styles.actionButtons, pressed ? {backgroundColor:colors.transparentWhite} : {}]}>
                <Image style={styles.actionIcons} source={require('../images/whiteDownload.png')} />
            </Pressable>
            <Pressable onPress={() => toggleWallpaperTypes(WallpaperTypesActions.show)} style={({pressed}) => [styles.actionButtons, pressed ? {backgroundColor:colors.transparentWhite} : {}]}>
                <Image style={styles.actionIcons} source={require('../images/photo.png')}/>
            </Pressable>
            <Pressable onPress={()=> {
                if(!isWallpaperInFavorites) addToFavorites(route.params.wallpaperUrl)
                else removeFromFavorites(route.params.wallpaperUrl)
                }} style={({pressed}) => [styles.actionButtons, pressed ? {backgroundColor:colors.transparentWhite} : {}]}>
                <Image style={styles.actionIcons} source={isWallpaperInFavorites ? require('../images/filledWhiteHeart.png') : require('../images/emptyWhiteHeart.png')}/>
            </Pressable>
        </View>

        <SignUpPopUp showPopUp={showPopUp} setShowPopUp={setShowPopUp}/>
    </View>
  )
}

const styles = StyleSheet.create({
    wallpaperWrapper:{
        flex:1,
        position:'relative',
        justifyContent:'space-between'
    },
    blackView:{
        position:'absolute',
        width:dvw,
        height:dvh,
        backgroundColor:'rgba(0, 0, 0, .5)',
        top:0,
        zIndex:1
    },
    wallpaperHeader:{
        height:dvh / 15,
        width:dvw,
        backgroundColor:'rgba(0, 0, 0, .6)',
        justifyContent:'center'
    },
    backBtn:{
        width:40,
        height:40,
        borderRadius:8,
        alignItems:'center',
        justifyContent:'center'
    },
    backArrow:{
        transform:[{rotate:'180deg'}],
        width:25,
        height:25,
        marginLeft:5
    },
    wallpaper:{
        width:dvw,
        height:dvh ,
        position:'absolute',
        top:0,
        left:0,
    },
    actionsWrapper:{
        height:dvh / 12,
        width:dvw,
        backgroundColor:'rgba(0, 0, 0, .6)',
        flexDirection:'row',
        justifyContent:'space-around'
    },
    actionButtons:{
        height:50,
        width:50,
        borderRadius:8,
        justifyContent:'center',
        alignItems:'center',
        marginTop:10
    },
    actionIcons:{
        width:25,
        height:25
    },
    wallpaperTypesWrapper:{
        width:dvw / 1.2,
        marginLeft:'9%',
        backgroundColor:"rgba(0, 0, 0, .8)",
        padding:20,
        borderRadius:10,
        zIndex:2
    },
    invisibleElem:{
        display:'none'
    },
    wallpaperTypesButtons:{
        marginVertical:15,
        flexDirection:'row',
        alignItems:'center',
        paddingVertical:10,
        borderRadius:10
    },
    wallpaperTypesImages:{
        width:35,
        height:35
    },
    lock:{
        width:15,
        height:15,
        transform:[{translateX:-25}]
    }
})