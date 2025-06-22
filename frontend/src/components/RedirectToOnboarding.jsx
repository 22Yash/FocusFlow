import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

function RedirectLogic() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has completed onboarding
    const onboardingComplete = localStorage.getItem("onboardingComplete");
    
    if (onboardingComplete === "true") {
      // User has completed onboarding, redirect to dashboard
      navigate("/dashboard");
    } else {
      // User hasn't completed onboarding, start with onboarding
      navigate("/onboarding");
    }
  }, [navigate]);

  // Show loading while redirecting
  return (
    <div className="h-screen flex items-center justify-center bg-blue-50">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Setting up your account...</h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
      </div>
    </div>
  );
}

export default function RedirectToOnboarding() {
  return (
    <>
      <SignedIn>
        <RedirectLogic />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}