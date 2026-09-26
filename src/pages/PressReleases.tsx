import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Calendar, 
  Download, 
  ExternalLink,
  ArrowLeft,
  Building,
  Users,
  TrendingUp,
  Award
} from "lucide-react";
import { Link } from "react-router-dom";

const PressReleases = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-blue-600/5 to-purple-600/10" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-full border border-emerald-500/20 mb-8">
              <FileText className="w-6 h-6 text-emerald-600" />
              <span className="text-lg font-bold text-slate-800">البيانات الصحفية</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">قريباً</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              نعمل حالياً على تجهيز البيانات الصحفية الرسمية ومعلومات التواصل الإعلامي لنقدمها لكم قريباً
            </p>

            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">قريباً</h2>
              <p className="text-lg text-slate-600">ترقبوا البيانات الصحفية والتواصل الإعلامي</p>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <div className="container mx-auto px-6 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          العودة إلى الصفحة الرئيسية
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default PressReleases;