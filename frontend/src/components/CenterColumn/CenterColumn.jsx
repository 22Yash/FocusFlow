import styles from './CenterColumn.module.css';
import Card from '../shared/Card';
import TaskItem from '../shared/TaskItem';

const CenterColumn = () => {
  return (
    <div className={styles.centerColumn}>
      {/* Pomodoro Timer */}
      <Card 
        title="🍅 Focus Session" 
        action="Settings" 
        headerBg="linear-gradient(135deg, #667eea, #764ba2)"
      >
        <div className={styles.pomodoroSection}>
          <div className={styles.timerTask}>Working on: Submit Project Proposal</div>
          <div className={styles.timerDisplay}>25:00</div>
          <div className={styles.timerStatus}>Ready to start • Session 1 of 4</div>
          <div className={styles.timerControls}>
            <button className={styles.timerBtn}>▶️ Start Focus</button>
            <button className={styles.timerBtn}>⏭️ Skip Break</button>
          </div>
        </div>
      </Card>

      {/* Today's Tasks */}
      {/* <Card 
        title="📋 Today's Tasks" 
        action="+ Add Task" 
        headerBg="linear-gradient(135deg, #667eea, #764ba2)"
      >
        <div className={styles.taskList}>
          <TaskItem 
            title="Submit project proposal" 
            meta="Due today • Q1 (Urgent & Important)" 
            priority="high" 
            checked={false}
          />
          <TaskItem 
            title="Review team feedback" 
            meta="Completed • Q2 (Important)" 
            priority="medium" 
            checked={true}
          />
          <TaskItem 
            title="Plan next week's sprint" 
            meta="Due tomorrow • Q2 (Important)" 
            priority="medium" 
            checked={false}
          />
          <TaskItem 
            title="Update LinkedIn profile" 
            meta="This week • Q2 (Important)" 
            priority="low" 
            checked={false}
          />
        </div>
      </Card> */}
    </div>
  );
};

export default CenterColumn;