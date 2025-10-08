import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Settings } from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // التحويل التلقائي إلى صفحة الأنظمة بعد ثانية واحدة
    const timer = setTimeout(() => {
      navigate('/software-products', { replace: true });
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="p-8 text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
          <Settings className="w-8 h-8 text-primary animate-spin" />
        </div>
        <h1 className="text-2xl font-bold mb-2">جارٍ التحويل...</h1>
        <p className="text-muted-foreground">
          سيتم توجيهك إلى صفحة الأنظمة المتوفرة
        </p>
      </Card>
    </div>
  );
};

export default Admin;
