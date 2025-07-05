import styles from './LeftColumn.module.css';
import StatItem from '../shared/StatItem';
import {
  TrendingUp, Calendar, Clock, Target, Award, Activity,
  Filter, Download, ChevronDown
} from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Add this import

const LeftColumn = () => {
  const { user } = useUser();
  const [totalFocusHours, setTotalFocusHours] = useState(0);
  const [timeRange, setTimeRange] = useState('7d');
  const [completedTasks, setCompletedTasks] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching analytics for user:', user.id); // Debug log
        
        const res = await axios.get('http://localhost:5000/api/analytics', {
          params: {
            userId: user.id,
            range: timeRange
          }
        });

        console.log('Analytics response:', res.data); // Debug log

        const data = res.data;

        // Only set the state variables that exist in your component
        setTotalFocusHours(data.totalFocusHours || 0);
        setCompletedTasks(data.completedTasks || 0);
        setCurrentStreak(data.currentStreak || 0);
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user, timeRange]);

  const StatCard = ({ icon: Icon, title, value, change, trend, color = "blue" }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-${color}-100 rounded-2xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        <div className={`flex items-center text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
          <TrendingUp className="w-4 h-4 mr-1" />
          {change}%
        </div>
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );

  // Show loading state
  if (loading) {
    return (
      <div className={styles.leftColumn}>
        <div className={styles.statsCard}>
          <StatItem 
            icon="⏰" 
            title="Focus Time" 
            subtitle="This week" 
            value="Loading..."
            iconBg="linear-gradient(135deg, #667eea, #764ba2)"
          />
          <StatItem 
            icon="✅" 
            title="Tasks Done" 
            subtitle="This week" 
            value="Loading..."
            iconBg="linear-gradient(135deg, #48bb78, #68d391)"
          />
          <StatItem 
            icon="🔥" 
            title="Streak" 
            subtitle="Days active" 
            value="Loading..." 
            iconBg="linear-gradient(135deg, #ed8936, #f6ad55)"
          />
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={styles.leftColumn}>
        <div className={styles.statsCard}>
          <p>Error loading analytics: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.leftColumn}>
      <div className={styles.statsCard}>
        <StatItem 
          icon="⏰" 
          title="Focus Time" 
          value={`${totalFocusHours}h`}
          iconBg="linear-gradient(135deg, #667eea, #764ba2)"
        />
        <StatItem 
          icon="✅" 
          title="Tasks Done" 
          subtitle="This week" 
          value={completedTasks}
          iconBg="linear-gradient(135deg, #48bb78, #68d391)"
        />
        <StatItem 
          icon="🔥" 
          title="Streak" 
          subtitle="Days active" 
          value={currentStreak} 
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