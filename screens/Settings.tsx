import { Dimensions, Image, Pressable, StyleSheet, Text, View, useColorScheme, Appearance } from 'react-native'
import React, { useEffect, useState } from 'react'
import colors from '../lib/colors'
import { darkModeOptions } from '../App'
import { Dropdown } from 'react-native-element-dropdown';

const dvh = Dimensions.get('window').height
const dvw = Dimensions.get('window').width

export default function Settings(){

    const darkMode = useColorScheme() === 'dark'
    // The current dark mode preference thats saved locally
    const dropDownData = [
        { label:"System Default", value:darkModeOptions.systemDefault},
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
    </View>
  )
}

const styles = StyleSheet.create({
    settingsPage:{
        height:dvh,
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
    }
})