import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { BrowserMultiFormatReader } from '@zxing/library';

interface QRScannerProps {
  onClose: () => void;
}

const QRScanner = ({ onClose }: QRScannerProps) => {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [scanResult, setScanResult] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    codeReaderRef.current = new BrowserMultiFormatReader();
    
    return () => {
      stopScanning();
    };
  }, []);

  const startCameraScanning = async () => {
    try {
      setError('');
      setScanning(true);

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();

        if (codeReaderRef.current) {
          codeReaderRef.current.decodeFromVideoDevice(undefined, videoRef.current, (result, err) => {
            if (result) {
              const text = result.getText();
              setScanResult(text);
              handleScanResult(text);
              stopScanning();
            }
          });
        }
      }
    } catch (err) {
      console.error('Ошибка доступа к камере:', err);
      setError('Не удалось получить доступ к камере. Проверьте разрешения в браузере.');
      setScanning(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setError('');
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const imageSrc = e.target?.result as string;
        const img = new Image();
        img.src = imageSrc;
        
        img.onload = async () => {
          try {
            if (codeReaderRef.current) {
              const result = await codeReaderRef.current.decodeFromImageUrl(imageSrc);
              const text = result.getText();
              setScanResult(text);
              handleScanResult(text);
            }
          } catch (err) {
            setError('QR-код не найден на изображении');
          }
        };
      };
      
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Ошибка чтения файла:', err);
      setError('Не удалось прочитать изображение');
    }
  };

  const handleScanResult = (text: string) => {
    if (text.includes('/video/') || text.includes('/quiz/')) {
      try {
        const url = new URL(text);
        navigate(url.pathname);
        onClose();
      } catch {
        window.open(text, '_blank');
      }
    } else {
      window.open(text, '_blank');
    }
  };

  const stopScanning = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
    }
    setScanning(false);
  };

  return (
    <div className="fixed inset-0 bg-navy-900/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="game-card vintage-frame max-w-2xl w-full">
        <div className="vintage-corner top-left"></div>
        <div className="vintage-corner top-right"></div>
        <div className="vintage-corner bottom-left"></div>
        <div className="vintage-corner bottom-right"></div>
        
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-gold-950 flex items-center">
                <Icon name="QrCode" size={32} className="mr-2" />
                Сканировать QR-код
              </CardTitle>
              <CardDescription className="text-gold-200 mt-2">
                Используйте камеру или загрузите изображение
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="icon"
              onClick={onClose}
              className="border-gold-950 text-gold-950 hover:bg-gold-950/10"
            >
              <Icon name="X" size={24} />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 flex items-center">
              <Icon name="AlertCircle" size={20} className="text-red-400 mr-2" />
              <p className="text-red-200">{error}</p>
            </div>
          )}

          {scanResult && (
            <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-4 flex items-center">
              <Icon name="CheckCircle" size={20} className="text-green-400 mr-2" />
              <p className="text-green-200">QR-код отсканирован: {scanResult}</p>
            </div>
          )}

          {scanning ? (
            <div className="space-y-4">
              <div className="aspect-video bg-navy-800 rounded-lg overflow-hidden relative">
                <video 
                  ref={videoRef} 
                  className="w-full h-full object-cover"
                  playsInline
                />
                <div className="absolute inset-0 border-4 border-gold-950/50 rounded-lg pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-4 border-gold-950 rounded-lg"></div>
                </div>
              </div>
              <Button 
                onClick={stopScanning}
                variant="outline"
                className="w-full border-gold-950 text-gold-950 hover:bg-gold-950/10"
              >
                <Icon name="X" size={20} className="mr-2" />
                Остановить сканирование
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              <Button 
                onClick={startCameraScanning}
                className="bg-gold-950 text-navy-900 hover:bg-gold-800 h-32 flex flex-col items-center justify-center"
              >
                <Icon name="Camera" size={48} className="mb-2" />
                <span className="text-lg">Открыть камеру</span>
              </Button>

              <Button 
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="border-gold-950 text-gold-950 hover:bg-gold-950/10 h-32 flex flex-col items-center justify-center"
              >
                <Icon name="Image" size={48} className="mb-2" />
                <span className="text-lg">Загрузить фото</span>
              </Button>

              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          )}

          <div className="bg-navy-800/50 rounded-lg p-4 border border-gold-950/30">
            <h4 className="text-gold-950 font-medium mb-2 flex items-center">
              <Icon name="Info" size={18} className="mr-2" />
              Как пользоваться:
            </h4>
            <ul className="text-gold-200 text-sm space-y-1 ml-6">
              <li>• Нажмите "Открыть камеру" для сканирования QR-кода</li>
              <li>• Или загрузите фото с QR-кодом из галереи</li>
              <li>• Наведите камеру на QR-код и он автоматически отсканируется</li>
              <li>• После сканирования вы перейдёте по ссылке</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRScanner;
