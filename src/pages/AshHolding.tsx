import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Shield, Wallet, Users, Settings } from 'lucide-react';

export default function AshHolding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-6">
            ASH HOLDING
          </h1>
          <p className="text-2xl text-white/80 mb-8">
            منصة الإدارة المالية والمحافظ الرقمية
          </p>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            نظام شامل لإدارة العملاء والمحافظ المالية مع أدوات متقدمة للمراقبة والتحكم
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Shield className="w-12 h-12 text-blue-400" />
                <div>
                  <CardTitle className="text-white text-2xl">لوحة الإدارة</CardTitle>
                  <CardDescription className="text-white/70">
                    إدارة شاملة للنظام والعملاء
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-white/60 mb-6">
                تحكم كامل في النظام مع مراقبة لحظية للمعاملات ومراجعة الطلبات
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex items-center text-white/80">
                  <Users className="w-4 h-4 ml-2" />
                  إدارة العملاء والمستخدمين
                </div>
                <div className="flex items-center text-white/80">
                  <Wallet className="w-4 h-4 ml-2" />
                  مراقبة المحافظ والمعاملات
                </div>
                <div className="flex items-center text-white/80">
                  <Settings className="w-4 h-4 ml-2" />
                  إعدادات النظام والأمان
                </div>
              </div>
              <Link to="/ash/admin">
                <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white">
                  دخول لوحة الإدارة
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Wallet className="w-12 h-12 text-green-400" />
                <div>
                  <CardTitle className="text-white text-2xl">محفظة العميل</CardTitle>
                  <CardDescription className="text-white/70">
                    إدارة الحساب الشخصي والمعاملات
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-white/60 mb-6">
                تابع رصيدك وأرسل الطلبات وراقب المعاملات بسهولة ووضوح
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex items-center text-white/80">
                  <Wallet className="w-4 h-4 ml-2" />
                  مراقبة الرصيد والمعاملات
                </div>
                <div className="flex items-center text-white/80">
                  <Users className="w-4 h-4 ml-2" />
                  طلبات الإيداع والسحب
                </div>
                <div className="flex items-center text-white/80">
                  <Settings className="w-4 h-4 ml-2" />
                  إدارة الملف الشخصي
                </div>
              </div>
              <Link to="/ash/client">
                <Button className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white">
                  دخول محفظة العميل
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">المميزات الرئيسية</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-white/5 backdrop-blur-xl rounded-lg p-6">
              <Shield className="w-8 h-8 text-blue-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">أمان متقدم</h3>
              <p className="text-white/60 text-sm">تشفير عالي المستوى وحماية شاملة للبيانات</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-lg p-6">
              <Wallet className="w-8 h-8 text-green-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">إدارة مالية</h3>
              <p className="text-white/60 text-sm">نظام محافظ متطور مع مراقبة لحظية</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-lg p-6">
              <Settings className="w-8 h-8 text-purple-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">تحكم شامل</h3>
              <p className="text-white/60 text-sm">أدوات إدارة متقدمة وواجهة سهلة الاستخدام</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}