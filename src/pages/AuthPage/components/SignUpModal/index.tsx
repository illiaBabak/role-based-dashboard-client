import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Field } from "../Field";
import { useCreateUser } from "src/api/mutations";
import { useNavigate } from "react-router-dom";

export type SignUpData = {
  login: string;
  password: string;
  role: "admin" | "user";
};

type SignUpFormFields = SignUpData & { confirmPassword: string };

type SignUpModalProps = {
  onSignInClick: () => void;
};

export const SignUpModal = ({ onSignInClick }: SignUpModalProps) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignUpFormFields, string>>
  >({});

  const navigate = useNavigate();

  const isFormValid = (): boolean => {
    const errors: Partial<Record<keyof SignUpFormFields, string>> = {};

    if (!login.trim()) errors.login = "Login is required";
    if (!password) errors.password = "Password is required";
    else if (password.length < 6)
      errors.password = "Password must be at least 6 characters";
    if (!confirmPassword)
      errors.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword)
      errors.confirmPassword = "Passwords don't match";

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const { mutateAsync: createUser, isPending, error } = useCreateUser();

  const handleSubmit = async () => {
    if (isFormValid()) {
      try {
        const response = await createUser({
          login: login.trim(),
          password,
          role,
          name: login.trim(),
        });

        if (response?.data.user) {
          navigate("/dashboard");
        }
      } catch (err) {
        console.error("Sign up failed:", err);
      }
    }
  };

  const clearError = (field: keyof SignUpFormFields) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }));

  return (
    <div
      data-testid="signup-modal"
      className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-xl max-sm:py-4 md:p-8"
    >
      <div className="mb-4 text-center md:mb-8">
        <h1
          data-testid="signup-heading"
          className="text-xl font-bold text-white md:text-3xl"
        >
          Create account
        </h1>
        <p className="mt-1 text-xs text-slate-400 md:mt-2 md:text-sm">
          Join us today
        </p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            data-testid="signup-error"
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
        className="space-y-3 md:space-y-5"
      >
        <Field
          testId="signup-login"
          label="Login"
          type="text"
          placeholder="Choose a login"
          value={login}
          error={errors.login}
          onChange={(v) => {
            setLogin(v);
            clearError("login");
          }}
        />

        <Field
          testId="signup-password"
          label="Password"
          type="password"
          placeholder="Create a password"
          value={password}
          error={errors.password}
          onChange={(v) => {
            setPassword(v);
            clearError("password");
          }}
        />

        <Field
          testId="signup-confirm-password"
          label="Confirm Password"
          type="password"
          placeholder="Repeat your password"
          value={confirmPassword}
          error={errors.confirmPassword}
          onChange={(v) => {
            setConfirmPassword(v);
            clearError("confirmPassword");
          }}
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300 md:mb-2">
            Role
          </label>
          <div
            data-testid="signup-role-picker"
            className="flex gap-1 rounded-xl border border-white/10 bg-white/5 p-1"
          >
            {(["user", "admin"] as const).map((r) => (
              <button
                key={r}
                data-testid={`signup-role-${r}`}
                type="button"
                onClick={() => setRole(r)}
                className={`relative flex-1 cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition-colors md:px-4 md:py-2.5 ${
                  role === r
                    ? "text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {role === r && (
                  <motion.span
                    layoutId="role-indicator"
                    className="absolute inset-0 rounded-lg bg-indigo-600 shadow-lg"
                    transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                  />
                )}
                <span className="relative z-10 capitalize">{r}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          data-testid="signup-submit"
          type="submit"
          disabled={isPending}
          className="w-full cursor-pointer rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 md:py-3 md:text-base"
        >
          {isPending ? "Creating account…" : "Create Account"}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-slate-400 md:mt-6 md:text-sm">
        Already have an account?{" "}
        <button
          data-testid="signup-to-signin"
          type="button"
          onClick={onSignInClick}
          className="cursor-pointer font-medium text-indigo-400 transition-colors hover:text-indigo-300"
        >
          Sign In
        </button>
      </p>
    </div>
  );
};
