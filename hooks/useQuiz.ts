import { useState, useCallback } from 'react';
import { QuizQuestion } from '../types';

export const useQuiz = () => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [showQuizResult, setShowQuizResult] = useState(false);

  const handleAnswer = useCallback((index: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[currentQuizIndex] = index;
    setQuizAnswers(newAnswers);
  }, [quizAnswers, currentQuizIndex]);

  const handleNext = useCallback(() => {
    setCurrentQuizIndex(prev => prev + 1);
  }, []);

  const handlePrevious = useCallback(() => {
    setCurrentQuizIndex(prev => Math.max(0, prev - 1));
  }, []);

  const handleSubmit = useCallback(() => {
    setShowQuizResult(true);
  }, []);

  const handleStartQuiz = useCallback(() => {
    setCurrentQuizIndex(0);
    setQuizAnswers([]);
    setShowQuiz(true);
    setShowQuizResult(false);
  }, []);

  const handleCloseQuiz = useCallback(() => {
    setShowQuiz(false);
    setCurrentQuizIndex(0);
    setQuizAnswers([]);
    setShowQuizResult(false);
  }, []);

  return {
    showQuiz,
    currentQuizIndex,
    quizAnswers,
    showQuizResult,
    handleAnswer,
    handleNext,
    handlePrevious,
    handleSubmit,
    handleStartQuiz,
    handleCloseQuiz,
    setShowQuiz
  };
};
