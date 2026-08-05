'use client';
import React from 'react';
import { Check } from 'lucide-react';

interface StepWizardHeaderProps {
  currentStep: 1 | 2 | 3 | 4;
}

export function StepWizardHeader({ currentStep }: StepWizardHeaderProps) {
  return (
    <div className="bg-slate-900 text-white p-6 md:px-10 border-b border-slate-800">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {/* Step 1 Indicator */}
        <div className={`flex items-center gap-2.5 ${currentStep === 1 ? 'opacity-100' : 'opacity-60'}`}>
          <div
            className={`w-9 h-9 rounded-xl font-heading font-bold text-xs flex items-center justify-center transition-all ${
              currentStep === 1
                ? 'bg-[#aa2d29] text-white shadow-md'
                : currentStep > 1
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {currentStep > 1 ? <Check className="w-4 h-4" /> : '1'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Step 1</p>
            <p className="text-xs font-bold text-white mt-1">Route & Time</p>
          </div>
        </div>

        <div className="h-[2px] flex-1 bg-slate-800 mx-3 max-w-[50px] md:max-w-[80px]"></div>

        {/* Step 2 Indicator */}
        <div className={`flex items-center gap-2.5 ${currentStep === 2 ? 'opacity-100' : 'opacity-60'}`}>
          <div
            className={`w-9 h-9 rounded-xl font-heading font-bold text-xs flex items-center justify-center transition-all ${
              currentStep === 2
                ? 'bg-[#aa2d29] text-white shadow-md'
                : currentStep > 2
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {currentStep > 2 ? <Check className="w-4 h-4" /> : '2'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Step 2</p>
            <p className="text-xs font-bold text-white mt-1">Vehicle & VIP</p>
          </div>
        </div>

        <div className="h-[2px] flex-1 bg-slate-800 mx-3 max-w-[50px] md:max-w-[80px]"></div>

        {/* Step 3 Indicator */}
        <div className={`flex items-center gap-2.5 ${currentStep === 3 ? 'opacity-100' : 'opacity-60'}`}>
          <div
            className={`w-9 h-9 rounded-xl font-heading font-bold text-xs flex items-center justify-center transition-all ${
              currentStep === 3
                ? 'bg-[#aa2d29] text-white shadow-md'
                : currentStep > 3
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {currentStep > 3 ? <Check className="w-4 h-4" /> : '3'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Step 3</p>
            <p className="text-xs font-bold text-white mt-1">Passenger</p>
          </div>
        </div>

        <div className="h-[2px] flex-1 bg-slate-800 mx-3 max-w-[50px] md:max-w-[80px]"></div>

        {/* Step 4 Indicator */}
        <div className={`flex items-center gap-2.5 ${currentStep === 4 ? 'opacity-100' : 'opacity-60'}`}>
          <div
            className={`w-9 h-9 rounded-xl font-heading font-bold text-xs flex items-center justify-center transition-all ${
              currentStep === 4 ? 'bg-[#aa2d29] text-white shadow-md' : 'bg-slate-800 text-slate-400'
            }`}
          >
            4
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Step 4</p>
            <p className="text-xs font-bold text-white mt-1">Payment & Tip</p>
          </div>
        </div>
      </div>
    </div>
  );
}
