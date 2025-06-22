import styles from './Header.module.css';
import sharedStyles from '../shared/styles/base.module.css';
import { UserButton, useUser } from "@clerk/clerk-react";
import {Link} from "react-router-dom";


const Header = () => {

  const { user } = useUser();

  const getGreeting = () => {
    const hour = new Date().getHours();
   
    
    
  
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
    
  };

  const userName = user?.firstName || "there";
  
  return (
    <div className={`${sharedStyles.dashboardContainer} ${styles.header}`}>
      <div className={styles.logoSection}>
        <div className={styles.logo}>
          <Link to="/">🎯</Link>
          </div>
        <div className={styles.welcomeText}>
        <h1>{getGreeting()}, {userName}!</h1>
          <p>Ready to make today productive?</p>
        </div>
      </div>
      <div className={styles.headerActions}>
        <div className={styles.notificationBell}>
          🔔
          <div className={styles.notificationBadge}>3</div>
        </div>
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};

export default Header;