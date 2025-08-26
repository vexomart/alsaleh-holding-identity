import { useCallback, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  MarkerType,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import SEO from "@/components/SEO";
import { PageLayout } from "@/components/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  Globe, 
  Shield, 
  Cloud, 
  Brain, 
  Database, 
  Smartphone, 
  Cog, 
  Monitor, 
  Server,
  Users,
  BarChart,
  Lock,
  Wifi
} from "lucide-react";

// مكونات العقد المخصصة
function TechServiceNode({ data }: { data: any }) {
  const IconComponent = data.icon;
  
  return (
    <div className={`tech-node ${data.type}`}>
      <div className="tech-node-icon">
        <IconComponent className="w-6 h-6" />
      </div>
      <div className="tech-node-title">{data.label}</div>
      <div className="tech-node-description">{data.description}</div>
    </div>
  );
}

function CoreServiceNode({ data }: { data: any }) {
  const IconComponent = data.icon;
  
  return (
    <div className="core-node">
      <div className="core-node-icon">
        <IconComponent className="w-8 h-8" />
      </div>
      <div className="core-node-title">{data.label}</div>
      <div className="core-node-badge">خدمة أساسية</div>
    </div>
  );
}

const nodeTypes = {
  techService: TechServiceNode,
  coreService: CoreServiceNode,
};

// تعريف العقد الأولية
const initialNodes: Node[] = [
  // العقدة المركزية
  {
    id: 'center',
    type: 'coreService',
    position: { x: 400, y: 300 },
    data: {
      label: 'علي الشهري القابضة',
      icon: Zap,
    },
    style: { zIndex: 10 },
  },
  
  // خدمات الذكاء الاصطناعي
  {
    id: 'ai-solutions',
    type: 'techService',
    position: { x: 100, y: 100 },
    data: {
      label: 'حلول الذكاء الاصطناعي',
      description: 'تطوير واستخدام تقنيات الذكاء الاصطناعي',
      icon: Brain,
      type: 'ai'
    },
  },
  
  // الحوسبة السحابية
  {
    id: 'cloud-solutions',
    type: 'techService',
    position: { x: 700, y: 100 },
    data: {
      label: 'الحوسبة السحابية',
      description: 'خدمات البنية التحتية السحابية',
      icon: Cloud,
      type: 'cloud'
    },
  },
  
  // الأمن السيبراني
  {
    id: 'security',
    type: 'techService',
    position: { x: 100, y: 500 },
    data: {
      label: 'الأمن السيبراني',
      description: 'حماية البيانات والأنظمة',
      icon: Shield,
      type: 'security'
    },
  },
  
  // إنترنت الأشياء
  {
    id: 'iot',
    type: 'techService',
    position: { x: 700, y: 500 },
    data: {
      label: 'إنترنت الأشياء',
      description: 'ربط الأجهزة الذكية',
      icon: Wifi,
      type: 'iot'
    },
  },
  
  // قواعد البيانات
  {
    id: 'database',
    type: 'techService',
    position: { x: 250, y: 200 },
    data: {
      label: 'إدارة البيانات',
      description: 'قواعد البيانات والتحليلات',
      icon: Database,
      type: 'data'
    },
  },
  
  // التطبيقات المحمولة
  {
    id: 'mobile',
    type: 'techService',
    position: { x: 550, y: 200 },
    data: {
      label: 'التطبيقات المحمولة',
      description: 'تطوير تطبيقات الهواتف الذكية',
      icon: Smartphone,
      type: 'mobile'
    },
  },
  
  // الأتمتة
  {
    id: 'automation',
    type: 'techService',
    position: { x: 250, y: 400 },
    data: {
      label: 'الأتمتة الذكية',
      description: 'أتمتة العمليات والمهام',
      icon: Cog,
      type: 'automation'
    },
  },
  
  // التحليلات
  {
    id: 'analytics',
    type: 'techService',
    position: { x: 550, y: 400 },
    data: {
      label: 'التحليلات المتقدمة',
      description: 'تحليل البيانات واستخراج الرؤى',
      icon: BarChart,
      type: 'analytics'
    },
  },
];

// تعريف الحواف الأولية
const initialEdges: Edge[] = [
  // ربط العقدة المركزية بجميع الخدمات
  {
    id: 'center-ai',
    source: 'center',
    target: 'ai-solutions',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#3b82f6', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
  },
  {
    id: 'center-cloud',
    source: 'center',
    target: 'cloud-solutions',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#10b981', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
  },
  {
    id: 'center-security',
    source: 'center',
    target: 'security',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#f59e0b', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' },
  },
  {
    id: 'center-iot',
    source: 'center',
    target: 'iot',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#8b5cf6', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' },
  },
  {
    id: 'center-database',
    source: 'center',
    target: 'database',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#ef4444', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' },
  },
  {
    id: 'center-mobile',
    source: 'center',
    target: 'mobile',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#06b6d4', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#06b6d4' },
  },
  {
    id: 'center-automation',
    source: 'center',
    target: 'automation',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#84cc16', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#84cc16' },
  },
  {
    id: 'center-analytics',
    source: 'center',
    target: 'analytics',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#f97316', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#f97316' },
  },
  
  // روابط بين الخدمات
  {
    id: 'ai-data',
    source: 'ai-solutions',
    target: 'database',
    type: 'smoothstep',
    style: { stroke: '#6b7280', strokeWidth: 1 },
  },
  {
    id: 'cloud-security',
    source: 'cloud-solutions',
    target: 'security',
    type: 'smoothstep',
    style: { stroke: '#6b7280', strokeWidth: 1 },
  },
  {
    id: 'mobile-analytics',
    source: 'mobile',
    target: 'analytics',
    type: 'smoothstep',
    style: { stroke: '#6b7280', strokeWidth: 1 },
  },
  {
    id: 'iot-automation',
    source: 'iot',
    target: 'automation',
    type: 'smoothstep',
    style: { stroke: '#6b7280', strokeWidth: 1 },
  },
];

export default function TechEcosystem() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id);
  }, []);

  const title = "المنظومة التقنية المتكاملة | علي الشهري القابضة";
  const description = "استكشف منظومتنا التقنية المتكاملة وكيفية تفاعل خدماتنا المختلفة لتقديم حلول شاملة ومبتكرة.";

  return (
    <PageLayout>
      <SEO
        title={title}
        description={description}
        canonicalUrl={typeof window !== "undefined" ? `${window.location.origin}/tech-ecosystem` : "/tech-ecosystem"}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "المنظومة التقنية المتكاملة",
          description: description,
          inLanguage: "ar"
        }}
      />

      <div className="tech-ecosystem-page">
        {/* Header */}
        <header className="container-fluid py-12 text-center">
          <Badge variant="secondary" className="mb-4">التقنية والابتكار</Badge>
          <h1 className="text-responsive-3xl font-extrabold tracking-tight text-gradient-primary mb-4">
            المنظومة التقنية المتكاملة
          </h1>
          <p className="text-responsive-base text-muted-foreground max-w-3xl mx-auto">
            استكشف كيفية تفاعل جميع خدماتنا التقنية معًا لتكوين منظومة متكاملة تقدم حلولاً شاملة ومبتكرة لعملائنا
          </p>
        </header>

        {/* Interactive Flow */}
        <section className="container-fluid mb-12">
          <Card className="shadow-corporate">
            <CardHeader>
              <CardTitle className="text-responsive-xl text-center">
                الرسم البياني التفاعلي للمنظومة
              </CardTitle>
              <CardDescription className="text-center">
                انقر على أي خدمة لاستكشاف تفاصيلها وعلاقاتها مع الخدمات الأخرى
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[600px] border rounded-lg overflow-hidden">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onNodeClick={onNodeClick}
                  nodeTypes={nodeTypes}
                  fitView
                  attributionPosition="top-right"
                  style={{ backgroundColor: "#f8fafc" }}
                >
                  <MiniMap 
                    zoomable 
                    pannable 
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                    }}
                  />
                  <Controls />
                  <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
                </ReactFlow>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Services Grid */}
        <section className="container-fluid spacing-responsive">
          <h2 className="text-responsive-2xl font-bold text-center mb-8">
            مكونات المنظومة التقنية
          </h2>
          <div className="grid-responsive-1-2-3 gap-6">
            {[
              { icon: Brain, title: "الذكاء الاصطناعي", description: "تطوير حلول ذكية باستخدام خوارزميات التعلم الآلي والشبكات العصبية" },
              { icon: Cloud, title: "الحوسبة السحابية", description: "خدمات البنية التحتية السحابية والتخزين والحوسبة عالية الأداء" },
              { icon: Shield, title: "الأمن السيبراني", description: "حماية البيانات والأنظمة من التهديدات والهجمات السيبرانية" },
              { icon: Wifi, title: "إنترنت الأشياء", description: "ربط الأجهزة والمعدات الذكية لتكوين شبكة متصلة" },
              { icon: Database, title: "إدارة البيانات", description: "تخزين وتنظيم وتحليل البيانات الضخمة بكفاءة عالية" },
              { icon: Smartphone, title: "التطبيقات المحمولة", description: "تطوير تطبيقات الهواتف الذكية والأجهزة اللوحية" },
              { icon: Cog, title: "الأتمتة الذكية", description: "أتمتة العمليات والمهام لتحسين الكفاءة والدقة" },
              { icon: BarChart, title: "التحليلات المتقدمة", description: "استخراج الرؤى والمعلومات القيمة من البيانات" },
            ].map((service, index) => (
              <Card key={index} className="hover-scale">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <service.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Integration Benefits */}
        <section className="container-fluid py-16 bg-muted/30 rounded-2xl">
          <div className="text-center mb-12">
            <h2 className="text-responsive-2xl font-bold mb-4">
              فوائد التكامل التقني
            </h2>
            <p className="text-responsive-base text-muted-foreground max-w-2xl mx-auto">
              من خلال ربط جميع خدماتنا في منظومة واحدة، نحقق فوائد لا تُحصى لعملائنا
            </p>
          </div>
          
          <div className="grid-responsive-1-2 gap-8">
            {[
              {
                icon: Zap,
                title: "كفاءة عالية",
                description: "تقليل الوقت والجهد من خلال التشغيل الآلي والتكامل السلس"
              },
              {
                icon: Users,
                title: "تجربة موحدة",
                description: "واجهة موحدة للوصول لجميع الخدمات والحلول التقنية"
              },
              {
                icon: Lock,
                title: "أمان متقدم",
                description: "حماية شاملة على جميع مستويات المنظومة التقنية"
              },
              {
                icon: BarChart,
                title: "رؤى عميقة",
                description: "تحليلات شاملة وتقارير مفصلة لاتخاذ قرارات مدروسة"
              }
            ].map((benefit, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <benefit.icon className="w-8 h-8 text-primary" />
                    <CardTitle>{benefit.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container-fluid py-16 text-center">
          <h2 className="text-responsive-2xl font-bold mb-4">
            ابدأ رحلتك التقنية معنا
          </h2>
          <p className="text-responsive-base text-muted-foreground mb-8 max-w-2xl mx-auto">
            اكتشف كيف يمكن لمنظومتنا التقنية المتكاملة أن تحول أعمالك وتحقق أهدافك
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <a href="/contact">تواصل معنا</a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="/services">استكشف خدماتنا</a>
            </Button>
          </div>
        </section>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .tech-ecosystem-page .react-flow__viewport {
          direction: ltr;
        }
        
        .tech-node {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px;
          text-align: center;
          min-width: 160px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .tech-node.ai {
          border-color: #3b82f6;
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
        }
        
        .tech-node.cloud {
          border-color: #10b981;
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
        }
        
        .tech-node.security {
          border-color: #f59e0b;
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
        }
        
        .tech-node.iot {
          border-color: #8b5cf6;
          background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
        }
        
        .tech-node.data {
          border-color: #ef4444;
          background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%);
        }
        
        .tech-node.mobile {
          border-color: #06b6d4;
          background: linear-gradient(135deg, #cffafe 0%, #a5f3fc 100%);
        }
        
        .tech-node.automation {
          border-color: #84cc16;
          background: linear-gradient(135deg, #ecfccb 0%, #d9f99d 100%);
        }
        
        .tech-node.analytics {
          border-color: #f97316;
          background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%);
        }
        
        .tech-node-icon {
          display: flex;
          justify-content: center;
          margin-bottom: 8px;
        }
        
        .tech-node-title {
          font-weight: bold;
          font-size: 14px;
          margin-bottom: 4px;
          color: #1f2937;
        }
        
        .tech-node-description {
          font-size: 12px;
          color: #6b7280;
          line-height: 1.3;
        }
        
        .core-node {
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white;
          border: none;
          border-radius: 16px;
          padding: 24px;
          text-align: center;
          min-width: 200px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        .core-node-icon {
          display: flex;
          justify-content: center;
          margin-bottom: 12px;
        }
        
        .core-node-title {
          font-weight: bold;
          font-size: 16px;
          margin-bottom: 8px;
        }
        
        .core-node-badge {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          padding: 4px 8px;
          font-size: 12px;
          display: inline-block;
        }
        
        .react-flow__edge.react-flow__edge-smoothstep {
          stroke-width: 2px;
        }
        
        .react-flow__controls {
          direction: ltr;
        }
        
        .react-flow__minimap {
          direction: ltr;
        }
      `}} />
    </PageLayout>
  );
}