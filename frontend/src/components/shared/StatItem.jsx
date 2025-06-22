import styles from './styles/utilities.module.css';

const StatItem = ({ icon, title, subtitle, value, iconBg }) => {
  return (
    <div className={styles.statItem}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div 
          className={styles.statIcon} 
          style={{ background: iconBg, color: 'white' }}
        >
          {icon}
        </div>
        <div className={styles.statInfo}>
          <h4>{title}</h4>
          <p>{subtitle}</p>
        </div>
      </div>
      <div className={styles.statValue}>{value}</div>
    </div>
  );
};

export default StatItem;