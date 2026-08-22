import { ArrowDownLeft, ArrowUpRight, CaretRight } from 'phosphor-react';

interface Transaction {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
}

const transactions: Transaction[] = [
  {
    id: '1',
    title: 'Apple Store',
    subtitle: 'Hoy · 2:45 PM',
    amount: -9.99,
    type: 'withdrawal',
  },
  {
    id: '2',
    title: 'Transferencia Recibida',
    subtitle: 'Ayer · De Carlos M.',
    amount: 250.00,
    type: 'deposit',
  },
];

function TransactionIcon({ type }: { type: Transaction['type'] }) {
  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center ${
        type === 'deposit'
          ? 'bg-accent-cyan/15 text-accent-cyan'
          : 'bg-primary/15 text-primary'
      }`}
    >
      {type === 'deposit' ? (
        <ArrowDownLeft size={20} weight="bold" />
      ) : (
        <ArrowUpRight size={20} weight="bold" />
      )}
    </div>
  );
}

function TransactionItem({ transaction }: { transaction: Transaction }) {
  const isPositive = transaction.amount > 0;

  return (
    <div className="flex items-center gap-3 py-3">
      <TransactionIcon type={transaction.type} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text-primary truncate">
          {transaction.title}
        </p>
        <p className="text-xs text-text-muted">{transaction.subtitle}</p>
      </div>
      <span
        className={`text-sm font-bold ${
          isPositive ? 'text-accent-cyan' : 'text-text-primary'
        }`}
      >
        {isPositive ? '+' : '-'} ${Math.abs(transaction.amount).toFixed(2)}
      </span>
    </div>
  );
}

export function RecentTransactions() {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-text-primary">
          Movimientos Recientes
        </h3>
        <button className="text-xs font-semibold text-primary hover:text-primary-accent transition-colors flex items-center gap-0.5">
          Ver todo
          <CaretRight size={14} weight="fill" />
        </button>
      </div>

      <div className="divide-y divide-border">
        {transactions.map((tx) => (
          <TransactionItem key={tx.id} transaction={tx} />
        ))}
      </div>
    </div>
  );
}
