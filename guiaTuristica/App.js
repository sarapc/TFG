// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import CitySelectorScreen from './CitySelectorScreen';
import SwipeScreen from './SwipeScreen';
import MapScreen from './MapScreen';
import ProfileScreen from './ProfileScreen';
import GoalsScreen from './GoalsScreen';
import HistoryScreen from './HistoryScreen';
import SaveRouteScreen from './SaveRouteScreen';
import RouteOrderScreen from './RouteOrderScreen';
import WelcomeScreen from './WelcomeScreen';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';



const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WelcomeScreen">
        <Stack.Screen name="CitySelector" component={CitySelectorScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="SwipeScreen" component={SwipeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MapScreen" component={MapScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="ProfileScreen" component={ProfileScreen}  options={{ headerShown: false }}/>
        <Stack.Screen name="GoalsScreen" component={GoalsScreen}  options={{ headerShown: false }}/>
        <Stack.Screen name="HistoryScreen" component={HistoryScreen}  options={{ headerShown: false }}/>
        <Stack.Screen name="SaveRouteScreen" component={SaveRouteScreen}  options={{ headerShown: false }}/>
        <Stack.Screen name="RouteOrderScreen" component={RouteOrderScreen}  options={{ headerShown: false }}/>
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen}  options={{ headerShown: false }}/>
        <Stack.Screen name="LoginScreen" component={LoginScreen}  options={{ headerShown: false }}/>
        <Stack.Screen name="RegisterScreen" component={RegisterScreen}  options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}