import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  CameraOff, 
  Volume2, 
  VolumeX, 
  Download, 
  Copy,
  Hand,
  Eye,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DetectedGesture {
  gesture: string;
  confidence: number;
  timestamp: number;
  arabicTranslation: string;
}

const SignLanguageSupport: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [detectedText, setDetectedText] = useState<string>('');
  const [recentGestures, setRecentGestures] = useState<DetectedGesture[]>([]);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [error, setError] = useState<string>('');
  const [modelLoaded, setModelLoaded] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const { toast } = useToast();

  // Enhanced gesture mapping with Arabic translations
  const gestureMapping: Record<string, string> = {
    'thumbs_up': 'موافق - أحسنت',
    'peace': 'سلام - النصر',
    'okay': 'حسناً - لا بأس',
    'pointing_up': 'انتباه - مهم',
    'open_palm': 'توقف - انتظر',
    'fist': 'قوة - عزيمة',
    'call_me': 'اتصل بي',
    'rock': 'قوي - ممتاز',
    'i_love_you': 'أحبك',
    'crossed_fingers': 'حظ سعيد - أتمنى',
  };

  // Simulated gesture detection (in a real implementation, this would use AI model)
  const detectGesture = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx || !videoRef.current.videoWidth) return;

      // Draw current frame to canvas
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0);

      // Simulate gesture detection with random results for demo
      const gestures = Object.keys(gestureMapping);
      const randomGesture = gestures[Math.floor(Math.random() * gestures.length)];
      const confidence = 0.7 + Math.random() * 0.3; // 70-100% confidence

      if (confidence > 0.8) {
        const newGesture: DetectedGesture = {
          gesture: randomGesture,
          confidence,
          timestamp: Date.now(),
          arabicTranslation: gestureMapping[randomGesture]
        };

        setRecentGestures(prev => [newGesture, ...prev].slice(0, 10));
        setDetectedText(prev => prev + ' ' + gestureMapping[randomGesture]);

        // Text-to-speech
        if (isSpeechEnabled && 'speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(gestureMapping[randomGesture]);
          utterance.lang = 'ar-SA';
          utterance.rate = 0.8;
          speechSynthesis.speak(utterance);
        }

        toast({
          title: "إشارة مكتشفة!",
          description: `${gestureMapping[randomGesture]} (${(confidence * 100).toFixed(1)}%)`,
        });
      }
    } catch (error) {
      console.error('Error detecting gesture:', error);
    }
  }, [gestureMapping, isSpeechEnabled, toast]);

  const startCamera = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        videoRef.current.onloadedmetadata = () => {
          setIsActive(true);
          setModelLoaded(true);
          setIsLoading(false);
          
          // Start gesture detection
          intervalRef.current = setInterval(detectGesture, 1000);
          
          toast({
            title: "تم تشغيل دعم لغة الإشارة!",
            description: "ابدأ بعمل الإشارات أمام الكاميرا",
          });
        };
      }
    } catch (error) {
      setError('فشل في الوصول إلى الكاميرا. تأكد من منح الإذن للكاميرا.');
      setIsLoading(false);
      console.error('Camera error:', error);
    }
  }, [detectGesture, toast]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setIsActive(false);
    setModelLoaded(false);
    
    toast({
      title: "تم إيقاف دعم لغة الإشارة",
      description: "يمكنك إعادة تشغيله في أي وقت",
    });
  }, [toast]);

  const copyText = useCallback(() => {
    navigator.clipboard.writeText(detectedText);
    toast({
      title: "تم النسخ!",
      description: "تم نسخ النص المترجم إلى الحافظة",
    });
  }, [detectedText, toast]);

  const downloadTranscript = useCallback(() => {
    const blob = new Blob([detectedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sign-language-transcript-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "تم التحميل!",
      description: "تم حفظ النص المترجم كملف",
    });
  }, [detectedText, toast]);

  const clearText = useCallback(() => {
    setDetectedText('');
    setRecentGestures([]);
    toast({
      title: "تم المسح",
      description: "تم مسح جميع النصوص المترجمة",
    });
  }, [toast]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Main Toggle Button */}
      <Button
        onClick={isActive ? stopCamera : startCamera}
        disabled={isLoading}
        className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl hover:shadow-glow transition-all duration-300 hover:scale-110 rounded-full w-16 h-16"
      >
        {isLoading ? (
          <RefreshCw className="w-8 h-8 animate-spin" />
        ) : isActive ? (
          <Hand className="w-8 h-8 animate-pulse" />
        ) : (
          <Eye className="w-8 h-8" />
        )}
      </Button>

      {/* Main Interface */}
      {(isActive || isLoading || error) && (
        <Card className="w-96 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl border-0 shadow-2xl animate-fade-in">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between text-xl font-bold text-primary">
              <div className="flex items-center gap-2">
                <Hand className="w-6 h-6 text-blue-600" />
                <span>دعم لغة الإشارة</span>
              </div>
              <div className="flex gap-2">
                <Badge className={`${modelLoaded ? 'bg-green-500' : 'bg-orange-500'} text-white`}>
                  {modelLoaded ? 'متصل' : 'يتصل...'}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Error Display */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Camera Feed */}
            {isActive && (
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-48 bg-gray-900 rounded-lg object-cover"
                />
                <canvas
                  ref={canvasRef}
                  className="hidden"
                />
                {modelLoaded && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-green-500 text-white flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      مباشر
                    </Badge>
                  </div>
                )}
              </div>
            )}

            {/* Controls */}
            <div className="flex gap-2">
              <Button
                onClick={isActive ? stopCamera : startCamera}
                disabled={isLoading}
                className={`flex-1 ${isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
              >
                {isActive ? <CameraOff className="w-4 h-4 mr-2" /> : <Camera className="w-4 h-4 mr-2" />}
                {isActive ? 'إيقاف' : 'تشغيل'}
              </Button>
              
              <Button
                onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
                variant="outline"
                className="px-3"
              >
                {isSpeechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
            </div>

            {/* Detected Text Area */}
            {detectedText && (
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    النص المترجم:
                  </h4>
                  <p className="text-blue-700 text-sm leading-relaxed">
                    {detectedText}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={copyText} variant="outline" size="sm" className="flex-1">
                    <Copy className="w-4 h-4 mr-2" />
                    نسخ
                  </Button>
                  <Button onClick={downloadTranscript} variant="outline" size="sm" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    حفظ
                  </Button>
                  <Button onClick={clearText} variant="outline" size="sm">
                    مسح
                  </Button>
                </div>
              </div>
            )}

            {/* Recent Gestures */}
            {recentGestures.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-primary text-sm">الإشارات الأخيرة:</h4>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {recentGestures.slice(0, 5).map((gesture, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                      <span className="font-medium">{gesture.arabicTranslation}</span>
                      <Badge variant="secondary" className="text-xs">
                        {(gesture.confidence * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Instructions */}
            {!isActive && !error && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">كيفية الاستخدام:</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• اضغط "تشغيل" لبدء الكاميرا</li>
                  <li>• قم بعمل الإشارات أمام الكاميرا</li>
                  <li>• سيتم ترجمة الإشارات إلى نص عربي</li>
                  <li>• يمكن حفظ أو نسخ النص المترجم</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SignLanguageSupport;