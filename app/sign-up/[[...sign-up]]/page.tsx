// /pages/signup.tsx
import { SignUp } from "@clerk/nextjs";

// app/sign-up/[...sign-up].tsx
import React from 'react';

const SignUpPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
            <div className="w-full max-w-md p-8 space-y-8 rounded-lg shadow-2xl">
                <SignUp/>
            </div>
        </div>
    );
};

export default SignUpPage;