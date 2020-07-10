import React, { useState, useEffect, useCallback } from 'react'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Easing
} from 'react-native'
import Button from '../components/Button'

import { firestore as db } from '../config/firebase'
import { CLIENT_ID, API_KEY } from 'react-native-dotenv'
import { ethers } from 'ethers'

import {
  loginFailure,
  loginSuccess,
  setAccessToken,
  logout,
  firebaseSignInSuccess,
  firebaseSignInFailure,
  googleSignInSuccess,
  googleSignInFailure,
  logoutSuccess,
  logoutFailure,
  signInWithGoogle,
  signOut
} from '../redux/authReducer'

import {
  createUserSuccess,
  createUserFailure,
  updateUserSuccess,
  updateUserFailure,
  createWalletSuccess,
  createWalletFailure,
  getWalletSuccess,
  getWalletFailure,
  getWalletFromDrive
} from '../redux/userReducer'

import { useSelector, useDispatch, useStore } from 'react-redux'
import { throwError } from '../redux/errorReducer'

import Spinner from 'react-native-loading-spinner-overlay'
import Colors from '../constants/colors'

const SignInScreen = props => {
  const dispatch = useDispatch()
  const navigation = useNavigation()

  const isSignedIn = useSelector(state => state.auth.isSignedIn)
  const accessToken = useSelector(state => state.auth.accessToken)
  const isLoading = useSelector(state => state.isLoading)

  const [fadeValue, setOpacityValue] = useState(new Animated.Value(0))

  const checkIfSignedIn = () => {
    if (isSignedIn) {
      navigation.navigate('HomeStack')
    } else {
      navigation.navigate('SignIn')
    }
  }

  useEffect(() => {
    checkIfSignedIn()
  })

  useEffect(() => {
    Animated.timing(fadeValue, {
      toValue: 1,
      duration: 800
    }).start()
  }, [])

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Spinner visible={isLoading} />
      <Animated.View
        style={{
          opacity: fadeValue,
          transform: [
            {
              translateY: fadeValue.interpolate({
                inputRange: [0, 1],
                outputRange: [100, 0]
              })
            }
          ]
        }}
      >
        <Button
          title='Sign in with Google'
          onPress={() => dispatch(signInWithGoogle())}
        ></Button>
      </Animated.View>
    </SafeAreaView>
  )
}

export default SignInScreen
