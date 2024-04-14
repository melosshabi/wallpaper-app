import { Dimensions, StyleSheet, TextInput, View, useColorScheme, Image, Pressable, Keyboard } from 'react-native'
import React, { useState, useEffect } from 'react'
import colors from '../lib/colors'
import { useNavigation } from '@react-navigation/native'
import {default as storage} from "@react-native-async-storage/async-storage"
// @ts-ignore
import {API_KEY} from "@env"
import { darkModeOptions } from '../App'

const dvw = Dimensions.get('window').width

export default function ImageSearchBar() {
    const [searchQuery, setSearchQuery] = useState<string>("")
    const navigation = useNavigation()
    const [darkMode, setDarkMode] = useState<boolean>(false)
    const colorScheme = useColorScheme()
    useEffect(() => {
      async function checkDarkMode(){
        if(!await storage.getItem("darkMode")){
          await storage.setItem('darkMode', darkModeOptions.systemDefault)
          setDarkMode(colorScheme === "dark")
        }else if(await storage.getItem('darkMode') === darkModeOptions.disabled){
          setDarkMode(false)
        }else if(await storage.getItem('darkMode') === darkModeOptions.enabled){
          setDarkMode(true)
        }else{
          setDarkMode(colorScheme === 'dark')
        }
      }
      checkDarkMode()
    }, [])

    // clickedSearchButton refers to the magnifying glass
    async function handleSubmit(clickedSearchButton:boolean){
        if(searchQuery === "") return 
        if(clickedSearchButton) Keyboard.dismiss()
        const res = await fetch(`https://api.pexels.com/v1/search?query=${searchQuery}&per_page=50`, {headers:{Authorization:API_KEY}})
        const data = await res.json()
        const searchedPhotos = ([...data.photos])
        
        // @ts-ignore
        navigation.setParams({photos:searchedPhotos})
    }
  return (
    <View style={styles.inputWrapper}>
      <TextInput
      style={[styles.input, darkMode ? styles.darkInput : styles.lightInput]}
      placeholder='Search'
      onSubmitEditing={() => handleSubmit(false)}
      value={searchQuery}
      onChangeText={setSearchQuery}
      placeholderTextColor={darkMode ? colors.white : colors.black}
      />
      <Pressable onPress={() => handleSubmit(true)} style={({pressed}) => [styles.searchButton, pressed ? {backgroundColor:darkMode ? colors.transparentWhite : colors.lightGray} : {}]}>
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
        borderBottomColor:'white',
        color:colors.white
    },
    lightInput:{
        borderBottomColor:'black',
        color:colors.black
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