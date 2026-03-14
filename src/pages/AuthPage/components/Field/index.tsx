import { AnimatePresence, motion } from "motion/react";

type FieldProps = {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  testId?: string;
};

export const Field = ({
  label,
  type,
  placeholder,
  value,
  error,
  onChange,
  autoComplete,
  testId,
}: FieldProps) => (
  <div>
    <label className="mb-1 block text-xs font-medium text-slate-300 md:mb-1.5 md:text-sm">
      {label}
    </label>
    <input
      data-testid={testId}
      autoComplete={autoComplete ?? "off"}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full rounded-xl border bg-white/5 px-3 py-2 text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/20 md:px-4 md:py-3 md:text-base ${
        error
          ? "border-red-500/50 focus:border-red-500/50"
          : "border-white/10 focus:border-indigo-500/50"
      }`}
    />
    <AnimatePresence>
      {error && (
        <motion.p
          data-testid={testId ? `${testId}-error` : undefined}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-1 overflow-hidden text-xs text-red-400 md:mt-1.5"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);
