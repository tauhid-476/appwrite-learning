"use client";

import QuestionForm from "@/components/QuestionForm";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import React from "react";

const AskQuestion = () => {
    const { user } = useAuthStore();
    const router = useRouter();

    React.useEffect(() => {
        if (!user) {
            router.push("/login"); // Redirect to login if user is not authenticated
        }
    }, [user, router]);

    if (!user) return null;

    return (
        <div className="block pb-20 md:pt-32 relative overflow-hidden">

            <div className="container mx-auto px-4 relative z-10">
                <h1 className="mb-10 mt-4 text-2xl">Ask a public question</h1>

                <div className="flex flex-wrap md:flex-row-reverse">
                    <div className="w-full md:w-1/3"></div>
                    <div className="w-full md:w-2/3">
                        <QuestionForm />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AskQuestion;