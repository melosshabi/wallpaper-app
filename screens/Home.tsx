import { StyleSheet, Image, FlatList, SafeAreaView, Dimensions, Pressable, useColorScheme } from 'react-native'
import React, { useState, useEffect } from 'react'
import colors from '../lib/colors'
import ImageSearchBar from '../components/ImageSearchBar'
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
  const queries = ['coding', 'nature', 'beach', 'dark', 'gaming', 'underwater', 'digital', 'interior', 'gym']

  // This function generates an index based on the length of the "queries" array
  function generateQueryIndex(){
    return Math.floor(Math.random() * queries.length)
  }
  const randomIndex = generateQueryIndex()
  const [pageNumber, setPageNumber] = useState(1)

  async function fetchPhotos(page:number, queryIndex:number) {
    const res = await fetch(`https://api.pexels.com/v1/search?query=${queries[queryIndex]}&page=${page}}&per_page=50`, {
      headers:{
        Authorization:API_KEY
      }
    })
    const data = await res.json()
    setHomePhotos(prev => [...prev,...data.photos])
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight:() => <ImageSearchBar/>
    })
    fetchPhotos(pageNumber, randomIndex)
  }, [])

  useEffect(() => {
    if(route.params) setHomePhotos([...route.params.photos])
  }, [route.params])

  const [imageListRefreshing, setImageListRefreshing] = useState(false)
  // This function fetches new images when the user refreshes the homescreen
  async function fetchNewImages(){
    const randomIndex = generateQueryIndex()
    fetchPhotos(pageNumber, randomIndex)
  }
  return (
    <SafeAreaView style={darkMode ? styles.darkHome : styles.lightHome}>
        <FlatList 
        refreshing={imageListRefreshing}
        onRefresh={() => {
          setImageListRefreshing(true)
          fetchNewImages().then(() => setImageListRefreshing(false))
        }} 
        style={{minHeight:dvh}} data={homePhotos} numColumns={2}
        onScroll={(e): void => {
          if(e.nativeEvent.contentOffset.y + e.nativeEvent.layoutMeasurement.height === e.nativeEvent.contentSize.height){
            setPageNumber(prev => ++prev)
            fetchPhotos(pageNumber, randomIndex)
          }
        }}
          renderItem={({item}) => (
            // @ts-ignore
            <Pressable style={styles.homePhotoWrapper} onPress={() => navigation.navigate('WallpaperDetails', {wallpaperUrl:item.src.portrait, navigatedFromProfile:false})}>
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
  homePhotoWrapper:{
    width:dvw / 2.2,
    height:280,
    marginLeft:10,
    marginVertical:10,
    position:'relative',
    alignItems:'flex-end',
    justifyContent:'flex-end'
  },
  homePhotos:{
    width:dvw / 2.2,
    height:280,
    borderRadius:10,
    position:'absolute'
  }
})