import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";

export const NotFoundPage = () => {
  const [seconds, setSeconds] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (seconds === 0) navigate("/", { replace: true });
  }, [seconds, navigate]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4">
      <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-[8rem] font-black leading-none tracking-tighter text-white/90"
        >
          404
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mt-4 text-lg text-slate-400"
        >
          Page not found
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-2 text-sm text-slate-500"
        >
          Redirecting in {seconds}s…
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mt-8"
        >
          <Link
            to="/"
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-500 active:scale-[0.98]"
          >
            Go home
          </Link>
        </motion.div>
      </div>
    </div>
  );
};
