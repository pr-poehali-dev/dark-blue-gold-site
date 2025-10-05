import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const VideoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [videoData, setVideoData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Загружаем данные из localStorage
    const videos = JSON.parse(localStorage.getItem('videos') || '[]');
    const video = videos.find((v: any) => v.id === id);
    
    if (video) {
      setVideoData(video);
    }
    
    setIsLoading(false);
  }, [id]);

  const generateQRCode = (content: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(content)}`;
  };
  
  const convertYouTubeUrl = (url: string) => {
    // Конвертируем YouTube URL в embed формат
    const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/);
    if (videoIdMatch && videoIdMatch[1]) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
    }
    return url;
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
  
  if (!videoData) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-center">
          <Icon name="AlertCircle" size={48} className="text-gold-950 mx-auto mb-4" />
          <h3 className="text-2xl text-gold-950 mb-4">Видео не найдено</h3>
          <Button onClick={() => navigate('/')} className="bg-gold-950 text-navy-900 hover:bg-gold-800">
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Вернуться на главную
          </Button>
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
                      <Icon name="Calendar" size={16} className="mr-1" />
                      {new Date(videoData.createdAt).toLocaleDateString('ru-RU')}
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
                  src={convertYouTubeUrl(videoData.videoUrl)}
                  title={videoData.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
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
                </div>
              </div>
            </CardContent>
          </Card>


        </div>
      </div>
    </div>
  );
};

export default VideoPage;