// Ultra-minimal App to test React basics
const App = () => {
  console.log('App component rendering...');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-center text-slate-800 dark:text-white">نظام إدارة الموارد البشرية</h1>
        <p className="text-center mt-4 text-slate-600 dark:text-slate-300">تم إصلاح مشكلة React Hook dispatcher</p>
        <div className="text-center mt-8 p-6 bg-green-100 dark:bg-green-900/20 rounded-lg">
          <p className="text-green-800 dark:text-green-300 font-medium">
            ✅ React يعمل بشكل صحيح الآن
          </p>
        </div>
        <div className="text-center mt-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            الوقت الحالي: {new Date().toLocaleString('ar-SA')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;