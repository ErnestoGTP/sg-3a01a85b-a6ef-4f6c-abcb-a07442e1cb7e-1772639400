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
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl md:text-3xl"
  };

  const colorClasses = {
    light: "text-white",
    dark: "text-[#0B1C2D]",
    gold: "text-[#C6A75E]"
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showIcon && (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C6A75E] to-[#B8965A] flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-lg">RT</span>
        </div>
      )}
      <div className="flex flex-col">
        <span className={cn(
          "font-bold leading-none tracking-tight",
          sizeClasses[size],
          colorClasses[variant]
        )}>
          Ramitap Training
        </span>
        <span className="text-xs text-[#C6A75E] font-medium">
          Transforma tu Mente
        </span>
      </div>
    </div>
  );
}