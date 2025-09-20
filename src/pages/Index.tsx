import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [showQuizResult, setShowQuizResult] = useState(false);

  const quizQuestions = [
    {
      question: "Какой самый популярный язык программирования в 2024?",
      options: ["JavaScript", "Python", "Java", "C++"],
      correct: 1
    },
    {
      question: "Что означает QR в QR-коде?",
      options: ["Quick Response", "Quality Rating", "Quantum Read", "Quick Record"],
      correct: 0
    },
    {
      question: "Сколько пикселей в 4K разрешении?",
      options: ["2 миллиона", "4 миллиона", "8 миллионов", "16 миллионов"],
      correct: 2
    }
  ];

  const handleQuizAnswer = (selectedAnswer: number) => {
    if (selectedAnswer === quizQuestions[currentQuiz].correct) {
      setQuizScore(quizScore + 1);
    }

    if (currentQuiz < quizQuestions.length - 1) {
      setCurrentQuiz(currentQuiz + 1);
    } else {
      setShowQuizResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuiz(0);
    setQuizScore(0);
    setShowQuizResult(false);
  };

  const generateQRCode = (content: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(content)}`;
  };

  return (
    <div className="min-h-screen bg-navy-gold">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-navy-900/95 backdrop-blur-sm border-b border-gold-950/20">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Gamepad2" size={32} className="text-gold-950" />
              <h1 className="text-2xl font-montserrat font-bold text-gold-950">
                GameZone
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#quizzes" className="nav-link">Квизы</a>
              <a href="#videos" className="nav-link">Видео</a>
              <a href="#games" className="nav-link">Игры</a>
            </div>
            <Button className="qr-button">
              <Icon name="QrCode" size={20} className="mr-2" />
              Сканировать
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl md:text-7xl font-montserrat font-bold text-gold-950 mb-6">
            Развлекательная Зона
          </h2>
          <p className="text-xl text-gold-200 mb-8 max-w-2xl mx-auto">
            Игры, квизы и видео с QR-переходами. Сканируй, играй, побеждай!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gold-950 text-navy-900 hover:bg-gold-800 px-8 py-3 text-lg">
              <Icon name="Play" size={24} className="mr-2" />
              Начать игру
            </Button>
            <Button variant="outline" className="border-gold-950 text-gold-950 hover:bg-gold-950/10 px-8 py-3 text-lg">
              <Icon name="Brain" size={24} className="mr-2" />
              Пройти квиз
            </Button>
          </div>
        </div>
      </section>

      {/* Quiz Section */}
      <section id="quizzes" className="py-16 bg-navy-900/50">
        <div className="container mx-auto px-4">
          <h3 className="section-title text-center">Интерактивные Квизы</h3>
          
          <div className="max-w-2xl mx-auto">
            <Card className="game-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-gold-950 flex items-center">
                    <Icon name="Brain" size={24} className="mr-2" />
                    Технологический Квиз
                  </CardTitle>
                  <img 
                    src={generateQRCode('https://quiz.gamezone.dev/tech-quiz')} 
                    alt="QR код для квиза"
                    className="w-12 h-12 rounded"
                  />
                </div>
                <CardDescription className="text-gold-200">
                  Проверь свои знания в области технологий
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!showQuizResult ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gold-200">
                      <span>Вопрос {currentQuiz + 1} из {quizQuestions.length}</span>
                      <Badge variant="secondary" className="bg-gold-950/20 text-gold-950">
                        Счет: {quizScore}
                      </Badge>
                    </div>
                    
                    <Progress 
                      value={(currentQuiz / quizQuestions.length) * 100} 
                      className="h-2"
                    />
                    
                    <div className="py-4">
                      <h4 className="text-lg font-medium text-gold-950 mb-4">
                        {quizQuestions[currentQuiz].question}
                      </h4>
                      
                      <div className="grid gap-2">
                        {quizQuestions[currentQuiz].options.map((option, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="justify-start text-left border-gold-950/30 text-gold-200 hover:bg-gold-950/20 hover:text-gold-950"
                            onClick={() => handleQuizAnswer(index)}
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Icon name="Trophy" size={48} className="text-gold-950 mx-auto mb-4" />
                    <h4 className="text-2xl font-bold text-gold-950 mb-2">Квиз завершен!</h4>
                    <p className="text-gold-200 mb-4">
                      Ваш результат: {quizScore} из {quizQuestions.length}
                    </p>
                    <Button 
                      onClick={resetQuiz}
                      className="bg-gold-950 text-navy-900 hover:bg-gold-800"
                    >
                      <Icon name="RotateCcw" size={20} className="mr-2" />
                      Пройти снова
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section id="videos" className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="section-title text-center">Видео Контент</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Гайд по веб-разработке",
                description: "Основы создания современных сайтов",
                duration: "15:30",
                category: "Обучение"
              },
              {
                title: "Топ игр 2024",
                description: "Обзор лучших игр этого года",
                duration: "22:45",
                category: "Развлечения"
              },
              {
                title: "Квантовые технологии",
                description: "Будущее компьютерных технологий",
                duration: "18:20",
                category: "Наука"
              }
            ].map((video, index) => (
              <Card key={index} className="game-card group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-gold-950 text-lg mb-2">
                        {video.title}
                      </CardTitle>
                      <CardDescription className="text-gold-200">
                        {video.description}
                      </CardDescription>
                    </div>
                    <img 
                      src={generateQRCode(`https://videos.gamezone.dev/${index + 1}`)} 
                      alt={`QR код для видео ${video.title}`}
                      className="w-16 h-16 rounded ml-4"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Badge variant="secondary" className="bg-gold-950/20 text-gold-950">
                        {video.category}
                      </Badge>
                      <span className="text-sm text-gold-200 flex items-center">
                        <Icon name="Clock" size={16} className="mr-1" />
                        {video.duration}
                      </span>
                    </div>
                    <Button size="sm" className="qr-button group-hover:animate-pulse-gold">
                      <Icon name="Play" size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section id="games" className="py-16 bg-navy-900/50">
        <div className="container mx-auto px-4">
          <h3 className="section-title text-center">Мини-Игры</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Пазл-Челлендж",
                description: "Собери картинку за время",
                difficulty: "Легко",
                players: "1-4",
                icon: "Puzzle"
              },
              {
                title: "Викторина Знаний",
                description: "100 вопросов на эрудицию",
                difficulty: "Средне",
                players: "1-10",
                icon: "BookOpen"
              },
              {
                title: "Реакция Ниндзя",
                description: "Проверь скорость реакции",
                difficulty: "Сложно",
                players: "1",
                icon: "Zap"
              },
              {
                title: "Логическая Цепь",
                description: "Найди закономерность",
                difficulty: "Эксперт",
                players: "1",
                icon: "Link"
              }
            ].map((game, index) => (
              <Card key={index} className="game-card group cursor-pointer">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gold-950/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gold-950/30 transition-colors">
                    <Icon name={game.icon as any} size={32} className="text-gold-950" />
                  </div>
                  <CardTitle className="text-gold-950 text-lg">
                    {game.title}
                  </CardTitle>
                  <CardDescription className="text-gold-200">
                    {game.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-3">
                  <div className="flex justify-center space-x-4 text-sm">
                    <span className="text-gold-200 flex items-center">
                      <Icon name="Target" size={16} className="mr-1" />
                      {game.difficulty}
                    </span>
                    <span className="text-gold-200 flex items-center">
                      <Icon name="Users" size={16} className="mr-1" />
                      {game.players}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <img 
                      src={generateQRCode(`https://games.gamezone.dev/${index + 1}`)} 
                      alt={`QR код для игры ${game.title}`}
                      className="w-12 h-12 rounded"
                    />
                    <Button className="qr-button group-hover:animate-pulse-gold">
                      <Icon name="Play" size={16} className="mr-2" />
                      Играть
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-950 py-12 border-t border-gold-950/20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Icon name="Gamepad2" size={28} className="text-gold-950" />
            <span className="text-xl font-montserrat font-bold text-gold-950">GameZone</span>
          </div>
          <p className="text-gold-200 mb-4">
            Лучшие игры, квизы и развлечения с QR-переходами
          </p>
          <div className="flex justify-center space-x-6 text-gold-200">
            <a href="#" className="hover:text-gold-950 transition-colors">
              <Icon name="Github" size={24} />
            </a>
            <a href="#" className="hover:text-gold-950 transition-colors">
              <Icon name="Twitter" size={24} />
            </a>
            <a href="#" className="hover:text-gold-950 transition-colors">
              <Icon name="Instagram" size={24} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;