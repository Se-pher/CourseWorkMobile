import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './components/AuthContext';
import LoginScreen from './components/Login';
import RegisterScreen from './components/Register';
import CoursePage from './components/CoursePage'; 
import ViewClassInstance from './components/ViewClassInstance';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const MainStack = () => {
  return (  
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Courses" 
        component={CoursePage}
        options={{
          title: 'Courses',
        }}
      />
      <Stack.Screen 
        name="ViewClassInstance" 
        component={ViewClassInstance}
        options={{
          title: 'Classes',
        }}
      />
    </Stack.Navigator>
  );
};

// Create a separate component for the navigation logic
const NavigationContent = () => {
  const { user } = useAuth();
  return user ? <MainStack /> : <AuthStack />;
};

// Main App component
const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <NavigationContent />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;