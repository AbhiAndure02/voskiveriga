import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  color?: 'blue' | 'emerald' | 'purple' | 'yellow' | 'pink';
}

const FeatureCard = ({ icon, title, description, color = 'blue' }: FeatureCardProps) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    pink: 'bg-pink-100 text-pink-600'
  };

  return (
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 ${colorClasses[color]} rounded-xl flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-gray-800">{title}</h4>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;