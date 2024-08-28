import React from 'react'
import {NavigationContainer} from '@react-navigation/native'
import { DrawerContentComponentProps, createDrawerNavigator } from '@react-navigation/drawer'
import { View, Pressable, useColorScheme, Text, StyleSheet, Image } from 'react-native'
// Components
import Home from './screens/Home'
import CustomBurgerButton from './components/CustomBurgerButton'
import WallpaperDetails from './screens/WallpaperDetails'
import ImageSearchBar from './components/ImageSearchBar'
import SignUp from './screens/SignUp'
import SignIn from './screens/SignIn'
// lib
import colors from './lib/colors'
import { auth } from './lib/firebase-config'
import { signOut } from 'firebase/auth'
import Settings from './screens/Settings'
import Profile from './screens/Profile'

function drawerContent({navigation}:DrawerContentComponentProps, darkMode:boolean){
  
  async function logOut(){
    signOut(auth).then(() => {
      navigation.navigate("Home", undefined)
      // navigation.closeDrawer()
    })
  }
  return (
    <View style={[styles.customDrawer, darkMode ? styles.customDrawerDark : styles.customDrawerLight]}>
      <View style={styles.drawerHeader}>
        <Image source={require('./images/drawerBg.jpg')} style={styles.drawerBackground}/>
        <View style={styles.headerTextWrapper}><Text style={styles.headerText}>Mela Wallpapers</Text></View>
      </View>
      <View>
        <Pressable onPress={() => navigation.navigate("Home", undefined)}  style={({pressed}) => [styles.drawerButtons, pressed ? {backgroundColor: darkMode ? colors.transparentWhite : colors.lightGray} : {}]}>
          <Image source={darkMode ? require("./images/whiteHome.png") : require("./images/blackHome.png")}/>
          <Text style={[styles.drawerText, darkMode ? styles.darkDrawerText : styles.lightDrawerText]}>Home</Text>
        </Pressable>
        
        {!auth.currentUser && <Pressable onPress={() => navigation.navigate("SignIn", undefined)} style={({pressed}) => [styles.drawerButtons, pressed ? {backgroundColor: darkMode ? colors.transparentWhite : colors.lightGray} : {}]}>
          <Image source={darkMode ? require('./images/whiteSignIn.png') : require('./images/blackSignIn.png')}/>
          <Text style={[styles.drawerText, darkMode ? styles.darkDrawerText : styles.lightDrawerText]}>Sign In</Text>
        </Pressable>}
        
        {!auth.currentUser && <Pressable onPress={() => navigation.navigate('SignUp', undefined)} style={({pressed}) => [styles.drawerButtons, pressed ? {backgroundColor: darkMode ? colors.transparentWhite : colors.lightGray} : {}]}>
          <Image style={styles.userIcon} source={darkMode ? require('./images/whiteUser.png') : require('./images/blackUser.png')}/>
          <Text style={[styles.drawerText, darkMode ? styles.darkDrawerText : styles.lightDrawerText]}>Sign Up</Text>
        </Pressable>}
      </View>
      <View style={styles.drawerFooter}>
        {auth.currentUser && 
          <Pressable onPress={() => navigation.navigate("Profile", undefined)} style={({pressed}) => [styles.drawerButtons, pressed ? {backgroundColor: darkMode ? colors.transparentWhite : colors.lightGray} : {}]}>
            <Image style={styles.userIcon} source={darkMode ? require('./images/whiteUser.png') : require('./images/blackUser.png')}/>
            <Text style={[styles.drawerText, darkMode ? styles.darkDrawerText : styles.lightDrawerText]}>My Profile</Text>
          </Pressable>}

          <Pressable onPress={() => navigation.navigate("Settings")} style={({pressed}) => [styles.drawerButtons, pressed ? {backgroundColor: darkMode ? colors.transparentWhite : colors.lightGray} : {}]}>
            <Image source={darkMode ? require('./images/whiteGear.png') : require('./images/blackGear.png')}/> 
            <Text style={[styles.drawerText, darkMode ? styles.darkDrawerText : styles.lightDrawerText]}>Settings</Text>
          </Pressable>

          {auth.currentUser &&
            <Pressable style={({pressed}) => [styles.drawerButtons, pressed ? {backgroundColor: darkMode ? colors.transparentWhite : colors.lightGray} : {}]} onPress={() => logOut()}>
              <Image source={darkMode ? require('./images/whiteSignOut.png') : require('./images/blackSignOut.png')}/>
              <Text style={[styles.drawerText, darkMode ? styles.darkDrawerText : styles.lightDrawerText]}>Sign Out</Text>
            </Pressable>
          }
      </View>
    </View>
  )
}

export default function App(){
  const Drawer = createDrawerNavigator<ComponentProps>()
  const darkMode = useColorScheme() === 'dark'

  return (
    <NavigationContainer>
      <Drawer.Navigator screenOptions={{
        headerStyle:{
          backgroundColor:darkMode ? colors.black : colors.white
        },
        headerLeft: () => <CustomBurgerButton/>,
        title: "",
        }} 
        drawerContent={props => drawerContent(props, darkMode)}>
        <Drawer.Screen name="Home" component={Home}/>
        <Drawer.Screen name="WallpaperDetails" component={WallpaperDetails} options={{
          headerShown:false,
          unmountOnBlur:true
        }}/>
        <Drawer.Screen name="SignUp" component={SignUp} options={{unmountOnBlur:true}}/>
        <Drawer.Screen name="SignIn" component={SignIn} options={{unmountOnBlur:true}}/>
        <Drawer.Screen name="Settings" component={Settings}/>
        <Drawer.Screen name="Profile" component={Profile} options={{unmountOnBlur:true}}/>
      </Drawer.Navigator>
    </NavigationContainer>
  )
}
const styles = StyleSheet.create({
  customDrawer:{
    flex:1,
    backgroundColor:colors.white,
    justifyContent:'flex-start'
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
    width:'100%',
    position:'absolute',
    bottom:0
  },
  themeIcon:{
    width:50,
    height:50,
  },
  userIcon:{
    width:25,
    height:25
  }
})