import { useState, useEffect } from "react";
import { Search, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const MobileSearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results or filter content
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setIsOpen(false);
      setSearchQuery("");
    }
  };

  const searchSuggestions = [
    "تصميم مواقع",
    "هوية بصرية", 
    "تسويق رقمي",
    "متجر إلكتروني",
    "تطبيقات جوال"
  ];

  return (
    <>
      {/* Install App Prompt - Mobile Only */}
      {showInstallPrompt && (
        <div className="fixed top-4 left-4 right-4 z-50 md:hidden">
          <div className="bg-gradient-to-r from-primary to-accent text-white p-4 rounded-xl shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5" />
                <div>
                  <p className="font-bold text-sm">تثبيت التطبيق</p>
                  <p className="text-xs opacity-90">للوصول السريع والسهل</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleInstallApp}
                  className="text-white hover:bg-white/20 text-xs px-3 py-1"
                >
                  تثبيت
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowInstallPrompt(false)}
                  className="text-white hover:bg-white/20 p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Button - Mobile Only */}
      <div className="md:hidden">
        <Button
          onClick={() => setIsOpen(true)}
          size="sm"
          className="fixed bottom-20 left-4 z-40 bg-gradient-to-r from-primary to-accent shadow-2xl hover:shadow-glow rounded-full w-12 h-12 p-0"
        >
          <Search className="w-5 h-5 text-white" />
        </Button>
      </div>

      {/* Search Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 md:hidden animate-fade-in">
          <div className="bg-background h-full pt-safe">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold">البحث</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="p-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Search Form */}
            <div className="p-4">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن الخدمات، العروض، أو المقالات..."
                    className="pl-4 pr-10 h-12 text-right"
                    autoFocus
                  />
                </div>
                <Button type="submit" className="w-full h-12">
                  البحث
                </Button>
              </form>

              {/* Search Suggestions */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  اقتراحات البحث
                </h3>
                <div className="space-y-2">
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchQuery(suggestion);
                        handleSearch(new Event('submit') as any);
                      }}
                      className="w-full text-right p-3 bg-muted/50 hover:bg-muted transition-colors rounded-lg text-sm"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  روابط سريعة
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigate('/current-offers');
                      setIsOpen(false);
                    }}
                    className="h-12 text-sm"
                  >
                    العروض الحالية
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigate('/contact');
                      setIsOpen(false);
                    }}
                    className="h-12 text-sm"
                  >
                    تواصل معنا
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigate('/about');
                      setIsOpen(false);
                    }}
                    className="h-12 text-sm"
                  >
                    من نحن
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigate('/careers');
                      setIsOpen(false);
                    }}
                    className="h-12 text-sm"
                  >
                    الوظائف
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileSearchBar;