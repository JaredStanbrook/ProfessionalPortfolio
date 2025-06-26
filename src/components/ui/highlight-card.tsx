import * as React from "react";
import { cn } from "@/lib/utils";

type HighlightCardSize = "small" | "wide" | "long" | "big";

interface HighlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: HighlightCardSize;
}

const sizeClasses: Record<HighlightCardSize, string> = {
  small: "md:col-span-1 row-span-1",
  wide: "md:col-span-2 row-span-1",
  long: "md:col-span-1 row-span-2",
  big: "md:col-span-2 row-span-2",
};

const HighlightCard = React.forwardRef<HTMLDivElement, HighlightCardProps>(
  ({ className, size = "small", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col overflow-hidden transition-all border-2 rounded-lg cursor-pointer bg-background hover:border-primary border-border",
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
);
HighlightCard.displayName = "HighlightCard";

export { HighlightCard };
