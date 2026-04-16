import React, { ReactNode } from "react";

interface StatCardProps {
  title?: string;
  label?: string; // Alias for title
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  iconColor?: string;
  className?: string;
  color?: string; // Optional background color class
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  label,
  value,
  subtitle,
  icon,
  iconColor = "text-[#ECA468]",
  className = "",
  color,
}) => {
  const displayTitle = title || label;
  const bgClass = color ? `${color}` : "bg-[#fff8ea]/60 backdrop-blur-md";

  return (
    <div
      className={`${bgClass} rounded-2xl p-6 shadow-sm border border-[#ECA468]/10 flex flex-col justify-between transition-all hover:shadow-md hover:-translate-y-1 ${className}`}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500">{displayTitle}</h3>
        <div className={`${iconColor} opacity-80`}>{icon}</div>
      </div>
      <div>
        <div className="text-2xl font-black text-gray-900 leading-none mb-1">{value}</div>
        {subtitle && <p className="text-[10px] font-bold text-[#D0864B] uppercase tracking-wide">{subtitle}</p>}
      </div>
    </div>
  );
};

export default StatCard;
