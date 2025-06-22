import styles from './styles/utilities.module.css';

const Card = ({ title, action, headerBg, children }) => {
  return (
    <div className={styles.mainCard}>
      <div className={styles.cardHeader} style={{ background: headerBg }}>
        <div className={styles.cardTitle}>{title}</div>
        <button className={styles.cardAction}>{action}</button>
      </div>
      <div className={styles.cardContent}>
        {children}
      </div>
    </div>
  );
};

export default Card;