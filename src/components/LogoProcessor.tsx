import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { removeBackground, loadImageFromUrl } from '@/utils/backgroundRemover';
import { Loader2, Download, Image as ImageIcon } from 'lucide-react';

const LogoProcessor: React.FC = () => {
  const [processing, setProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processLogo = async () => {
    setProcessing(true);
    setError(null);
    
    try {
      // Load the uploaded logo
      const imageElement = await loadImageFromUrl('/lovable-uploads/58f1dde7-91b4-4747-92a6-188055f11cee.png');
      
      // Remove background
      const processedBlob = await removeBackground(imageElement);
      
      // Create URL for the processed image
      const processedUrl = URL.createObjectURL(processedBlob);
      setProcessedImage(processedUrl);
      
    } catch (err) {
      console.error('Error processing logo:', err);
      setError('فشل في معالجة الشعار. يرجى المحاولة مرة أخرى.');
    } finally {
      setProcessing(false);
    }
  };

  const downloadProcessedImage = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = 'ash-logo-transparent.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">معالج الشعار</h2>
        <p className="text-slate-600">إزالة الخلفية وضبط مقاس شعار الشركة</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original Image */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-700">الشعار الأصلي</h3>
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
            <img 
              src="/lovable-uploads/58f1dde7-91b4-4747-92a6-188055f11cee.png" 
              alt="ASH Logo Original"
              className="w-full h-auto max-h-48 object-contain"
            />
          </div>
        </div>

        {/* Processed Image */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-700">الشعار المعالج</h3>
          <div className="border border-slate-200 rounded-lg p-4 bg-gradient-to-br from-slate-100 to-slate-200 min-h-[200px] flex items-center justify-center">
            {processing ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <p className="text-sm text-slate-600">جاري معالجة الشعار...</p>
              </div>
            ) : processedImage ? (
              <img 
                src={processedImage} 
                alt="ASH Logo Processed"
                className="w-full h-auto max-h-48 object-contain"
                style={{ 
                  background: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                  backgroundSize: '10px 10px',
                  backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px'
                }}
              />
            ) : error ? (
              <div className="text-center">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            ) : (
              <div className="text-center">
                <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500">سيظهر الشعار المعالج هنا</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-8">
        <Button 
          onClick={processLogo}
          disabled={processing}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
        >
          {processing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              جاري المعالجة...
            </>
          ) : (
            'معالجة الشعار'
          )}
        </Button>

        {processedImage && (
          <Button 
            onClick={downloadProcessedImage}
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50 px-6 py-2"
          >
            <Download className="w-4 h-4 mr-2" />
            تحميل الشعار
          </Button>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">التعليمات:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• اضغط على "معالجة الشعار" لإزالة الخلفية</li>
          <li>• سيتم إنشاء شعار بخلفية شفافة</li>
          <li>• يمكنك تحميل الشعار المعالج واستخدامه</li>
          <li>• الشعار سيكون بتنسيق PNG مع دعم الشفافية</li>
        </ul>
      </div>
    </div>
  );
};

export default LogoProcessor;