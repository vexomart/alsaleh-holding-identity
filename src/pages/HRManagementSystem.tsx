import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const HRManagementSystem = () => {
  console.log('HRManagementSystem component starting to render...');
  
  return (
    <>
      <SEO 
        title="نظام إدارة الموارد البشرية | حلول HR متطورة"
        description="نظام شامل لإدارة الموارد البشرية يشمل إدارة الموظفين، الرواتب، الحضور، الإجازات، تقييم الأداء والتدريب. حلول HR رقمية متطورة."
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Navigation />
        
        <div className="container mx-auto px-6 py-20">
          <h1 className="text-4xl font-bold text-center text-slate-800 dark:text-white">نظام إدارة الموارد البشرية</h1>
          <p className="text-center mt-4 text-slate-600 dark:text-slate-300">الصفحة تعمل بنجاح!</p>
          <div className="text-center mt-8 p-6 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <p className="text-green-800 dark:text-green-300 font-medium">
              ✅ تم حل مشكلة React Hook dispatcher
            </p>
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default HRManagementSystem;