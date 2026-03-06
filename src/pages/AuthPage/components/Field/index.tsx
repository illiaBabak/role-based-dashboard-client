import { AnimatePresence, motion } from "motion/react";

type FieldProps = {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
};

export const Field = ({
  label,
  type,
  placeholder,
  value,
  error,
  onChange,
}: FieldProps) => (
  <div>
    <label className="mb-1.5 block text-sm font-medium text-slate-300">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-white outline-none transition-all placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/20 ${
        error
          ? "border-red-500/50 focus:border-red-500/50"
          : "border-white/10 focus:border-indigo-500/50"
      }`}
    />
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-1.5 overflow-hidden text-xs text-red-400"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);
