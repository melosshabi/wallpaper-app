import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native'
import React from 'react'
import colors from '../lib/colors'
import { DrawerActions, useNavigation } from '@react-navigation/native'

export default function CustomBurgerButton() {
    const navigation = useNavigation()
    const darkMode = useColorScheme() === 'dark'
  return (
    <Pressable style={({pressed}) => [styles.button, pressed ? {backgroundColor: darkMode ? 'rgba(255, 255, 255, .4)' : 'rgba(0, 0, 0, .4)'} : {}]} onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
      <View style={[styles.buttonLines, darkMode ? styles.lightLines : styles.darkLines]}><Text>a</Text></View>
      <View style={[styles.buttonLines, darkMode ? styles.lightLines : styles.darkLines, {maxWidth:'20%'}]}></View>
      <View style={[styles.buttonLines, darkMode ? styles.lightLines : styles.darkLines, {maxWidth:'10%'}]}></View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
    button:{
        minWidth:'35%',
        height:'80%',
        justifyContent:'space-between',
        marginLeft:10,
        padding:10,
        borderRadius:8
    },
    buttonLines:{
        height:2,
    },
    darkLines:{
        backgroundColor:colors.black
    },
    lightLines:{
        backgroundColor:colors.white
    }
})