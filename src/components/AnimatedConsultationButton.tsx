import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageCircle, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const AnimatedConsultationButton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Link to="/consultation">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          {/* Animated Background Glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 rounded-full blur-xl opacity-70"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Main Button */}
          <Button 
            size="lg"
            className="relative bg-gradient-to-r from-orange-500 via-pink-600 to-purple-700 hover:from-orange-600 hover:via-pink-700 hover:to-purple-800 text-white font-bold px-6 py-4 rounded-full shadow-2xl border-2 border-white/20 backdrop-blur-sm"
          >
            {/* Floating Sparkles */}
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{
                y: [-5, 5, -5],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
            </motion.div>
            
            <motion.div
              className="absolute -bottom-2 -left-2"
              animate={{
                y: [5, -5, 5],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            >
              <Sparkles className="w-3 h-3 text-blue-300" />
            </motion.div>

            {/* Button Content */}
            <div className="flex items-center gap-3">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <MessageCircle className="w-6 h-6" />
              </motion.div>
              
              <span className="text-lg font-bold">استشارة مجانية</span>
              
              <motion.div
                animate={{
                  x: [0, 5, 0],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </div>
            
            {/* Pulse Effect */}
            <motion.div
              className="absolute inset-0 bg-white rounded-full opacity-20"
              animate={{
                scale: [0, 1.5],
                opacity: [0.3, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          </Button>
          
          {/* Notification Badge */}
          <motion.div
            className="absolute -top-2 -left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [-5, 5, -5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            مجاناً
          </motion.div>
        </motion.div>
      </Link>
    </motion.div>
  );
};