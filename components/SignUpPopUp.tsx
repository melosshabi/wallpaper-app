import { Animated, Dimensions, Easing, Image, Pressable, StyleSheet, Text, useColorScheme } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { useNavigation } from '@react-navigation/native'
import colors from '../lib/colors'

export default function SignUpPopUp({showPopUp, setShowPopUp}:{showPopUp:boolean, setShowPopUp:React.Dispatch<React.SetStateAction<boolean>>}) {
    const navigation = useNavigation()
    const darkMode = useColorScheme() === 'dark'
    
    const bottomVal = useRef(new Animated.Value(-dvh / 3)).current
    useEffect(() => {
        if(showPopUp){
            Animated.timing(bottomVal, {
                toValue:0,
                easing: Easing.linear,
                useNativeDriver:false,
                duration:100
            }).start()
        }
    }, [showPopUp])
    function resetAnimation(){
        bottomVal.setValue(-dvh / 3)
        setShowPopUp(false)
    }
  return (
    
    <Animated.View style={[styles.popUp, {bottom:bottomVal}, darkMode ? styles.darkPopUp : styles.lightPopUp]}>
        <Pressable onPress={() => resetAnimation()} style={({pressed}) => [styles.closeButton, pressed ? {backgroundColor: darkMode ? colors.transparentWhite : colors.lightGray} : {}]}>
            <Image style={styles.xIcon} source={darkMode ? require('../images/whiteX.png') : require('../images/blackX.png')}/>
        </Pressable>
        <Text style={[styles.headerText, darkMode ? styles.darkText : styles.lightText]}>Sign Up</Text>
        <Text style={[styles.text,darkMode ? styles.darkText : styles.lightText]}>You need to sign up for an account before saving wallpapers to your favorites</Text>
        {/* @ts-ignore */}
        <Pressable style={({pressed}) => [styles.signUpButton, darkMode ? styles.darkButton : styles.lightButton, pressed ? {backgroundColor: darkMode ? colors.transparentWhite : colors.lightGray} : {}]} onPress={() => navigation.navigate('SignUp', undefined)}>
            <Text style={[styles.text, {color:colors.white}]}>Sign Up</Text>
        </Pressable>
    </Animated.View>
  ) 
}
const dvh = Dimensions.get('window').height
const dvw = Dimensions.get('window').width
const styles = StyleSheet.create({
    popUp:{
        position:'absolute',
        height:dvh / 3,
        width:dvw,
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
    },
    darkPopUp:{
        backgroundColor:colors.black,
    },
    lightPopUp:{
        backgroundColor:colors.white
    },
    closeButton:{
        alignSelf:'flex-end',
        borderRadius:50,
        
    },
    xIcon:{
        width:50,
        height:50
    },
    headerText:{
        fontSize:30,
        textAlign:'center',
        marginVertical:10,
    },
    darkText:{
        color:colors.white
    },
    lightText:{
        color:colors.black
    },
    text:{
        textAlign:'center'
    },
    signUpButton:{
        width:dvw / 2.5,
        alignSelf:'center',
        marginTop:50,
        paddingVertical:10,
        paddingHorizontal:15,
        backgroundColor:colors.orange,
        borderRadius:8
    },
    buttonText:{
        fontSize:20
    }
})