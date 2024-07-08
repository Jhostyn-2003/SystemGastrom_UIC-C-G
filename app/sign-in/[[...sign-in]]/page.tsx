// /app/sign-in/[...sign-in].tsx
import React from 'react';
import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
      <div className="min-h-screen bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
          <div className="w-full max-w-md p-8 space-y-8 rounded-lg shadow-2xl">
              <SignIn />
          </div>
      </div>
  );
};

export default SignInPage;