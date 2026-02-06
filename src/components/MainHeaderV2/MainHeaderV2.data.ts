/**
 * MainHeaderV2 - Navigation Data
 * All routes and menu configurations
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
  LucideIcon,
} from 'lucide-react';

// Types
export interface NavLink {
  label: string;
  href: string;
  icon?: LucideIcon;
  desc?: string;
}

export interface NavGroup {
  title: string;
  links: NavLink[];
}

// Primary Navigation Links
export const primaryLinks: NavLink[] = [
  { label: 'الرئيسية', href: '/' },
  { label: 'من نحن', href: '/about' },
];

// End Navigation Links
export const endLinks: NavLink[] = [
  { label: 'شركاتنا', href: '/subsidiaries' },
  { label: 'تواصل معنا', href: '/contact' },
];

// Services Menu
export const servicesMenu: NavLink[] = [
  { label: 'تطوير البرمجيات', href: '/technical-services', icon: Code2, desc: 'حلول برمجية متكاملة' },
  { label: 'الحلول التقنية', href: '/tech-ecosystem', icon: Cpu, desc: 'بنية تقنية متطورة' },
  { label: 'الذكاء الاصطناعي', href: '/ai-solutions', icon: Brain, desc: 'تقنيات AI متقدمة' },
  { label: 'التحول الرقمي', href: '/digital-transformation', icon: Rocket, desc: 'رقمنة الأعمال' },
  { label: 'خدمات مخصصة أخرى', href: '/services-catalog', icon: Wrench, desc: 'حلول مخصصة' },
];

// Products Menu
export const productsMenu: NavLink[] = [
  { label: 'الحلول السحابية', href: '/cloud-solutions', icon: Cloud, desc: 'منصات سحابية' },
  { label: 'تطبيقات ويب', href: '/ready-projects', icon: Monitor, desc: 'تطبيقات متقدمة' },
  { label: 'تطبيقات جوال', href: '/mobile-apps', icon: Smartphone, desc: 'iOS & Android' },
  { label: 'منصات إدارية', href: '/software-products', icon: Layout, desc: 'أنظمة إدارة' },
  { label: 'المشاريع التقنية', href: '/tech-projects', icon: Lightbulb, desc: 'مشاريع متكاملة' },
];

// Others Menu
export const othersMenu: NavLink[] = [
  { label: 'الأخبار والتحديثات', href: '/news', icon: Newspaper },
  { label: 'الأسئلة الشائعة', href: '/faq', icon: HelpCircle },
  { label: 'الشركاء', href: '/partnerships', icon: Users },
  { label: 'الوظائف', href: '/careers', icon: Briefcase },
  { label: 'دليل المستخدم', href: '/user-guide', icon: BookOpen },
];

// Mobile Menu Groups
export const mobileMenuGroups: NavGroup[] = [
  { title: 'التنقل', links: [...primaryLinks, ...endLinks] },
  { title: 'خدماتنا', links: servicesMenu },
  { title: 'منتجاتنا', links: productsMenu },
  { title: 'المزيد', links: othersMenu },
];
