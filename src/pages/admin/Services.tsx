import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Edit, Trash2, Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';

const mockServices = [
  { id: '1', name: 'تصميم المواقع', nameEn: 'Website Design', price: '5,000', category: 'development', status: 'active' },
  { id: '2', name: 'تطوير التطبيقات', nameEn: 'App Development', price: '15,000', category: 'development', status: 'active' },
  { id: '3', name: 'استشارات تقنية', nameEn: 'Tech Consulting', price: '2,500', category: 'consulting', status: 'active' },
  { id: '4', name: 'تصميم الهوية', nameEn: 'Brand Identity', price: '3,000', category: 'design', status: 'inactive' },
];

const AdminServices = () => {
  const { isRTL } = useLanguage();
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold">{isRTL ? 'إدارة الخدمات' : 'Services Management'}</h2>
          <p className="text-muted-foreground">
            {isRTL ? 'إدارة الخدمات والمنتجات' : 'Manage services and products'}
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 me-2" />
          {isRTL ? 'إضافة خدمة' : 'Add Service'}
        </Button>
      </motion.div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={isRTL ? 'البحث في الخدمات...' : 'Search services...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ps-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockServices.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <Badge variant={service.status === 'active' ? 'default' : 'secondary'}>
                    {isRTL 
                      ? (service.status === 'active' ? 'نشط' : 'غير نشط')
                      : (service.status === 'active' ? 'Active' : 'Inactive')}
                  </Badge>
                </div>

                <h3 className="font-semibold text-lg mb-2">
                  {isRTL ? service.name : service.nameEn}
                </h3>

                <p className="text-2xl font-bold text-primary mb-4">
                  {service.price} {isRTL ? 'ريال' : 'SAR'}
                </p>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="w-4 h-4 me-1" />
                    {isRTL ? 'تعديل' : 'Edit'}
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminServices;
