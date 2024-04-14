import { Dimensions, Image, Pressable, StyleSheet, Switch, Text, View, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import colors from '../lib/colors'
import { darkModeOptions } from '../App'
import {default as storage} from "@react-native-async-storage/async-storage"
import { Dropdown } from 'react-native-element-dropdown';
import RNREstart from 'react-native-restart'
import { useNavigation } from '@react-navigation/native'

const dvh = Dimensions.get('window').height
const dvw = Dimensions.get('window').width

export default function Settings(){

    const [darkMode, setDarkMode] = useState<boolean>(false)
    // The current dark mode preference thats saved locally
    const [darkModeSetting, setDarkModeSetting] = useState<string>("")
    const colorScheme = useColorScheme()
    const dropDownData = [
        { label:"System Default", value:darkModeOptions.systemDefault},
        { label:"Dark", value:darkModeOptions.enabled  },
        { label:"Light", value:darkModeOptions.disabled }
    ]

     // Decides whether to go with dark mode or not
    async function setColorScheme(){
        const darkModeSetting = await storage.getItem('darkMode')
        if(darkModeSetting) setDarkModeSetting(darkModeSetting)
        if(darkModeSetting === darkModeOptions.disabled){
            setDarkMode(false)
        }else if(darkModeSetting === darkModeOptions.enabled){
            setDarkMode(true)
        }else if(darkModeSetting === darkModeOptions.systemDefault){
            setDarkMode(colorScheme === 'dark')
        }
    }

    useEffect(() => {
        setColorScheme()
    }, [darkModeSetting])
    const navigation = useNavigation()
    async function handleThemeChange(newDarkModeSetting: string){
        await storage.setItem('darkMode', newDarkModeSetting)
        const darkModeSetting = await storage.getItem('darkMode')
        setDarkModeSetting(darkModeSetting as string)
        // RNREstart.restart()
        // navigation.reset()
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
                {darkModeSetting === darkModeOptions.systemDefault ? "System Default"
                : darkModeSetting === darkModeOptions.enabled ? "Dark" : "Light"
                }
                placeholderStyle={darkMode ? {color:colors.black} : {color:colors.black}}
                value={darkModeSetting}
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