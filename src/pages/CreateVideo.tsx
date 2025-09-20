import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

const CreateVideo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    category: '',
    duration: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика сохранения видео
    console.log('Video data:', formData);
    // Перенаправляем на созданную страницу видео
    const videoId = Date.now().toString();
    navigate(`/video/${videoId}`);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateQRCode = (content: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(content)}`;
  };

  return (
    <div className="min-h-screen bg-navy-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
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
            
            <CardHeader className="text-center">
              <Icon name="FileVideo" size={48} className="text-gold-950 mx-auto mb-4" />
              <CardTitle className="text-2xl text-gold-950">Создать Новое Видео</CardTitle>
              <CardDescription className="text-gold-200">
                Добавьте видео с автоматической генерацией QR-кода
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gold-950 font-medium">
                    Название видео
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Введите название видео"
                    className="border-gold-950/30 focus:border-gold-950 bg-navy-800/50 text-gold-200"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gold-950 font-medium">
                    Описание
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Краткое описание видео"
                    className="border-gold-950/30 focus:border-gold-950 bg-navy-800/50 text-gold-200 min-h-20"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="videoUrl" className="text-gold-950 font-medium">
                    Ссылка на видео
                  </Label>
                  <Input
                    id="videoUrl"
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => handleChange('videoUrl', e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="border-gold-950/30 focus:border-gold-950 bg-navy-800/50 text-gold-200"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-gold-950 font-medium">
                      Категория
                    </Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleChange('category', e.target.value)}
                      placeholder="Обучение, Развлечения..."
                      className="border-gold-950/30 focus:border-gold-950 bg-navy-800/50 text-gold-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration" className="text-gold-950 font-medium">
                      Длительность
                    </Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => handleChange('duration', e.target.value)}
                      placeholder="15:30"
                      className="border-gold-950/30 focus:border-gold-950 bg-navy-800/50 text-gold-200"
                    />
                  </div>
                </div>

                {formData.title && (
                  <div className="border border-gold-950/30 rounded-lg p-4 bg-navy-800/30">
                    <h4 className="text-gold-950 font-medium mb-3 flex items-center">
                      <Icon name="QrCode" size={20} className="mr-2" />
                      Предварительный просмотр QR-кода
                    </h4>
                    <div className="flex items-center justify-center">
                      <img 
                        src={generateQRCode(`https://gamezone.dev/video/${Date.now()}`)} 
                        alt="QR код для видео"
                        className="w-32 h-32 rounded border border-gold-950/50"
                      />
                    </div>
                    <p className="text-center text-gold-200 text-sm mt-2">
                      QR-код будет создан автоматически после сохранения
                    </p>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button 
                    type="submit"
                    className="bg-gold-950 text-navy-900 hover:bg-gold-800 flex-1"
                  >
                    <Icon name="Save" size={20} className="mr-2" />
                    Создать видео
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/')}
                    className="border-gold-950 text-gold-950 hover:bg-gold-950/10"
                  >
                    <Icon name="X" size={20} className="mr-2" />
                    Отмена
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateVideo;