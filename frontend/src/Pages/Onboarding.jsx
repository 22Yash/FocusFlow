import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

function OnboardingForm() {
  const [challenge, setChallenge] = useState("");
  const [hours, setHours] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!challenge || !hours) {
      alert("Please fill all fields");
      return;
    }

    // Save to localStorage (or Context / Clerk metadata later)
    localStorage.setItem("productivityChallenge", challenge);
    localStorage.setItem("dailyHours", hours);

    navigate("/goal-setup");
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-blue-100 px-4">
      <h2 className="text-3xl font-bold mb-6">Tell us about yourself 📝</h2>

      <div className="mb-4 w-full max-w-md">
        <label className="block mb-2 font-semibold">
          Your biggest productivity challenge:
        </label>
        <select
          className="p-2 border rounded w-full"
          value={challenge}
          onChange={(e) => setChallenge(e.target.value)}
        >
          <option value="">-- Select --</option>
          <option>Getting distracted</option>
          <option>Poor time management</option>
          <option>Procrastination</option>
          <option>Lack of motivation</option>
        </select>
      </div>

      <div className="mb-6 w-full max-w-md">
        <label className="block mb-2 font-semibold">Daily study/work hours:</label>
        <input
          type="number"
          className="p-2 border rounded w-full"
          placeholder="e.g. 5"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded"
      >
        Continue Setup →
      </button>
    </div>
  );
}

export default function Onboarding() {
  return (
    <>
      <SignedIn>
        <OnboardingForm />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
