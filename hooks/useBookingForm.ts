'use client';
import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { VEHICLES, AIRPORT_KEYWORDS } from '@/lib/constants';
import { getVehiclePrice } from '@/lib/utils';
import { formatCardNumber, formatCardExpiry } from '@/lib/cardUtils';

const isAirport = (loc: string) => AIRPORT_KEYWORDS.some(k => loc.includes(k));

const formatDisplayDate = (d: string) => {
  if (!d) return '';
  if (d.includes('-')) {
    const [y, m, day] = d.split('-');
    if (y && m && day && y.length === 4) return `${day}/${m}/${y}`;
  }
  return d;
};

export function useBookingForm() {
  const [customerName, setCustomerName] = useState('Guest');
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState<any | null>(null);

  // Form State - Step 1
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [transferType, setTransferType] = useState('');
  const [passengers, setPassengers] = useState('');

  // Form State - Step 2 (Vehicle & VIP Preferences)
  const [selectedVehicle, setSelectedVehicle] = useState('VIP Business Van');
  const [quietRide, setQuietRide] = useState('Yes');
  const [temperature, setTemperature] = useState('21°C');
  const [childSeat, setChildSeat] = useState('None');
  const [specialRequests, setSpecialRequests] = useState('');

  // Form State - Step 3 (Contact & Passenger Details)
  const [salutation, setSalutation] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactMethod, setContactMethod] = useState<'Phone' | 'WhatsApp' | ''>('WhatsApp');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [meetGreetName, setMeetGreetName] = useState('');

  // Form State - Step 4 (Payment & Chauffeur Gratuity)
  const [tipType, setTipType] = useState<'0' | '10' | '15' | '20' | 'custom'>('15');
  const [customTipAmount, setCustomTipAmount] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const basePrice = getVehiclePrice(selectedVehicle);
  const customVal = parseFloat(customTipAmount) || 0;
  const calculatedTip = tipType === 'custom'
    ? Math.max(0, customVal)
    : (basePrice * parseInt(tipType, 10)) / 100;
  const totalPrice = basePrice + calculatedTip;

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardExpiry(formatCardExpiry(e.target.value, cardExpiry));
  };

  const handleCardCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCardCvc(raw);
  };

  const loadProfileAndPreferences = () => {
    const currentEmail = localStorage.getItem('currentCustomerEmail') || '';
    const savedName = localStorage.getItem('currentCustomer') || '';
    const savedPhone = localStorage.getItem('currentUserPhone') || '';
    const userProfileKey = currentEmail ? `customerProfile_${currentEmail.toLowerCase().trim()}` : 'customerProfile';
    const savedProfile = JSON.parse(localStorage.getItem(userProfileKey) || localStorage.getItem('customerProfile') || '{}');

    if (savedName) setCustomerName(savedName);

    const nameParts = (savedName || '').split(' ');
    const fName = savedProfile.firstName || nameParts[0] || '';
    const lName = savedProfile.lastName || nameParts.slice(1).join(' ') || '';

    if (fName) setFirstName(fName);
    if (lName) setLastName(lName);
    if (savedProfile.phone || savedPhone) setPhoneNumber(savedProfile.phone || savedPhone);

    if (savedProfile.preferredVehicle) {
      setSelectedVehicle(savedProfile.preferredVehicle);
    } else {
      setSelectedVehicle('VIP Business Van');
    }

    if (savedProfile.quietRide) {
      setQuietRide(savedProfile.quietRide);
    } else {
      setQuietRide('Yes');
    }

    if (savedProfile.temperature) {
      setTemperature(savedProfile.temperature);
    } else {
      setTemperature('21°C');
    }

    if (savedProfile.childSeat) {
      setChildSeat(savedProfile.childSeat);
    } else {
      setChildSeat('None');
    }

    if (savedProfile.specialRequests) {
      setSpecialRequests(savedProfile.specialRequests);
    }

    const mName = savedProfile.meetGreetName || `${fName} ${lName}`.trim();
    if (mName) {
      setMeetGreetName(mName);
    }
  };

  useEffect(() => {
    loadProfileAndPreferences();

    const handleProfileUpdate = () => {
      loadProfileAndPreferences();
    };

    window.addEventListener('customerProfileUpdated', handleProfileUpdate);
    window.addEventListener('storage', handleProfileUpdate);

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

          const reservations = dbCust.reservations || [];
          if (reservations.length > 0) {
            const latestNotes = reservations[0]?.notes || '';
            const qMatch = latestNotes.match(/\[Quiet Ride:\s*([^\]]+)\]/i);
            const cMatch = latestNotes.match(/\[Climate:\s*([^\]]+)\]/i);
            const csMatch = latestNotes.match(/\[Child Seat:\s*([^\]]+)\]/i);
            const msMatch = latestNotes.match(/\[Meet Sign:\s*([^\]]+)\]/i);
            const nMatch = latestNotes.match(/Notes:\s*(.*)$/i);

            const currentEmail = localStorage.getItem('currentCustomerEmail') || '';
            const userProfileKey = currentEmail ? `customerProfile_${currentEmail.toLowerCase().trim()}` : 'customerProfile';
            const existingProf = JSON.parse(localStorage.getItem(userProfileKey) || localStorage.getItem('customerProfile') || '{}');
            let shouldSave = false;

            if (!existingProf.preferredVehicle && reservations[0]?.vehicle_type) {
              existingProf.preferredVehicle = reservations[0].vehicle_type;
              setSelectedVehicle(reservations[0].vehicle_type);
              shouldSave = true;
            }
            if (!existingProf.quietRide && qMatch) {
              const qVal = qMatch[1].trim().includes('Silent') || qMatch[1].trim() === 'Yes' ? 'Yes' : 'No';
              existingProf.quietRide = qVal;
              setQuietRide(qVal);
              shouldSave = true;
            }
            if (!existingProf.temperature && cMatch) {
              const cVal = cMatch[1].trim();
              existingProf.temperature = cVal;
              setTemperature(cVal);
              shouldSave = true;
            }
            if (!existingProf.childSeat && csMatch) {
              const csVal = csMatch[1].trim();
              existingProf.childSeat = csVal;
              setChildSeat(csVal);
              shouldSave = true;
            }
            if (!existingProf.meetGreetName && msMatch) {
              const msVal = msMatch[1].trim();
              existingProf.meetGreetName = msVal;
              setMeetGreetName(msVal);
              shouldSave = true;
            }
            if (!existingProf.specialRequests && nMatch) {
              const srVal = nMatch[1].trim();
              existingProf.specialRequests = srVal;
              setSpecialRequests(srVal);
              shouldSave = true;
            }

            if (shouldSave) {
              localStorage.setItem('customerProfile', JSON.stringify(existingProf));
              if (currentEmail) {
                localStorage.setItem(userProfileKey, JSON.stringify(existingProf));
              }
            }
          }
        }
      })
      .catch(() => {});

    return () => {
      window.removeEventListener('customerProfileUpdated', handleProfileUpdate);
      window.removeEventListener('storage', handleProfileUpdate);
    };
  }, []);

  useEffect(() => {
    if (isAirport(pickup) || isAirport(dropoff)) {
      setTransferType('Airport Transfer');
    } else if (pickup || dropoff) {
      setTransferType('Point to Point');
    }
  }, [pickup, dropoff]);

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

  useEffect(() => {
    if (passengers && selectedVehicle) {
      const pCount = parseInt(passengers || '1', 10);
      const vehObj = VEHICLES.find(v => v.id === selectedVehicle);
      if (vehObj && pCount > (vehObj.maxPax || 6)) {
        setSelectedVehicle('');
      }
    }
  }, [passengers, selectedVehicle]);

  // Validations
  const validateStep1 = () => {
    if (!pickup) return 'Please select a Pick-up Location.';
    if (!dropoff) return 'Please select a Drop-off Location.';
    if (pickup === dropoff) return 'Pick-up and Drop-off locations cannot be the same.';
    if (!date) return 'Please select a Transfer Date.';
    if (!time) return 'Please select a Transfer Time.';
    if (!passengers) return 'Please select the number of Passengers.';
    return null;
  };

  const validateStep2 = () => {
    if (!selectedVehicle) return 'Please select a VIP Vehicle Class.';
    const pCount = parseInt(passengers || '1', 10);
    const vehObj = VEHICLES.find(v => v.id === selectedVehicle);
    if (vehObj && pCount > (vehObj.maxPax || 6)) {
      return `Selected vehicle (${vehObj.name}) cannot accommodate ${passengers} passengers (Max ${vehObj.maxPax} pax). Please select a larger vehicle.`;
    }
    return null;
  };

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

  const validateStep4 = () => {
    if (!cardholderName.trim()) return 'Please enter the Cardholder Name.';
    const cleanNum = cardNumber.replace(/\s+/g, '');
    if (cleanNum.length < 15) return 'Please enter a valid 16-digit Card Number.';
    if (cardExpiry.length < 5 || !cardExpiry.includes('/')) return 'Please enter the Expiration Date (MM/YY).';

    const [expMonthStr, expYearStr] = cardExpiry.split('/');
    const expMonth = parseInt(expMonthStr, 10);
    const expYear = parseInt(expYearStr, 10);

    if (!expMonth || expMonth < 1 || expMonth > 12) {
      return 'Expiration Month must be between 01 and 12.';
    }

    const now = new Date();
    const currentYear2Digit = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    if (isNaN(expYear) || expYear < currentYear2Digit || (expYear === currentYear2Digit && expMonth < currentMonth)) {
      return 'The card expiration date cannot be in the past.';
    }

    if (cardCvc.length < 3) return 'Please enter a 3-digit CVV/CVC code.';
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

  const handleResetWizard = () => {
    setBookingConfirmed(null);
    setCurrentStep(1);
    setPickup('');
    setDropoff('');
    setDate('');
    setTime('');
    setTransferType('');
    setPassengers('');
    setSalutation('');
    setFlightNumber('');
    setSpecialRequests('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvc('');
    setValidationError('');
    loadProfileAndPreferences();
  };

  return {
    customerName,
    currentStep,
    setCurrentStep,
    validationError,
    setValidationError,
    isSubmitting,
    bookingConfirmed,
    setBookingConfirmed,
    // Step 1
    pickup,
    setPickup,
    dropoff,
    setDropoff,
    date,
    setDate,
    time,
    setTime,
    transferType,
    setTransferType,
    passengers,
    setPassengers,
    // Step 2
    selectedVehicle,
    setSelectedVehicle,
    quietRide,
    setQuietRide,
    temperature,
    setTemperature,
    childSeat,
    setChildSeat,
    specialRequests,
    setSpecialRequests,
    // Step 3
    salutation,
    setSalutation,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    contactMethod,
    setContactMethod,
    phoneNumber,
    setPhoneNumber,
    flightNumber,
    setFlightNumber,
    meetGreetName,
    setMeetGreetName,
    // Step 4
    tipType,
    setTipType,
    customTipAmount,
    setCustomTipAmount,
    cardholderName,
    setCardholderName,
    cardNumber,
    cardExpiry,
    cardCvc,
    showReceiptModal,
    setShowReceiptModal,
    handleCardNumberChange,
    handleCardExpiryChange,
    handleCardCvcChange,
    // Pricing
    basePrice,
    calculatedTip,
    totalPrice,
    // Navigation & Submission
    handleNextToStep2,
    handleNextToStep3,
    handleNextToStep4,
    handleConfirmBooking,
    handleResetWizard,
  };
}
