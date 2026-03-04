import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "light" | "dark" | "gold";
  size?: "sm" | "md" | "lg";
  className?: string;
  showIcon?: boolean;
}

export function Logo({ 
  variant = "light", 
  size = "md", 
  className,
  showIcon = true 
}: LogoProps) {
  const sizeClasses = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl"
  };

  const iconSizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg"
  };

  const colorClasses = {
    light: "text-white",
    dark: "text-[#0B1C2D]",
    gold: "text-[#C6A75E]"
  };

  return (
    <div className={cn("flex flex-row items-center gap-3", className)}>
      {showIcon && (
        <div className={cn(
          "rounded-full bg-gradient-to-br from-[#C6A75E] to-[#B8965A] flex items-center justify-center shadow-lg flex-shrink-0",
          iconSizeClasses[size]
        )}>
          <span className="text-white font-bold">RT</span>
        </div>
      )}
      <div className="flex flex-col leading-tight">
        <span className={cn(
          "font-bold tracking-tight whitespace-nowrap",
          sizeClasses[size],
          colorClasses[variant]
        )}>
          Ramitap Training
        </span>
        <span className="text-xs text-[#C6A75E] font-medium whitespace-nowrap">
          Transforma tu Mente
        </span>
      </div>
    </div>
  );
}