import styles from './RightColumn.module.css';

const RightColumn = () => {
  return (
    <div className={styles.rightColumn}>
      <div className={styles.aiAssistant}>
        <div className={styles.aiHeader}>
          <div className={styles.aiAvatar}>🤖</div>
          <div>
            <h4>AI Assistant</h4>
            <p>Your productivity coach</p>
          </div>
        </div>
        <div className={styles.aiMessage}>
          I notice you have a high-priority task due today. Would you like me to help you break it down into smaller, manageable steps?
        </div>
        <div className={styles.aiSuggestions}>
          <button className={styles.suggestionBtn}>📝 Break down task</button>
          <button className={styles.suggestionBtn}>⏰ Schedule focus time</button>
          <button className={styles.suggestionBtn}>🎯 Set reminders</button>
        </div>
      </div>

      <div className={styles.insightCard}>
        <div className={styles.insightHeader}>
          <div className={styles.insightIcon}>📊</div>
          <h4>Today's Insight</h4>
        </div>
        <div className={styles.insightHighlight}>
          <div className={styles.insightValue}>10:00 AM</div>
          <div className={styles.insightLabel}>Your peak focus time</div>
        </div>
        <p className={styles.insightNote}>
          Schedule your most important tasks during this window
        </p>
      </div>
    </div>
  );
};

export default RightColumn;