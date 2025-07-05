import styles from './DashboardGrid.module.css';
import LeftColumn from '../LeftColumn/LeftColumn';
import CenterColumn from '../CenterColumn/CenterColumn';
import RightColumn from '../RightColumn/RightColumn';

const DashboardGrid = () => {
  return (
    <div className={styles.dashboardGrid}>
      <LeftColumn />
      <RightColumn />
      <CenterColumn />
      
    </div>
  );
};

export default DashboardGrid;