import { Dimensions, Image, Pressable, StyleSheet, Text, TextInput, View, useColorScheme, Keyboard } from 'react-native'
import React, { useState } from 'react'
import colors from '../lib/colors'
import * as yup from 'yup'
import {Formik} from 'formik'
import {signInWithEmailAndPassword} from 'firebase/auth'
import { auth } from '../lib/firebase-config'
import { useNavigation } from '@react-navigation/native'

const dvw = Dimensions.get("window").width
const dvh = Dimensions.get('window').height
export default function SignUp() {

    const navigation = useNavigation()
    
    const darkMode = useColorScheme() === 'dark'

    const signInSchema = yup.object().shape({
        email:yup.string(),
        password:yup.string().min(6, "Password must be at least 6 characters long")
    })
    const [emailError, setEmailError] = useState<string>("")
    const [passwordError, setPasswordError] = useState<string>("")
    const [signInOnProgress, setSignInOnProgress] = useState<boolean>(false)
    async function signIn(email:string, password:string){
        if(!email || !password) return

        setSignInOnProgress(true)
        signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            setSignInOnProgress(false)
            //@ts-ignore
            navigation.navigate('Home', undefined)
        })
        .catch(err => {
            setSignInOnProgress(false)
            switch(err.code){
                case 'auth/user-not-found':
                    setEmailError("Account does not exist")
                    break;
                case 'auth/wrong-password':
                    setPasswordError("Wrong password")
                    break;
            }
        })
    }
    const [keyboardVisible, setKeyboardVisible] = useState(false)
    Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true))
    Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false))
  return (
    <View style={[styles.signInScreen]}>
      <Image style={styles.image} source={require('../images/signIn.jpg')}/>
      <View style={[styles.signInForm, {backgroundColor:darkMode ? colors.black : colors.white}, keyboardVisible && {marginBottom:-80}]}>
        <Text style={[styles.headerText, {color:darkMode ? colors.white : colors.black}]}>Sign In</Text>
      <Formik
        initialValues={{email: '', password:''}}
        validationSchema={signInSchema}
        onSubmit={values => signIn(values.email, values.password)}
      >
     {({ handleChange, handleBlur, handleSubmit, errors, values }) => (
       <View>

         {/* Email */}
         <View style={styles.inputWrapper}>
          <TextInput
            onChangeText={handleChange('email')}
            onChange={() => setEmailError("")}
            onBlur={handleBlur('email')}
            value={values.email}
            placeholder='Email'
            style={[styles.inputs,{borderBottomColor: darkMode ? colors.white : colors.black}]}
            autoCapitalize='none'
            placeholderTextColor={darkMode ? 'white' : 'black'}
          />
         
         {errors.email && (<Text style={styles.error}>{errors.email}</Text>)}
         {emailError && (<Text style={styles.error}>{emailError}</Text>)}
         </View>

         {/* Password */}
         <View style={[styles.inputWrapper]}>
           <TextInput
            onChangeText={handleChange('password')}
            onChange={() => setPasswordError("")}
            onBlur={handleBlur('password')}
            value={values.password}
            placeholder='Password'
            style={[styles.inputs,{borderBottomColor: darkMode ? colors.white : colors.black}]}
            secureTextEntry={true}
            autoCapitalize='none'
            placeholderTextColor={darkMode ? 'white' : 'black'}
          />
          {errors.password && (<Text style={styles.error}>{errors.password}</Text>)}
          {passwordError && <Text style={styles.error}>{passwordError}</Text>}
         </View>

            <Pressable onPress={() => handleSubmit()} style={({pressed}) => [styles.signInButton, signInOnProgress && styles.disabledButton, pressed && {backgroundColor:colors.darkOrange}]} disabled={signInOnProgress}>
                <Text style={styles.signInButtonText}>{signInOnProgress ? 'Signing in' : 'Sign in'}</Text>
            </Pressable>
       </View>
     )}
   </Formik>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    signInScreen:{
        flex:1,
        justifyContent:'flex-end',
        
    },
    image:{
        width:dvw,
        height:dvh,
        position:'absolute',
        bottom:160
    },
    signInForm:{
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
    signInButton:{
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
    signInButtonText:{
        textAlign:'center',
        fontSize:20,
        color:'white'
    }
})