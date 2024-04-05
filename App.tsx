import React, {useState} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import { DrawerContentComponentProps, DrawerItem, createDrawerNavigator } from '@react-navigation/drawer'
import { View, Pressable, useColorScheme, Text, StyleSheet, Image, Switch } from 'react-native'
// Components
import Home from './screens/Home'
import CustomBurgerButton from './components/CustomBurgerButton'
import WallpaperDetails from './screens/WallpaperDetails'
import ImageSearchBar from './components/ImageSearchBar'
// lib
import colors from './lib/colors'
import { SearchBar } from 'react-native-screens'

function drawerContent({navigation}:DrawerContentComponentProps, darkMode:boolean){
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState<boolean>(false)
  return (
    <View style={[styles.customDrawer, darkMode ? styles.customDrawerDark : styles.customDrawerLight]}>
      <View style={styles.drawerHeader}>
        <Image source={require('./images/drawerBg.jpg')} style={styles.drawerBackground}/>
        <View style={styles.headerTextWrapper}><Text style={styles.headerText}>Mela Wallpapers</Text></View>
      </View>
      <View style={styles.drawerBody}>
        <Pressable onPress={() => navigation.navigate("Home", undefined)}  style={({pressed}) => [styles.drawerButtons, pressed ? {backgroundColor: darkMode ? colors.transparentWhite : colors.lightGray} : {}]}>
          <Image source={darkMode ? require("./images/whiteHome.png") : require("./images/blackHome.png")}/>
          <Text style={[styles.drawerText, darkMode ? styles.darkDrawerText : styles.lightDrawerText]}>Home</Text>
        </Pressable>
        
        <Pressable style={({pressed}) => [styles.drawerButtons, pressed ? {backgroundColor: darkMode ? colors.transparentWhite : colors.lightGray} : {}]}>
          <Image source={darkMode ? require('./images/whiteSignIn.png') : require('./images/blackSignIn.png')}/>
          <Text style={[styles.drawerText, darkMode ? styles.darkDrawerText : styles.lightDrawerText]}>Sign In</Text>
        </Pressable>
        
        <Pressable style={({pressed}) => [styles.drawerButtons, pressed ? {backgroundColor: darkMode ? colors.transparentWhite : colors.lightGray} : {}]}>
          <Image source={darkMode ? require('./images/whiteUser.png') : require('./images/blackUser.png')}/>
          <Text style={[styles.drawerText, darkMode ? styles.darkDrawerText : styles.lightDrawerText]}>Sign Up</Text>
        </Pressable>
      </View>
      <View style={styles.drawerFooter}>
          <Pressable onPress={() => navigation.navigate("Settings")} style={({pressed}) => [styles.drawerButtons, pressed ? {backgroundColor: darkMode ? colors.transparentWhite : colors.lightGray} : {}]}>
            <Image source={darkMode ? require('./images/whiteGear.png') : require('./images/blackGear.png')}/> 
            <Text style={[styles.drawerText, darkMode ? styles.darkDrawerText : styles.lightDrawerText]}>Settings</Text>
          </Pressable>
      </View>
    </View>
  )
}
export default function App() {
  const Drawer = createDrawerNavigator<ComponentProps>()
  const darkMode = useColorScheme() === "dark"

  return (
    <NavigationContainer>
      <Drawer.Navigator screenOptions={{
        headerStyle:{
          backgroundColor:darkMode ? colors.black : colors.white
          }, 
        headerTitleStyle:{
          color:darkMode ? colors.white : colors.black
          },
        headerLeft: () => <CustomBurgerButton/>,
        headerRight: () => <ImageSearchBar/>,
        title: "",
        }} 
        drawerContent={props => drawerContent(props, darkMode)}>
        <Drawer.Screen name="Home" component={Home}/>
        <Drawer.Screen name="WallpaperDetails" component={WallpaperDetails} options={{
          headerShown:false
        }}/>
      </Drawer.Navigator>
    </NavigationContainer>
  )
}
const styles = StyleSheet.create({
  customDrawer:{
    flex:1,
    justifyContent:'space-between',
    backgroundColor:colors.white,
  },
  customDrawerLight:{
    backgroundColor:colors.white
  },
  customDrawerDark:{
    backgroundColor:colors.black
  },
  drawerHeader:{
    height:"35%",
    position:'relative',
  },
  drawerBackground:{
    width:'100%',
    height:'100%'
  },
  headerTextWrapper:{
    height:'20%',
    width:'100%',
    backgroundColor:'rgba(0,0,0, .5)',
    position:'absolute',
    bottom:0,
    justifyContent:'center',
    alignItems:'center'
  },
  headerText:{
    fontFamily:"Millenia",
    fontSize:30,
    color:'white'
  },
  drawerBody:{
    height:'50%',
  },
  drawerText:{
    color:'white',
    fontSize:15,
    textShadowColor:'black',
    textShadowRadius:15,
    fontFamily:"Roboto-Regular",
    marginLeft:5
  },
  darkDrawerText:{
    color:'white'
  },
  lightDrawerText:{
    color:'black',
    textShadowColor:undefined
  },
  drawerButtonsWrapper:{
    flexDirection:'row',
    justifyContent:'space-between'
  },
  drawerButtons:{
    padding:15,
    paddingVertical:10,
    borderRadius:8,
    margin:5,
    flexDirection:'row',
    alignItems:'center'
  },
  drawerFooter:{
  },
  themeIcon:{
    width:50,
    height:50,
  }
})