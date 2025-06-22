import DashboardGrid from "../components/DashboardGrid/DashboardGrid";
import Navbar from "../components/Navbar";
import QuickActions from "../components/QuickActions/QuickActions"
import Header from "../components/Header/Header"

import sharedStyles from '../components/shared/styles/base.module.css';

function Dashboard() {
    return (
      <>
       <div className={sharedStyles.dashboardContainer}>
        <Header/>
      <DashboardGrid/>
      <QuickActions/>
    </div>
      </>
      
    );
  }
  
  export default Dashboard;
  