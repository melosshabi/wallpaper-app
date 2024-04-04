import { View, Text, StyleSheet, Image, FlatList, SafeAreaView, useColorScheme, Dimensions, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import colors from '../lib/colors'
// @ts-ignore
import {API_KEY} from "@env"
import { useNavigation } from '@react-navigation/native'

const dvw = Dimensions.get('window').width
export default function Home() {

  const [homePhotos, setHomePhotos] = useState<any[]>([])
  const darkMode = useColorScheme() === 'dark'
  const navigation = useNavigation()
  useEffect(() => {
    async function fetchPhotos() {
      const res = await fetch('https://api.pexels.com/v1/search?query=coding&per_page=20', {
        headers:{
          Authorization:API_KEY
        }
      })
      const data = await res.json()
      setHomePhotos(() => [...data.photos])
    }
    fetchPhotos()
  }, [])
  return (
    <SafeAreaView style={darkMode ? styles.darkHome : styles.lightHome}>
        <FlatList data={homePhotos} numColumns={2}
          renderItem={({item}) => (
            // @ts-ignore
            <Pressable onPress={() => navigation.navigate('WallpaperDetails', {wallpaperUrl:item.src.portrait})}>
              <Image source={{uri:item.src.portrait}} style={styles.homePhotos}/>
            </Pressable>
          )}
          />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  darkHome:{
    backgroundColor:colors.black
  },
  lightHome:{
    backgroundColor:colors.white
  },
  homePhotos:{
    width:dvw / 2.2,
    height:280,
    marginLeft:10,
    marginVertical:10,
    borderRadius:10
  }
})