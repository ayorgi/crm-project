'use client';
import React, { useRef } from 'react';
import { AlertCircle } from 'lucide-react';
import { useBookingForm } from '@/hooks/useBookingForm';
import { QuickStatsHeader } from '@/components/portal/booking/QuickStatsHeader';
import { StepWizardHeader } from '@/components/portal/booking/StepWizardHeader';
import { Step1RouteDate } from '@/components/portal/booking/Step1RouteDate';
import { Step2VehicleVip } from '@/components/portal/booking/Step2VehicleVip';
import { Step3Passenger } from '@/components/portal/booking/Step3Passenger';
import { Step4Payment } from '@/components/portal/booking/Step4Payment';
import { BookingSuccessModal } from '@/components/portal/booking/BookingSuccessModal';

export default function PortalDashboard() {
  const form = useBookingForm();
  const bookingRef = useRef<HTMLDivElement>(null);

  const scrollToBooking = () => {
    bookingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // If a booking is confirmed, display the confirmation & invoice modal view
  if (form.bookingConfirmed) {
    return (
      <BookingSuccessModal
        bookingConfirmed={form.bookingConfirmed}
        showReceiptModal={form.showReceiptModal}
        setShowReceiptModal={form.setShowReceiptModal}
        onResetWizard={form.handleResetWizard}
      />
    );
  }

  return (
    <div className="w-full max-w-6xl space-y-6 py-2">
      {/* Top Header & Stats + Hero Banner */}
      <QuickStatsHeader customerName={form.customerName} onBookNow={scrollToBooking} />

      {/* 4-STEP WIZARD ENGINE CONTAINER */}
      <div ref={bookingRef} className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
        {/* STEPPER NAVIGATION HEADER (1, 2, 3, 4 Indicators) */}
        <StepWizardHeader currentStep={form.currentStep} />

        {/* VALIDATION ERROR BANNER */}
        {form.validationError && (
          <div className="bg-rose-50 border-b border-rose-200 px-6 py-3.5 flex items-center gap-3 text-rose-700 text-xs font-bold animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{form.validationError}</span>
          </div>
        )}

        {/* STEP CONTENT PANEL */}
        <div className="p-8 md:p-12 space-y-8">
          {/* STEP 1: ROUTE & TIME */}
          {form.currentStep === 1 && (
            <Step1RouteDate
              pickup={form.pickup}
              setPickup={form.setPickup}
              dropoff={form.dropoff}
              setDropoff={form.setDropoff}
              transferType={form.transferType}
              setTransferType={form.setTransferType}
              date={form.date}
              setDate={form.setDate}
              time={form.time}
              setTime={form.setTime}
              passengers={form.passengers}
              setPassengers={form.setPassengers}
              onNext={form.handleNextToStep2}
            />
          )}

          {/* STEP 2: VEHICLE & VIP PREFERENCES */}
          {form.currentStep === 2 && (
            <Step2VehicleVip
              passengers={form.passengers}
              selectedVehicle={form.selectedVehicle}
              setSelectedVehicle={form.setSelectedVehicle}
              quietRide={form.quietRide}
              setQuietRide={form.setQuietRide}
              temperature={form.temperature}
              setTemperature={form.setTemperature}
              childSeat={form.childSeat}
              setChildSeat={form.setChildSeat}
              specialRequests={form.specialRequests}
              setSpecialRequests={form.setSpecialRequests}
              onBack={() => form.setCurrentStep(1)}
              onNext={form.handleNextToStep3}
            />
          )}

          {/* STEP 3: CONTACT & PASSENGER DETAILS */}
          {form.currentStep === 3 && (
            <Step3Passenger
              salutation={form.salutation}
              setSalutation={form.setSalutation}
              firstName={form.firstName}
              setFirstName={form.setFirstName}
              lastName={form.lastName}
              setLastName={form.setLastName}
              contactMethod={form.contactMethod}
              setContactMethod={form.setContactMethod}
              phoneNumber={form.phoneNumber}
              setPhoneNumber={form.setPhoneNumber}
              transferType={form.transferType}
              flightNumber={form.flightNumber}
              setFlightNumber={form.setFlightNumber}
              meetGreetName={form.meetGreetName}
              setMeetGreetName={form.setMeetGreetName}
              onBack={() => form.setCurrentStep(2)}
              onNext={form.handleNextToStep4}
            />
          )}

          {/* STEP 4: SECURE PAYMENT & CHAUFFEUR GRATUITY */}
          {form.currentStep === 4 && (
            <Step4Payment
              basePrice={form.basePrice}
              calculatedTip={form.calculatedTip}
              totalPrice={form.totalPrice}
              selectedVehicle={form.selectedVehicle}
              tipType={form.tipType}
              setTipType={form.setTipType}
              customTipAmount={form.customTipAmount}
              setCustomTipAmount={form.setCustomTipAmount}
              cardholderName={form.cardholderName}
              setCardholderName={form.setCardholderName}
              cardNumber={form.cardNumber}
              handleCardNumberChange={form.handleCardNumberChange}
              cardExpiry={form.cardExpiry}
              handleCardExpiryChange={form.handleCardExpiryChange}
              cardCvc={form.cardCvc}
              handleCardCvcChange={form.handleCardCvcChange}
              isSubmitting={form.isSubmitting}
              onBack={() => form.setCurrentStep(3)}
              onSubmit={form.handleConfirmBooking}
            />
          )}
        </div>
      </div>
    </div>
  );
}
