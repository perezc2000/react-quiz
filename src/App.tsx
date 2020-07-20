import React, { useState } from 'react';

// API's
import { fetchTrivia } from './API';

// Components
import QuestionCard from './components/QuestionCard';

// Types
import { QuestionState, Difficulty } from './API';

// Styles
import { GlobalStyle, Wrapper } from './App.styles';

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
}

const TOTAL_QUESTIONS = 10;
const App = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUsersAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchTrivia(TOTAL_QUESTIONS, Difficulty.EASY);

    setQuestions(newQuestions);
    setScore(0);
    setUsersAnswers([]);
    setNumber(0);
    setLoading(false);
  }
  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      const answer = e.currentTarget.value;
      const correct = questions[number].correct_answer === answer;

      if (correct) setScore(prev => prev + 1);

      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer
      }
      setUsersAnswers(prev => [...prev, answerObject]);
    }
  }
  const nextQuestion = () => {
    const next = number + 1;

    if (next === TOTAL_QUESTIONS) {
      setGameOver(true);
    } else {
      setNumber(next);
    }
  }
  return (
    <>
    <GlobalStyle />
      <div className="App">
        <Wrapper>
          <h1>FCC: REACT QUIZ</h1>
          {(gameOver || userAnswers.length === TOTAL_QUESTIONS) && (
            <button className="start" onClick={startTrivia}>Start</button>
          )}
          {!gameOver && <p className="score">Score: {score}</p>}
          {loading && <p>Loading Question ...</p>}
          {!loading && !gameOver && (
            <QuestionCard
              question={questions[number].question}
              answers={questions[number].answers}
              callback={checkAnswer}
              userAnswer={userAnswers ? userAnswers[number] : undefined}
              questionNumber={number + 1}
              totalQuestion={TOTAL_QUESTIONS}
            />
          )}
          {!loading && !gameOver && userAnswers.length === number + 1 && number !== TOTAL_QUESTIONS - 1 && (
            <button className="next" onClick={nextQuestion}>Next Question</button>
          )}
        </Wrapper>
      </div>
    </>
  );
}

export default App;
