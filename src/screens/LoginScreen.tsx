import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Input, Button } from 'react-native-elements';
import { useAuth } from '../context/AuthContext';
import theme from '../styles/theme';
import { useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

const LoginScreen: React.FC = () => {
  const { signIn } = useAuth();
  const navigation = useNavigation<LoginScreenProps['navigation']>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { width } = useWindowDimensions();

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      await signIn({ email, password });
    } catch (err) {
      setError('Email ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };

  const maxWidth = width > 500 ? 400 : '100%';

  return (
    <Container>
      <Title fontSize={width > 500 ? 48 : 38}>Login</Title>

      <Content style={{ maxWidth, alignSelf: 'center' }}>
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          inputStyle={{ color: '#ffffff', fontSize: 16 }}
          containerStyle={{ marginBottom: 15 }}
        />

        <Input
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          inputStyle={{ color: '#ffffff', fontSize: 16 }}
          containerStyle={{ marginBottom: 15 }}
        />

        {error ? <ErrorText>{error}</ErrorText> : null}

        <Button
          title="Entrar"
          onPress={handleLogin}
          loading={loading}
          containerStyle={{ marginTop: 10, width: '100%' }}
          buttonStyle={{
            backgroundColor: theme.colors.primary,
            paddingVertical: 12,
          }}
          titleStyle={{
            color: theme.colors.btntext,
            fontWeight: 'bold',
            fontSize: 20,
          }}
        />

        <Button
          title="Cadastrar"
          onPress={() => navigation.navigate('Register')}
          containerStyle={{ marginTop: 10, width: '100%' }}
          buttonStyle={{
            backgroundColor: theme.colors.primary,
            paddingVertical: 12,
          }}
          titleStyle={{
            color: theme.colors.btntext,
            fontWeight: 'bold',
            fontSize: 20,
          }}
        />
      </Content>
    </Container>
  );
};

// Container principal
const Container = styled.View`
  flex: 1;
  padding: 20px;
  justify-content: center;
  background-color: ${theme.colors.background};
`;

// Título com tamanho variável
const Title = styled.Text<{ fontSize: number }>`
  font-size: ${({ fontSize }) => fontSize}px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 80px;
  color: ${theme.colors.title};
`;

// Wrapper com largura máxima
const Content = styled.View`
  width: 100%;
`;

// Texto de erro
const ErrorText = styled.Text`
  color: ${theme.colors.error};
  text-align: center;
  margin-bottom: 10px;
`;

export default LoginScreen;