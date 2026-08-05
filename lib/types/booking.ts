export interface VehicleOption {
  id: string;
  name: string;
  maxPax: number;
  pax: string;
  price: string;
  desc: string;
}

export interface VipPreferences {
  quietRide: string;
  temperature: string;
  childSeat: string;
  specialRequests: string;
  meetGreetName: string;
}

export interface BookingFormData {
  // Step 1
  pickup: string;
  dropoff: string;
  date: string;
  time: string;
  transferType: string;
  passengers: string;

  // Step 2
  selectedVehicle: string;
  quietRide: string;
  temperature: string;
  childSeat: string;
  specialRequests: string;

  // Step 3
  salutation: string;
  firstName: string;
  lastName: string;
  contactMethod: 'Phone' | 'WhatsApp' | '';
  phoneNumber: string;
  flightNumber: string;
  meetGreetName: string;

  // Step 4
  tipType: '0' | '10' | '15' | '20' | 'custom';
  customTipAmount: string;
  cardholderName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
}

export interface BookingConfirmedData {
  pnr: string;
  bookingRef: string;
  guestName: string;
  email: string;
  phone: string;
  pickup: string;
  dropoff: string;
  date: string;
  time: string;
  vehicle: string;
  passengers: string;
  flightNumber?: string;
  meetGreetName?: string;
  basePrice: number;
  tipAmount: number;
  totalPrice: number;
  quietRide: string;
  temperature: string;
  childSeat: string;
  specialRequests: string;
  createdAt: string;
  status: string;
}

export interface CustomerRecord {
  id: string | number;
  rawId?: number;
  rawResId?: number;
  bookingRef?: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  company?: string;
  customerType: string;
  vehicle: string;
  vehicleType?: string;
  pickup: string;
  pickupLocation?: string;
  dropoff: string;
  dropoffLocation?: string;
  date: string;
  transferDate?: string;
  time: string;
  transferTime?: string;
  flightNumber?: string;
  passengers: string | number;
  transferType?: string;
  notes?: string;
  status: string;
  quietRide?: string;
  temperature?: string;
  childSeat?: string;
  specialRequests?: string;
  meetGreetName?: string;
  totalPrice?: number;
  price?: number | string;
  latestDate?: Date;
  transfers?: number;
  segment?: string;
}
