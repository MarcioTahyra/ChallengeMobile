import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../types/navigation';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import QuestionsScreen from '../screens/QuestionsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import UserDashboardScreen from '../screens/UserDashboardScreen';
import InvestmentSuggestionsScreen from '../screens/InvestmentSuggestionsScreen';
import MyPortfolioScreen from '../screens/MyPortfolioScreen';


const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>       
            <Stack.Screen 
              name="UserDashboard" 
              component={UserDashboardScreen}
              options={{ title: 'Painel do Paciente' }}
            />
            <Stack.Screen 
              name="Home" 
              component={InvestmentSuggestionsScreen}
              options={{ title: 'Início' }}
            />
            <Stack.Screen 
              name="Questions" 
              component={QuestionsScreen}
              options={{ title: 'Agendar Consulta' }}
            />
            <Stack.Screen 
              name="Profile" 
              component={ProfileScreen}
              options={{ title: 'Perfil' }}
            />
            <Stack.Screen name="InvestmentSuggestions"
            component={InvestmentSuggestionsScreen}
            options={{ title: 'Sugestões' }} />

            <Stack.Screen name="MyPortfolio"
            component={MyPortfolioScreen}
            options={{ title: 'Minha Carteira' }} />

          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 