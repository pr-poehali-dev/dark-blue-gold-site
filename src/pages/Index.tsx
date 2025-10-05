import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import QRScanner from '@/components/QRScanner';

const Index = () => {
  const navigate = useNavigate();
  const [visibleSection, setVisibleSection] = useState('');
  const [videos, setVideos] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '-50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSection(entry.target.id);
          entry.target.classList.add('animate-fade-in');
          
          const animateElements = entry.target.querySelectorAll('.animate-on-scroll');
          animateElements.forEach((el, index) => {
            setTimeout(() => {
              el.classList.add('visible');
            }, index * 100);
          });
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));
    
    loadContent();

    return () => observer.disconnect();
  }, []);

  const loadContent = () => {
    const loadedVideos = JSON.parse(localStorage.getItem('videos') || '[]');
    setVideos(loadedVideos);
    
    const loadedQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    setQuizzes(loadedQuizzes);
  };

  const handleDeleteVideo = (e: React.MouseEvent, videoId: string) => {
    e.stopPropagation();
    if (confirm('Вы уверены, что хотите удалить это видео?')) {
      const updatedVideos = videos.filter(v => v.id !== videoId);
      localStorage.setItem('videos', JSON.stringify(updatedVideos));
      setVideos(updatedVideos);
    }
  };

  const handleDeleteQuiz = (e: React.MouseEvent, quizId: string) => {
    e.stopPropagation();
    if (confirm('Вы уверены, что хотите удалить этот квиз?')) {
      const updatedQuizzes = quizzes.filter(q => q.id !== quizId);
      localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));
      setQuizzes(updatedQuizzes);
    }
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
              <a 
                href="#quizzes" 
                className={`nav-link ${visibleSection === 'quizzes' ? 'text-gold-950 after:w-full' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('quizzes')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Квизы
              </a>
              <a 
                href="#videos" 
                className={`nav-link ${visibleSection === 'videos' ? 'text-gold-950 after:w-full' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('videos')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Видео
              </a>
              <a 
                href="#games" 
                className={`nav-link ${visibleSection === 'games' ? 'text-gold-950 after:w-full' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('games')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Игры
              </a>
            </div>
            <Button 
              className="qr-button"
              onClick={() => setShowScanner(true)}
            >
              <Icon name="QrCode" size={20} className="mr-2" />
              Сканировать
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <div className="vintage-frame max-w-4xl mx-auto bg-navy-800/30">
            <div className="vintage-corner top-left"></div>
            <div className="vintage-corner top-right"></div>
            <div className="vintage-corner bottom-left"></div>
            <div className="vintage-corner bottom-right"></div>
            <h2 className="text-5xl md:text-7xl font-montserrat font-bold text-gold-950 mb-6">
              Развлекательная Зона
            </h2>
            <p className="text-xl text-gold-200 mb-8 max-w-2xl mx-auto">
              Игры, квизы и видео с QR-переходами. Сканируй, играй, побеждай!
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button 
              className="bg-gold-950 text-navy-900 hover:bg-gold-800 px-8 py-3 text-lg transition-transform hover:scale-105"
              onClick={() => document.getElementById('games')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Icon name="Play" size={24} className="mr-2" />
              Начать игру
            </Button>
            <Button 
              variant="outline" 
              className="border-gold-950 text-gold-950 hover:bg-gold-950/10 px-8 py-3 text-lg transition-transform hover:scale-105"
              onClick={() => document.getElementById('quizzes')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Icon name="Brain" size={24} className="mr-2" />
              Пройти квиз
            </Button>
            <Button 
              className="bg-gold-800 text-navy-900 hover:bg-gold-700 px-8 py-3 text-lg transition-transform hover:scale-105"
            >
              <Icon name="Plus" size={24} className="mr-2" />
              Создать контент
            </Button>
          </div>
        </div>
      </section>

      {/* Admin Panel Section */}
      <section className="py-16 bg-navy-900/30">
        <div className="container mx-auto px-4">
          <h3 className="section-title text-center animate-on-scroll">Создать Контент</h3>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <Card className="game-card vintage-frame">
              <div className="vintage-corner top-left"></div>
              <div className="vintage-corner top-right"></div>
              <div className="vintage-corner bottom-left"></div>
              <div className="vintage-corner bottom-right"></div>
              <CardHeader className="text-center">
                <Icon name="FileVideo" size={48} className="text-gold-950 mx-auto mb-4" />
                <CardTitle className="text-gold-950">Добавить Видео</CardTitle>
                <CardDescription className="text-gold-200">
                  Создайте новую видео-страницу с QR-кодом
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  className="bg-gold-950 text-navy-900 hover:bg-gold-800 w-full"
                  onClick={() => navigate('/create-video')}
                >
                  <Icon name="Plus" size={20} className="mr-2" />
                  Создать видео
                </Button>
              </CardContent>
            </Card>

            <Card className="game-card vintage-frame">
              <div className="vintage-corner top-left"></div>
              <div className="vintage-corner top-right"></div>
              <div className="vintage-corner bottom-left"></div>
              <div className="vintage-corner bottom-right"></div>
              <CardHeader className="text-center">
                <Icon name="Brain" size={48} className="text-gold-950 mx-auto mb-4" />
                <CardTitle className="text-gold-950">Создать Квиз</CardTitle>
                <CardDescription className="text-gold-200">
                  Разработайте интерактивный квиз
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  className="bg-gold-950 text-navy-900 hover:bg-gold-800 w-full"
                  onClick={() => navigate('/create-quiz')}
                >
                  <Icon name="Plus" size={20} className="mr-2" />
                  Создать квиз
                </Button>
              </CardContent>
            </Card>


          </div>
        </div>
      </section>

      {/* Quiz Section */}
      <section id="quizzes" className="py-16 bg-navy-900/50">
        <div className="container mx-auto px-4">
          <h3 className="section-title text-center animate-on-scroll">Ваши Квизы</h3>
          
          {quizzes.length === 0 ? (
            <p className="text-center text-gold-200 mt-4 max-w-2xl mx-auto">
              Здесь будут отображаться созданные вами квизы. Нажмите "Создать квиз" выше, чтобы добавить первый квиз.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {quizzes.map((quiz) => (
                <Card 
                  key={quiz.id} 
                  className="game-card cursor-pointer relative group" 
                  onClick={() => navigate(`/quiz/${quiz.id}`)}
                >
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-red-900 hover:bg-red-800"
                    onClick={(e) => handleDeleteQuiz(e, quiz.id)}
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                  <CardHeader>
                    <CardTitle className="text-gold-950 text-lg mb-2 flex items-center">
                      <Icon name="Brain" size={20} className="mr-2" />
                      {quiz.title}
                    </CardTitle>
                    <CardDescription className="text-gold-200">
                      {quiz.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {quiz.category && (
                          <span className="text-sm text-gold-200">
                            {quiz.category}
                          </span>
                        )}
                        <span className="text-sm text-gold-200 flex items-center">
                          <Icon name="HelpCircle" size={16} className="mr-1" />
                          {quiz.questions?.length || 0} вопросов
                        </span>
                      </div>
                      <Button size="sm" className="qr-button">
                        <Icon name="Play" size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Video Section */}
      <section id="videos" className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="section-title text-center animate-on-scroll">Ваши Видео</h3>
          
          {videos.length === 0 ? (
            <p className="text-center text-gold-200 mt-4 max-w-2xl mx-auto">
              Здесь будут отображаться ваши видео. Нажмите "Создать видео" выше, чтобы добавить первое видео.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {videos.map((video, index) => (
                <Card 
                  key={video.id} 
                  className="game-card cursor-pointer relative group" 
                  onClick={() => navigate(`/video/${video.id}`)}
                >
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-red-900 hover:bg-red-800"
                    onClick={(e) => handleDeleteVideo(e, video.id)}
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                  <CardHeader>
                    <CardTitle className="text-gold-950 text-lg mb-2">
                      {video.title}
                    </CardTitle>
                    <CardDescription className="text-gold-200">
                      {video.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {video.category && (
                          <span className="text-sm text-gold-200">
                            {video.category}
                          </span>
                        )}
                        {video.duration && (
                          <span className="text-sm text-gold-200 flex items-center">
                            <Icon name="Clock" size={16} className="mr-1" />
                            {video.duration}
                          </span>
                        )}
                      </div>
                      <Button size="sm" className="qr-button">
                        <Icon name="Play" size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>



      {showScanner && <QRScanner onClose={() => setShowScanner(false)} />}

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