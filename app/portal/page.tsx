'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Car, Clock, MapPin, ArrowRight, ArrowLeft, PlusCircle, CheckCircle2,
  User, Phone, Sparkles, Calendar, VolumeX, Thermometer,
  Tag, ShieldCheck, AlertCircle, MessageSquare, Users, Plane, Info,
  CreditCard, FileText, Download, X, Ticket, Building2, Check, Lock
} from 'lucide-react';
import logoImg from '../../public/logo.png';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, SelectLabel, SelectSeparator } from '@/components/ui/select';
import { apiFetch } from '@/lib/api';
import { LOCATION_GROUPS, VEHICLES, AIRPORT_KEYWORDS } from '@/lib/constants';
import { getVehiclePrice, escapeHtml } from '@/lib/utils';
import { downloadInvoiceHtml } from '@/lib/invoiceTemplate';

const inpClass = "w-full h-12 px-4 bg-slate-50/80 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#aa2d29]/20 focus:border-[#aa2d29] focus:bg-white outline-none transition-all text-slate-900 placeholder:text-slate-400 flex items-center justify-between";

const isAirport = (loc: string) => AIRPORT_KEYWORDS.some(k => loc.includes(k));

const TIME_SLOTS = Array.from({ length: 96 }, (_, i) => {
  const hours = String(Math.floor(i / 4)).padStart(2, '0');
  const minutes = String((i % 4) * 15).padStart(2, '0');
  return `${hours}:${minutes}`;
});

export default function PortalDashboard() {
  const router = useRouter();
  const [customerName, setCustomerName] = useState('Guest');
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState<any | null>(null);

  // Form State - Empty Defaults
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [transferType, setTransferType] = useState('');
  const [passengers, setPassengers] = useState('');

  // Step 2 State (Vehicle & VIP Preferences) - Empty Defaults
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [quietRide, setQuietRide] = useState('');
  const [temperature, setTemperature] = useState('');
  const [childSeat, setChildSeat] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  // Step 3 State (Contact & Passenger Details) - Empty Defaults
  const [salutation, setSalutation] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactMethod, setContactMethod] = useState<'Phone' | 'WhatsApp' | ''>('WhatsApp');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [meetGreetName, setMeetGreetName] = useState('');

  // Step 4 State (Payment & Chauffeur Gratuity)
  const [tipType, setTipType] = useState<'0' | '10' | '15' | '20' | 'custom'>('15');
  const [customTipAmount, setCustomTipAmount] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  useEffect(() => {
    if (showReceiptModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showReceiptModal]);

  const basePrice = getVehiclePrice(selectedVehicle);
  const customVal = parseFloat(customTipAmount) || 0;
  const calculatedTip = tipType === 'custom'
    ? Math.max(0, customVal)
    : (basePrice * parseInt(tipType, 10)) / 100;
  const totalPrice = basePrice + calculatedTip;

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardNumber(formatted);
  };

  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  const handleCardCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCardCvc(raw);
  };

  const formatDisplayDate = (d: string) => {
    if (!d) return '';
    if (d.includes('-')) {
      const [y, m, day] = d.split('-');
      if (y && m && day && y.length === 4) return `${day}/${m}/${y}`;
    }
    return d;
  };

  useEffect(() => {
    const savedName = localStorage.getItem('currentCustomer') || '';
    const savedPhone = localStorage.getItem('currentUserPhone') || '';
    const savedProfile = JSON.parse(localStorage.getItem('customerProfile') || '{}');

    if (savedName) setCustomerName(savedName);

    const nameParts = savedName.split(' ');
    const fName = savedProfile.firstName || nameParts[0] || '';
    const lName = savedProfile.lastName || nameParts.slice(1).join(' ') || '';

    setFirstName(fName);
    setLastName(lName);
    setPhoneNumber(savedProfile.phone || savedPhone || '');

    if (savedProfile.preferredVehicle) setSelectedVehicle(savedProfile.preferredVehicle);
    if (savedProfile.quietRide) setQuietRide(savedProfile.quietRide);
    if (savedProfile.temperature) setTemperature(savedProfile.temperature);
    if (savedProfile.childSeat) setChildSeat(savedProfile.childSeat);
    if (savedProfile.specialRequests) setSpecialRequests(savedProfile.specialRequests);
    
    setMeetGreetName(savedProfile.meetGreetName || `${fName} ${lName}`.trim());

    // Fetch latest preferences from DB to override local storage if necessary
    apiFetch('/me/customer')
      .then(res => res.json())
      .then(result => {
        if (result.status === 'success' && result.data) {
          const dbCust = result.data;
          if (dbCust.first_name) setFirstName(dbCust.first_name);
          if (dbCust.last_name) setLastName(dbCust.last_name);
          if (dbCust.phone) setPhoneNumber(dbCust.phone);
          if (dbCust.preferred_vehicle) setSelectedVehicle(dbCust.preferred_vehicle);
          if (dbCust.first_name || dbCust.last_name) {
            setCustomerName(`${dbCust.first_name || ''} ${dbCust.last_name || ''}`.trim());
          }
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isAirport(pickup) || isAirport(dropoff)) {
      setTransferType('Airport Transfer');
    } else if (pickup || dropoff) {
      setTransferType('Point to Point');
    }
  }, [pickup, dropoff]);

  // Lock background scroll when receipt modal is active
  useEffect(() => {
    if (showReceiptModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showReceiptModal]);

  // Automatically deselect vehicle if passenger count exceeds vehicle capacity
  useEffect(() => {
    if (passengers && selectedVehicle) {
      const pCount = parseInt(passengers || '1', 10);
      const vehObj = VEHICLES.find(v => v.id === selectedVehicle);
      if (vehObj && pCount > (vehObj.maxPax || 6)) {
        setSelectedVehicle('');
      }
    }
  }, [passengers, selectedVehicle]);

  // Validation Check for Step 1
  const validateStep1 = () => {
    if (!pickup) return 'Please select a Pick-up Location.';
    if (!dropoff) return 'Please select a Drop-off Location.';
    if (pickup === dropoff) return 'Pick-up and Drop-off locations cannot be the same.';
    if (!date) return 'Please select a Transfer Date.';
    if (!time) return 'Please select a Transfer Time.';
    if (!passengers) return 'Please select the number of Passengers.';
    return null;
  };

  // Validation Check for Step 2
  const validateStep2 = () => {
    if (!selectedVehicle) return 'Please select a VIP Vehicle Class.';
    const pCount = parseInt(passengers || '1', 10);
    const vehObj = VEHICLES.find(v => v.id === selectedVehicle);
    if (vehObj && pCount > (vehObj.maxPax || 6)) {
      return `Selected vehicle (${vehObj.name}) cannot accommodate ${passengers} passengers (Max ${vehObj.maxPax} pax). Please select a larger vehicle.`;
    }
    return null;
  };

  // Validation Check for Step 3
  const validateStep3 = () => {
    if (!salutation) return 'Please select Title / Salutation.';
    if (!firstName.trim()) return 'Please enter your First Name.';
    if (!lastName.trim()) return 'Please enter your Last Name.';
    if (!contactMethod) return 'Please select a Contact Method.';
    if (!phoneNumber.trim()) return 'Please enter your Phone / WhatsApp Number.';
    if (transferType === 'Airport Transfer' && !flightNumber.trim()) {
      return 'Please enter your Flight Number for Airport Transfers.';
    }
    return null;
  };

  // Validation Check for Step 4
  const validateStep4 = () => {
    if (!cardholderName.trim()) return 'Please enter the Cardholder Name.';
    const cleanNum = cardNumber.replace(/\s+/g, '');
    if (cleanNum.length < 15) return 'Please enter a valid 16-digit Card Number.';
    if (cardExpiry.length < 5 || !cardExpiry.includes('/')) return 'Please enter the Expiration Date (MM/YY).';
    if (cardCvc.length < 3) return 'Please enter a 3 or 4-digit CVV/CVC code.';
    return null;
  };

  const handleNextToStep2 = () => {
    const err = validateStep1();
    if (err) {
      setValidationError(err);
      return;
    }
    setValidationError('');
    setCurrentStep(2);
  };

  const handleNextToStep3 = () => {
    const err = validateStep2();
    if (err) {
      setValidationError(err);
      return;
    }
    setValidationError('');
    setCurrentStep(3);
  };

  const handleNextToStep4 = () => {
    const err = validateStep3();
    if (err) {
      setValidationError(err);
      return;
    }
    if (!cardholderName.trim()) {
      setCardholderName(`${firstName} ${lastName}`.trim());
    }
    setValidationError('');
    setCurrentStep(4);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateStep4();
    if (err) {
      setValidationError(err);
      return;
    }
    setValidationError('');
    setIsSubmitting(true);

    const userEmail = localStorage.getItem('currentCustomerEmail') || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@vip.com`;
    const fullPassengerName = `${salutation} ${firstName} ${lastName}`.trim();
    const cardLast4 = cardNumber.replace(/\s+/g, '').slice(-4) || '4242';

    const payload = {
        first_name: firstName,
        last_name: lastName,
        email: userEmail,
        phone: phoneNumber,
        contact_method: contactMethod,
        customer_type: 'Individual VIP',
        transfer_type: transferType,
        vehicle_type: selectedVehicle,
        pickup_location: pickup,
        dropoff_location: dropoff,
        transfer_date: date,
        transfer_time: time,
        flight_number: flightNumber || null,
        passengers: parseInt(passengers) || 1,
        price: totalPrice,
        notes: `[Payment: Paid (Card •••• ${cardLast4})] [Fare: $${basePrice.toFixed(2)}] [Tip: $${calculatedTip.toFixed(2)}] [Quiet Ride: ${quietRide || 'Standard'}] [Climate: ${temperature || 'Optimal'}] [Child Seat: ${childSeat || 'None'}] [Meet Sign: ${meetGreetName || fullPassengerName}] ${specialRequests ? 'Notes: ' + specialRequests : ''}`,
        status: 'Pending',
      };

    let finalBookingId: number | string = Math.floor(1000 + Math.random() * 9000);
    try {
      const res = await apiFetch('/customers', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const responseData = await res.json();
      if (responseData?.data?.id || responseData?.id) {
        finalBookingId = responseData.data?.id || responseData.id;
      }
    } catch (error) {
      console.error('Booking submission error:', error);
    }

    setBookingConfirmed({
      id: finalBookingId,
      pickupLocation: pickup,
      dropoffLocation: dropoff,
      transferDate: formatDisplayDate(date),
      transferTime: time,
      transferType: transferType || 'VIP Transfer',
      vehicleType: selectedVehicle,
      passengers,
      flightNumber,
      passengerName: fullPassengerName,
      email: (typeof window !== 'undefined' ? localStorage.getItem('currentCustomerEmail') : '') || '',
      company: '',
      phone: phoneNumber,
      status: 'Pending',
      basePrice: basePrice.toFixed(2),
      tipAmount: calculatedTip.toFixed(2),
      totalPrice: totalPrice.toFixed(2),
      cardLast4,
    });
    setIsSubmitting(false);
  };

  const handleDownloadReceipt = (receipt: any) => {
    downloadInvoiceHtml({
      id: receipt.id,
      pickupLocation: receipt.pickupLocation,
      dropoffLocation: receipt.dropoffLocation,
      transferDate: receipt.transferDate,
      transferTime: receipt.transferTime,
      transferType: receipt.transferType || 'VIP Transfer',
      vehicleType: receipt.vehicleType,
      passengers: receipt.passengers,
      flightNumber: receipt.flightNumber,
      passengerName: receipt.passengerName,
      email: receipt.email,
      phone: receipt.phone,
      company: receipt.company,
      status: receipt.status || 'Confirmed',
      basePrice: parseFloat(receipt.basePrice) || 0,
      tipAmount: parseFloat(receipt.tipAmount) || 0,
      totalPrice: parseFloat(receipt.totalPrice) || 0,
      cardLast4: receipt.cardLast4 || '5632',
    }, `Invoice_INV_TR_${receipt.id}.html`);
  };

  const handleResetWizard = () => {
    setBookingConfirmed(null);
    setCurrentStep(1);
    setPickup('');
    setDropoff('');
    setDate('');
    setTime('');
    setTransferType('');
    setPassengers('');
    setSelectedVehicle('');
    setQuietRide('');
    setTemperature('');
    setChildSeat('');
    setSpecialRequests('');
    setTipType('15');
    setCustomTipAmount('');
    setCardholderName('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvc('');
    setValidationError('');
  };

  // SUCCESS CONFIRMATION VIEW
  if (bookingConfirmed) {
    return (
      <div className="w-full max-w-5xl py-10">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200/80 shadow-md text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100 shadow-xs">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
              Reservation Received
            </span>
            <h1 className="text-3xl md:text-4xl font-heading font-black text-slate-900 mt-3 tracking-tight">
              Booking Received!
            </h1>
            <p className="text-slate-500 mt-1 text-base">
              Your VIP transfer request is currently pending confirmation. Pass Ref: <strong className="text-slate-900">#TR-{bookingConfirmed.id}</strong>
            </p>
          </div>

          {/* Ticket Pass Summary */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 text-left space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200/80 pb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Ticket className="w-4 h-4 text-[#aa2d29]" /> Reservation Details
              </span>
              <span className="text-xs font-bold text-[#aa2d29] bg-rose-50 px-2.5 py-1 rounded-md border border-rose-100">
                {bookingConfirmed.vehicleType}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-slate-400 font-semibold mb-0.5">Route</p>
                <p className="font-bold text-slate-900 text-sm">{bookingConfirmed.pickupLocation} ➔ {bookingConfirmed.dropoffLocation}</p>
              </div>
              <div>
                <p className="text-slate-400 font-semibold mb-0.5">Date & Time</p>
                <p className="font-bold text-slate-900 text-sm">{bookingConfirmed.transferDate} at {bookingConfirmed.transferTime}</p>
              </div>
              <div>
                <p className="text-slate-400 font-semibold mb-0.5">Passenger Name</p>
                <p className="font-bold text-slate-900 text-sm">{bookingConfirmed.passengerName}</p>
              </div>
              <div>
                <p className="text-slate-400 font-semibold mb-0.5">Contact Number</p>
                <p className="font-bold text-slate-900 text-sm">{bookingConfirmed.phone}</p>
              </div>
            </div>

            {/* Price & Payment Breakdown */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between items-center text-slate-500 font-medium">
                <span>Base Transfer Fare:</span>
                <span className="font-bold text-slate-900">${bookingConfirmed.basePrice}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 font-medium">
                <span>Chauffeur Gratuity (Tip):</span>
                <span className="font-bold text-slate-900">${bookingConfirmed.tipAmount}</span>
              </div>
              <div className="border-t border-slate-100 pt-2 flex justify-between items-center text-sm font-bold text-slate-900">
                <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                  <CheckCircle2 className="w-4 h-4" /> Total Paid (Card ending in •••• {bookingConfirmed.cardLast4}):
                </span>
                <span className="text-[#aa2d29] text-base font-black">${bookingConfirmed.totalPrice}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <button
              onClick={() => setShowReceiptModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-2xl font-bold shadow-md shadow-emerald-600/20 text-sm transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
            >
              <FileText className="w-4 h-4" />
              <span>Get Receipt</span>
            </button>
            <button
              onClick={() => router.push('/portal/trips')}
              className="bg-[#aa2d29] text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-[#8e2622] shadow-md shadow-[#aa2d29]/20 text-sm transition-all cursor-pointer active:scale-95"
            >
              View My Trips
            </button>
            <button
              onClick={handleResetWizard}
              className="bg-white border border-slate-300 text-slate-700 px-8 py-3.5 rounded-2xl font-bold hover:bg-slate-50 text-sm transition-all cursor-pointer active:scale-95"
            >
              Book Another Transfer
            </button>
          </div>

          {/* Professional PDF/Receipt Modal Popup */}
          {showReceiptModal && (
            <div 
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5"
              onClick={() => setShowReceiptModal(false)}
            >
              <div 
                className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-gray-100 relative animate-in fade-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
              >
                
                {/* Modal Actions Top Bar (Sticky/Fixed) */}
                <div className="bg-gray-900 text-white p-3.5 px-6 flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                    <FileText className="w-4 h-4 text-[#aa2d29]" /> Tax Invoice Preview
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadReceipt(bookingConfirmed)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#aa2d29] hover:bg-[#8e2622] text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                    <button
                      onClick={() => setShowReceiptModal(false)}
                      className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                      title="Close"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Official Invoice Paper Document (Single clean internal scroll if needed) */}
                <div className="p-5 sm:p-7 space-y-4 bg-white text-left overflow-y-auto flex-1">
                  
                  {/* Invoice Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start border-b border-gray-200 pb-4 gap-4">
                    <div>
                      <Image
                        src={logoImg}
                        alt="Logo"
                        className="h-8 w-auto mb-2 mix-blend-multiply"
                        priority
                      />
                      <p className="text-[11px] text-gray-400 font-medium leading-tight">VIP Chauffeur & Logistics Services Ltd.</p>
                      <p className="text-[11px] text-gray-400 font-medium leading-tight">Tax Registration No: 9812-4091-VIP</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-full border border-emerald-200 uppercase tracking-widest inline-block mb-1">
                        PAID IN FULL
                      </span>
                      <h2 className="text-lg font-black font-heading text-gray-900 leading-tight">INVOICE #INV-TR-{bookingConfirmed.id}</h2>
                      <p className="text-[11px] text-gray-500 font-medium mt-0.5">Date: {bookingConfirmed.transferDate} {bookingConfirmed.transferTime || ''}</p>
                    </div>
                  </div>

                  {/* Bill To & Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/80 p-3.5 rounded-xl border border-gray-100 text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Billed To</span>
                      <p className="font-bold text-gray-900 text-sm">{bookingConfirmed.passengerName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{bookingConfirmed.email || (typeof window !== 'undefined' ? localStorage.getItem('currentCustomerEmail') : '') || 'vip.guest@transfervip.com'}</p>
                      <p className="text-xs text-gray-500">{bookingConfirmed.phone || 'No phone provided'}</p>
                      {bookingConfirmed.company && (
                        <p className="text-xs font-semibold text-[#aa2d29] mt-1 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5" /> Partner: {bookingConfirmed.company}
                        </p>
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Service Details</span>
                      <p className="text-xs font-semibold text-gray-700 mb-0.5"><span className="text-gray-400 font-normal">Service:</span> {bookingConfirmed.transferType || 'VIP Transfer'}</p>
                      <p className="text-xs font-semibold text-gray-700 mb-0.5"><span className="text-gray-400 font-normal">Vehicle:</span> {bookingConfirmed.vehicleType}</p>
                      <p className="text-xs font-semibold text-gray-700 mb-0.5"><span className="text-gray-400 font-normal">Passengers:</span> {bookingConfirmed.passengers || '1'} Pax</p>
                      {bookingConfirmed.flightNumber && (
                        <p className="text-xs font-semibold text-gray-700"><span className="text-gray-400 font-normal">Flight No:</span> {bookingConfirmed.flightNumber}</p>
                      )}
                    </div>
                  </div>

                  {/* Route Summary Box */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1.5">Route Breakdown</span>
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-gray-100 text-gray-600 uppercase font-bold text-[10px] tracking-wider">
                          <tr>
                            <th className="p-2.5 px-3">Transfer Route</th>
                            <th className="p-2.5 px-3 text-center">Type</th>
                            <th className="p-2.5 px-3 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          <tr>
                            <td className="p-2.5 px-3 font-semibold text-gray-900">
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-[#aa2d29] shrink-0" />
                                <span>{bookingConfirmed.pickupLocation} ➔ {bookingConfirmed.dropoffLocation}</span>
                              </div>
                            </td>
                            <td className="p-2.5 px-3 text-center font-medium text-gray-600">{bookingConfirmed.vehicleType}</td>
                            <td className="p-2.5 px-3 text-right font-bold uppercase text-emerald-600">
                              PAID
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="bg-gray-50/80 rounded-xl p-3.5 border border-gray-200 text-xs space-y-1.5">
                    <div className="flex justify-between items-center text-gray-500 font-medium">
                      <span>Base Transfer Fare ({bookingConfirmed.vehicleType}):</span>
                      <span className="font-bold text-gray-900">${bookingConfirmed.basePrice}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-500 font-medium">
                      <span>Chauffeur Gratuity (Driver Tip):</span>
                      <span className="font-bold text-gray-900">${bookingConfirmed.tipAmount}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-1.5 flex justify-between items-center text-xs font-bold text-gray-900">
                      <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Total Paid (Card ending in •••• {bookingConfirmed.cardLast4 || '5432'}):
                      </span>
                      <span className="text-[#aa2d29] text-sm font-black">${bookingConfirmed.totalPrice} USD</span>
                    </div>
                  </div>

                  {/* Total & Footer Stamp */}
                  <div className="flex flex-col sm:flex-row justify-between items-center pt-2.5 border-t border-gray-200 gap-3">
                    <div className="flex items-center gap-2.5 bg-[#ecfdf5] p-2.5 px-3.5 rounded-xl border border-[#a7f3d0] w-full sm:w-auto">
                      <ShieldCheck className="w-4 h-4 text-[#047857] shrink-0" />
                      <div>
                        <p className="font-bold text-[#047857] text-xs leading-tight">Verified Electronic Tax Invoice</p>
                        <p className="text-[10px] text-[#059669] leading-tight mt-0.5">Issued electronically under VIP Corporate Account Agreement.</p>
                      </div>
                    </div>

                    <div className="text-right bg-[#0f172a] text-white p-3.5 px-5 rounded-2xl shadow-sm w-full sm:w-auto shrink-0 flex sm:flex-col justify-between sm:justify-center items-center sm:items-end">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-[#94a3b8] block">TOTAL PAID</span>
                      <span className="text-xl font-black font-heading text-white block leading-tight sm:mt-0.5">${bookingConfirmed.totalPrice} USD</span>
                    </div>
                  </div>

                </div>

                {/* Modal Bottom Footer (Sticky/Fixed) */}
                <div className="bg-gray-50 p-2.5 px-6 border-t border-gray-100 flex justify-center items-center text-[11px] text-gray-400 shrink-0">
                  <span>VIP Chauffeur Services © 2026</span>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl space-y-6 py-2">
      {/* Clean Top Left Heading */}
      <div className="pt-2">
        <h1 className="text-3xl md:text-4xl text-slate-900 font-heading font-black tracking-tight">
          Welcome back, {customerName}
        </h1>
        <p className="text-slate-500 mt-1.5 text-sm font-medium">
          Schedule your luxury transfer in 4 quick steps.
        </p>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#aa2d29]/10 flex items-center justify-center shrink-0">
            <Car className="w-4 h-4 text-[#aa2d29]" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest leading-tight">Fleet</p>
            <p className="text-sm font-bold text-slate-900 leading-tight">4 Vehicle Classes</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest leading-tight">Chauffeurs</p>
            <p className="text-sm font-bold text-slate-900 leading-tight">Professional & Vetted</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 text-sky-500" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest leading-tight">Support</p>
            <p className="text-sm font-bold text-slate-900 leading-tight">24 / 7 Available</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest leading-tight">Coverage</p>
            <p className="text-sm font-bold text-slate-900 leading-tight">Airports — TRNC</p>
          </div>
        </div>
      </div>

      {/* Tip Banner */}
      <div className="flex items-center gap-3 px-5 py-3.5 bg-slate-900 rounded-2xl text-white">
        <Info className="w-4 h-4 text-[#aa2d29] shrink-0" />
        <p className="text-xs font-medium text-slate-300">
          <span className="text-white font-semibold">Tip: </span>
          Book at least <span className="text-white font-semibold">2 hours</span> before your desired pick-up time to guarantee vehicle availability. For airport pickups, we track your flight in real time.
        </p>
      </div>

      {/* 4-STEP WIZARD ENGINE CONTAINER */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
        
        {/* STEPPER NAVIGATION HEADER (1, 2, 3, 4 Indicators) */}
        <div className="bg-slate-900 text-white p-6 md:px-10 border-b border-slate-800">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {/* Step 1 Indicator */}
            <div className={`flex items-center gap-2.5 ${currentStep === 1 ? 'opacity-100' : 'opacity-60'}`}>
              <div className={`w-9 h-9 rounded-xl font-heading font-bold text-xs flex items-center justify-center transition-all ${
                currentStep === 1 ? 'bg-[#aa2d29] text-white shadow-md' : currentStep > 1 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
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
              <div className={`w-9 h-9 rounded-xl font-heading font-bold text-xs flex items-center justify-center transition-all ${
                currentStep === 2 ? 'bg-[#aa2d29] text-white shadow-md' : currentStep > 2 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
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
              <div className={`w-9 h-9 rounded-xl font-heading font-bold text-xs flex items-center justify-center transition-all ${
                currentStep === 3 ? 'bg-[#aa2d29] text-white shadow-md' : currentStep > 3 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
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
              <div className={`w-9 h-9 rounded-xl font-heading font-bold text-xs flex items-center justify-center transition-all ${
                currentStep === 4 ? 'bg-[#aa2d29] text-white shadow-md' : 'bg-slate-800 text-slate-400'
              }`}>
                4
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Step 4</p>
                <p className="text-xs font-bold text-white mt-1">Payment & Tip</p>
              </div>
            </div>
          </div>
        </div>

        {/* VALIDATION ERROR BANNER */}
        {validationError && (
          <div className="bg-rose-50 border-b border-rose-200 px-6 py-3.5 flex items-center gap-3 text-rose-700 text-xs font-bold animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* STEP CONTENT PANEL */}
        <div className="p-8 md:p-12 space-y-8">
          
          {/* ================= STEP 1: ROUTE & TIME ================= */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#aa2d29]" />
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Step 1: Pick-up & Drop-off Details</h2>
                    <p className="text-xs text-slate-500">Select your transfer route, schedule date, and passenger count.</p>
                  </div>
                </div>
              </div>

              {/* Route Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pick-up Location */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Pick-up Location *</label>
                  <Select value={pickup} onValueChange={val => setPickup(val === 'none' || !val ? '' : val)}>
                    <SelectTrigger className={inpClass}>
                      <SelectValue placeholder="Select pick-up point" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none" className="text-slate-400 italic">-- Clear Selection --</SelectItem>
                      {LOCATION_GROUPS.map((group, i) => (
                        <SelectGroup key={group.label}>
                          {i > 0 && <SelectSeparator />}
                          <SelectLabel className="font-bold text-[11px] text-slate-500 uppercase tracking-widest bg-slate-50/50 px-2 py-1.5">{group.label}</SelectLabel>
                          {group.items.map(o => <SelectItem key={o} value={o} className="pl-4">{o}</SelectItem>)}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Drop-off Location */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Drop-off Location *</label>
                  <Select value={dropoff} onValueChange={val => setDropoff(val === 'none' || !val ? '' : val)}>
                    <SelectTrigger className={inpClass}>
                      <SelectValue placeholder="Select drop-off point" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none" className="text-slate-400 italic">-- Clear Selection --</SelectItem>
                      {LOCATION_GROUPS.map((group, i) => (
                        <SelectGroup key={group.label}>
                          {i > 0 && <SelectSeparator />}
                          <SelectLabel className="font-bold text-[11px] text-slate-500 uppercase tracking-widest bg-slate-50/50 px-2 py-1.5">{group.label}</SelectLabel>
                          {group.items.map(o => <SelectItem key={o} value={o} className="pl-4">{o}</SelectItem>)}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Transfer Type Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center justify-between">
                  <span>Transfer Type *</span>
                  {(isAirport(pickup) || isAirport(dropoff)) && (
                    <span className="text-[11px] text-[#aa2d29] font-semibold lowercase tracking-normal">
                      (Auto-set for Airport route)
                    </span>
                  )}
                </label>
                <Select
                  value={transferType}
                  onValueChange={val => setTransferType(val === 'none' || !val ? '' : val)}
                  disabled={isAirport(pickup) || isAirport(dropoff)}
                >
                  <SelectTrigger className={`${inpClass} ${isAirport(pickup) || isAirport(dropoff) ? 'opacity-80 bg-slate-100 cursor-not-allowed' : ''}`}>
                    <SelectValue placeholder="Select transfer type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none" className="text-slate-400 italic">-- Select Transfer Type --</SelectItem>
                    <SelectItem value="Hotel & Resort Transfer">Hotel & Resort Transfer</SelectItem>
                    <SelectItem value="Hourly Transportation">Hourly Transportation</SelectItem>
                    <SelectItem value="Airport Transfer" disabled={!isAirport(pickup) && !isAirport(dropoff)} className={!isAirport(pickup) && !isAirport(dropoff) ? "opacity-50 cursor-not-allowed" : ""}>Airport Transfer</SelectItem>
                    <SelectItem value="Point to Point">Point to Point</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date & Time Grid with Standardized Height and Font */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Transfer Date *</label>
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="DD/MM/YYYY"
                      value={formatDisplayDate(date)}
                      readOnly
                      className={`${inpClass} relative z-0 cursor-pointer`}
                    />
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      onClick={e => { try { e.currentTarget.showPicker(); } catch (err) { } }}
                      className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Transfer Time *</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="HH:MM"
                      value={time || ''}
                      readOnly
                      className={`${inpClass} relative z-0 cursor-pointer`}
                    />
                    <input
                      type="time"
                      required
                      value={time}
                      onChange={e => setTime(e.target.value)}
                      onClick={e => { try { e.currentTarget.showPicker(); } catch (err) { } }}
                      className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Passengers *</label>
                  <Select value={passengers} onValueChange={val => setPassengers(val || '')}>
                    <SelectTrigger className={inpClass}>
                      <SelectValue placeholder="Select passengers" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                        <SelectItem key={n} value={String(n)}>
                          {n} {n === 1 ? 'passenger' : 'passengers'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Navigation Footer for Step 1 */}
              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={handleNextToStep2}
                  className="bg-[#aa2d29] hover:bg-[#8e2622] text-white font-bold px-8 py-3.5 rounded-2xl shadow-md shadow-[#aa2d29]/20 text-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  <span>Choose a Vehicle</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 2: VEHICLE & VIP PREFERENCES ================= */}
          {currentStep === 2 && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <Car className="w-5 h-5 text-[#aa2d29]" />
                <div>
                  <h2 className="text-base font-bold text-slate-900">Step 2: Select Vehicle & VIP Preferences</h2>
                  <p className="text-xs text-slate-500">Choose your VIP vehicle class and configure your cabin experience.</p>
                </div>
              </div>

              {/* Vehicle Selection Cards */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Select Vehicle Class *</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {VEHICLES.map(v => {
                    const pCount = parseInt(passengers || '1', 10);
                    const isCapacityExceeded = pCount > (v.maxPax || 6);
                    const isSelected = selectedVehicle === v.id && !isCapacityExceeded;

                    return (
                      <div
                        key={v.id}
                        onClick={() => {
                          if (!isCapacityExceeded) {
                            setSelectedVehicle(v.id);
                          }
                        }}
                        className={`p-5 rounded-2xl border-2 transition-all select-none ${
                          isCapacityExceeded
                            ? 'opacity-40 cursor-not-allowed bg-slate-100/90 border-slate-200'
                            : isSelected
                            ? 'border-[#aa2d29] bg-rose-50/40 shadow-xs cursor-pointer'
                            : 'border-slate-200/80 bg-slate-50/50 hover:border-slate-300 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                            <Car className={`w-4 h-4 ${isSelected ? 'text-[#aa2d29]' : isCapacityExceeded ? 'text-slate-400' : 'text-slate-500'}`} />
                            <span className={isCapacityExceeded ? 'text-slate-500 line-through decoration-slate-400' : ''}>{v.name}</span>
                          </h3>
                          <span className={`font-black text-base ${isCapacityExceeded ? 'text-slate-400' : 'text-[#aa2d29]'}`}>{v.price}</span>
                        </div>
                        <p className="text-xs text-slate-500 mb-3">{v.desc}</p>
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className={`px-2.5 py-1 rounded-md border ${
                            isCapacityExceeded
                              ? 'bg-rose-50 text-rose-600 border-rose-200'
                              : 'bg-white text-slate-600 border-slate-200'
                          }`}>
                            {isCapacityExceeded ? `Max ${v.maxPax} Pax (Over Capacity)` : v.pax}
                          </span>
                          <span className={
                            isCapacityExceeded
                              ? 'text-rose-500 font-semibold'
                              : isSelected
                              ? 'text-[#aa2d29] font-black'
                              : 'text-slate-400'
                          }>
                            {isCapacityExceeded ? `Not available for ${pCount} pax` : isSelected ? '✓ Selected' : 'Click to select'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* VIP Cabin Preferences */}
              <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-200/80 space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">VIP Cabin & Comfort Preferences</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Quiet Ride */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                      Quiet Ride Mode
                    </label>
                    <Select value={quietRide} onValueChange={val => setQuietRide(val || '')}>
                      <SelectTrigger className={inpClass.replace('bg-slate-50/80', 'bg-white')}>
                        <SelectValue placeholder="Select quiet ride mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes (Silent Cabin - No Small Talk)</SelectItem>
                        <SelectItem value="No">No (Standard Friendly Chauffeur)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Temperature */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                      Cabin AC Climate
                    </label>
                    <Select value={temperature} onValueChange={val => setTemperature(val || '')}>
                      <SelectTrigger className={inpClass.replace('bg-slate-50/80', 'bg-white')}>
                        <SelectValue placeholder="Select cabin temperature" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="20°C">20°C (Cool & Fresh)</SelectItem>
                        <SelectItem value="21°C">21°C (Optimal Climate)</SelectItem>
                        <SelectItem value="22°C">22°C (Warm Comfort)</SelectItem>
                        <SelectItem value="23°C">23°C (Cozy Warm)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Child Seat */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Child / Baby Seat</label>
                    <Select value={childSeat} onValueChange={val => setChildSeat(val || '')}>
                      <SelectTrigger className={inpClass.replace('bg-slate-50/80', 'bg-white')}>
                        <SelectValue placeholder="Select child seat option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="None">None (Adult Passengers)</SelectItem>
                        <SelectItem value="1 Infant Seat">1 Infant Seat (0-12 Months)</SelectItem>
                        <SelectItem value="1 Child Seat">1 Child Safety Seat (1-4 Yrs)</SelectItem>
                        <SelectItem value="1 Booster Seat">1 Booster Seat (4-8 Yrs)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Special Requests / Refreshments</label>
                  <textarea
                    placeholder="e.g. Still mineral water, Wi-Fi password details..."
                    value={specialRequests}
                    onChange={e => setSpecialRequests(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:border-[#aa2d29] outline-none h-24 resize-none text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Navigation Footer for Step 2 */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 rounded-2xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Route</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextToStep3}
                  className="bg-[#aa2d29] hover:bg-[#8e2622] text-white font-bold px-8 py-3.5 rounded-2xl shadow-md shadow-[#aa2d29]/20 text-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  <span>Passenger Contact Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 3: CONTACT & PASSENGER DETAILS ================= */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <User className="w-5 h-5 text-[#aa2d29]" />
                <div>
                  <h2 className="text-base font-bold text-slate-900">Step 3: Passenger & Contact Information</h2>
                  <p className="text-xs text-slate-500">Provide passenger details and preferred contact channel for driver updates.</p>
                </div>
              </div>

              {/* Salutation, First Name, Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Title / Salutation *</label>
                  <Select value={salutation} onValueChange={val => setSalutation(val || '')}>
                    <SelectTrigger className={inpClass}>
                      <SelectValue placeholder="Select title" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mr.">Mr.</SelectItem>
                      <SelectItem value="Mrs.">Mrs.</SelectItem>
                      <SelectItem value="Ms.">Ms.</SelectItem>
                      <SelectItem value="Dr.">Dr.</SelectItem>
                      <SelectItem value="Prof.">Prof.</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">First Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Arda"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className={inpClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Last Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Şahin"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className={inpClass}
                  />
                </div>
              </div>

              {/* Preferred Contact Method & Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Preferred Contact Method *</label>
                  <Select value={contactMethod} onValueChange={(val: any) => setContactMethod(val || '')}>
                    <SelectTrigger className={inpClass}>
                      <SelectValue placeholder="Select contact method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WhatsApp">WhatsApp Message (Recommended)</SelectItem>
                      <SelectItem value="Phone">Direct Phone Call</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                    {contactMethod || 'Contact'} Number *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="+90 533 000 0000"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    className={inpClass}
                  />
                </div>
              </div>

              {/* Flight Number & Meet & Greet Name (Only for Airport Transfers) */}
              {transferType === 'Airport Transfer' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      Flight Number *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. TK 1921"
                      value={flightNumber}
                      onChange={e => setFlightNumber(e.target.value)}
                      className={inpClass}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      Airport Meet Signage Name
                    </label>
                    <input
                      type="text"
                      placeholder="Defaults to Passenger Name if blank"
                      value={meetGreetName}
                      onChange={e => setMeetGreetName(e.target.value)}
                      className={inpClass}
                    />
                  </div>
                </div>
              )}

              {/* Navigation Footer for Step 3 */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 rounded-2xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Vehicle</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextToStep4}
                  className="bg-[#aa2d29] hover:bg-[#8e2622] text-white font-bold px-8 py-3.5 rounded-2xl shadow-md shadow-[#aa2d29]/20 text-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 4: SECURE PAYMENT & CHAUFFEUR GRATUITY ================= */}
          {currentStep === 4 && (
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
                  ].map((tip) => {
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
                        placeholder="123"
                        maxLength={4}
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
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 rounded-2xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Passenger Details</span>
                </button>

                <button
                  type="button"
                  onClick={handleConfirmBooking}
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
          )}

        </div>
      </div>
    </div>
  );
}
