import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  features?: string[];
  price?: string;
  badge?: string;
  className?: string;
  onClick?: () => void;
}

export function ServiceCard({ 
  title, 
  description, 
  icon: Icon, 
  features = [], 
  price, 
  badge,
  className,
  onClick 
}: ServiceCardProps) {
  return (
    <Card className={cn(
      "group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover-scale",
      "bg-white/80 backdrop-blur-sm",
      className
    )}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <CardHeader className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-full bg-gradient-to-br from-primary/10 to-blue-600/10 group-hover:from-primary/20 group-hover:to-blue-600/20 transition-colors">
            <Icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
          </div>
          {badge && (
            <Badge variant="secondary" className="bg-gradient-to-r from-primary/10 to-blue-600/10 text-primary">
              {badge}
            </Badge>
          )}
        </div>
        
        <CardTitle className="text-xl group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="relative space-y-4">
        {features.length > 0 && (
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mr-3"></div>
                {feature}
              </li>
            ))}
          </ul>
        )}
        
        <div className="flex items-center justify-between pt-4">
          {price && (
            <div className="text-2xl font-bold text-primary">
              {price}
            </div>
          )}
          
          <Button 
            onClick={onClick}
            className="mr-auto bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
          >
            اطلب الآن
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}