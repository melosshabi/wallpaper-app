import { Dimensions, Image, Pressable, StyleSheet, Text, View, useColorScheme, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import {auth, db} from '../lib/firebase-config'
import colors from '../lib/colors'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { useNavigation } from '@react-navigation/native'
import { darkModeOptions } from '../App'
import {default as storage} from "@react-native-async-storage/async-storage"

export default function Profile() {

    const navigation = useNavigation()
    const [favoriteWallpapers, setFavoriteWallpapers] = useState<FavoriteWallpapers[]>([])
    const [darkMode, setDarkMode] = useState<boolean>(false)
    const colorScheme = useColorScheme()
    useEffect(() => {
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
        // Decides whether to go with dark mode or not
        async function setColorScheme(){
            const darkModeSetting = await storage.getItem('darkMode')
            if(darkModeSetting === darkModeOptions.disabled){
                setDarkMode(false)
            }else if(darkModeSetting === darkModeOptions.enabled){
                setDarkMode(true)
            }else{
                setDarkMode(colorScheme === 'dark')
            }
        }
        setColorScheme()
        fetchFavorites()
    }, [])

  return (
    <View style={[styles.profileScreen, darkMode ? styles.darkProfileScreen : styles.lightProfileScreen]}>
      <View style={[styles.profileHeader, darkMode ? styles.darkProfileHeader : {}]}>
        <View style={styles.profilePictureWrapper}>
            <Image style={styles.profilePicture} source={!auth.currentUser?.photoURL && !darkMode ? require("../images/blackUser.png") : !auth.currentUser?.photoURL && darkMode ? require('../images/whiteUser.png') : auth.currentUser?.photoURL} />
        </View>
        <View style={styles.usernameWrapper}>
            <Text style={[styles.username, darkMode ? {color:colors.white} : {color:colors.black}]}>{auth.currentUser?.displayName}</Text>
            <Pressable style={({pressed}) => [styles.editButton, darkMode ? styles.darkButton : styles.lightButton, pressed ? {backgroundColor:colors.lightGray} : {}]}>
                <Text style={[styles.editButtonText, darkMode ? styles.darkEditButtonText : styles.lightEditButtonText]}>Edit Profile</Text>
            </Pressable>
        </View>
      </View>
      <View style={styles.profileScreenBody}>
            <View style={[styles.profileScreenBodyTop, darkMode ? styles.darkProfileScreenBodyTop : styles.lightProfileScreenBodyTop]}>
                <Image style={styles.heartIcon} source={darkMode ? require('../images/emptyWhiteHeart.png') : require('../images/emptyBlackHeart.png')}/>
            </View>
            {/* Favorite saved images */}
            <View style={styles.profileScreenBodyBottom}>
                <FlatList data={favoriteWallpapers} numColumns={2} 
                    renderItem={({item}) => (
                         // @ts-ignore
                        <Pressable style={styles.photosWrappers} onPress={() => navigation.navigate('WallpaperDetails', {wallpaperUrl:item.photoUrl, navigatedFromProfile:true})}>
                            <Image source={{uri:item.photoUrl}} style={styles.Photos}/>
                        </Pressable>
                    )}
                />
            </View>
      </View>
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
        width:50,
        height:50,
        borderRadius:50,
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
    darkButton:{
        backgroundColor:colors.white,
    },
    lightButton:{
        backgroundColor:colors.black
    },
    editButtonText:{},
    darkEditButtonText:{
        color:colors.black,
    },
    lightEditButtonText:{
        color:colors.white
    },
    profileScreenBody:{},
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
    Photos:{
        width:dvw / 2.2,
        height:280,
        borderRadius:10,
        position:'absolute'
    }
})