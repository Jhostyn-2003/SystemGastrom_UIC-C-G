import React from 'react';
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-100 to-indigo-100 flex flex-col items-center justify-center">
            <div className="max-w-2xl mx-auto p-8 bg-white shadow-2xl rounded-xl transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105">
                <h2 className="text-center text-4xl font-extrabold text-gray-900 mb-10">
                    Bienvenido a la Aplicación para Gestionar tu Establecimiento Gastronómico

                </h2>
                <Logo/>
                <br />
                <SignedOut>
                    <div className="flex justify-center">
                        <SignInButton>
                            <Button className="w-80 h-12 bg-blue-600 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1">
                                Ingresar
                            </Button>
                        </SignInButton>
                    </div>
                </SignedOut>
                <SignedIn>
                    <div className="flex flex-col items-center gap-6 mt-6">
                        <div className="flex items-center gap-3 bg-gray-200 p-3 rounded-lg shadow">
                            <p className="text-gray-800 font-semibold">
                                Ajustes de usuario:
                            </p>
                            <UserButton />
                        </div>
                        <Button>
                            <Link href="/admin/dashboard">
                                Gestionar Establecimiento
                            </Link>
                        </Button>
                    </div>
                </SignedIn>
            </div>
        </div>
    );
};

export default Home;