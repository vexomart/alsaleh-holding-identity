import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  ArrowLeft,
  User,
  Briefcase,
  FileText,
  Upload,
  Mail
} from "lucide-react";

interface StepProps {
  currentStep: number;
  onStepChange: (step: number) => void;
}

const steps = [
  { 
    id: 1, 
    title: "البيانات الشخصية", 
    icon: User,
    description: "المعلومات الأساسية"
  },
  { 
    id: 2, 
    title: "بيانات الوظيفة", 
    icon: Briefcase,
    description: "المنصب والخبرة"
  },
  { 
    id: 3, 
    title: "السيرة الذاتية", 
    icon: Upload,
    description: "رفع الملفات"
  },
  { 
    id: 4, 
    title: "رسالة تعريفية", 
    icon: FileText,
    description: "اللمسة الأخيرة"
  },
  { 
    id: 5, 
    title: "المراجعة والإرسال", 
    icon: Mail,
    description: "التأكيد النهائي"
  }
];

export const JobApplicationSteps = ({ currentStep, onStepChange }: StepProps) => {
  const progress = (currentStep / steps.length) * 100;

  return (
    <Card className="border-0 shadow-elegant bg-gradient-to-r from-blue-50 to-purple-50 mb-8">
      <CardHeader className="pb-4">
        <CardTitle className="text-center text-2xl font-bold text-primary mb-4">
          مراحل التقديم
        </CardTitle>
        <Progress value={progress} className="h-3 bg-gray-200">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </Progress>
        <p className="text-center text-sm text-muted-foreground mt-2">
          المرحلة {currentStep} من {steps.length}
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const isClickable = step.id <= currentStep;
            
            return (
              <div key={step.id} className="flex flex-col items-center">
                <button
                  onClick={() => isClickable && onStepChange(step.id)}
                  disabled={!isClickable}
                  className={`
                    relative flex items-center justify-center w-16 h-16 rounded-full mb-2 transition-all duration-300
                    ${isCompleted 
                      ? 'bg-green-500 text-white shadow-lg transform scale-110' 
                      : isCurrent 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-xl animate-pulse transform scale-110' 
                        : isClickable
                          ? 'bg-gray-200 text-gray-600 hover:bg-gray-300 cursor-pointer'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-8 h-8" />
                  ) : (
                    <IconComponent className="w-8 h-8" />
                  )}
                  
                  {/* Step number indicator */}
                  <div className={`
                    absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                    ${isCompleted 
                      ? 'bg-green-600 text-white' 
                      : isCurrent 
                        ? 'bg-yellow-400 text-yellow-900 animate-pulse' 
                        : 'bg-gray-300 text-gray-600'
                    }
                  `}>
                    {step.id}
                  </div>
                </button>
                
                <div className="text-center max-w-24">
                  <h3 className={`
                    text-sm font-semibold mb-1 transition-colors
                    ${isCurrent ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-gray-600'}
                  `}>
                    {step.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className={`
                    hidden md:block absolute top-8 right-24 w-16 h-0.5 transition-colors duration-300
                    ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}
                  `} />
                )}
              </div>
            );
          })}
        </div>
        
        {/* Navigation buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={() => onStepChange(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            السابق
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {steps[currentStep - 1]?.title}
            </p>
          </div>
          
          <Button
            onClick={() => onStepChange(Math.min(steps.length, currentStep + 1))}
            disabled={currentStep === steps.length}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            التالي
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};