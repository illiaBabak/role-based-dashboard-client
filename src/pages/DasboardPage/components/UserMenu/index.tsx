import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import ClickAwayListener from "react-click-away-listener";
import { useLogout } from "src/api/mutations";
import { useNavigate } from "react-router-dom";

type UserMenuProps = {
  name: string;
};

export const UserMenu = ({ name }: UserMenuProps) => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const { mutateAsync: logout, isPending } = useLogout();

  const handleLogout = async () => {
    await logout();

    navigate("/");
  };

  const initial = name.charAt(0).toUpperCase();

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div className="relative z-10">
        <button
          data-testid="user-menu-button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white ring-2 ring-indigo-500/30 transition-all hover:ring-indigo-500/60 active:scale-95"
        >
          {initial}
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              onMouseDown={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -4 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-xl border border-white/10 bg-slate-800/90 shadow-2xl backdrop-blur-xl"
            >
              <div className="border-b border-white/5 px-4 py-3">
                <p className="truncate text-sm font-medium text-white">
                  {name}
                </p>
              </div>

              <div className="p-1.5">
                <button
                  data-testid="logout-button"
                  onClick={handleLogout}
                  disabled={isPending}
                  className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                    />
                  </svg>
                  {isPending ? "Logging out…" : "Log out"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ClickAwayListener>
  );
};
