"use client"
import { ArrowRight } from "lucide-react";
import { redirect } from "next/navigation";

export default function Home() {
  return (
    <div className="flex flex-col h-full bg-white text-black font-sans relative overflow-hidden">

      <div className="flex-1 w-full px-4 pt-4 min-h-0">
        <div className="w-full h-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden rounded-2xl relative" data-alt="Minimalist abstract 3D shapes representing growth and finance in teal and white" style={{ backgroundImage: 'url("./onboarding.png")' }}>
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background-light dark:to-background-dark opacity-40"></div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col items-center px-6 pt-8 pb-4">
        {/* Headline */}
        <h1 className="text-[#0d1b1b] dark:text-white tracking-tight text-[32px] font-extrabold leading-[1.2] text-center mb-4">
          Streamline Your Invoicing
        </h1>
        {/* Body Text */}
        <p className="text-[#0d1b1b]/70 dark:text-white/70 text-base font-medium leading-relaxed text-center px-2">
          Effortless invoicing designed for freelancers &amp; small businesses. Get paid faster and track every penny.
        </p>
        {/* Pagination Indicators */}
        <div className="flex gap-2 mt-8">
          <div className="w-6 h-1.5 rounded-full bg-primary"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700"></div>
        </div>
      </div>
      {/* Action Section */}
      <div className="w-full px-6 pb-10 flex flex-col gap-4 mt-auto">
        {/* SingleButton */}
        <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-primary hover:bg-[#11dcdc] active:scale-[0.98] transition-all text-[#0d1b1b] text-base font-bold leading-normal tracking-[0.015em] shadow-[0_4px_14px_rgba(19,236,236,0.4)]"
          onClick={() => { redirect("/onboarding") }}
        >
          <span className="truncate">Get Started</span>
          <ArrowRight className="ml-2 w-5 h-5" />
        </button>
        {/* MetaText */}
        {/* <p className="text-[#4c9a9a] dark:text-primary/70 text-sm font-medium leading-normal text-center cursor-pointer hover:text-primary transition-colors">
          Already have an account? <span className="underline decoration-2 underline-offset-4">Log in</span>
        </p> */}
      </div>
    </div>

  );
}
