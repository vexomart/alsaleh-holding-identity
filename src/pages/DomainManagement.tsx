import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, Eye, Edit, Calendar, User } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface DomainRequest {
  id: string;
  domain_name: string;
  extension: string;
  full_domain: string;
  price: number;
  status: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_company?: string;
  additional_notes?: string;
  registration_period: number;
  auto_renew: boolean;
  created_at: string;
  updated_at: string;
}

const DomainManagement = () => {
  const [requests, setRequests] = useState<DomainRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<DomainRequest | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchDomainRequests();
  }, []);

  const fetchDomainRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('domain_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching domain requests:', error);
        toast.error("خطأ في جلب البيانات");
        return;
      }

      setRequests(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('domain_requests')
        .update({ status: newStatus })
        .eq('id', requestId);

      if (error) {
        console.error('Error updating status:', error);
        toast.error("فشل في تحديث الحالة");
        return;
      }

      toast.success("تم تحديث الحالة بنجاح");
      fetchDomainRequests();
    } catch (error) {
      console.error('Error:', error);
      toast.error("حدث خطأ أثناء التحديث");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { label: string; variant: "default" | "secondary" | "destructive" | "outline" } } = {
      pending: { label: "قيد الانتظار", variant: "outline" },
      processing: { label: "قيد المعالجة", variant: "secondary" },
      approved: { label: "تمت الموافقة", variant: "default" },
      rejected: { label: "مرفوض", variant: "destructive" },
      registered: { label: "مسجل", variant: "default" }
    };

    const statusInfo = statusMap[status] || { label: status, variant: "outline" as const };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const filteredRequests = requests.filter(request => 
    statusFilter === "all" || request.status === statusFilter
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            إدارة طلبات النطاقات
          </h1>
          <p className="text-gray-600">
            إدارة ومتابعة جميع طلبات تسجيل النطاقات
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الطلبات</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{requests.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">قيد الانتظار</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {requests.filter(r => r.status === 'pending').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">تمت الموافقة</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {requests.filter(r => r.status === 'approved').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">مسجلة</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {requests.filter(r => r.status === 'registered').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter and Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>طلبات النطاقات</CardTitle>
                <CardDescription>
                  قائمة بجميع طلبات تسجيل النطاقات
                </CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="pending">قيد الانتظار</SelectItem>
                    <SelectItem value="processing">قيد المعالجة</SelectItem>
                    <SelectItem value="approved">تمت الموافقة</SelectItem>
                    <SelectItem value="rejected">مرفوض</SelectItem>
                    <SelectItem value="registered">مسجل</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>النطاق</TableHead>
                  <TableHead>العميل</TableHead>
                  <TableHead>السعر</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>تاريخ الطلب</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-blue-600" />
                        <div>
                          <div className="font-medium">{request.full_domain}</div>
                          <div className="text-sm text-gray-500">
                            {request.registration_period} سنة
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{request.customer_name}</div>
                        <div className="text-sm text-gray-500">{request.customer_email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{request.price} ريال</div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(request.status)}
                    </TableCell>
                    <TableCell>
                      {new Date(request.created_at).toLocaleDateString('ar-SA')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowDetails(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {request.status === 'pending' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateRequestStatus(request.id, 'approved')}
                            >
                              موافقة
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateRequestStatus(request.id, 'rejected')}
                            >
                              رفض
                            </Button>
                          </>
                        )}
                        {request.status === 'approved' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateRequestStatus(request.id, 'registered')}
                          >
                            تم التسجيل
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredRequests.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                لا توجد طلبات تطابق المعايير المحددة
              </div>
            )}
          </CardContent>
        </Card>

        {/* Request Details Dialog */}
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>تفاصيل طلب النطاق</DialogTitle>
              <DialogDescription>
                {selectedRequest && `${selectedRequest.full_domain}`}
              </DialogDescription>
            </DialogHeader>
            
            {selectedRequest && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">النطاق</label>
                    <div className="text-lg font-semibold">{selectedRequest.full_domain}</div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">اسم العميل</label>
                    <div>{selectedRequest.customer_name}</div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">البريد الإلكتروني</label>
                    <div>{selectedRequest.customer_email}</div>
                  </div>
                  
                  {selectedRequest.customer_phone && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">رقم الهاتف</label>
                      <div>{selectedRequest.customer_phone}</div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">السعر</label>
                    <div className="text-lg font-semibold text-green-600">
                      {selectedRequest.price} ريال/سنة
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">مدة التسجيل</label>
                    <div>{selectedRequest.registration_period} سنة</div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">التجديد التلقائي</label>
                    <div>{selectedRequest.auto_renew ? 'نعم' : 'لا'}</div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">الحالة</label>
                    <div>{getStatusBadge(selectedRequest.status)}</div>
                  </div>
                </div>
                
                {selectedRequest.customer_company && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-500">اسم الشركة</label>
                    <div>{selectedRequest.customer_company}</div>
                  </div>
                )}
                
                {selectedRequest.additional_notes && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-500">ملاحظات إضافية</label>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      {selectedRequest.additional_notes}
                    </div>
                  </div>
                )}
                
                <div className="md:col-span-2 text-sm text-gray-500">
                  تاريخ الطلب: {new Date(selectedRequest.created_at).toLocaleString('ar-SA')}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DomainManagement;