import { Dimensions, Image, Pressable, StyleSheet, Text, TextInput, View, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import colors from '../lib/colors'
import * as yup from 'yup'
import {Formik} from 'formik'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../lib/firebase-config'
import { useNavigation } from '@react-navigation/native'

const dvw = Dimensions.get("window").width
const dvh = Dimensions.get('window').height
export default function SignUp() {

    const navigation = useNavigation()
    
    const darkMode = useColorScheme() === 'dark'

    const signUpSchema = yup.object().shape({
        username:yup.string().min(4, "Username must be at least 4 characters long"),
        email:yup.string(),
        password:yup.string().min(2, "Password must be at least 6 characters long")
    })
    const [emailError, setEmailError] = useState<string>("")
    const [passwordError, setPasswordError] = useState<string>("")
    const [signUpInProgress, setSignUpInProgress] = useState<boolean>(false)
    async function signUp(username:string, email:string, password:string){
        if(!username || !email || !password) return

        setSignUpInProgress(true)
        let user = null
        createUserWithEmailAndPassword(auth, email, password)
        .then(res => user = res.user)
        .catch(err => {
            setSignUpInProgress(false)
            switch(err.code){
                case 'auth/email-already-in-use':
                    setEmailError("Email is already in use")
                break;
                case 'auth/invalid-email':
                    setEmailError("Email is invalid")
                    break;
                case 'auth/weak-password':
                    setPasswordError('Password must be at least 6 characters long')
                    break;
            }
        })
        if(user !== null){
            await updateProfile(user, {displayName:username})
        }
        //@ts-ignore
        navigation.navigate('Home', undefined)
    }
  return (
    <View style={[styles.signUpScreen]}>
      <Image style={styles.image} source={require('../images/signUp.png')}/>
      <View style={[styles.signUpForm, {backgroundColor:darkMode ? colors.black : colors.white}]}>
        <Text style={[styles.headerText, {color:darkMode ? colors.white : colors.black}]}>Sign Up</Text>
      <Formik
        initialValues={{username:'', email: '', password:'' }}
        validationSchema={signUpSchema}
        onSubmit={values => signUp(values.username, values.email, values.password)}
      >
     {({ handleChange, handleBlur, handleSubmit, errors, values }) => (
       <View>
        {/* Username */}
        <View style={styles.inputWrapper}>
          <TextInput
            onChangeText={handleChange('username')}
            onBlur={handleBlur('username')}
            value={values.username}
            placeholder='Username'
            style={[styles.inputs,{borderBottomColor: darkMode ? colors.white : colors.black}]}
            autoCapitalize='none'
            placeholderTextColor='white'
        />
        {errors.username && (<Text style={styles.error}>{errors.username}</Text>)}
        </View>

         {/* Email */}
         <View style={styles.inputWrapper}>
          <TextInput
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
            placeholder='Email'
            style={[styles.inputs,{borderBottomColor: darkMode ? colors.white : colors.black}]}
            autoCapitalize='none'
            placeholderTextColor='white'
          />
         
         {errors.email && (<Text style={styles.error}>{errors.email}</Text>)}
         {emailError && (<Text style={styles.error}>{emailError}</Text>)}
         </View>

         {/* Password */}
         <View style={[styles.inputWrapper]}>
           <TextInput
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            value={values.password}
            placeholder='Password'
            style={[styles.inputs,{borderBottomColor: darkMode ? colors.white : colors.black}]}
            secureTextEntry={true}
            autoCapitalize='none'
            placeholderTextColor='white'
          />
          {errors.password && (<Text style={styles.error}>{errors.password}</Text>)}
          {passwordError && <Text style={styles.error}>{passwordError}</Text>}
         </View>

         <Pressable onPress={() => handleSubmit()} style={({pressed}) => [styles.signUpButton, signUpInProgress && styles.disabledButton, pressed && {backgroundColor:colors.darkOrange}]} disabled={signUpInProgress}><Text style={styles.signUpButtonText}>{signUpInProgress ? 'Signing up' : 'Sign up'}</Text></Pressable>
       </View>
     )}
   </Formik>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    signUpScreen:{
        flex:1,
        justifyContent:'flex-end',
        
    },
    image:{
        width:dvw,
        height:dvh,
        position:'absolute',

    },
    signUpForm:{
        height:dvh / 1.8,
        borderTopLeftRadius:50,
        borderTopRightRadius:50,
        padding:10,
    },
    headerText:{
        fontSize:30,
        textAlign:'center'
    },
    inputWrapper:{
        marginVertical:10,
    },
    inputs:{
        borderBottomWidth:1,
        paddingHorizontal:5
    },
    error:{
        color:colors.orange
    },
    signUpButton:{
        width:dvw / 2.5,
        marginTop:20,
        marginLeft: dvw / 3.5,
        backgroundColor:colors.orange,
        padding:10,
        borderRadius:8
    },
    disabledButton:{
        opacity:.8
    },
    signUpButtonText:{
        textAlign:'center',
        fontSize:20,
        color:'white'
    }
})