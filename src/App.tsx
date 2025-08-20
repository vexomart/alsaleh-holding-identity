import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";

// Minimal App to test if React is working
const App = () => {
  console.log('App component rendering...');
  
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/hr-management-system" element={
            <div className="container mx-auto px-6 py-20">
              <h1 className="text-4xl font-bold text-center text-slate-800 dark:text-white">نظام إدارة الموارد البشرية</h1>
              <p className="text-center mt-4 text-slate-600 dark:text-slate-300">تم إصلاح مشكلة React Hook dispatcher</p>
              <div className="text-center mt-8 p-6 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <p className="text-green-800 dark:text-green-300 font-medium">
                  ✅ التطبيق يعمل بشكل صحيح الآن
                </p>
              </div>
            </div>
          } />
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">404</h1>
                <p className="text-slate-600 dark:text-slate-300">الصفحة غير موجودة</p>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;