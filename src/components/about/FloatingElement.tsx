import { LucideIcon } from 'lucide-react';

interface FloatingElementProps {
  icon: LucideIcon;
  color: string;
  className?: string;
  size?: number;
}

const FloatingElement = ({ 
  icon: Icon, 
  color, 
  className = "", 
  size = 6 
}: FloatingElementProps) => {
  return (
    <div className={`absolute ${className} shadow-lg flex items-center justify-center`}>
      <div className={`${color} rounded-2xl p-4`}>
        <Icon className={`w-${size} h-${size}`} />
      </div>
    </div>
  );
};

export default FloatingElement;