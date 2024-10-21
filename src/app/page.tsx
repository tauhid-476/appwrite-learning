

import React from "react";
import { NeonGradientCard } from "@/components/magicui/neon-gradient-card";
import HeroSectionHeader from "./components/HeroSectionHeader";

export default async function Home() {
  return (
    <main className="relative min-h-screen">
      {/* HeroSection with parallax effect, particles, and icon cloud */}
      <div className="relative z-10">
        <HeroSectionHeader />
      </div>

      {/* Additional content */}
      <div className="relative z-20 bg-black bg-opacity-90">
        <div className="container mx-auto px-4 py-16">
          {/* Latest Questions and Top Contributors */}
          {/* <div className="flex flex-col md:flex-row justify-between mb-16">
            <div className="w-full md:w-2/3 pr-0 md:pr-4 mb-8 md:mb-0">
            <p className="mb-4 text-2xl">Latest Questions</p>
              <LatestQuestions />
            </div>
            <div className="w-full md:w-1/3">
              <TopContributors />
            </div>
          </div> */}

          {/* Join Now Section */}
          <NeonGradientCard className="my-10 bg-gray-900">
            <div className="p-6 rounded-[18px]">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white text-center">JOIN NOW</h2>
              <p className="text-sm text-gray-300 text-center">
                "Sign up" to become a part of our dynamic community. Gain access to a vast pool of
                knowledge, connect with experts, and share your insights. Whether you're here to ask
                questions or provide answers, joining us will enhance your learning experience and help
                you stay updated with the latest discussions. Join now and start making meaningful
                contributions today!
              </p>
            </div>
          </NeonGradientCard>
        </div>

        {/* Footer */}

      </div>
    </main>
  );
}


/*
<NeonGradientCard className="my-10 bg-gray-900">
  <div className="p-6 rounded-[18px]">
    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white text-center">JOIN NOW</h2>
    <p className="text-sm text-gray-300 text-center">
      "Sign up" to become a part of our dynamic community. Gain access to a vast pool of
          knowledge, connect with experts, and share your insights. Whether you're here to ask
          questions or provide answers, joining us will enhance your learning experience and help
          you stay updated with the latest discussions. Join now and start making meaningful
          contributions today!
    </p>
  </div>
</NeonGradientCard>

*/