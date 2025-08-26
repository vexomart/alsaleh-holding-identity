import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-4">عذراً! الصفحة غير موجودة</p>
          <a href="/" className="text-blue-500 hover:text-blue-700 underline">
            العودة للصفحة الرئيسية
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
