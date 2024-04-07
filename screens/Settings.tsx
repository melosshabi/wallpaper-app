import { Dimensions, Image, Pressable, StyleSheet, Switch, Text, View, useColorScheme } from 'react-native'
import React from 'react'
import colors from '../lib/colors'

const dvh = Dimensions.get('window').height
export default function Settings() {
    const darkMode = useColorScheme() === 'dark'
  return (
    <View style={[styles.settingsPage, darkMode ? styles.darkSettingsPage : styles.lightSettingsPage]}>
        <Pressable style={styles.themeButton}>
            <Image source={darkMode ? require('../images/themeIconForDarkMode.png') : require('../images/themeIconForLightMode.png')}/>
            <Text>Theme</Text>
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
    }
})