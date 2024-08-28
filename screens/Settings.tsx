import { Dimensions, Image, Pressable, StyleSheet, Text, View, useColorScheme, Appearance, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import colors from '../lib/colors'
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';

const dvh = Dimensions.get('window').height
const dvw = Dimensions.get('window').width

export default function Settings(){

    const darkMode = useColorScheme() === 'dark'
    const darkModeOptions = {
        enabled:'true',
        disabled:'false',
        systemDefault:'systemDefault'
    }
    const dropDownData = [
        { label:"Dark", value:darkModeOptions.enabled  },
        { label:"Light", value:darkModeOptions.disabled }
    ]

    async function handleThemeChange(newDarkModeSetting: string){
        switch(newDarkModeSetting){
            case darkModeOptions.enabled:
                Appearance.setColorScheme('dark')
                break
            case darkModeOptions.disabled:
                Appearance.setColorScheme('light')
                break
            case darkModeOptions.systemDefault:
                Appearance.setColorScheme(null)
        }
    }

    async function openUrl(url:string){
        await Linking.openURL(url)
    }
  return (
    <View style={[styles.settingsPage, darkMode ? styles.darkSettingsPage : styles.lightSettingsPage]}>
        <Pressable style={styles.themeButton}>
            <Image style={styles.themeIcon} source={darkMode ? require('../images/themeIconForDarkMode.png') : require('../images/themeIconForLightMode.png')}/>
            <Text style={darkMode ? styles.darkModeText : styles.lightModeText}>Theme</Text>
            <Dropdown
                data={dropDownData}
                onChange={item => handleThemeChange(item.value)}
                labelField="label"
                valueField="value"
                placeholder=
                {darkMode === null ? "System Default"
                : darkMode === true ? "Dark" : "Light"
                }
                placeholderStyle={darkMode ? {color:colors.white} : {color:colors.black}}
                // value={darkMode ? "Dark" : !darkMode ? "Light" : "System Default"}
                style={[styles.dropDown]}
                // itemContainerStyle={darkMode ? {backgroundColor:colors.black} : {backgroundColor:colors.white}}
                itemTextStyle={[darkMode ? {color:colors.white} : {color:colors.black}]}
                containerStyle={darkMode ? {backgroundColor:colors.black} : {backgroundColor:colors.white}}
                activeColor={darkMode ? 'black' : 'white'}
                selectedTextStyle={darkMode ? {color:colors.white} : {color:colors.black}}
            />
        </Pressable>

        <View style={styles.socialsWrapper}>
            <Pressable onPress={() => openUrl('https://www.linkedin.com/in/melosshabi/')}>
                <Image style={styles.socialsIcons} source={darkMode ? require('../images/whiteLinkedin.png') : require("../images/blackLinkedin.png")}/>
            </Pressable>
            <Pressable onPress={() => openUrl("https://www.github.com/melosshabi")}>
                <Image style={styles.socialsIcons} source={darkMode ? require('../images/whiteGithub.png') : require('../images/blackGithub.png')}/>  
            </Pressable>
            <Pressable onPress={() => openUrl("https://www.melosshabi.com")}>
                <Image style={styles.socialsIcons} source={darkMode ? require('../images/whiteGlobe.png') : require('../images/blackGlobe.png')}/>
            </Pressable>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    settingsPage:{
        height:dvh - 56,
        justifyContent:'space-between',
        alignItems:'center'
    },
    darkSettingsPage:{
        backgroundColor:colors.black
    },
    lightSettingsPage:{
        backgroundColor:colors.white,
    },
    themeButton:{
        flexDirection:'row',
        alignItems:'center',
        marginTop:20
    },
    themeIcon:{
        width:50,
        height:50,
        marginRight:10
    },
    darkModeText:{
        color:colors.white,
        fontSize:20
    },
    lightModeText:{
        color:colors.black,
        fontSize:20
    },
    dropDown:{
        width: dvw / 2.5,
        marginLeft:100,
    },
    socialsWrapper:{
        width:dvw / 2,
        flexDirection:'row',
        justifyContent:'space-between',
        marginBottom:20
    },
    socialsIcons:{
        width:30,
        height:30
    }
})