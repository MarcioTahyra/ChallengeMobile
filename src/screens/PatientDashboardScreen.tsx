import React, { useState } from 'react';
import styled from 'styled-components/native';
import { ScrollView, ViewStyle, useWindowDimensions } from 'react-native';
import { Button } from 'react-native-elements';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import theme from '../styles/theme';
import Header from '../components/Header';

type PatientDashboardScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PatientDashboard'>;
};

const PatientDashboardScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigation = useNavigation<PatientDashboardScreenProps['navigation']>();
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();
  const maxWidth = width > 500 ? 400 : '100%';

  return (
    <Container>
      <Header />
      <ScrollView contentContainerStyle={{ padding: 20, alignItems: 'center' }}>
        <Content style={{ maxWidth }}>
          <Title>Meu Perfil</Title>

          <Button
            title="Questionário"
            onPress={() => navigation.navigate('CreateAppointment')}
            containerStyle={styles.button as ViewStyle}
            buttonStyle={styles.buttonStyle}
            titleStyle={styles.buttonTitleStyle}
          />

          <Button
            title="Perfil de Investimentos"
            onPress={() => navigation.navigate('Profile')}
            containerStyle={styles.button as ViewStyle}
            buttonStyle={styles.buttonStyle}
            titleStyle={styles.buttonTitleStyle}
          />

          <Button
            title="Minha Carteira"
            onPress={() => navigation.navigate('MyPortfolio')}
            containerStyle={styles.button as ViewStyle}
            buttonStyle={styles.buttonStyle}
            titleStyle={styles.buttonTitleStyle}
          />

          <Button
            title="Sugestões"
            onPress={() => navigation.navigate('InvestmentSuggestions')}
            containerStyle={styles.button as ViewStyle}
            buttonStyle={styles.buttonStyle}
            titleStyle={styles.buttonTitleStyle}
          />
        </Content>
      </ScrollView>

      <FixedFooter>
        <Button
          title="Sair"
          onPress={signOut}
          buttonStyle={styles.logoutButton}
        />
      </FixedFooter>
    </Container>
  );
};

const styles = {
  button: {
    marginBottom: 20,
    width: '100%',
  },
  buttonStyle: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
  },
  buttonTitleStyle: {
    color: theme.colors.btntext,
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: theme.colors.error,
    paddingVertical: 12,
    borderRadius: 30,
  },
};

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Content = styled.View`
  width: 100%;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 20px;
  text-align: center;
`;

const FixedFooter = styled.View`
  padding: 20px;
  background-color: ${theme.colors.background};
`;

export default PatientDashboardScreen;
