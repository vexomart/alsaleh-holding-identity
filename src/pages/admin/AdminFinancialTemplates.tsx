import React, { useState } from 'react';
import { PageContainer } from '@/components/ui/page-container';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Receipt,
  CreditCard,
  FileText,
  Download,
  Upload,
  Edit,
  Eye,
  Copy,
  Plus,
  Settings,
  Banknote,
  Wallet,
  Building,
  Calendar,
  DollarSign,
} from 'lucide-react';

// Mock data for financial templates
const financialTemplates = {
  invoices: [
    {
      id: 1,
      name: 'فاتورة مبيعات أساسية',
      type: 'invoice',
      description: 'قالب فاتورة بسيط للمبيعات العادية',
      category: 'basic',
      language: 'ar',
      lastModified: '2024-08-27',
      usage: 245,
      fields: ['اسم العميل', 'رقم الفاتورة', 'تاريخ الإصدار', 'البنود', 'المجموع'],
    },
    {
      id: 2,
      name: 'فاتورة ضريبية معتمدة',
      type: 'invoice',
      description: 'قالب فاتورة متوافق مع أنظمة الزكاة والضريبة',
      category: 'tax',
      language: 'ar',
      lastModified: '2024-08-25',
      usage: 189,
      fields: ['رقم التسجيل الضريبي', 'رقم الفاتورة', 'ضريبة القيمة المضافة', 'الإجمالي'],
    },
  ],
  deposits: [
    {
      id: 3,
      name: 'طلب شحن محفظة بنكي',
      type: 'deposit',
      description: 'قالب لطلبات شحن المحفظة عبر التحويل البنكي',
      category: 'bank',
      language: 'ar',
      lastModified: '2024-08-27',
      usage: 156,
      fields: ['رقم الحساب', 'اسم المستفيد', 'مبلغ التحويل', 'رقم العملية'],
    },
    {
      id: 4,
      name: 'إيصال استلام دفعة',
      type: 'receipt',
      description: 'قالب إيصال لتأكيد استلام المدفوعات',
      category: 'payment',
      language: 'ar',
      lastModified: '2024-08-26',
      usage: 98,
      fields: ['رقم الإيصال', 'تاريخ الاستلام', 'طريقة الدفع', 'المبلغ المستلم'],
    },
  ],
  banking: [
    {
      id: 5,
      name: 'كشف حساب شهري',
      type: 'statement',
      description: 'قالب كشف حساب للمعاملات الشهرية',
      category: 'statement',
      language: 'ar',
      lastModified: '2024-08-24',
      usage: 67,
      fields: ['رقم الحساب', 'فترة الكشف', 'الرصيد الافتتاحي', 'الرصيد الختامي'],
    },
    {
      id: 6,
      name: 'طلب اعتماد مالي',
      type: 'credit',
      description: 'قالب طلب اعتماد مالي للمؤسسات',
      category: 'credit',
      language: 'ar',
      lastModified: '2024-08-23',
      usage: 34,
      fields: ['اسم المؤسسة', 'رقم السجل التجاري', 'المبلغ المطلوب', 'الغرض'],
    },
  ],
};

const templateCategories = [
  { value: 'all', label: 'جميع القوالب', icon: FileText },
  { value: 'invoice', label: 'الفواتير', icon: Receipt },
  { value: 'deposit', label: 'طلبات الشحن', icon: Wallet },
  { value: 'banking', label: 'القوالب البنكية', icon: Building },
  { value: 'payment', label: 'المدفوعات', icon: CreditCard },
];

const templateTypes = [
  { value: 'basic', label: 'أساسي', color: 'bg-blue-500' },
  { value: 'tax', label: 'ضريبي', color: 'bg-green-500' },
  { value: 'bank', label: 'بنكي', color: 'bg-purple-500' },
  { value: 'payment', label: 'دفع', color: 'bg-orange-500' },
  { value: 'statement', label: 'كشف', color: 'bg-teal-500' },
  { value: 'credit', label: 'اعتماد', color: 'bg-red-500' },
];

export default function AdminFinancialTemplates() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const getAllTemplates = () => {
    return [
      ...financialTemplates.invoices,
      ...financialTemplates.deposits,
      ...financialTemplates.banking,
    ];
  };

  const getFilteredTemplates = () => {
    if (selectedCategory === 'all') return getAllTemplates();
    
    const categoryMap: { [key: string]: string } = {
      invoice: 'invoices',
      deposit: 'deposits',
      banking: 'banking',
      payment: 'deposits', // payment templates are in deposits for now
    };
    
    const categoryKey = categoryMap[selectedCategory];
    return categoryKey ? (financialTemplates as any)[categoryKey] : [];
  };

  const getTypeInfo = (category: string) => {
    return templateTypes.find(t => t.value === category) || templateTypes[0];
  };

  const handlePreview = (template: any) => {
    setSelectedTemplate(template);
    setIsPreviewOpen(true);
  };

  return (
    <PageContainer>
      <PageHeader 
        title="القوالب المالية"
        description="إدارة قوالب الفواتير والمعاملات البنكية وطلبات الشحن"
      />

      <div className="space-y-6">
        {/* Categories Filter */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              تصنيفات القوالب
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {templateCategories.map(category => {
                const count = selectedCategory === 'all' 
                  ? getAllTemplates().length 
                  : getFilteredTemplates().length;
                
                return (
                  <Button
                    key={category.value}
                    variant={selectedCategory === category.value ? 'default' : 'outline'}
                    className="h-20 flex-col gap-2"
                    onClick={() => setSelectedCategory(category.value)}
                  >
                    <category.icon className="w-6 h-6" />
                    <div className="text-center">
                      <div className="text-sm font-medium">{category.label}</div>
                      <div className="text-xs opacity-70">
                        ({category.value === 'all' ? getAllTemplates().length : 
                          category.value === 'invoice' ? financialTemplates.invoices.length :
                          category.value === 'deposit' ? financialTemplates.deposits.length :
                          category.value === 'banking' ? financialTemplates.banking.length :
                          financialTemplates.deposits.length})
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Templates Management */}
        <Tabs defaultValue="templates" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="templates">القوالب الحالية</TabsTrigger>
            <TabsTrigger value="create">إنشاء قالب جديد</TabsTrigger>
            <TabsTrigger value="settings">إعدادات القوالب</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    القوالب المتاحة
                  </span>
                  <Badge variant="secondary">
                    {getFilteredTemplates().length} قالب
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getFilteredTemplates().map(template => {
                    const typeInfo = getTypeInfo(template.category);
                    
                    return (
                      <Card key={template.id} className="relative overflow-hidden">
                        <div className="absolute top-3 left-3">
                          <Badge variant="secondary" className="text-xs">
                            {template.type}
                          </Badge>
                        </div>
                        
                        <CardHeader className="pb-3">
                          <div className="flex items-start gap-3">
                            <div className={`w-3 h-3 rounded-full ${typeInfo.color} mt-1`} />
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-lg truncate">
                                {template.name}
                              </CardTitle>
                              <CardDescription className="text-sm">
                                {template.description}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>عدد الاستخدامات:</span>
                              <span>{template.usage}</span>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>آخر تعديل:</span>
                              <span>{template.lastModified}</span>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>عدد الحقول:</span>
                              <span>{template.fields.length}</span>
                            </div>
                          </div>

                          <Separator />

                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePreview(template)}
                              className="text-xs"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              معاينة
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs"
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              تحرير
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs"
                            >
                              <Copy className="w-3 h-3 mr-1" />
                              نسخ
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs"
                            >
                              <Download className="w-3 h-3 mr-1" />
                              تصدير
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  إنشاء قالب مالي جديد
                </CardTitle>
                <CardDescription>
                  قم بإنشاء قالب مخصص للمعاملات المالية أو البنكية
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="template-name">اسم القالب</Label>
                    <Input id="template-name" placeholder="أدخل اسم القالب" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-type">نوع القالب</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع القالب" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="invoice">فاتورة</SelectItem>
                        <SelectItem value="deposit">طلب شحن</SelectItem>
                        <SelectItem value="receipt">إيصال استلام</SelectItem>
                        <SelectItem value="statement">كشف حساب</SelectItem>
                        <SelectItem value="credit">اعتماد مالي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-category">التصنيف</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر التصنيف" />
                      </SelectTrigger>
                      <SelectContent>
                        {templateTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-language">اللغة</Label>
                    <Select defaultValue="ar">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ar">العربية</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template-description">وصف القالب</Label>
                  <Textarea 
                    id="template-description" 
                    placeholder="أدخل وصف مفصل للقالب واستخداماته"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>حقول القالب</Label>
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="flex gap-2">
                      <Input placeholder="اسم الحقل" className="flex-1" />
                      <Select>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="النوع" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">نص</SelectItem>
                          <SelectItem value="number">رقم</SelectItem>
                          <SelectItem value="date">تاريخ</SelectItem>
                          <SelectItem value="currency">عملة</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button size="sm" variant="outline">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      أضف الحقول المطلوبة في القالب (اسم العميل، المبلغ، التاريخ، إلخ)
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>تحميل قالب جاهز</Label>
                  <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      اسحب وأفلت ملف القالب هنا أو انقر للاختيار
                    </p>
                    <Button variant="outline" size="sm">
                      اختر الملف
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      PDF, DOCX, HTML حتى 10MB
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1">
                    <Plus className="w-4 h-4 mr-2" />
                    إنشاء القالب
                  </Button>
                  <Button variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    معاينة
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    إعدادات عامة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>اللغة الافتراضية للقوالب</Label>
                    <Select defaultValue="ar">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ar">العربية</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>العملة الافتراضية</Label>
                    <Select defaultValue="SAR">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SAR">ريال سعودي (SAR)</SelectItem>
                        <SelectItem value="USD">دولار أمريكي (USD)</SelectItem>
                        <SelectItem value="EUR">يورو (EUR)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>تنسيق التاريخ</Label>
                    <Select defaultValue="dd/mm/yyyy">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd/mm/yyyy">يوم/شهر/سنة</SelectItem>
                        <SelectItem value="mm/dd/yyyy">شهر/يوم/سنة</SelectItem>
                        <SelectItem value="yyyy-mm-dd">سنة-شهر-يوم</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    معلومات الشركة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>اسم الشركة</Label>
                    <Input defaultValue="شركة علي صالح الشهري القابضة" />
                  </div>
                  <div className="space-y-2">
                    <Label>رقم السجل التجاري</Label>
                    <Input defaultValue="1234567890" />
                  </div>
                  <div className="space-y-2">
                    <Label>الرقم الضريبي</Label>
                    <Input defaultValue="987654321012345" />
                  </div>
                  <div className="space-y-2">
                    <Label>عنوان الشركة</Label>
                    <Textarea defaultValue="الرياض، المملكة العربية السعودية" rows={2} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              معاينة القالب: {selectedTemplate?.name}
            </DialogTitle>
            <DialogDescription>
              معاينة تصميم وحقول القالب المالي
            </DialogDescription>
          </DialogHeader>
          
          {selectedTemplate && (
            <div className="space-y-6">
              <div className="bg-muted/50 p-6 rounded-lg">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold mb-2">شركة علي صالح الشهري القابضة</h1>
                  <p className="text-muted-foreground">الرياض، المملكة العربية السعودية</p>
                </div>
                
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold mb-2">{selectedTemplate.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-sm">رقم المرجع: #2024-001</p>
                    <p className="text-sm">التاريخ: {new Date().toLocaleDateString('ar-SA')}</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <h4 className="font-semibold">حقول القالب:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedTemplate.fields.map((field: string, index: number) => (
                      <div key={index} className="flex justify-between p-2 bg-background rounded">
                        <span className="text-sm">{field}:</span>
                        <span className="text-sm text-muted-foreground">[قيمة تجريبية]</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border-t pt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    هذا مثال تجريبي لعرض تصميم القالب
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  تحميل PDF
                </Button>
                <Button variant="outline" className="flex-1">
                  <Edit className="w-4 h-4 mr-2" />
                  تحرير القالب
                </Button>
                <Button variant="outline" className="flex-1">
                  <Copy className="w-4 h-4 mr-2" />
                  نسخ القالب
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}