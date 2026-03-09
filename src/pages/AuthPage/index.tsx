import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SignInModal } from "./components/SignInModal";
import { SignUpModal } from "./components/SignUpModal";
import { useGetUser } from "src/api/queries";
import { useNavigate } from "react-router-dom";

type AuthMode = "signIn" | "signUp";

export const AuthPage = () => {
  const navigate = useNavigate();

  const [mode, setMode] = useState<AuthMode>("signIn");

  const { data: user, isLoading: isLoadingUser } = useGetUser();

  useEffect(() => {
    if (isLoadingUser) return;

    if (user?.data.user) navigate("/dashboard");
  }, [user, isLoadingUser, navigate]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4">
      <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative w-full max-w-md">
        <AnimatePresence mode="wait">
          {mode === "signIn" ? (
            <motion.div
              key="signIn"
              initial={{ opacity: 0, x: -30, filter: "blur(4px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 30, filter: "blur(4px)" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <SignInModal onSignUpClick={() => setMode("signUp")} />
            </motion.div>
          ) : (
            <motion.div
              key="signUp"
              initial={{ opacity: 0, x: 30, filter: "blur(4px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -30, filter: "blur(4px)" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <SignUpModal onSignInClick={() => setMode("signIn")} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
