import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const avatarVariants = cva("rounded-full bg-muted shrink-0 overflow-hidden", {
  variants: {
    size: {
      xs: "w-6 h-6",
      sm: "w-8 h-8",
      md: "w-16 h-16",
      lg: "w-24 h-24",
    },
  },
  defaultVariants: {
    size: "sm",
  },
});

interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
}

export function Avatar({ className, size, src, alt, ...props }: AvatarProps) {
  return (
    <div className={cn(avatarVariants({ size, className }))} {...props}>
      {src ? (
        <img src={src} alt={alt ?? ""} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-muted" />
      )}
    </div>
  );
}
