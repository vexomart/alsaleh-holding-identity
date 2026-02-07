import { motion, AnimatePresence } from "framer-motion";
import { 
  Eye, 
  Edit, 
  Shield, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar, 
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  email: string;
  full_name: string | null;
  full_name_ar: string | null;
  avatar_url: string | null;
  phone: string | null;
  is_active: boolean | null;
  last_login_at: string | null;
  created_at: string | null;
  preferred_language: string | null;
  roles: string[];
}

interface UserDialogsProps {
  language: string;
  selectedUser: User | null;
  
  // View Dialog
  isViewDialogOpen: boolean;
  onViewDialogChange: (open: boolean) => void;
  onEditFromView: () => void;
  formatDate: (date: string | null) => string;
  formatRelativeTime: (date: string | null) => string;
  
  // Edit Dialog
  isEditDialogOpen: boolean;
  onEditDialogChange: (open: boolean) => void;
  editingName: string;
  onEditingNameChange: (name: string) => void;
  editingPhone: string;
  onEditingPhoneChange: (phone: string) => void;
  onSaveEdit: () => void;
  
  // Role Dialog
  isRoleDialogOpen: boolean;
  onRoleDialogChange: (open: boolean) => void;
  selectedRole: string;
  onSelectedRoleChange: (role: string) => void;
  onSaveRole: () => void;
  
  // Delete Dialog
  isDeleteDialogOpen: boolean;
  onDeleteDialogChange: (open: boolean) => void;
  onConfirmDelete: () => void;
}

const roles = [
  { value: "super_admin", labelAr: "مدير النظام", labelEn: "Super Admin", color: "text-secondary" },
  { value: "admin", labelAr: "مدير", labelEn: "Admin", color: "text-primary" },
  { value: "manager", labelAr: "مشرف", labelEn: "Manager", color: "text-primary" },
  { value: "support", labelAr: "دعم فني", labelEn: "Support", color: "text-accent" },
  { value: "finance", labelAr: "مالية", labelEn: "Finance", color: "text-accent" },
  { value: "content_editor", labelAr: "محرر محتوى", labelEn: "Content Editor", color: "text-secondary" },
  { value: "staff", labelAr: "موظف", labelEn: "Staff", color: "text-muted-foreground" },
  { value: "customer", labelAr: "عميل", labelEn: "Customer", color: "text-muted-foreground" },
];

export function UserDialogs({
  language,
  selectedUser,
  isViewDialogOpen,
  onViewDialogChange,
  onEditFromView,
  formatDate,
  formatRelativeTime,
  isEditDialogOpen,
  onEditDialogChange,
  editingName,
  onEditingNameChange,
  editingPhone,
  onEditingPhoneChange,
  onSaveEdit,
  isRoleDialogOpen,
  onRoleDialogChange,
  selectedRole,
  onSelectedRoleChange,
  onSaveRole,
  isDeleteDialogOpen,
  onDeleteDialogChange,
  onConfirmDelete,
}: UserDialogsProps) {
  const displayName = selectedUser 
    ? (language === "ar" && selectedUser.full_name_ar 
        ? selectedUser.full_name_ar 
        : selectedUser.full_name || selectedUser.email.split("@")[0])
    : "";

  return (
    <>
      {/* View User Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={onViewDialogChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary/10">
                <Eye className="h-5 w-5 text-primary" />
              </div>
              {language === "ar" ? "تفاصيل المستخدم" : "User Details"}
            </DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* User Header */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                <Avatar className="h-16 w-16 ring-2 ring-primary/20">
                  <AvatarImage src={selectedUser.avatar_url || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xl font-semibold">
                    {displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate">{displayName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={selectedUser.is_active ? "default" : "secondary"} className="text-xs">
                      {selectedUser.is_active 
                        ? (language === "ar" ? "نشط" : "Active")
                        : (language === "ar" ? "معطل" : "Inactive")}
                    </Badge>
                    {selectedUser.roles.map((role) => {
                      const roleInfo = roles.find(r => r.value === role);
                      return (
                        <Badge key={role} variant="outline" className="text-xs">
                          {roleInfo ? (language === "ar" ? roleInfo.labelAr : roleInfo.labelEn) : role}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">{language === "ar" ? "البريد الإلكتروني" : "Email"}</p>
                    <p className="font-medium truncate">{selectedUser.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Phone className="h-4 w-4 text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">{language === "ar" ? "الهاتف" : "Phone"}</p>
                    <p className="font-medium" dir="ltr">{selectedUser.phone || (language === "ar" ? "غير متوفر" : "N/A")}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Globe className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">{language === "ar" ? "اللغة المفضلة" : "Preferred Language"}</p>
                    <p className="font-medium">{selectedUser.preferred_language === "ar" ? "العربية" : "English"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="p-2 rounded-lg bg-secondary/10">
                      <Calendar className="h-4 w-4 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">{language === "ar" ? "تاريخ التسجيل" : "Joined"}</p>
                      <p className="font-medium text-sm">{formatDate(selectedUser.created_at)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <Clock className="h-4 w-4 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">{language === "ar" ? "آخر دخول" : "Last Login"}</p>
                      <p className="font-medium text-sm">{formatRelativeTime(selectedUser.last_login_at)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => onViewDialogChange(false)}>
              {language === "ar" ? "إغلاق" : "Close"}
            </Button>
            <Button onClick={onEditFromView} className="gap-2">
              <Edit className="h-4 w-4" />
              {language === "ar" ? "تعديل" : "Edit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={onEditDialogChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary/10">
                <Edit className="h-5 w-5 text-primary" />
              </div>
              {language === "ar" ? "تعديل المستخدم" : "Edit User"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{language === "ar" ? "الاسم الكامل" : "Full Name"}</Label>
              <Input
                value={editingName}
                onChange={(e) => onEditingNameChange(e.target.value)}
                placeholder={language === "ar" ? "أدخل الاسم" : "Enter name"}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label>{language === "ar" ? "رقم الهاتف" : "Phone Number"}</Label>
              <Input
                value={editingPhone}
                onChange={(e) => onEditingPhoneChange(e.target.value)}
                placeholder={language === "ar" ? "أدخل رقم الهاتف" : "Enter phone"}
                className="h-11"
                dir="ltr"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => onEditDialogChange(false)}>
              {language === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button onClick={onSaveEdit} className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              {language === "ar" ? "حفظ التغييرات" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Role Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={onRoleDialogChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              {language === "ar" ? "تغيير دور المستخدم" : "Change User Role"}
            </DialogTitle>
            <DialogDescription>
              {language === "ar" 
                ? `تغيير دور "${displayName}"`
                : `Change role for "${displayName}"`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label className="mb-2 block">{language === "ar" ? "اختر الدور الجديد" : "Select New Role"}</Label>
            <Select value={selectedRole} onValueChange={onSelectedRoleChange}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder={language === "ar" ? "اختر الدور" : "Select role"} />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    <span className={role.color}>
                      {language === "ar" ? role.labelAr : role.labelEn}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => onRoleDialogChange(false)}>
              {language === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button onClick={onSaveRole} className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              {language === "ar" ? "تغيير الدور" : "Change Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={onDeleteDialogChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <div className="p-2 rounded-xl bg-destructive/10">
                <AlertCircle className="h-5 w-5" />
              </div>
              {language === "ar" ? "تأكيد الحذف" : "Confirm Delete"}
            </DialogTitle>
            <DialogDescription className="pt-2">
              {language === "ar" 
                ? `هل أنت متأكد من حذف المستخدم "${displayName}"؟ لا يمكن التراجع عن هذا الإجراء.`
                : `Are you sure you want to delete "${displayName}"? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => onDeleteDialogChange(false)}>
              {language === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button variant="destructive" onClick={onConfirmDelete} className="gap-2">
              <Trash2 className="h-4 w-4" />
              {language === "ar" ? "حذف" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
