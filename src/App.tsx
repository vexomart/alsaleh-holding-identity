import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";

const App = () => {
  console.log('App component rendering...');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/current-offers" element={
            <div className="p-8">
              <h1 className="text-2xl font-bold">العروض الحالية</h1>
              <p>صفحة العروض الحالية</p>
            </div>
          } />
          <Route path="*" element={
            <div className="p-8">
              <h1 className="text-2xl font-bold">الصفحة غير موجودة</h1>
              <p>404 - الصفحة التي تبحث عنها غير موجودة</p>
            </div>
          } />
        </Routes>
      </HashRouter>
    </div>
  );
};

export default App;