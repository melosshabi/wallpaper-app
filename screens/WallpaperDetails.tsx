import { StyleSheet, Text, View, useColorScheme, Image, Dimensions, Pressable } from 'react-native'
import React from 'react'
import { DrawerScreenProps } from '@react-navigation/drawer'
import colors from '../lib/colors'
import { useNavigation } from '@react-navigation/native'
import RNFetchBlob from 'rn-fetch-blob'
import { makeShareable } from 'react-native-reanimated/lib/typescript/reanimated2/shareables'

type WallpaperDetailsProps = DrawerScreenProps<ComponentProps, 'WallpaperDetails'>

const dvw = Dimensions.get('window').width
const dvh = Dimensions.get('window').height
export default function WallpaperDetails({route}: WallpaperDetailsProps) {
    const darkMode = useColorScheme() === 'dark'
    const navigation = useNavigation()

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
  return (
    <View style={styles.wallpaperWrapper}>
        <Image style={styles.wallpaper} source={{uri:route.params.wallpaperUrl}}/>

        <View style={styles.wallpaperHeader}>
            <Pressable onPress={() => navigation.goBack()} style={({pressed}) => [styles.backBtn, pressed ? {backgroundColor: darkMode ? colors.transparentWhite : colors.lightGray} : {}] } >
                <Image style={styles.backArrow} source={require('../images/whiteArrow.png')} />
            </Pressable>
        </View>

        <View style={styles.actionsWrapper}>
            <Pressable onPress={() => downloadImage(route.params.wallpaperUrl)} style={({pressed}) => [styles.actionButtons, pressed ? {backgroundColor:colors.transparentWhite} : {}]}>
                <Image style={styles.actionIcons} source={require('../images/whiteDownload.png')} />
            </Pressable>
            <Pressable style={({pressed}) => [styles.actionButtons, pressed ? {backgroundColor:colors.transparentWhite} : {}]}>
                <Image style={styles.actionIcons} source={require('../images/photo.png')}/>
            </Pressable>
            <Pressable style={({pressed}) => [styles.actionButtons, pressed ? {backgroundColor:colors.transparentWhite} : {}]}>
                <Image style={styles.actionIcons} source={require('../images/emptyWhiteHeart.png')}/>
            </Pressable>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    wallpaperWrapper:{
        flex:1,
        position:'relative',
        justifyContent:'space-between'
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
    }
})