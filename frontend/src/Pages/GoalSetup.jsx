import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/clerk-react";

function GoalSetupForm() {
  const [goal, setGoal] = useState("");
  const [sessions, setSessions] = useState(3);
  const [duration, setDuration] = useState("25");
  const navigate = useNavigate();
  const { user } = useUser();

  const handleSubmit = async () => {
    if (!goal) {
      alert("Please enter a goal");
      return;
    }

    // Save to localStorage
    localStorage.setItem("goal", goal);
    localStorage.setItem("sessions", sessions);
    localStorage.setItem("sessionDuration", duration);

    

    localStorage.setItem("onboardingComplete", "true");
navigate("/dashboard");
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-blue-50 px-4">
      <h2 className="text-3xl font-bold mb-6">Set Your First Goal 🎯</h2>

      <input
        type="text"
        className="p-2 border mb-4 w-full max-w-md"
        placeholder="What do you want to accomplish this week?"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
      />

      <div className="mb-4 w-full max-w-md">
        <label className="block mb-2 font-semibold">Focus sessions per day:</label>
        <input
          type="number"
          value={sessions}
          onChange={(e) => setSessions(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>

      <div className="mb-6 w-full max-w-md">
        <label className="block mb-2 font-semibold">Preferred session length:</label>
        <div className="flex gap-4">
          {["25", "45", "60"].map((min) => (
            <label key={min} className="flex items-center gap-2">
              <input
                type="radio"
                value={min}
                checked={duration === min}
                onChange={() => setDuration(min)}
              />
              {min} min
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
      >
        Start My Journey →
      </button>
    </div>
  );
}

export default function GoalSetup() {
  return (
    <>
      <SignedIn>
        <GoalSetupForm />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
