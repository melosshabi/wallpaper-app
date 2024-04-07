import { Image, Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native'
import React from 'react'
import {auth} from '../lib/firebase-config'

export default function Profile() {
    const darkMode = useColorScheme() === 'dark'
    console.log(auth.currentUser?.displayName)
  return (
    <View style={styles.profileScreen}>
      <View style={styles.profileHeader}>
        <View style={styles.profilePictureWrapper}>
            <Image source={!auth.currentUser?.photoURL ? require("../images/blackUser.png") : !auth.currentUser.photoURL && darkMode ? require('../images/whiteUser.png') : auth.currentUser.photoURL} />
        </View>
        <View style={styles.usernameWrapper}>
            <Text>{auth.currentUser?.displayName}</Text>
            <Pressable>
                <Text>Edit Profile</Text>
            </Pressable>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    profileScreen:{},
    profileHeader:{},
    profilePictureWrapper:{},
    usernameWrapper:{}
})