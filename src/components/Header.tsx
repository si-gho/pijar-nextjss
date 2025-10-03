import { Bell, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface HeaderProps {
  title?: string;
}

export const Header = ({ title = "Pijar Pro" }: HeaderProps) => {
  return (
    <header className="bg-gradient-primary text-primary-foreground px-4 py-5 shadow-lg relative overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      </div>
      
      <div className="flex items-center justify-between max-w-md mx-auto relative z-10">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight">{title}</h1>
          <p className="text-xs text-primary-foreground/80 mt-0.5 font-medium">
            Kabupaten Labuhanbatu Selatan
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-primary-foreground hover:bg-white/20 transition-colors relative"
            >
              <Bell className="h-5 w-5" />
            </Button>
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-danger text-danger-foreground text-xs border-2 border-primary">
              3
            </Badge>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-primary-foreground hover:bg-white/20 transition-colors"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};