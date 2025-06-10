import React from 'react';
import styled from 'styled-components/native';
import theme from '../styles/theme';

type QuestionItemProps = {
  id: string;
  text: string;
  options: string[];
  selectedOptionIndex?: number;
  onSelect: (questionId: string, optionIndex: number) => void;
};

const QuestionItem: React.FC<QuestionItemProps> = ({
  id,
  text,
  options,
  selectedOptionIndex,
  onSelect,
}) => {
  return (
    <QuestionContainer>
      <QuestionText>{text}</QuestionText>
      {options.map((option, index) => {
        const selected = selectedOptionIndex === index;
        return (
          <OptionButton
            key={index}
            selected={selected}
            onPress={() => onSelect(id, index)}
          >
            <OptionText selected={selected}>{option}</OptionText>
          </OptionButton>
        );
      })}
    </QuestionContainer>
  );
};

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

export default QuestionItem;
