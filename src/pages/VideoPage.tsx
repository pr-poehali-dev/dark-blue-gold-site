import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const VideoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [videoData, setVideoData] = useState({
    title: "Гайд по веб-разработке",
    description: "Подробное руководство по созданию современных веб-приложений с использованием React и TypeScript",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    category: "Обучение",
    duration: "25:30",
    views: 1247,
    likes: 89,
    createdAt: new Date().toLocaleDateString('ru-RU')
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Имитация загрузки данных
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [id]);

  const generateQRCode = (content: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(content)}`;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: videoData.title,
        text: videoData.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Ссылка скопирована в буфер обмена!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-950 mx-auto mb-4"></div>
          <p className="text-gold-200">Загрузка видео...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
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

          <Card className="game-card vintage-frame mb-8">
            <div className="vintage-corner top-left"></div>
            <div className="vintage-corner top-right"></div>
            <div className="vintage-corner bottom-left"></div>
            <div className="vintage-corner bottom-right"></div>
            
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl text-gold-950 mb-2">
                    {videoData.title}
                  </CardTitle>
                  <CardDescription className="text-gold-200 text-lg">
                    {videoData.description}
                  </CardDescription>
                  <div className="flex items-center space-x-4 mt-4">
                    <Badge variant="secondary" className="bg-gold-950/20 text-gold-950">
                      {videoData.category}
                    </Badge>
                    <span className="text-gold-200 flex items-center">
                      <Icon name="Clock" size={16} className="mr-1" />
                      {videoData.duration}
                    </span>
                    <span className="text-gold-200 flex items-center">
                      <Icon name="Eye" size={16} className="mr-1" />
                      {videoData.views} просмотров
                    </span>
                    <span className="text-gold-200 flex items-center">
                      <Icon name="Heart" size={16} className="mr-1" />
                      {videoData.likes}
                    </span>
                  </div>
                </div>
                <div className="ml-6 text-center">
                  <img 
                    src={generateQRCode(window.location.href)} 
                    alt="QR код для видео"
                    className="w-24 h-24 rounded border border-gold-950/50 mb-2"
                  />
                  <p className="text-gold-200 text-xs">Поделиться QR</p>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="aspect-video bg-navy-800 rounded-lg mb-6 relative overflow-hidden">
                <iframe
                  src={videoData.videoUrl}
                  title={videoData.title}
                  className="w-full h-full"
                  allowFullScreen
                  frameBorder="0"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    className="bg-gold-950 text-navy-900 hover:bg-gold-800"
                    onClick={handleShare}
                  >
                    <Icon name="Share2" size={20} className="mr-2" />
                    Поделиться
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gold-950 text-gold-950 hover:bg-gold-950/10"
                  >
                    <Icon name="Heart" size={20} className="mr-2" />
                    Нравится
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gold-950 text-gold-950 hover:bg-gold-950/10"
                  >
                    <Icon name="Bookmark" size={20} className="mr-2" />
                    Сохранить
                  </Button>
                </div>
                <div className="text-gold-200 text-sm">
                  Опубликовано: {videoData.createdAt}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Похожие видео */}
          <Card className="game-card vintage-frame">
            <div className="vintage-corner top-left"></div>
            <div className="vintage-corner top-right"></div>
            <div className="vintage-corner bottom-left"></div>
            <div className="vintage-corner bottom-right"></div>
            
            <CardHeader>
              <CardTitle className="text-gold-950 flex items-center">
                <Icon name="Video" size={24} className="mr-2" />
                Похожие видео
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { title: "Основы JavaScript", duration: "18:45", category: "Обучение" },
                  { title: "CSS Grid Layout", duration: "12:20", category: "Дизайн" },
                  { title: "React Hooks", duration: "22:15", category: "Обучение" }
                ].map((video, index) => (
                  <Card key={index} className="border border-gold-950/30 bg-navy-800/50 hover:bg-navy-800/70 transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div className="aspect-video bg-navy-700 rounded mb-3 flex items-center justify-center">
                        <Icon name="Play" size={32} className="text-gold-950" />
                      </div>
                      <h4 className="text-gold-950 font-medium mb-2">{video.title}</h4>
                      <div className="flex items-center justify-between text-sm">
                        <Badge variant="secondary" className="bg-gold-950/20 text-gold-950 text-xs">
                          {video.category}
                        </Badge>
                        <span className="text-gold-200">{video.duration}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VideoPage;