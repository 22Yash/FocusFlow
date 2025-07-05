import React from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <div className="flex justify-between items-center text-white p-[20px] h-[100px]">
      <div>
        <h1 className="text-[40px] font-bold">
          <Link to="/">🧠 FocusFlow</Link></h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Show Sign In and Sign Up when user is logged out */}
        <SignedOut>
          <SignInButton redirectUrl="/redirect">
            <button className="bg-blue-600 px-4 py-2 rounded-[10px] hover:bg-blue-700">
              Sign In
            </button>
          </SignInButton>

          <SignUpButton redirectUrl="/redirect">
            <button className="bg-green-600 px-4 py-2 rounded-[10px] hover:bg-green-700">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>

        {/* Show User button when user is logged in */}
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
}

export default Navbar;