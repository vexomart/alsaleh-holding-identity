import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Search, Edit, Eye, Building, Mail, Phone, Globe } from "lucide-react";
import { ClientForm } from "@/components/admin/ClientForm";

interface Client {
  id: string;
  legal_name: string;
  display_name?: string;
  tax_number?: string;
  sector: string;
  status: string;
  billing_email: string;
  phone?: string;
  website?: string;
  created_at: string;
  city?: string;
  country: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client =>
    client.legal_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.billing_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.tax_number && client.tax_number.includes(searchTerm))
  );

  const getStatusBadge = (status: string) => {
    const statusMap = {
      prospect: { label: 'عميل محتمل', variant: 'secondary' as const },
      active: { label: 'نشط', variant: 'default' as const },
      inactive: { label: 'غير نشط', variant: 'outline' as const },
      blocked: { label: 'محظور', variant: 'destructive' as const },
    };
    
    const config = statusMap[status as keyof typeof statusMap] || statusMap.prospect;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getSectorLabel = (sector: string) => {
    const sectorMap = {
      government: 'حكومي',
      private: 'خاص',
      semi_government: 'شبه حكومي',
    };
    return sectorMap[sector as keyof typeof sectorMap] || sector;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">إدارة العملاء</h2>
          <p className="text-muted-foreground">
            إدارة قاعدة بيانات العملاء وجهات الاتصال
          </p>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              إضافة عميل جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>إضافة عميل جديد</DialogTitle>
              <DialogDescription>
                أدخل بيانات العميل الجديد
              </DialogDescription>
            </DialogHeader>
            <ClientForm 
              onSuccess={() => {
                setShowAddDialog(false);
                fetchClients();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>البحث والتصفية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="البحث بالاسم، البريد الإلكتروني، أو الرقم الضريبي..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة العملاء ({filteredClients.length})</CardTitle>
          <CardDescription>
            جميع العملاء المسجلين في النظام
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم التجاري</TableHead>
                <TableHead>القطاع</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>البريد الإلكتروني</TableHead>
                <TableHead>الهاتف</TableHead>
                <TableHead>تاريخ الإضافة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Building className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{client.legal_name}</div>
                        {client.display_name && (
                          <div className="text-sm text-muted-foreground">
                            {client.display_name}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getSectorLabel(client.sector)}</TableCell>
                  <TableCell>{getStatusBadge(client.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      {client.billing_email}
                    </div>
                  </TableCell>
                  <TableCell>
                    {client.phone ? (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        {client.phone}
                      </div>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(client.created_at).toLocaleDateString('ar')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      {client.website && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={client.website} target="_blank" rel="noopener noreferrer">
                            <Globe className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredClients.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'لا توجد نتائج للبحث' : 'لا يوجد عملاء مسجلين'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}