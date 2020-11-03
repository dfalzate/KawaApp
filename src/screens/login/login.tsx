import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import * as LocalAuthentication from 'expo-local-authentication'

import LoginComponent from '../../components/loginForm/loginComponent'

interface LoginScreenProps {
  // onUnlock: (result:boolean)=>void,
}

const LoginScreen: React.FC<LoginScreenProps> = (props: any) => {
  const [hasAuth, setHasAuth] = React.useState<any>(false)

  React.useEffect(() => {
    checkDeviceForHardware()
  }, [])

  const checkDeviceForHardware = async () => {
    let compatible = await LocalAuthentication.hasHardwareAsync()
    setHasAuth(compatible)
    if (compatible) {
      const responseEnrollment = await LocalAuthentication.isEnrolledAsync()
      if (responseEnrollment) {
        const responseAuth = await LocalAuthentication.authenticateAsync({ promptMessage: 'Unlock' })
        if (responseAuth.success) {
          props.navigation.navigate('Detalles')
        }
      }
    }
  }

  const onSubmit = (data: any) => {
    console.log('LoginComponent', data)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>KawaApp</Text>
      <TouchableOpacity onPress={checkDeviceForHardware} style={styles.login}>
        <Text style={styles.login_text}>Login</Text>
      </TouchableOpacity>
      {!hasAuth && <LoginComponent onSubmit={onSubmit} />}
    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
  },
  login: {
    backgroundColor: 'lightgray',
    width: '40%',
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  login_text: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
})
