import React, { useState } from 'react';
import { Alert, ScrollView, View, useWindowDimensions } from 'react-native';
import { Button } from 'react-native-elements';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import theme from '../styles/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import QuestionItem from '../components/QuestionItem';


type QuestionsProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Questions'>;
};

type Question = {
  id: string;
  text: string;
  options: string[];
};

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

const QuestionsScreen: React.FC = () => {
  const navigation = useNavigation<QuestionsProps['navigation']>();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmit = async () => {
    try {
      await AsyncStorage.setItem('@InvestApp:questionnaireAnswers', JSON.stringify(answers));
      Alert.alert('Sucesso', 'Respostas salvas com sucesso!');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível salvar as respostas.');
    }
  };

  return (
    <Container>
      <Header />
      <ContentWrapper isLargeScreen={isLargeScreen}>
        <Title>Fazer Questionário</Title>
        <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
          {questions.map((question) => (
            <QuestionItem
              key={question.id}
              id={question.id}
              text={question.text}
              options={question.options}
              selectedOptionIndex={answers[question.id]}
              onSelect={handleSelectOption}
            />
          ))}


          <View style={{ alignItems: 'center', marginBottom: 40 }}>
            <Button
              title="Enviar"
              onPress={handleSubmit}
              buttonStyle={{
                backgroundColor: theme.colors.primary,
                paddingVertical: 10,
                paddingHorizontal: 40,
              }}
              containerStyle={{ marginTop: 10 }}
            />
          </View>
        </ScrollView>
      </ContentWrapper>

      <FixedFooter>
        <Button
          title="Voltar"
          onPress={() => navigation.goBack()}
          containerStyle={styles.button}
          buttonStyle={styles.buttonStyle}
        />
      </FixedFooter>
    </Container>
  );
};

// Estilização responsiva

const styles = {
  button: {
    width: '33%',
  },
  buttonStyle: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
  },
};

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const ContentWrapper = styled.View<{ isLargeScreen: boolean }>`
  flex: 1;
  width: ${({ isLargeScreen }) => (isLargeScreen ? '70%' : '100%')};
  align-self: center;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  color: ${theme.colors.text};
  margin: 20px 0;
`;

const QuestionContainer = styled.View`
  margin-bottom: 25px;
  padding: 0 20px;
`;

const QuestionText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: ${theme.colors.text};
`;

const OptionButton = styled.TouchableOpacity<{ selected: boolean }>`
  background-color: ${({ selected }) =>
    selected ? theme.colors.primary : theme.colors.card};
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 10px;
  border-width: 1px;
  border-color: ${theme.colors.primary};
`;

const OptionText = styled.Text<{ selected: boolean }>`
  color: ${({ selected }) =>
    selected ? '#fff' : theme.colors.text};
  font-size: 16px;
`;

const FixedFooter = styled.View`
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  align-items: center;
`;

export default QuestionsScreen;
