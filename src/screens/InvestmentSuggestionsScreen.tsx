import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView, ActivityIndicator, Alert, useWindowDimensions } from 'react-native';
import theme from '../styles/theme';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';

type Portfolio = {
  nome: string;
  ativos: string[];
};

const portfolios: Record<string, Portfolio[]> = {
  Conservador: [
    { nome: 'Carteira Conservadora A', ativos: ['Tesouro Selic', 'CDB de grandes bancos', 'Fundos de Renda Fixa'] },
    { nome: 'Carteira Conservadora B', ativos: ['Tesouro Selic', 'Poupança com reforço mensal', 'LCI de bancos médios'] },
    { nome: 'Carteira Conservadora C', ativos: ['CDB de bancos médios', 'Fundos de Renda Fixa', 'Poupança'] },
  ],
  Moderado: [
    { nome: 'Carteira Moderada A', ativos: ['Tesouro IPCA+', 'Fundos Multimercado', 'Ações de empresas estáveis'] },
    { nome: 'Carteira Moderada B', ativos: ['LCI/LCA', 'Tesouro IPCA+', 'Fundos de ações'] },
    { nome: 'Carteira Moderada C', ativos: ['Fundos Multimercado', 'ETFs', 'Ações blue chips'] },
  ],
  Arrojado: [
    { nome: 'Carteira Arrojada A', ativos: ['Ações', 'ETFs', 'Criptomoedas'] },
    { nome: 'Carteira Arrojada B', ativos: ['Fundos de ações', 'Criptomoedas', 'Investimentos internacionais'] },
    { nome: 'Carteira Arrojada C', ativos: ['Ações internacionais', 'Criptoativos', 'Small caps'] },
  ],
};

const InvestmentSuggestionsScreen: React.FC = () => {
  const [profile, setProfile] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const answersData = await AsyncStorage.getItem('@MedicalApp:questionnaireAnswers');
        if (answersData) {
          const answers = JSON.parse(answersData) as Record<string, number>;
          const total = Object.values(answers).reduce((sum, val) => sum + (val + 1), 0);
          const average = total / Object.keys(answers).length;

          if (average <= 1.9) setProfile('Conservador');
          else if (average <= 2.9) setProfile('Moderado');
          else setProfile('Arrojado');
        }
      } catch (err) {
        console.error('Erro ao carregar perfil:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSelectPortfolio = async (portfolio: Portfolio) => {
    try {
      await AsyncStorage.setItem('@MedicalApp:selectedPortfolio', JSON.stringify(portfolio));
      Alert.alert('Sucesso', `Carteira "${portfolio.nome}" salva com sucesso!`);
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar carteira:', error);
      Alert.alert('Erro', 'Não foi possível salvar a carteira.');
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </LoadingContainer>
    );
  }

  const availablePortfolios = profile ? portfolios[profile] : [];

  return (
    <Container>
      <Header />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Title responsiveWidth={width}>Sugestões de Investimento</Title>
        <Subtitle responsiveWidth={width}>
          Perfil identificado: <Bold>{profile}</Bold>
        </Subtitle>

        <SectionTitle responsiveWidth={width}>Escolha uma carteira:</SectionTitle>
        {availablePortfolios.map((portfolio, index) => (
          <PortfolioCard key={index} onPress={() => handleSelectPortfolio(portfolio)} responsiveWidth={width}>
            <PortfolioTitle responsiveWidth={width}>{portfolio.nome}</PortfolioTitle>
            {portfolio.ativos.map((ativo, i) => (
              <PortfolioItem key={i} responsiveWidth={width}>• {ativo}</PortfolioItem>
            ))}
          </PortfolioCard>
        ))}
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

// Styled Components com responsividade
const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Title = styled.Text<{ responsiveWidth: number }>`
  font-size: ${({ responsiveWidth }) => (responsiveWidth > 600 ? '28px' : '22px')};
  font-weight: bold;
  text-align: center;
  color: ${theme.colors.text};
  margin-bottom: 10px;
`;

const Subtitle = styled.Text<{ responsiveWidth: number }>`
  font-size: ${({ responsiveWidth }) => (responsiveWidth > 600 ? '20px' : '16px')};
  text-align: center;
  margin-bottom: 20px;
  color: ${theme.colors.text};
`;

const Bold = styled.Text`
  font-weight: bold;
  color: ${theme.colors.primary};
`;

const SectionTitle = styled.Text<{ responsiveWidth: number }>`
  font-size: ${({ responsiveWidth }) => (responsiveWidth > 600 ? '22px' : '18px')};
  font-weight: bold;
  margin-bottom: 15px;
  color: ${theme.colors.text};
`;

const PortfolioCard = styled.TouchableOpacity<{ responsiveWidth: number }>`
  background-color: ${theme.colors.card};
  padding: ${({ responsiveWidth }) => (responsiveWidth > 600 ? '20px' : '15px')};
  border-radius: 10px;
  margin-bottom: 15px;
`;

const PortfolioTitle = styled.Text<{ responsiveWidth: number }>`
  font-size: ${({ responsiveWidth }) => (responsiveWidth > 600 ? '20px' : '18px')};
  font-weight: bold;
  color: ${theme.colors.primary};
  margin-bottom: 10px;
`;

const PortfolioItem = styled.Text<{ responsiveWidth: number }>`
  font-size: ${({ responsiveWidth }) => (responsiveWidth > 600 ? '18px' : '16px')};
  color: ${theme.colors.text};
`;

const Footer = styled.View`
  padding: 10px 20px;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export default InvestmentSuggestionsScreen;
