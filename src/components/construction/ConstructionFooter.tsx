import { Building2, Phone, Mail, MapPin } from "lucide-react";

const ConstructionFooter = () => {
  return (
    <footer className="py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl mr-3">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold">المقاولات العالمية</span>
                <p className="text-slate-400 text-sm">بناء المستقبل</p>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed">
              شركة رائدة في مجال البناء والتشييد، نقدم حلولاً متكاملة ومتطورة لجميع احتياجاتكم الإنشائية
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-6 text-blue-300">خدماتنا</h4>
            <ul className="space-y-3 text-slate-300">
              <li className="hover:text-blue-300 cursor-pointer transition-colors">البناء والتشييد</li>
              <li className="hover:text-blue-300 cursor-pointer transition-colors">الاستشارات الهندسية</li>
              <li className="hover:text-blue-300 cursor-pointer transition-colors">إدارة المشاريع</li>
              <li className="hover:text-blue-300 cursor-pointer transition-colors">ضمان الجودة</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-6 text-blue-300">الشركة</h4>
            <ul className="space-y-3 text-slate-300">
              <li className="hover:text-blue-300 cursor-pointer transition-colors">من نحن</li>
              <li className="hover:text-blue-300 cursor-pointer transition-colors">مشاريعنا</li>
              <li className="hover:text-blue-300 cursor-pointer transition-colors">شهاداتنا</li>
              <li className="hover:text-blue-300 cursor-pointer transition-colors">الوظائف</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-6 text-blue-300">تواصل معنا</h4>
            <div className="space-y-4">
              <div className="flex items-center text-slate-300">
                <Phone className="h-5 w-5 ml-3 text-blue-400" />
                <span>+966 11 234 5678</span>
              </div>
              <div className="flex items-center text-slate-300">
                <Mail className="h-5 w-5 ml-3 text-blue-400" />
                <span>info@construction.com</span>
              </div>
              <div className="flex items-center text-slate-300">
                <MapPin className="h-5 w-5 ml-3 text-blue-400" />
                <span>الرياض، السعودية</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-700 mt-12 pt-8 text-center">
          <p className="text-slate-400">
            &copy; 2024 شركة المقاولات العالمية. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default ConstructionFooter;