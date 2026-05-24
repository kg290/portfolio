import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export default function ShinyButton({
  children,
  className,
  shimmerColor = "#ffffff",
  shimmerSize = "0.05em",
  shimmerDuration = "3s",
  borderRadius = "100px",
  background = "linear-gradient(110deg, #000103, 45%, #1e2631, 55%, #000103)",
  ...props
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative inline-flex h-12 items-center justify-center overflow-hidden border border-white/10 px-8 font-medium text-white transition-colors",
        className
      )}
      style={{
        borderRadius,
        background,
        backgroundSize: "200% 100%",
        animation: `shimmer ${shimmerDuration} linear infinite`,
      }}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
      <span
        className="absolute inset-0 overflow-hidden rounded-[inherit]"
        style={{ padding: shimmerSize }}
      >
        <span
          className="absolute inset-[-100%] animate-shimmer"
          style={{
            background: `conic-gradient(from 90deg at 50% 50%, transparent 0%, ${shimmerColor} 20%, transparent 40%)`,
          }}
        />
      </span>
    </motion.button>
  );
}

export function GlowButton({
  children,
  className,
  glowColor = "#6366f1",
  ...props
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative inline-flex h-12 items-center justify-center rounded-full px-8 font-semibold text-white transition-all",
        "bg-gradient-to-r from-primary to-secondary",
        "before:absolute before:-inset-1 before:rounded-full before:bg-gradient-to-r before:from-primary before:to-secondary before:opacity-0 before:blur-xl before:transition-opacity hover:before:opacity-70",
        className
      )}
      style={{
        boxShadow: `0 0 20px ${glowColor}40`,
      }}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

export function OutlineButton({
  children,
  className,
  ...props
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-8 font-medium text-white transition-all",
        "hover:border-white/40 hover:bg-white/5",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function AnimatedButton({
  children,
  className,
  ...props
}) {
  return (
    <motion.button
      className={cn(
        "group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-primary px-10 font-semibold text-white",
        className
      )}
      whileHover="hover"
      whileTap="tap"
      variants={{
        hover: { scale: 1.02 },
        tap: { scale: 0.98 },
      }}
      {...props}
    >
      <motion.span
        className="relative z-10 flex items-center gap-2"
        variants={{
          hover: { y: 0 },
        }}
      >
        {children}
      </motion.span>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%]"
        variants={{
          hover: { backgroundPosition: "100% 0" },
        }}
        initial={{ backgroundPosition: "0% 0" }}
        transition={{ duration: 0.5 }}
      />
    </motion.button>
  );
}
