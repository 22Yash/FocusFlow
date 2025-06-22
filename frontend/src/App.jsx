import React, { useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import LandingPage from './Pages/LandingPage'
import Onboarding from './Pages/Onboarding'
import GoalSetup from './Pages/GoalSetup'
import Dashboard from './Pages/Dashboard'
import RedirectToOnboarding from './components/RedirectToOnboarding';
import TaskPlannig from './Pages/TaskPlannig';
import FocusSession from './components/Focus Session/FocusSession';
import SessionStart from './components/Focus Session/SessionStart';

function App() {
  const { isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only run this logic when Clerk has loaded and user is signed in
    if (isLoaded && isSignedIn) {
      // If user just signed in and is on landing page, redirect them
      if (location.pathname === '/') {
        navigate('/redirect');
      }
    }
  }, [isSignedIn, isLoaded, location.pathname, navigate]);

  return (
    <div className='h-full w-full'>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/redirect" element={<RedirectToOnboarding/>} />
        <Route path="/onboarding" element={<Onboarding/>} />
        <Route path="/goal-setup" element={<GoalSetup/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path='/focussession' element={<FocusSession/>}/>
        <Route path='/taskplanning' element={<TaskPlannig/>}/>
        <Route path='/sessionstart' element={<SessionStart/>}/>
      </Routes>
    </div>
  )
}

export default App