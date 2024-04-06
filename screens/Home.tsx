import { StyleSheet, Image, FlatList, SafeAreaView, useColorScheme, Dimensions, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import colors from '../lib/colors'
// @ts-ignore
import {API_KEY} from "@env"
import { useNavigation } from '@react-navigation/native'
import { DrawerScreenProps } from '@react-navigation/drawer'

type HomeProps = DrawerScreenProps<ComponentProps, 'Home'>
const dvw = Dimensions.get('window').width
const dvh = Dimensions.get('window').height
export default function Home({route}:HomeProps) {

  const [homePhotos, setHomePhotos] = useState<any[]>([])
  const darkMode = useColorScheme() === 'dark'
  const navigation = useNavigation()
  const queries = ['coding', 'nature', 'beach', 'dark', 'gaming', 'underwater', 'digital', 'excercise', 'interior', 'tech', 'gym']
  const randomIndex = Math.floor(Math.random() * queries.length)
  useEffect(() => {
    async function fetchPhotos() {
      const res = await fetch(`https://api.pexels.com/v1/search?query=${queries[randomIndex]}&per_page=50`, {
        headers:{
          Authorization:API_KEY
        }
      })
      const data = await res.json()
      setHomePhotos(() => [...data.photos])
    }
    fetchPhotos()
  }, [])

  useEffect(() => {
    if(route.params) setHomePhotos([...route.params.photos])
  }, [route.params])
  return (
    <SafeAreaView style={darkMode ? styles.darkHome : styles.lightHome}>
        <FlatList style={{minHeight:dvh}} data={homePhotos} numColumns={2}
          renderItem={({item}) => (
            // @ts-ignore
            <Pressable onPress={() => navigation.navigate('WallpaperDetails', {wallpaperUrl:item.src.portrait})}>
              <Image source={{uri:item.src.original}} style={styles.homePhotos}/>
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