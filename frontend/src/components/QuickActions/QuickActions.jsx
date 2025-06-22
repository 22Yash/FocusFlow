import styles from './QuickActions.module.css';
import { Link } from 'react-router-dom';

const QuickActions = () => {
  return (
    <div className={styles.quickActions}>
      <Link to="/taskplanning" className={styles.actionBtn}>
      <span className={styles.actionIcon}>📊</span>
        <span className={styles.actionText}>Eisenhower Matrix</span>
      </Link>
      
        
      
      <a href="#" className={styles.actionBtn}>
        <span className={styles.actionIcon}>📈</span>
        <span className={styles.actionText}>Analytics</span>
      </a>
      <a href="#" className={styles.actionBtn}>
        <span className={styles.actionIcon}>🎯</span>
        <span className={styles.actionText}>Habit Tracker</span>
      </a>
      <a href="#" className={styles.actionBtn}>
        <span className={styles.actionIcon}>📝</span>
        <span className={styles.actionText}>Journal</span>
      </a>
    </div>
  );
};

export default QuickActions;