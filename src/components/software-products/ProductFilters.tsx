import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

interface ProductFiltersProps {
  categories: Array<{
    name: string;
    emoji: string;
    count: number;
  }>;
  selectedCategory: string;
  searchTerm: string;
  onCategoryChange: (category: string) => void;
  onSearchChange: (search: string) => void;
}

export const ProductFilters = ({ 
  categories, 
  selectedCategory, 
  searchTerm, 
  onCategoryChange, 
  onSearchChange 
}: ProductFiltersProps) => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 items-center justify-between bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-8 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-2xl">
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <Button
            key={category.name}
            variant={selectedCategory === category.name ? "default" : "outline"}
            onClick={() => onCategoryChange(category.name)}
            className={`rounded-2xl text-base px-6 py-3 font-bold transition-all duration-300 ${selectedCategory === category.name 
              ? "bg-gradient-to-r from-primary via-blue-600 to-purple-600 shadow-2xl text-white transform scale-105" 
              : "hover:bg-gradient-to-r hover:from-primary/10 hover:to-blue-500/10 hover:scale-105"
            }`}
          >
            <span className="text-lg mr-2">{category.emoji}</span>
            {category.name}
            <Badge variant="secondary" className="mr-2 bg-white/20 text-current">
              {category.count}
            </Badge>
          </Button>
        ))}
      </div>
      <div className="relative">
        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 animate-pulse" />
        <input
          type="text"
          placeholder="🔍 البحث في المنتجات الحصرية..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-6 pr-12 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary text-base font-medium min-w-80 transition-all duration-300"
        />
      </div>
    </div>
  );
};