import { useWallet } from "@hooks/useWallet";
import styles from "./wallet.module.css";
import { formatCurrency } from "@utils/HelperFunctions";
import { Wallet } from 'lucide-react';
import Loader from "@components/common/Loader/Loader";

export default function WalletCard() {
  const { wallet, loading, error } = useWallet();

  if (loading) return <div className="text-center p-4"><Loader /></div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;
  if (!wallet) return null;
  return (
    <div className={styles.walletCard}>
      {/* Header */}
      <h5 className={styles.walletTitle}>
        <div className="d-flex"><Wallet /> My Wallet</div>
      </h5>

      {/* Balance */}
      <div className={styles.walletBalance}>
        <span className={styles.balanceLabel}>Available Now</span>
        <h2 className={styles.balanceValue}>
          {formatCurrency(wallet.data.available_now)}
        </h2>
      </div>

      {/* Breakdown */}
      <div className={styles.walletBreakdown}>
        <div className={styles.breakdownRow}>
          <span>In Wallet</span>
          <span>{formatCurrency(wallet.data.wallet)}</span>
        </div>
        <div className={styles.breakdownRow}>
          <span>Escrow Locked</span>
          <span>{formatCurrency(wallet.data.locked)}</span>
        </div>
        <div className={styles.breakdownRow}>
          <span>Escrow Refundable</span>
          <span>{formatCurrency(wallet.data.refundable)}</span>
        </div>
      </div>

      <hr className={styles.divider} />

      {/* Total */}
      <div className={styles.totalRow}>
        <span>Total Money in App</span>
        <strong>{formatCurrency(wallet.data.total_in_app)}</strong>
      </div>
    </div>
  );
}
