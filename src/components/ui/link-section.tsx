import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { Badge } from "./badge";

interface LinkItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  onClick?: (e: React.MouseEvent) => void;
}

interface LinkSectionProps {
  title: string;
  icon: LucideIcon;
  links: LinkItem[];
  limit?: number;
}

export function LinkSection({ title, icon: Icon, links, limit }: LinkSectionProps) {
  const displayLinks = limit ? links.slice(0, limit) : links;
  
  return (
    <div>
      <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <Icon className="w-5 h-5" />
        {title}
      </h4>
      <ul className="space-y-3">
        {displayLinks.map((link, index) => {
          const LinkIcon = link.icon;
          return (
            <li key={index}>
              <a 
                href={link.href} 
                className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-200 group"
                onClick={link.onClick}
              >
                <LinkIcon className="w-4 h-4 group-hover:text-white transition-colors duration-200" />
                <span>{link.name}</span>
                {link.badge && (
                  <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                    {link.badge}
                  </Badge>
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}