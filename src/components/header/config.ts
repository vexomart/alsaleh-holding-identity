/**
 * Header Navigation Config - ASH HOLDING
 */

import {
  Code2,
  Cpu,
  Brain,
  Rocket,
  Wrench,
  Cloud,
  Smartphone,
  Monitor,
  Layout,
  Lightbulb,
  BookOpen,
  HelpCircle,
  Users,
  Briefcase,
  Newspaper,
} from 'lucide-react';
import { HeaderConfig } from './types';

export const headerConfig: HeaderConfig = {
  services: [
    { name: 'تطوير البرمجيات', href: '/technical-services', icon: Code2, description: 'حلول برمجية متكاملة' },
    { name: 'الحلول التقنية', href: '/tech-ecosystem', icon: Cpu, description: 'بنية تقنية متطورة' },
    { name: 'الذكاء الاصطناعي', href: '/ai-solutions', icon: Brain, description: 'تقنيات AI متقدمة' },
    { name: 'التحول الرقمي', href: '/digital-transformation', icon: Rocket, description: 'رقمنة الأعمال' },
    { name: 'خدمات مخصصة أخرى', href: '/services-catalog', icon: Wrench, description: 'حلول مخصصة' },
  ],
  products: [
    { name: 'الحلول السحابية', href: '/cloud-solutions', icon: Cloud, description: 'منصات سحابية' },
    { name: 'تطبيقات ويب', href: '/ready-projects', icon: Monitor, description: 'تطبيقات متقدمة' },
    { name: 'تطبيقات جوال', href: '/mobile-apps', icon: Smartphone, description: 'iOS & Android' },
    { name: 'منصات إدارية', href: '/software-products', icon: Layout, description: 'أنظمة إدارة' },
    { name: 'المشاريع التقنية', href: '/tech-projects', icon: Lightbulb, description: 'مشاريع متكاملة' },
  ],
  others: [
    { name: 'الأخبار والتحديثات', href: '/news', icon: Newspaper },
    { name: 'الأسئلة الشائعة', href: '/faq', icon: HelpCircle },
    { name: 'الشركاء', href: '/partnerships', icon: Users },
    { name: 'الوظائف', href: '/careers', icon: Briefcase },
    { name: 'دليل المستخدم', href: '/user-guide', icon: BookOpen },
  ],
};

export const mainNavItems = [
  { name: 'الرئيسية', href: '/' },
  { name: 'من نحن', href: '/about' },
  { name: 'شركاتنا', href: '/subsidiaries' },
  { name: 'تواصل معنا', href: '/contact' },
];
