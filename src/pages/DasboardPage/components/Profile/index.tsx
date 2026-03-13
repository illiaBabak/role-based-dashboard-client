import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CreatedUser } from "src/types";
import { useDeleteUser, useUpdateUser } from "src/api/mutations";

type ProfileProps = {
  user: CreatedUser;
  isCurrentUser: boolean;
};

export const Profile = ({ user, isCurrentUser }: ProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState<"admin" | "user">(user.role);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    mutateAsync: updateUser,
    isPending: isUpdating,
    error: updateError,
  } = useUpdateUser();

  const {
    mutateAsync: deleteUser,
    isPending: isDeleting,
    error: deleteError,
  } = useDeleteUser();

  const error = updateError || deleteError;

  const handleSave = async () => {
    await updateUser({
      id: user.id,
      name: name.trim(),
      role,
    });

    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(user.name);
    setRole(user.role);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await deleteUser(user.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative w-full"
    >
      <div
        className={`rounded-2xl border p-6 shadow-2xl backdrop-blur-xl ${
          isCurrentUser
            ? "border-emerald-500/50 bg-white/5 ring-1 ring-emerald-500/20"
            : "border-white/10 bg-white/5"
        }`}
      >
        {isCurrentUser && (
          <span className="absolute right-4 top-4 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
            You
          </span>
        )}
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-500/20">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-base font-bold text-white">{user.name}</h2>
            <span className="inline-block rounded-full bg-indigo-500/15 px-2 py-px text-[11px] font-medium capitalize text-indigo-400">
              {user.role}
            </span>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400"
            >
              {error.message}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">
              Login
            </label>
            <p className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-sm text-white">
              {user.login}
            </p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">
              Name
            </label>
            {isEditing ? (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
              />
            ) : (
              <p className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-sm text-white">
                {user.name}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">
              Role
            </label>
            {isEditing ? (
              <div className="flex gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
                {(["user", "admin"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`relative flex-1 cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                      role === r
                        ? "text-white"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {role === r && (
                      <motion.span
                        layoutId="profile-role-indicator"
                        className="absolute inset-0 rounded-md bg-indigo-600 shadow-lg"
                        transition={{
                          type: "spring",
                          duration: 0.4,
                          bounce: 0.15,
                        }}
                      />
                    )}
                    <span className="relative z-10 capitalize">{r}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-sm capitalize text-white">
                {user.role}
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2.5">
          {isEditing ? (
            <div className="flex gap-2.5">
              <button
                onClick={handleSave}
                disabled={isUpdating || !name.trim()}
                className="flex-1 cursor-pointer rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition-all hover:bg-indigo-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUpdating ? "Saving…" : "Save"}
              </button>
              <button
                onClick={handleCancel}
                disabled={isUpdating}
                className="flex-1 cursor-pointer rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-slate-300 transition-all hover:bg-white/5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full cursor-pointer rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition-all hover:bg-indigo-500 active:scale-[0.98]"
            >
              Edit Profile
            </button>
          )}

          <AnimatePresence>
            {showDeleteConfirm ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
                  <p className="mb-2 text-xs text-red-400">
                    Are you sure? This action cannot be undone.
                  </p>
                  <div className="flex gap-2.5">
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="flex-1 cursor-pointer rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-red-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isDeleting ? "Deleting…" : "Yes, Delete"}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={isDeleting}
                      className="flex-1 cursor-pointer rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 transition-all hover:bg-white/5 active:scale-[0.98]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.button
                layout
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full cursor-pointer rounded-lg border border-red-500/20 px-3 py-2 text-sm font-semibold text-red-400 transition-all hover:bg-red-500/10 active:scale-[0.98]"
              >
                Delete Account
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
