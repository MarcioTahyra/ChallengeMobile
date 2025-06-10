import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { ScrollView, ActivityIndicator, useWindowDimensions } from 'react-native';
import { Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import theme from '../styles/theme';
import { useNavigation } from '@react-navigation/native';

type Portfolio = {
  nome: string;
  ativos: string[];
};

const MyPortfolioScreen: React.FC = () => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const maxWidth = width > 500 ? 400 : '100%';

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const stored = await AsyncStorage.getItem('@InvestApp:selectedPortfolio');
        if (stored) {
          setPortfolio(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Erro ao carregar a carteira:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPortfolio();
  }, []);

  if (loading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <Header />
      <ScrollView contentContainerStyle={{ padding: 20, alignItems: 'center' }}>
        <Content style={{ maxWidth }}>
          <Title>Minha Carteira</Title>

          {portfolio ? (
            <>
              <PortfolioTitle>{portfolio.nome}</PortfolioTitle>
              {portfolio.ativos.map((ativo, index) => (
                <PortfolioItem key={index}>• {ativo}</PortfolioItem>
              ))}
            </>
          ) : (
            <NoDataText>Nenhuma carteira selecionada.</NoDataText>
          )}
        </Content>
      </ScrollView>

      <Footer>
        <Button
          title="Voltar"
          onPress={() => navigation.goBack()}
          buttonStyle={{
            backgroundColor: theme.colors.primary,
            paddingVertical: 12,
            borderRadius: 30,
          }}
        />
      </Footer>
    </Container>
  );
};

// Styled Components
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
  text-align: center;
  color: ${theme.colors.text};
  margin-bottom: 20px;
`;

const PortfolioTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${theme.colors.primary};
  margin-bottom: 10px;
`;

const PortfolioItem = styled.Text`
  font-size: 16px;
  color: ${theme.colors.text};
  margin-bottom: 5px;
`;

const NoDataText = styled.Text`
  font-size: 16px;
  color: ${theme.colors.text};
  text-align: center;
  margin-top: 20px;
`;

const Footer = styled.View`
  padding: 10px 20px;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export default MyPortfolioScreen;
