import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView, ActivityIndicator, useWindowDimensions } from 'react-native';
import Header from '../components/Header';
import theme from '../styles/theme';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

type Question = {
  id: string;
  text: string;
  options: string[];
};

type Answers = Record<string, number>;

const questions: Question[] = [
  {
    id: '1',
    text: 'Qual é a sua idade?',
    options: ['Até 25 anos', 'De 26 a 35 anos', 'De 36 a 55 anos', 'Acima de 55 anos'],
  },
  {
    id: '2',
    text: 'Qual é a sua principal fonte de renda?',
    options: ['Salário ou aposentadoria', 'Rendimento de empresa própria', 'Renda de investimentos ou imóveis', 'Outros'],
  },
  {
    id: '3',
    text: 'Qual é o seu objetivo com os investimentos?',
    options: ['Preservar meu capital', 'Obter rentabilidade acima da poupança', 'Acumular patrimônio no longo prazo', 'Obter alta rentabilidade, mesmo com riscos'],
  },
  {
    id: '4',
    text: 'Qual é o seu horizonte de investimento?',
    options: ['Até 1 ano', 'De 1 a 3 anos', 'De 3 a 5 anos', 'Acima de 5 anos'],
  },
  {
    id: '5',
    text: 'Como você se sentiria se seus investimentos sofressem uma perda de 10% em um curto período?',
    options: ['Muito desconfortável, retiraria o dinheiro', 'Preocupado, mas manteria', 'Entenderia como algo natural', 'Aproveitaria para investir mais'],
  },
  {
    id: '6',
    text: 'Qual a sua experiência com investimentos?',
    options: ['Nenhuma', 'Já investi em poupança e CDB', 'Já investi em fundos ou ações', 'Tenho experiência com derivativos, renda variável e criptos'],
  },
  {
    id: '7',
    text: 'Qual é a sua capacidade de lidar com perdas financeiras?',
    options: ['Até 10%', 'Entre 10% e 25%', 'Entre 25% e 50%', 'Acima de 50%'],
  },
  {
    id: '8',
    text: 'Quanto do seu capital pretende investir?',
    options: ['Até 10%', 'Entre 10% e 25%', 'Entre 25% e 50%', 'Acima de 50%'],
  },
];

const ProfileEvaluationScreen: React.FC = () => {
  const [answers, setAnswers] = useState<Answers>({});
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState('');
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const maxWidth = width > 500 ? 400 : '100%';

  useEffect(() => {
    const loadAnswers = async () => {
      try {
        const data = await AsyncStorage.getItem('@MedicalApp:questionnaireAnswers');
        if (data) {
          const parsed: Answers = JSON.parse(data);
          setAnswers(parsed);
          evaluateProfile(parsed);
        }
      } catch (err) {
        console.error('Erro ao carregar respostas:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAnswers();
  }, []);

  const evaluateProfile = (answers: Answers) => {
    const total = Object.values(answers).reduce((sum, val) => sum + (val + 1), 0);
    const average = total / questions.length;

    if (average <= 1.9) setProfile('Conservador');
    else if (average <= 2.9) setProfile('Moderado');
    else setProfile('Arrojado');
  };

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
          <Title>Seu Perfil de Investidor</Title>
          <ProfileBox>
            <ProfileText>{profile}</ProfileText>
          </ProfileBox>

          <Subtitle>Respostas do Questionário:</Subtitle>
          {questions.map((q) => (
            <QuestionBlock key={q.id}>
              <QuestionText>{q.text}</QuestionText>
              <AnswerText>
                {answers[q.id] !== undefined
                  ? q.options[answers[q.id]]
                  : 'Não respondido'}
              </AnswerText>
            </QuestionBlock>
          ))}
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

export default ProfileEvaluationScreen;

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

const Subtitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-top: 30px;
  margin-bottom: 10px;
`;

const QuestionBlock = styled.View`
  margin-bottom: 15px;
`;

const QuestionText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${theme.colors.text};
`;

const AnswerText = styled.Text`
  font-size: 16px;
  color: ${theme.colors.text};
  margin-top: 5px;
`;

const ProfileBox = styled.View`
  background-color: ${theme.colors.card};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  align-items: center;
`;

const ProfileText = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${theme.colors.primary};
`;

const Footer = styled.View`
  padding: 10px 20px;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
