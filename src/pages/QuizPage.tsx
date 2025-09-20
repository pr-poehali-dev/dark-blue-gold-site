import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface Question {
  question: string;
  options: string[];
  correct: number;
}

const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [quizData] = useState({
    title: "Квиз по веб-технологиям",
    description: "Проверьте свои знания в области современной веб-разработки",
    category: "Технологии",
    questions: [
      {
        question: "Какой язык программирования используется для создания интерактивных веб-страниц?",
        options: ["HTML", "CSS", "JavaScript", "Python"],
        correct: 2
      },
      {
        question: "Что означает CSS?",
        options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"],
        correct: 1
      },
      {
        question: "Какой протокол используется для безопасной передачи данных в интернете?",
        options: ["HTTP", "HTTPS", "FTP", "SMTP"],
        correct: 1
      },
      {
        question: "Что такое React?",
        options: ["База данных", "Серверный язык", "JavaScript библиотека", "Операционная система"],
        correct: 2
      }
    ] as Question[]
  });

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [id]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...userAnswers, selectedAnswer];
    setUserAnswers(newAnswers);

    if (selectedAnswer === quizData.questions[currentQuestion].correct) {
      setScore(score + 1);
    }

    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setUserAnswers([]);
  };

  const generateQRCode = (content: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(content)}`;
  };

  const handleShare = () => {
    const text = `Я прошел квиз "${quizData.title}" и набрал ${score} из ${quizData.questions.length} баллов!`;
    if (navigator.share) {
      navigator.share({
        title: quizData.title,
        text: text,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`${text} ${window.location.href}`);
      alert('Результат скопирован в буфер обмена!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-950 mx-auto mb-4"></div>
          <p className="text-gold-200">Загрузка квиза...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="border-gold-950 text-gold-950 hover:bg-gold-950/10"
            >
              <Icon name="ArrowLeft" size={20} className="mr-2" />
              Назад к главной
            </Button>
          </div>

          <Card className="game-card vintage-frame">
            <div className="vintage-corner top-left"></div>
            <div className="vintage-corner top-right"></div>
            <div className="vintage-corner bottom-left"></div>
            <div className="vintage-corner bottom-right"></div>
            
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl text-gold-950 mb-2 flex items-center">
                    <Icon name="Brain" size={32} className="mr-3" />
                    {quizData.title}
                  </CardTitle>
                  <CardDescription className="text-gold-200 text-lg">
                    {quizData.description}
                  </CardDescription>
                  <div className="flex items-center space-x-4 mt-4">
                    <Badge variant="secondary" className="bg-gold-950/20 text-gold-950">
                      {quizData.category}
                    </Badge>
                    <span className="text-gold-200 flex items-center">
                      <Icon name="HelpCircle" size={16} className="mr-1" />
                      {quizData.questions.length} вопросов
                    </span>
                  </div>
                </div>
                <div className="ml-6 text-center">
                  <img 
                    src={generateQRCode(window.location.href)} 
                    alt="QR код для квиза"
                    className="w-24 h-24 rounded border border-gold-950/50 mb-2"
                  />
                  <p className="text-gold-200 text-xs">Поделиться QR</p>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {!showResult ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between text-sm text-gold-200">
                    <span>Вопрос {currentQuestion + 1} из {quizData.questions.length}</span>
                    <Badge variant="secondary" className="bg-gold-950/20 text-gold-950">
                      Счет: {score}
                    </Badge>
                  </div>
                  
                  <Progress 
                    value={(currentQuestion / quizData.questions.length) * 100} 
                    className="h-3"
                  />
                  
                  <div className="py-6">
                    <h3 className="text-xl font-medium text-gold-950 mb-6">
                      {quizData.questions[currentQuestion].question}
                    </h3>
                    
                    <div className="grid gap-3">
                      {quizData.questions[currentQuestion].options.map((option, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className={`justify-start text-left p-4 h-auto border-gold-950/30 text-gold-200 hover:bg-gold-950/20 hover:text-gold-950 ${
                            selectedAnswer === index 
                              ? 'bg-gold-950/30 border-gold-950 text-gold-950' 
                              : ''
                          }`}
                          onClick={() => handleAnswerSelect(index)}
                        >
                          <span className="mr-3 font-bold">
                            {String.fromCharCode(65 + index)}.
                          </span>
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleNextQuestion}
                      disabled={selectedAnswer === null}
                      className="bg-gold-950 text-navy-900 hover:bg-gold-800 px-8"
                    >
                      {currentQuestion < quizData.questions.length - 1 ? 'Следующий вопрос' : 'Завершить квиз'}
                      <Icon name="ArrowRight" size={20} className="ml-2" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Icon name="Trophy" size={64} className="text-gold-950 mx-auto mb-6" />
                  <h3 className="text-3xl font-bold text-gold-950 mb-4">Квиз завершен!</h3>
                  
                  <div className="bg-navy-800/50 rounded-lg p-6 mb-6">
                    <div className="text-4xl font-bold text-gold-950 mb-2">
                      {score} / {quizData.questions.length}
                    </div>
                    <p className="text-gold-200 mb-4">
                      Правильных ответов: {Math.round((score / quizData.questions.length) * 100)}%
                    </p>
                    
                    <div className="text-left space-y-2">
                      <h4 className="text-gold-950 font-medium mb-3">Результаты по вопросам:</h4>
                      {quizData.questions.map((question, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-gold-200 flex-1">
                            Вопрос {index + 1}
                          </span>
                          <div className="flex items-center">
                            {userAnswers[index] === question.correct ? (
                              <Icon name="CheckCircle" size={16} className="text-green-400 mr-2" />
                            ) : (
                              <Icon name="XCircle" size={16} className="text-red-400 mr-2" />
                            )}
                            <span className={userAnswers[index] === question.correct ? 'text-green-400' : 'text-red-400'}>
                              {userAnswers[index] === question.correct ? 'Верно' : 'Неверно'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 justify-center">
                    <Button 
                      onClick={resetQuiz}
                      className="bg-gold-950 text-navy-900 hover:bg-gold-800"
                    >
                      <Icon name="RotateCcw" size={20} className="mr-2" />
                      Пройти снова
                    </Button>
                    <Button 
                      onClick={handleShare}
                      variant="outline"
                      className="border-gold-950 text-gold-950 hover:bg-gold-950/10"
                    >
                      <Icon name="Share2" size={20} className="mr-2" />
                      Поделиться результатом
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;