import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Login';       // Asegúrate de que la ruta sea correcta
import Usuarios from './Usuarios'; // Asegúrate de que la ruta sea correcta

const Stack = createStackNavigator();

export default function App() {
  return (
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Usuarios" component={Usuarios} />
      </Stack.Navigator>
  );
}
