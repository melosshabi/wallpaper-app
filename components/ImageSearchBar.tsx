import { Dimensions, StyleSheet, Text, TextInput, View, useColorScheme, Image, Pressable } from 'react-native'
import React from 'react'
import colors from '../lib/colors'

const dvw = Dimensions.get('window').width

export default function ImageSearchBar() {
    const darkMode = useColorScheme() === 'dark'
  return (
    <View style={styles.inputWrapper}>
      <TextInput
      style={[styles.input, darkMode ? styles.darkInput : styles.lightInput]}
      placeholder='Search'
      />
      <Pressable style={({pressed}) => [styles.searchButton, pressed ? {backgroundColor:darkMode ? colors.transparentWhite : colors.lightGray} : {}]}>
        <Image style={styles.magnifyingGlass} source={darkMode ? require('../images/whiteMagnifyingGlass.png') : require('../images/blackMagnifyingGlass.png')}/>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
    inputWrapper:{
        flexDirection:'row',
        alignItems:'center',
        transform:[{translateX:-dvw / 12}]
    },
    input:{
        width:dvw / 1.7,
        borderBottomWidth:1,
        paddingBottom:0
    },
    darkInput:{
        borderBottomColor:'white'
    },
    lightInput:{
        borderBottomColor:'black'
    },
    magnifyingGlass:{
        width:25,
        height:25
    },
    searchButton:{
        transform:[{translateX:10}, {translateY:5}],
        padding:5,
        borderRadius:5
    }
})