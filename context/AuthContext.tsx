import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { router, useRouter } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

const API_URL = Constants.expoConfig?.extra?.API_URL;

// Authentication Context
const AuthContext = createContext({
  isLoading: true,
  isAuthenticated: false,
  user: null,
  token: null as string | null,
  login: async (email: string, password: string): Promise<boolean> => false,
  logout: async () => {},
});

// Authentication Provider Component
export const AuthProvider = ({ children } : { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState<string | null>(null);

  // Check for existing session on app startup
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        
        if (storedToken) {
          // Optionally validate token here
          setToken(storedToken);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  // Login Handler
  const login = async (email : string, password: string) => {
    try {
      const response = await fetch(`${API_URL}login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          hashedPass: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Store token
        await AsyncStorage.setItem('userToken', data.token);
        
        // Update state
        setToken(data.token);
        setIsAuthenticated(true);
        
        return true;
      } else {
        // Handle login failure
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // Logout Handler
  const logout = async () => {
    try {
      // Remove token from storage
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('userEmail');
      await AsyncStorage.removeItem('userFirstName');
      await AsyncStorage.removeItem('userLastName');
      await AsyncStorage.removeItem('userGender');

      router.replace('/login'); // Redirect to login page

      // Clear state
      setToken(null);
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isLoading, 
        isAuthenticated, 
        user, 
        token, 
        login, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Wrapper component for authentication-based navigation
export const AuthWrapper = ({ children } : { children: React.ReactNode }) => {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace('/login');
      }
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return children;
};

// Simple Loading Screen
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" />
    <Text>Chargement...</Text>
  </View>
);