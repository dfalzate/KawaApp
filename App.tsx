import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import { LoginLayout, DetailsLayout } from './src/screens/index'

export default function App() {
  const Stack = createStackNavigator()
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name='Login'>{(props) => <LoginLayout {...props} />}</Stack.Screen>
        <Stack.Screen name='Detalles'>{(props) => <DetailsLayout {...props} />}</Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}
