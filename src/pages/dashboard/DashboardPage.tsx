import { useCallback } from "react";
import { Header } from "../../components/shared/layout/Header";
import { BalanceCard } from "./components/BalanceCard";
import { RecentTransactions } from "./components/RecentTransactions";
import { useAuth } from "../../hooks/useAuth";

export function DashboardPage() {
  const { account, loading, isRefreshing, accountLoading, refreshAccount } =
    useAuth();

  const handleRefresh = useCallback(() => {
    refreshAccount();
  }, [refreshAccount]);

  const showBalanceSkeleton =
    (loading || isRefreshing || accountLoading) && !account;

  return (
    <div className="min-h-dvh relative overflow-x-hidden">
      {/* Glow background elements */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/3 w-80 h-80 bg-accent-cyan/5 rounded-full blur-[100px] pointer-events-none" />

      <Header />

      <div className="relative max-w-lg mx-auto z-10">
        {/* Spacer for fixed header */}
        <div className="h-26 w-full" />

        <main className="px-5 space-y-6 pb-20">
          <BalanceCard
            balance={account?.balance ?? "0"}
            accountNumber={account?.account_number ?? ""}
            onRefresh={handleRefresh}
            balanceLoading={showBalanceSkeleton}
          />
          <RecentTransactions />
        </main>
      </div>
    </div>
  );
}
