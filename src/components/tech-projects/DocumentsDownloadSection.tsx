/**
 * Premium Documents Download Section
 * قسم تحميل المستندات المميز
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Download,
  FileText,
  FileImage,
  FileSpreadsheet,
  FileCode,
  File,
  Eye,
  Clock,
  HardDrive,
  CheckCircle,
  Sparkles,
  FolderOpen,
  Lock,
  Unlock,
  ArrowDownToLine,
  ExternalLink,
  Star,
  Zap,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Document {
  id: string;
  name: string;
  nameAr: string;
  type: "pdf" | "doc" | "xls" | "image" | "code" | "zip" | "presentation";
  size: string;
  date: string;
  description: string;
  isProtected?: boolean;
  downloadCount?: number;
  category: string;
}

interface DocumentsDownloadSectionProps {
  documents?: Document[];
  projectTitle?: string;
}

const defaultDocuments: Document[] = [
  {
    id: "1",
    name: "Technical Specifications",
    nameAr: "المواصفات التقنية",
    type: "pdf",
    size: "2.4 MB",
    date: "2025-01-15",
    description: "وثيقة شاملة للمواصفات التقنية والمتطلبات الفنية للمشروع",
    downloadCount: 156,
    category: "technical"
  },
  {
    id: "2",
    name: "System Architecture",
    nameAr: "هيكل النظام",
    type: "image",
    size: "1.8 MB",
    date: "2025-01-20",
    description: "مخطط معماري تفصيلي لبنية النظام والمكونات",
    downloadCount: 89,
    category: "design"
  },
  {
    id: "3",
    name: "API Documentation",
    nameAr: "توثيق واجهات البرمجة",
    type: "doc",
    size: "3.2 MB",
    date: "2025-01-25",
    description: "توثيق كامل لجميع واجهات البرمجة APIs مع أمثلة عملية",
    downloadCount: 234,
    category: "technical"
  },
  {
    id: "4",
    name: "Database Schema",
    nameAr: "مخطط قاعدة البيانات",
    type: "code",
    size: "856 KB",
    date: "2025-01-28",
    description: "مخطط قاعدة البيانات مع العلاقات والفهارس",
    isProtected: true,
    downloadCount: 67,
    category: "technical"
  },
  {
    id: "5",
    name: "Project Proposal",
    nameAr: "عرض المشروع",
    type: "presentation",
    size: "5.1 MB",
    date: "2025-01-10",
    description: "عرض تقديمي شامل للمشروع مع الجدول الزمني والميزانية",
    downloadCount: 312,
    category: "business"
  },
  {
    id: "6",
    name: "Source Code Package",
    nameAr: "حزمة الكود المصدري",
    type: "zip",
    size: "45.6 MB",
    date: "2025-02-01",
    description: "الكود المصدري الكامل للمشروع مع التعليقات التوضيحية",
    isProtected: true,
    downloadCount: 45,
    category: "development"
  }
];

const getFileIcon = (type: string) => {
  const iconProps = { className: "w-6 h-6" };
  switch (type) {
    case "pdf":
      return <FileText {...iconProps} className="w-6 h-6 text-red-400" />;
    case "doc":
      return <FileText {...iconProps} className="w-6 h-6 text-blue-400" />;
    case "xls":
      return <FileSpreadsheet {...iconProps} className="w-6 h-6 text-green-400" />;
    case "image":
      return <FileImage {...iconProps} className="w-6 h-6 text-purple-400" />;
    case "code":
      return <FileCode {...iconProps} className="w-6 h-6 text-yellow-400" />;
    case "zip":
      return <FolderOpen {...iconProps} className="w-6 h-6 text-orange-400" />;
    case "presentation":
      return <File {...iconProps} className="w-6 h-6 text-pink-400" />;
    default:
      return <File {...iconProps} className="w-6 h-6 text-slate-400" />;
  }
};

const getFileGradient = (type: string) => {
  switch (type) {
    case "pdf":
      return "from-red-500/20 to-red-600/10 border-red-500/30 hover:border-red-400/50";
    case "doc":
      return "from-blue-500/20 to-blue-600/10 border-blue-500/30 hover:border-blue-400/50";
    case "xls":
      return "from-green-500/20 to-green-600/10 border-green-500/30 hover:border-green-400/50";
    case "image":
      return "from-purple-500/20 to-purple-600/10 border-purple-500/30 hover:border-purple-400/50";
    case "code":
      return "from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 hover:border-yellow-400/50";
    case "zip":
      return "from-orange-500/20 to-orange-600/10 border-orange-500/30 hover:border-orange-400/50";
    case "presentation":
      return "from-pink-500/20 to-pink-600/10 border-pink-500/30 hover:border-pink-400/50";
    default:
      return "from-slate-500/20 to-slate-600/10 border-slate-500/30 hover:border-slate-400/50";
  }
};

const getCategoryBadge = (category: string) => {
  switch (category) {
    case "technical":
      return { label: "تقني", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" };
    case "design":
      return { label: "تصميم", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" };
    case "business":
      return { label: "أعمال", color: "bg-green-500/20 text-green-400 border-green-500/30" };
    case "development":
      return { label: "تطوير", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" };
    default:
      return { label: "عام", color: "bg-slate-500/20 text-slate-400 border-slate-500/30" };
  }
};

export function DocumentsDownloadSection({ 
  documents = defaultDocuments,
  projectTitle = "المشروع"
}: DocumentsDownloadSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const categories = [
    { id: "all", label: "الكل", icon: FolderOpen },
    { id: "technical", label: "تقني", icon: FileCode },
    { id: "design", label: "تصميم", icon: FileImage },
    { id: "business", label: "أعمال", icon: FileText },
    { id: "development", label: "تطوير", icon: Zap }
  ];

  const filteredDocuments = selectedCategory === "all" 
    ? documents 
    : documents.filter(doc => doc.category === selectedCategory);

  const handleDownload = (docId: string) => {
    setDownloadingId(docId);
    setDownloadProgress(0);
    
    // Simulate download progress
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDownloadingId(null);
            setDownloadProgress(0);
          }, 500);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 200);
  };

  const totalSize = documents.reduce((acc, doc) => {
    const size = parseFloat(doc.size);
    return acc + size;
  }, 0).toFixed(1);

  const totalDownloads = documents.reduce((acc, doc) => acc + (doc.downloadCount || 0), 0);

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 overflow-hidden">
      {/* Header with Gradient */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-purple-600/20" />
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl from-purple-500/10 to-transparent rounded-full blur-2xl" />
        
        <CardHeader className="relative z-10 pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/25">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-white text-xl flex items-center gap-2">
                  مركز تحميل المستندات
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                </CardTitle>
                <p className="text-slate-400 text-sm mt-1">
                  جميع الوثائق والملفات المتعلقة بـ {projectTitle}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 rounded-lg border border-slate-600/50">
                <HardDrive className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-300 text-sm">{totalSize} MB</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 rounded-lg border border-slate-600/50">
                <ArrowDownToLine className="w-4 h-4 text-green-400" />
                <span className="text-slate-300 text-sm">{totalDownloads.toLocaleString()} تحميل</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 rounded-lg border border-slate-600/50">
                <File className="w-4 h-4 text-purple-400" />
                <span className="text-slate-300 text-sm">{documents.length} ملف</span>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mt-6">
            {categories.map(cat => (
              <Button
                key={cat.id}
                size="sm"
                variant={selectedCategory === cat.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "transition-all duration-300",
                  selectedCategory === cat.id 
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-transparent shadow-lg shadow-cyan-500/25" 
                    : "bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-slate-600/50"
                )}
              >
                <cat.icon className="w-4 h-4 ml-2" />
                {cat.label}
              </Button>
            ))}
          </div>
        </CardHeader>
      </div>

      <CardContent className="p-6">
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDocuments.map((doc, index) => {
              const categoryBadge = getCategoryBadge(doc.category);
              const isDownloading = downloadingId === doc.id;
              const isHovered = hoveredId === doc.id;

              return (
                <motion.div
                  key={doc.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  onMouseEnter={() => setHoveredId(doc.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="group"
                >
                  <div 
                    className={cn(
                      "relative p-5 rounded-2xl border-2 transition-all duration-500",
                      "bg-gradient-to-br",
                      getFileGradient(doc.type),
                      isHovered && "scale-[1.02] shadow-xl"
                    )}
                  >
                    {/* Glow Effect */}
                    <div className={cn(
                      "absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500",
                      "bg-gradient-to-br from-white/5 to-transparent",
                      isHovered && "opacity-100"
                    )} />

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <motion.div 
                            className="p-3 bg-slate-800/80 rounded-xl shadow-lg"
                            animate={{ rotate: isHovered ? [0, -5, 5, 0] : 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            {getFileIcon(doc.type)}
                          </motion.div>
                          <div>
                            <h4 className="text-white font-semibold text-lg group-hover:text-cyan-300 transition-colors">
                              {doc.nameAr}
                            </h4>
                            <p className="text-slate-500 text-xs">{doc.name}</p>
                          </div>
                        </div>
                        
                        {doc.isProtected ? (
                          <div className="flex items-center gap-1 px-2 py-1 bg-amber-500/20 rounded-lg border border-amber-500/30">
                            <Lock className="w-3 h-3 text-amber-400" />
                            <span className="text-amber-400 text-xs">محمي</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-lg border border-green-500/30">
                            <Unlock className="w-3 h-3 text-green-400" />
                            <span className="text-green-400 text-xs">متاح</span>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                        {doc.description}
                      </p>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <Badge variant="outline" className={categoryBadge.color}>
                          {categoryBadge.label}
                        </Badge>
                        <div className="flex items-center gap-1 text-slate-500 text-xs">
                          <HardDrive className="w-3 h-3" />
                          <span>{doc.size}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-500 text-xs">
                          <Clock className="w-3 h-3" />
                          <span>{doc.date}</span>
                        </div>
                        {doc.downloadCount && (
                          <div className="flex items-center gap-1 text-slate-500 text-xs">
                            <ArrowDownToLine className="w-3 h-3" />
                            <span>{doc.downloadCount}</span>
                          </div>
                        )}
                      </div>

                      {/* Download Progress */}
                      {isDownloading && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mb-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-cyan-400 text-sm">جاري التحميل...</span>
                            <span className="text-cyan-400 text-sm">{Math.min(100, Math.round(downloadProgress))}%</span>
                          </div>
                          <Progress value={Math.min(100, downloadProgress)} className="h-2" />
                        </motion.div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleDownload(doc.id)}
                          disabled={isDownloading}
                          className={cn(
                            "flex-1 transition-all duration-300",
                            isDownloading 
                              ? "bg-cyan-600/50" 
                              : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/25"
                          )}
                        >
                          {isDownloading ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                              >
                                <Download className="w-4 h-4 ml-2" />
                              </motion.div>
                              جاري التحميل
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4 ml-2" />
                              تحميل
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-slate-700/50 border-slate-600/50 hover:bg-slate-600/50"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-slate-700/50 border-slate-600/50 hover:bg-slate-600/50"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-2 left-2 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredDocuments.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FolderOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-slate-400 text-lg mb-2">لا توجد مستندات</h3>
            <p className="text-slate-500 text-sm">لا توجد مستندات في هذه الفئة</p>
          </motion.div>
        )}

        {/* Download All Button */}
        <motion.div 
          className="mt-8 pt-6 border-t border-slate-700/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-gradient-to-r from-slate-800/80 to-slate-700/50 rounded-2xl border border-slate-600/50">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg shadow-green-500/25">
                <FolderOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-white font-semibold">تحميل جميع المستندات</h4>
                <p className="text-slate-400 text-sm">حزمة كاملة تحتوي على جميع الملفات ({totalSize} MB)</p>
              </div>
            </div>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/25 px-8"
            >
              <Download className="w-5 h-5 ml-2" />
              تحميل الكل
              <Badge className="mr-2 bg-white/20">{documents.length}</Badge>
            </Button>
          </div>
        </motion.div>

        {/* Security Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 flex items-center justify-center gap-2 text-slate-500 text-sm"
        >
          <Shield className="w-4 h-4" />
          <span>جميع الملفات آمنة وخالية من الفيروسات</span>
          <CheckCircle className="w-4 h-4 text-green-400" />
        </motion.div>
      </CardContent>
    </Card>
  );
}

export default DocumentsDownloadSection;
