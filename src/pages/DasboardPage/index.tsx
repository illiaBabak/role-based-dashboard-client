import { useGetUsers } from "src/api/queries";
import { Loader } from "src/components/Loader";
import { UserMenu } from "./components/UserMenu";
import { Profile } from "./components/Profile";
import { useAuth } from "src/hooks/useAuth";

export const DashboardPage = () => {
  const { user: currentUser, isLoading } = useAuth();

  const { data: users, isLoading: isLoadingUsers } = useGetUsers();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        <Loader />
      </div>
    );
  }

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

      <header className="relative border-b border-white/5">
        <div className="flex items-center justify-between px-8 py-4">
          <h1 data-testid="dashboard-heading" className="text-lg font-bold text-white tracking-tight">
            Dashboard
          </h1>
          <UserMenu name={currentUser?.name ?? ""} />
        </div>
      </header>

      <main className="relative flex-1 overflow-y-auto px-8 py-6">
        {isLoadingUsers ? (
          <div className="flex h-full items-center justify-center">
            <Loader />
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-4">
            {users?.map((user) => (
              <Profile
                key={user.id}
                user={user}
                isCurrentUser={user.id === currentUser?.id}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
