import styles from "./HostCard.module.css";
import { HostCardProps } from "src/types";

function HostCard({ host }: HostCardProps) {
  return (
    <div className={styles.card}>
      {/* Section heading */}
      <h3 className={styles.title}>Meet your host</h3>

      {/* Host information (avatar + details) */}
      <div className={styles.hostInfo}>
        {/* Avatar (currently rendered as text or emoji from props) */}
        <div className={styles.avatar}>{host.avatar}</div>

        {/* Host name and join date */}
        <div>
          <h6 className={styles.name}>{host.name}</h6>
          <small className={styles.joinDate}>{host.joinDate}</small>
        </div>
      </div>
    </div>
  );
}

export default HostCard;
