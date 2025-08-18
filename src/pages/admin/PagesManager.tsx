import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Globe,
  Calendar,
  User
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useOutletContext } from 'react-router-dom';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'editor';
}

interface Page {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  publish_at: string | null;
  admin_users: { name: string } | null;
}

export default function PagesManager() {
  const { user } = useOutletContext<{ user: AdminUser }>();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      const { data, error } = await supabase
        .from('cms_pages')
        .select(`
          id,
          title,
          slug,
          status,
          created_at,
          updated_at,
          publish_at,
          admin_users(name)
        `)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error('Error loading pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePageStatus = async (pageId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      const { error } = await supabase
        .from('cms_pages')
        .update({ 
          status: newStatus,
          publish_at: newStatus === 'published' ? new Date().toISOString() : null
        })
        .eq('id', pageId);

      if (error) throw error;
      loadPages();
    } catch (error) {
      console.error('Error updating page status:', error);
    }
  };

  const deletePage = async (pageId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الصفحة؟')) return;

    try {
      const { error } = await supabase
        .from('cms_pages')
        .delete()
        .eq('id', pageId);

      if (error) throw error;
      loadPages();
    } catch (error) {
      console.error('Error deleting page:', error);
    }
  };

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    if (status === 'published') {
      return <Badge className="bg-green-500">منشور</Badge>;
    }
    return <Badge variant="secondary">مسودة</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">إدارة الصفحات</h1>
          <p className="text-muted-foreground">إنشاء وإدارة صفحات الموقع</p>
        </div>
        <Button>
          <Plus className="ml-2 h-4 w-4" />
          صفحة جديدة
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="البحث في الصفحات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-8"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pages List */}
      <Card>
        <CardHeader>
          <CardTitle>الصفحات ({filteredPages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPages.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">لا توجد صفحات</p>
                <Button variant="outline" className="mt-4">
                  <Plus className="ml-2 h-4 w-4" />
                  إنشاء أول صفحة
                </Button>
              </div>
            ) : (
              filteredPages.map((page) => (
                <div key={page.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{page.title}</h3>
                        {getStatusBadge(page.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">/{page.slug}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {page.admin_users?.name || 'غير محدد'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(page.updated_at).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => togglePageStatus(page.id, page.status)}
                      >
                        <Globe className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deletePage(page.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}