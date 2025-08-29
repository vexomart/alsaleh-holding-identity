import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  MessageSquare,
  Bell,
  Calendar,
  Clock,
  File,
  Upload,
  Download,
  Share2,
  Video,
  Phone,
  Mail,
  Plus,
  Search,
  Filter,
  Settings,
  MoreHorizontal,
  Send,
  Paperclip,
  Image,
  FileText,
  Folder,
  Star,
  Eye,
  Edit2,
  Trash2,
  UserPlus,
  Activity,
  CheckCircle,
  AlertCircle,
  Info,
  MessageCircle,
  Heart,
  Bookmark,
  Reply,
  Forward,
  Link2,
  Hash,
  Smile,
  Camera,
  Mic,
  Globe,
  Shield,
  Zap
} from 'lucide-react';
import { toast } from "sonner";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  last_seen?: string;
  timezone: string;
  skills: string[];
  workload: number;
  projects_count: number;
  tasks_completed: number;
  performance_score: number;
}

interface ProjectMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  content: string;
  message_type: 'text' | 'file' | 'image' | 'announcement' | 'task_update';
  timestamp: string;
  is_pinned: boolean;
  reactions: { emoji: string; count: number; users: string[] }[];
  replies_count: number;
  attachments?: { id: string; name: string; type: string; size: number; url: string }[];
  mentioned_users?: string[];
  channel_id?: string;
}

interface ProjectFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploaded_by: string;
  uploaded_at: string;
  version: number;
  description?: string;
  tags: string[];
  downloads_count: number;
  folder_id?: string;
  is_starred: boolean;
}

interface ProjectActivity {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  action: string;
  details: string;
  timestamp: string;
  type: 'task' | 'file' | 'message' | 'meeting' | 'milestone' | 'system';
  related_id?: string;
}

interface ProjectTeamCollaborationProps {
  projectId: string;
  projectName: string;
}

const ProjectTeamCollaboration: React.FC<ProjectTeamCollaborationProps> = ({ projectId, projectName }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'files' | 'team' | 'activity'>('chat');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [messages, setMessages] = useState<ProjectMessage[]>([]);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [activities, setActivities] = useState<ProjectActivity[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('general');
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamData();
  }, [projectId]);

  const fetchTeamData = async () => {
    try {
      // Mock data - replace with actual Supabase queries
      const mockTeamMembers: TeamMember[] = [
        {
          id: '1',
          name: 'أحمد محمد',
          email: 'ahmed@company.com',
          role: 'مدير المشروع',
          department: 'إدارة المشاريع',
          status: 'online',
          timezone: 'Asia/Riyadh',
          skills: ['إدارة المشاريع', 'Agile', 'Scrum'],
          workload: 85,
          projects_count: 5,
          tasks_completed: 142,
          performance_score: 95
        },
        {
          id: '2',
          name: 'فاطمة علي',
          email: 'fatima@company.com',
          role: 'مصممة UI/UX',
          department: 'التصميم',
          status: 'online',
          timezone: 'Asia/Riyadh',
          skills: ['Figma', 'Adobe XD', 'تجربة المستخدم'],
          workload: 70,
          projects_count: 3,
          tasks_completed: 89,
          performance_score: 92
        },
        {
          id: '3',
          name: 'محمد خالد',
          email: 'mohammed@company.com',
          role: 'مطور فل ستاك',
          department: 'التطوير',
          status: 'away',
          timezone: 'Asia/Riyadh',
          skills: ['React', 'Node.js', 'TypeScript'],
          workload: 90,
          projects_count: 4,
          tasks_completed: 156,
          performance_score: 88
        }
      ];

      const mockMessages: ProjectMessage[] = [
        {
          id: '1',
          sender_id: '1',
          sender_name: 'أحمد محمد',
          content: 'مرحباً بالجميع! تم الانتهاء من مراجعة التصاميم الأولية. يمكننا الآن البدء في مرحلة التطوير.',
          message_type: 'announcement',
          timestamp: '2024-01-20T10:30:00Z',
          is_pinned: true,
          reactions: [{ emoji: '👍', count: 3, users: ['2', '3', '4'] }],
          replies_count: 2
        },
        {
          id: '2',
          sender_id: '2',
          sender_name: 'فاطمة علي',
          content: 'رائع! لقد قمت برفع الملفات النهائية للتصاميم في مجلد المشروع.',
          message_type: 'text',
          timestamp: '2024-01-20T11:15:00Z',
          is_pinned: false,
          reactions: [{ emoji: '❤️', count: 2, users: ['1', '3'] }],
          replies_count: 1,
          attachments: [
            { id: '1', name: 'final-designs.zip', type: 'application/zip', size: 15728640, url: '#' }
          ]
        },
        {
          id: '3',
          sender_id: '3',
          sender_name: 'محمد خالد',
          content: 'تم إنشاء مستودع Git للمشروع وإعداد البيئة التطويرية. الرابط في التعليقات.',
          message_type: 'task_update',
          timestamp: '2024-01-20T14:45:00Z',
          is_pinned: false,
          reactions: [],
          replies_count: 0
        }
      ];

      const mockFiles: ProjectFile[] = [
        {
          id: '1',
          name: 'تصاميم-الواجهة-النهائية.fig',
          type: 'figma',
          size: 8429536,
          url: '#',
          uploaded_by: 'فاطمة علي',
          uploaded_at: '2024-01-20T11:15:00Z',
          version: 3,
          description: 'التصاميم النهائية لجميع صفحات الموقع',
          tags: ['تصميم', 'UI', 'واجهة'],
          downloads_count: 12,
          is_starred: true
        },
        {
          id: '2',
          name: 'متطلبات-المشروع.pdf',
          type: 'pdf',
          size: 2156784,
          url: '#',
          uploaded_by: 'أحمد محمد',
          uploaded_at: '2024-01-15T09:30:00Z',
          version: 2,
          description: 'وثيقة متطلبات المشروع المحدثة',
          tags: ['متطلبات', 'وثائق', 'تخطيط'],
          downloads_count: 25,
          is_starred: false
        },
        {
          id: '3',
          name: 'كود-المشروع.zip',
          type: 'archive',
          size: 45673920,
          url: '#',
          uploaded_by: 'محمد خالد',
          uploaded_at: '2024-01-19T16:20:00Z',
          version: 1,
          description: 'الكود المصدري للنسخة التجريبية',
          tags: ['كود', 'تطوير', 'نسخة تجريبية'],
          downloads_count: 8,
          is_starred: true
        }
      ];

      const mockActivities: ProjectActivity[] = [
        {
          id: '1',
          user_id: '1',
          user_name: 'أحمد محمد',
          action: 'إنشاء مهمة جديدة',
          details: 'تم إنشاء مهمة "مراجعة التصاميم النهائية"',
          timestamp: '2024-01-20T15:30:00Z',
          type: 'task'
        },
        {
          id: '2',
          user_id: '2',
          user_name: 'فاطمة علي',
          action: 'رفع ملف جديد',
          details: 'تم رفع ملف "تصاميم-الواجهة-النهائية.fig"',
          timestamp: '2024-01-20T11:15:00Z',
          type: 'file'
        },
        {
          id: '3',
          user_id: '3',
          user_name: 'محمد خالد',
          action: 'إكمال مهمة',
          details: 'تم إكمال مهمة "إعداد بيئة التطوير"',
          timestamp: '2024-01-20T10:45:00Z',
          type: 'task'
        }
      ];

      setTeamMembers(mockTeamMembers);
      setMessages(mockMessages);
      setFiles(mockFiles);
      setActivities(mockActivities);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching team data:', error);
      toast.error('حدث خطأ في جلب بيانات الفريق');
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'متصل';
      case 'away': return 'بعيد';
      case 'busy': return 'مشغول';
      case 'offline': return 'غير متصل';
      default: return 'غير معروف';
    }
  };

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return <Image className="h-4 w-4" />;
    if (type.includes('pdf')) return <FileText className="h-4 w-4" />;
    if (type.includes('zip') || type.includes('archive')) return <Folder className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: ProjectMessage = {
      id: Date.now().toString(),
      sender_id: 'current_user',
      sender_name: 'أنت',
      content: newMessage,
      message_type: 'text',
      timestamp: new Date().toISOString(),
      is_pinned: false,
      reactions: [],
      replies_count: 0
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    toast.success('تم إرسال الرسالة');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">جارٍ تحميل بيانات الفريق...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">تعاون الفريق</h2>
          <p className="text-muted-foreground">{projectName}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setShowAddMemberDialog(true)} className="gap-2">
            <UserPlus className="h-4 w-4" />
            إضافة عضو
          </Button>
          <Button variant="outline" className="gap-2">
            <Video className="h-4 w-4" />
            اجتماع
          </Button>
          <Button variant="outline" className="gap-2">
            <Share2 className="h-4 w-4" />
            مشاركة
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === 'chat' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('chat')}
          className="gap-2"
        >
          <MessageSquare className="h-4 w-4" />
          المحادثة
        </Button>
        <Button
          variant={activeTab === 'files' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('files')}
          className="gap-2"
        >
          <Folder className="h-4 w-4" />
          الملفات
        </Button>
        <Button
          variant={activeTab === 'team' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('team')}
          className="gap-2"
        >
          <Users className="h-4 w-4" />
          الفريق
        </Button>
        <Button
          variant={activeTab === 'activity' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('activity')}
          className="gap-2"
        >
          <Activity className="h-4 w-4" />
          النشاطات
        </Button>
      </div>

      {/* Chat Tab */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-12 gap-6 h-[600px]">
          {/* Chat Area */}
          <Card className="col-span-8 flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  عام
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost">
                    <Search className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Bell className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="group">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>
                          {message.sender_name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{message.sender_name}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(message.timestamp).toLocaleTimeString('ar-SA')}
                          </span>
                          {message.is_pinned && <Star className="h-4 w-4 text-yellow-500" />}
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                          <p className="text-sm">{message.content}</p>
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2 space-y-2">
                              {message.attachments.map((file) => (
                                <div key={file.id} className="flex items-center gap-2 p-2 bg-white dark:bg-gray-900 rounded border">
                                  {getFileIcon(file.type)}
                                  <span className="text-sm font-medium">{file.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {formatFileSize(file.size)}
                                  </span>
                                  <Button size="sm" variant="ghost">
                                    <Download className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                          {message.reactions.length > 0 && (
                            <div className="flex items-center gap-1 mt-2">
                              {message.reactions.map((reaction, idx) => (
                                <Button key={idx} size="sm" variant="ghost" className="h-6 px-2">
                                  <span className="text-sm">{reaction.emoji} {reaction.count}</span>
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" variant="ghost" className="h-6 px-2">
                            <Smile className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-6 px-2">
                            <Reply className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-6 px-2">
                            <Star className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-6 px-2">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Camera className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="اكتب رسالة..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1"
                    dir="rtl"
                  />
                  <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Online Members Sidebar */}
          <Card className="col-span-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">الأعضاء المتصلون ({teamMembers.filter(m => m.status === 'online').length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                  <div className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{member.name}</div>
                    <div className="text-xs text-muted-foreground">{member.role}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost">
                      <MessageCircle className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Video className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Files Tab */}
      {activeTab === 'files' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>ملفات المشروع</CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="البحث في الملفات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10 w-64"
                    dir="rtl"
                  />
                </div>
                <Button className="gap-2">
                  <Upload className="h-4 w-4" />
                  رفع ملف
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {files.map((file) => (
                <Card key={file.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {getFileIcon(file.type)}
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-sm truncate">{file.name}</h3>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(file.size)} • الإصدار {file.version}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {file.is_starred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                          <Button size="sm" variant="ghost">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      {file.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">{file.description}</p>
                      )}
                      
                      {file.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {file.tags.map((tag, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>بواسطة {file.uploaded_by}</span>
                        <span>{new Date(file.uploaded_at).toLocaleDateString('ar-SA')}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="flex-1 gap-1">
                          <Download className="h-3 w-3" />
                          تحميل ({file.downloads_count})
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Tab */}
      {activeTab === 'team' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <Card key={member.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-16 h-16">
                        <AvatarFallback className="text-lg">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(member.status)}`}></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                      <p className="text-xs text-muted-foreground">{member.department}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>حمل العمل</span>
                      <span>{member.workload}%</span>
                    </div>
                    <Progress value={member.workload} className="h-2" />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-lg font-bold">{member.projects_count}</div>
                      <div className="text-xs text-muted-foreground">مشاريع</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">{member.tasks_completed}</div>
                      <div className="text-xs text-muted-foreground">مهام</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">{member.performance_score}</div>
                      <div className="text-xs text-muted-foreground">الأداء</div>
                    </div>
                  </div>

                  {member.skills.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">المهارات</h4>
                      <div className="flex flex-wrap gap-1">
                        {member.skills.map((skill, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="flex-1 gap-1">
                      <MessageSquare className="h-3 w-3" />
                      رسالة
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 gap-1">
                      <Video className="h-3 w-3" />
                      مكالمة
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>الحالة: {getStatusText(member.status)}</span>
                      <span>{member.timezone}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <Card>
          <CardHeader>
            <CardTitle>سجل النشاطات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="text-xs">
                      {activity.user_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{activity.user_name}</span>
                      <span className="text-sm text-muted-foreground">{activity.action}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{activity.details}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(activity.timestamp).toLocaleString('ar-SA')}</span>
                      <Badge variant="outline" className="text-xs">
                        {activity.type === 'task' ? 'مهمة' : 
                         activity.type === 'file' ? 'ملف' : 
                         activity.type === 'message' ? 'رسالة' : 
                         activity.type === 'meeting' ? 'اجتماع' : 'النظام'}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Member Dialog */}
      <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>إضافة عضو جديد للفريق</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="البريد الإلكتروني" />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="الدور" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="developer">مطور</SelectItem>
                <SelectItem value="designer">مصمم</SelectItem>
                <SelectItem value="manager">مدير</SelectItem>
                <SelectItem value="tester">مختبر</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowAddMemberDialog(false)}>
                إلغاء
              </Button>
              <Button onClick={() => {
                toast.success('تم إرسال دعوة العضو الجديد');
                setShowAddMemberDialog(false);
              }}>
                إرسال دعوة
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectTeamCollaboration;