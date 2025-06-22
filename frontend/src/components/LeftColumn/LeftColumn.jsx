import styles from './LeftColumn.module.css';
import StatItem from '../shared/StatItem';

const LeftColumn = () => {
  return (
    <div className={styles.leftColumn}>
      <div className={styles.statsCard}>
        <StatItem 
          icon="⏰" 
          title="Focus Time" 
          subtitle="Today" 
          value="3h 45m" 
          iconBg="linear-gradient(135deg, #667eea, #764ba2)"
        />
        <StatItem 
          icon="✅" 
          title="Tasks Done" 
          subtitle="This week" 
          value="12/18" 
          iconBg="linear-gradient(135deg, #48bb78, #68d391)"
        />
        <StatItem 
          icon="🔥" 
          title="Streak" 
          subtitle="Days active" 
          value="7" 
          iconBg="linear-gradient(135deg, #ed8936, #f6ad55)"
        />
      </div>

      <div className={styles.moodTracker}>
        <h3>How are you feeling?</h3>
        <div className={styles.moodEmojis}>
          <div className={styles.moodEmoji}>😫</div>
          <div className={styles.moodEmoji}>😐</div>
          <div className={`${styles.moodEmoji} ${styles.selected}`}>😊</div>
          <div className={styles.moodEmoji}>😄</div>
          <div className={styles.moodEmoji}>🤩</div>
        </div>
        <p>Feeling good today!</p>
      </div>
    </div>
  );
};

export default LeftColumn;