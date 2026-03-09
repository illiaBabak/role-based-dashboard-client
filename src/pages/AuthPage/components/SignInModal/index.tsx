import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Field } from "../Field";
import { useSignIn } from "src/api/mutations";
import { useNavigate } from "react-router-dom";

export type SignInData = {
  login: string;
  password: string;
};

type SignInModalProps = {
  onSignUpClick: () => void;
};

export const SignInModal = ({ onSignUpClick }: SignInModalProps) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignInData, string>>
  >({});

  const navigate = useNavigate();

  const { mutateAsync: signIn, isPending, error } = useSignIn();

  const isFormValid = (): boolean => {
    const errors: Partial<Record<keyof SignInData, string>> = {};

    if (!login.trim()) errors.login = "Login is required";
    if (!password) errors.password = "Password is required";

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (isFormValid()) {
      const response = await signIn({ login: login.trim(), password });

      if (response?.data.user) {
        navigate("/dashboard");
      }
    }
  };

  const clearError = (field: keyof SignInData) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }));

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-400">Sign in to your account</p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="overflow-hidden rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
          >
            {error.message}
          </motion.div>
        )}
      </AnimatePresence>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-5"
      >
        <Field
          label="Login"
          type="text"
          placeholder="Enter your login"
          value={login}
          error={errors.login}
          onChange={(v) => {
            setLogin(v);
            clearError("login");
          }}
        />

        <Field
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          error={errors.password}
          onChange={(v) => {
            setPassword(v);
            clearError("password");
          }}
        />

        <button
          type="submit"
          disabled={isPending}
          className="w-full cursor-pointer rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition-all hover:bg-indigo-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={onSignUpClick}
          className="cursor-pointer font-medium text-indigo-400 transition-colors hover:text-indigo-300"
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};
