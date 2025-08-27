import React, { useState } from 'react';
import { PageContainer } from '@/components/ui/page-container';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Image,
  Upload,
  Settings,
  Trash2,
  Edit,
  Save,
  X,
  Eye,
  Download,
} from 'lucide-react';

// Mock data for logos
const mockLogos = [
  {
    id: 1,
    name: 'شعار الشركة الرئيسي',
    type: 'primary',
    description: 'الشعار الأساسي للشركة',
    url: '/src/assets/tasaheel-official-logo.png',
    size: '248 KB',
    dimensions: '800x400',
    format: 'PNG',
    lastModified: '2024-08-27',
  },
  {
    id: 2,
    name: 'شعار وزارة التجارة',
    type: 'partner',
    description: 'شعار وزارة التجارة والاستثمار',
    url: '/src/assets/logos/ministry-commerce-logo.png',
    size: '156 KB',
    dimensions: '600x300',
    format: 'PNG',
    lastModified: '2024-08-25',
  },
  {
    id: 3,
    name: 'شعار هيئة الزكاة والضريبة',
    type: 'partner',
    description: 'شعار هيئة الزكاة والضريبة والجمارك',
    url: '/src/assets/logos/zatca-logo.svg',
    size: '89 KB',
    dimensions: '400x200',
    format: 'SVG',
    lastModified: '2024-08-20',
  },
];

const logoTypes = [
  { value: 'primary', label: 'أساسي', color: 'bg-blue-500' },
  { value: 'secondary', label: 'ثانوي', color: 'bg-green-500' },
  { value: 'partner', label: 'شريك', color: 'bg-purple-500' },
  { value: 'client', label: 'عميل', color: 'bg-orange-500' },
];

export default function AdminLogos() {
  const [logos, setLogos] = useState(mockLogos);
  const [editingLogo, setEditingLogo] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState('all');

  const filteredLogos = selectedType === 'all' 
    ? logos 
    : logos.filter(logo => logo.type === selectedType);

  const getTypeInfo = (type: string) => {
    return logoTypes.find(t => t.value === type) || logoTypes[0];
  };

  const handleEdit = (logoId: number) => {
    setEditingLogo(logoId);
  };

  const handleSave = (logoId: number) => {
    setEditingLogo(null);
    // Here you would save to backend
  };

  const handleDelete = (logoId: number) => {
    setLogos(logos.filter(logo => logo.id !== logoId));
  };

  return (
    <PageContainer>
      <PageHeader 
        title="إدارة الشعارات"
        description="إدارة وتنظيم شعارات الشركة والشركاء"
      />

      <div className="space-y-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              رفع شعار جديد
            </CardTitle>
            <CardDescription>
              قم برفع شعار جديد للشركة أو الشركاء
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="logo-name">اسم الشعار</Label>
                <Input id="logo-name" placeholder="أدخل اسم الشعار" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo-type">نوع الشعار</Label>
                <select id="logo-type" className="w-full px-3 py-2 border border-input rounded-md bg-background">
                  {logoTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo-description">وصف الشعار</Label>
              <Input id="logo-description" placeholder="أدخل وصف الشعار" />
            </div>
            <div className="space-y-2">
              <Label>ملف الشعار</Label>
              <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  اسحب وأفلت الملف هنا أو انقر للاختيار
                </p>
                <Button variant="outline" size="sm">
                  اختر الملف
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  PNG, JPG, SVG حتى 5MB
                </p>
              </div>
            </div>
            <Button className="w-full">
              <Upload className="w-4 h-4 mr-2" />
              رفع الشعار
            </Button>
          </CardContent>
        </Card>

        {/* Filter Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="w-5 h-5" />
              الشعارات المرفوعة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                variant={selectedType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType('all')}
              >
                الكل ({logos.length})
              </Button>
              {logoTypes.map(type => {
                const count = logos.filter(logo => logo.type === type.value).length;
                return (
                  <Button
                    key={type.value}
                    variant={selectedType === type.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedType(type.value)}
                  >
                    {type.label} ({count})
                  </Button>
                );
              })}
            </div>

            <Separator className="mb-6" />

            {/* Logos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLogos.map(logo => {
                const typeInfo = getTypeInfo(logo.type);
                const isEditing = editingLogo === logo.id;

                return (
                  <Card key={logo.id} className="overflow-hidden">
                    <div className="aspect-video bg-muted/50 flex items-center justify-center relative">
                      <Image className="w-12 h-12 text-muted-foreground" />
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="text-xs">
                          {logo.format}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-4 space-y-3">
                      {isEditing ? (
                        <div className="space-y-2">
                          <Input 
                            defaultValue={logo.name}
                            className="font-medium"
                          />
                          <Input 
                            defaultValue={logo.description}
                            className="text-sm text-muted-foreground"
                          />
                        </div>
                      ) : (
                        <div>
                          <h3 className="font-medium truncate">{logo.name}</h3>
                          <p className="text-sm text-muted-foreground truncate">
                            {logo.description}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${typeInfo.color}`} />
                        <span className="text-xs text-muted-foreground">
                          {typeInfo.label}
                        </span>
                      </div>

                      <div className="text-xs text-muted-foreground space-y-1">
                        <div className="flex justify-between">
                          <span>الحجم:</span>
                          <span>{logo.size}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>الأبعاد:</span>
                          <span>{logo.dimensions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>آخر تعديل:</span>
                          <span>{logo.lastModified}</span>
                        </div>
                      </div>

                      <Separator />

                      <div className="flex gap-1">
                        {isEditing ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSave(logo.id)}
                              className="flex-1"
                            >
                              <Save className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingLogo(null)}
                              className="flex-1"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                            >
                              <Download className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(logo.id)}
                              className="flex-1"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(logo.id)}
                              className="flex-1 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredLogos.length === 0 && (
              <div className="text-center py-12">
                <Image className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">لا توجد شعارات</h3>
                <p className="text-muted-foreground">
                  لم يتم العثور على شعارات من هذا النوع
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}