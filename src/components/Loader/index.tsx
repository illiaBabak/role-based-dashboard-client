import { motion } from "motion/react";

const dots = Array.from({ length: 8 });

export const Loader = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative h-12 w-12">
        {dots.map((_, i) => {
          const angle = (360 / dots.length) * i;
          const delay = (i / dots.length) * 0.8;

          return (
            <motion.span
              key={i}
              className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-indigo-500"
              style={{ transformOrigin: "50% 24px", rotate: `${angle}deg` }}
              animate={{ opacity: [1, 0.2, 1], scale: [1, 0.6, 1] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
