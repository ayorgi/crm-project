'use client';
import React from 'react';
import { CreditCard, Sparkles, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface Step4PaymentProps {
  basePrice: number;
  calculatedTip: number;
  totalPrice: number;
  selectedVehicle: string;
  tipType: '0' | '10' | '15' | '20' | 'custom';
  setTipType: (val: '0' | '10' | '15' | '20' | 'custom') => void;
  customTipAmount: string;
  setCustomTipAmount: (val: string) => void;
  cardholderName: string;
  setCardholderName: (val: string) => void;
  cardNumber: string;
  handleCardNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  cardExpiry: string;
  handleCardExpiryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  cardCvc: string;
  handleCardCvcChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSubmitting: boolean;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const inpClass =
  'w-full h-12 px-4 bg-slate-50/80 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#aa2d29]/20 focus:border-[#aa2d29] focus:bg-white outline-none transition-all text-slate-900 placeholder:text-slate-400 flex items-center justify-between';

export function Step4Payment({
  basePrice,
  calculatedTip,
  totalPrice,
  selectedVehicle,
  tipType,
  setTipType,
  customTipAmount,
  setCustomTipAmount,
  cardholderName,
  setCardholderName,
  cardNumber,
  handleCardNumberChange,
  cardExpiry,
  handleCardExpiryChange,
  cardCvc,
  handleCardCvcChange,
  isSubmitting,
  onBack,
  onSubmit,
}: Step4PaymentProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <CreditCard className="w-5 h-5 text-[#aa2d29]" />
        <div>
          <h2 className="text-base font-bold text-slate-900">Step 4: Secure Payment & Chauffeur Gratuity</h2>
          <p className="text-xs text-slate-500">Optionally add a driver tip and enter your payment details.</p>
        </div>
      </div>

      {/* Chauffeur Gratuity (Tip Driver) Section */}
      <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#aa2d29]" /> Chauffeur Gratuity (Tip Driver)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">100% of your gratuity goes directly to your executive chauffeur.</p>
          </div>
        </div>

        {/* Quick Tip Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { id: '0', label: 'No Tip', sub: '$0.00' },
            { id: '10', label: '10%', sub: `$${((basePrice * 10) / 100).toFixed(2)}` },
            { id: '15', label: '15%', sub: `$${((basePrice * 15) / 100).toFixed(2)}` },
            { id: '20', label: '20%', sub: `$${((basePrice * 20) / 100).toFixed(2)}` },
            { id: 'custom', label: 'Custom', sub: 'Enter amount' },
          ].map(tip => {
            const isSelected = tipType === tip.id;
            return (
              <button
                key={tip.id}
                type="button"
                onClick={() => setTipType(tip.id as any)}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#aa2d29] bg-rose-50/60 text-[#aa2d29] shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="font-bold text-xs">{tip.label}</div>
                <div className={`text-[11px] mt-0.5 ${isSelected ? 'text-[#aa2d29] font-semibold' : 'text-slate-400'}`}>
                  {tip.sub}
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom Tip Input */}
        {tipType === 'custom' && (
          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
              Custom Tip Amount ($)
            </label>
            <input
              type="number"
              min="0"
              step="1"
              placeholder="e.g. 25"
              value={customTipAmount}
              onChange={e => setCustomTipAmount(e.target.value)}
              className={inpClass.replace('bg-slate-50/80', 'bg-white')}
            />
          </div>
        )}
      </div>

      {/* Credit Card Details Form */}
      <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-slate-400" /> Credit Card Details
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">Encrypted & Secure</span>
        </div>

        <div className="space-y-4">
          {/* Name on Card */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              Cardholder Name *
            </label>
            <input
              required
              type="text"
              name="ccname"
              id="cc-name"
              autoComplete="cc-name"
              placeholder="e.g. Arda Şahin"
              value={cardholderName}
              onChange={e => setCardholderName(e.target.value)}
              className={inpClass.replace('bg-slate-50/80', 'bg-white')}
            />
          </div>

          {/* Card Number */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              Card Number *
            </label>
            <input
              required
              type="text"
              name="cardnumber"
              id="card-number"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={handleCardNumberChange}
              className={inpClass.replace('bg-slate-50/80', 'bg-white')}
            />
          </div>

          {/* Expiry & CVC Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                Expiry Date *
              </label>
              <input
                required
                type="text"
                name="ccexp"
                id="card-expiry"
                inputMode="numeric"
                autoComplete="cc-exp"
                maxLength={5}
                placeholder="MM/YY"
                value={cardExpiry}
                onChange={handleCardExpiryChange}
                className={inpClass.replace('bg-slate-50/80', 'bg-white')}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                Security Code (CVV / CVC) *
              </label>
              <input
                required
                type="password"
                name="cvc"
                id="card-cvc"
                inputMode="numeric"
                autoComplete="cc-csc"
                maxLength={3}
                placeholder="123"
                data-lpignore="true"
                data-form-type="other"
                value={cardCvc}
                onChange={handleCardCvcChange}
                className={inpClass.replace('bg-slate-50/80', 'bg-white')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Price Summary Breakdown Box */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-3">
        <div className="flex justify-between items-center text-xs text-slate-400">
          <span>Transfer Base Fare ({selectedVehicle || 'Selected Vehicle'}):</span>
          <span className="font-semibold text-white">${basePrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-xs text-slate-400">
          <span>Chauffeur Gratuity (Tip):</span>
          <span className="font-semibold text-white">${calculatedTip.toFixed(2)}</span>
        </div>
        <div className="border-t border-slate-800 pt-3 flex justify-between items-center">
          <span className="text-sm font-bold text-white">Total Amount:</span>
          <span className="text-xl font-black text-[#f87171]">${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Navigation Footer for Step 4 */}
      <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 rounded-2xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 flex items-center gap-2 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Passenger Details</span>
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className={`bg-[#aa2d29] hover:bg-[#8e2622] text-white font-bold px-10 py-3.5 rounded-2xl shadow-md shadow-[#aa2d29]/20 text-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Processing Payment...' : `Pay $${totalPrice.toFixed(2)} & Confirm Booking`}
          <CheckCircle2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
