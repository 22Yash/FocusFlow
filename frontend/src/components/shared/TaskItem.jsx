import styles from './styles/utilities.module.css';

const TaskItem = ({ title, meta, priority, checked }) => {
  const priorityClasses = {
    high: styles.priorityHigh,
    medium: styles.priorityMedium,
    low: styles.priorityLow
  };

  return (
    <div className={styles.taskItem}>
      <div className={`${styles.taskCheckbox} ${checked ? styles.checked : ''}`}></div>
      <div className={styles.taskInfo}>
        <div className={`${styles.taskTitle} ${checked ? styles.completed : ''}`}>{title}</div>
        <div className={styles.taskMeta}>{meta}</div>
      </div>
      <div className={`${styles.taskPriority} ${priorityClasses[priority]}`}>
        {priority === 'high' ? 'HIGH' : priority === 'medium' ? 'MED' : 'LOW'}
      </div>
    </div>
  );
};

export default TaskItem;