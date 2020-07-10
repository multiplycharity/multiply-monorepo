import React, { useState, useRef } from 'react'
import { View, Text, Share, StyleSheet } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import useScreenDimensions from '../hooks/useScreenDimensions'
import Colors from '../constants/colors'
import Button from '../components/Button'
import Cell from '../components/Cell'
import { Feather } from '@expo/vector-icons'
import { CommonActions } from '@react-navigation/native'
import { resetPaymentScreen } from '../redux/screenReducer'
import { sendTx } from '../redux/transactions'
import * as Animatable from 'react-native-animatable'
import animationDefinitions from '../constants/animations'
Animatable.initializeRegistryWithDefinitions(animationDefinitions)

const ConfirmPaymentModal = props => {
  const {
    address,
    title,
    imageUrl,
    subtitle,
    amount,
    iconName
  } = props.route.params

  const screen = useScreenDimensions()
  const navigation = props.navigation
  const dispatch = useDispatch()

  const isLoading = useSelector(state => state.isLoading)

  const balance = useSelector(state => state.user.balance)

  const [errorMessage, setErrorMessage] = useState('')
  const [errorTimer, setErrorTimer] = useState(null)
  const amountAnimation = useRef(null)
  const errorMessageAnimation = useRef(null)

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.White
      }}
    >
      <View style={{ backgroundColor: 'white', flex: 1, marginLeft: 40 }}>
        <Text style={[styles.sectionHeader, { marginTop: 40 }]}>Amount</Text>
        <Animatable.View ref={amountAnimation}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: '500',
              marginTop: 10
            }}
          >
            ${amount}
          </Text>
        </Animatable.View>
        <Animatable.View
          ref={errorMessageAnimation}
          style={{
            marginTop: 10,
            height: 16
          }}
        >
          <Text style={{ color: 'red' }}>{errorMessage}</Text>
        </Animatable.View>
      </View>

      <View
        style={{
          backgroundColor: Colors.Gray100,
          flex: 2
        }}
      >
        <View
          style={{
            height: 40,
            width: 40,
            borderRadius: 20,
            backgroundColor: Colors.Gray100,
            marginLeft: 25,
            position: 'absolute',
            top: -15,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <View
            style={{
              height: 34,
              width: 34,
              borderRadius: 18,
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Feather name='arrow-down' size={24} color={Colors.Blue}></Feather>
          </View>
        </View>

        <Text style={[styles.sectionHeader, { marginTop: 60, marginLeft: 40 }]}>
          To
        </Text>

        <Cell
          title={title}
          subtitle={subtitle}
          imageSize={50}
          titleSize={21}
          subtitleSize={16}
          imageUrl={imageUrl}
          imageBgColor={Colors.Gray200}
          iconColor={Colors.Gray600}
          activeOpacity={1}
          iconName={iconName}
          style={{ marginLeft: 15, marginTop: 10 }}
        ></Cell>

        <View
          style={{
            alignItems: 'center',
            position: 'absolute',
            bottom: screen.height > 800 ? 60 : 40,
            left: 50
          }}
        >
          <Button
            title='Confirm'
            color={Colors.White}
            width={screen.width - 100}
            backgroundColor={Colors.Blue}
            style={{
              paddingHorizontal: 20
            }}
            onPress={async () => {
              if (parseFloat(balance) < parseFloat(amount)) {
                errorTimer && clearTimeout(errorTimer)
                setErrorMessage('Insufficient balance')
                amountAnimation.current.shake(480)
                errorMessageAnimation.current.fadeIn(480)

                setErrorTimer(
                  setTimeout(() => {
                    errorMessageAnimation.current.fadeOut(480).then(() => {
                      setErrorMessage('')
                    })
                  }, 1800)
                )
                return
              }

              // displayValueAnimation.current.shake(480)
              else {
                dispatch(sendTx({ to: address, amount: amount }))
                dispatch(resetPaymentScreen())

                navigation.navigate('OverlayMessage', {
                  message: `You sent $${amount} ${'\n'} to ${title}`,
                  type: 'success'
                })
              }
            }}
          ></Button>
        </View>
      </View>
    </View>
  )
}

export default ConfirmPaymentModal

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 12,
    color: Colors.Gray500,
    fontWeight: '600',
    textTransform: 'uppercase'
  }
})
