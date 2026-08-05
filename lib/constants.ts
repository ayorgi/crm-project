export const PARTNERS = [
    'Kaya Palazzo Resort', 'Merit Royal Diamond', 'Elexus Hotel Resort',
    'Concorde Luxury Resort', 'Limak Cyprus Deluxe', 'Cratos Premium Hotel',
    'Les Ambassadeurs', "Lord's Palace Hotel", 'Acapulco Resort', 'Arkın Iskele Hotel',
];

export const LOCATION_GROUPS = [
    {
        label: 'Airports',
        items: ['Ercan International Airport', 'Larnaca International Airport', 'Paphos Airport'].sort()
    },
    {
        label: 'Cities & Regions',
        items: [
            'Bafra Resort Area', 'Gazimağusa (Famagusta) City Centre', 'Girne (Kyrenia) City Centre',
            'Güzelyurt (Morphou)', 'İskele (Trikomo)', 'Lefkoşa (Nicosia) City Centre', 'Long Beach Area'
        ].sort()
    },
    {
        label: 'Hotels & Resorts',
        items: [
            'Acapulco Resort', 'Arkın Iskele Hotel', 'Concorde Luxury Resort', 'Cratos Premium Hotel',
            'Elexus Hotel Resort', 'Kaya Palazzo Resort', 'Les Ambassadeurs', 'Limak Cyprus Deluxe',
            "Lord's Palace Hotel", 'Merit Royal Diamond'
        ].sort()
    }
];

export const VEHICLE_TYPES = ['VIP Business Van', 'Executive Sedan', 'Premium SUV', 'First Class Sedan'];

export const VEHICLES = [
    { id: 'VIP Business Van', name: 'VIP Business Van', maxPax: 8, pax: '1-8 pax', price: '$150', desc: 'Luxury leather seating, Wi-Fi & climate control.' },
    { id: 'Executive Sedan', name: 'Executive Sedan', maxPax: 3, pax: '1-3 pax', price: '$120', desc: 'Premium comfort sedan for individual business travellers.' },
    { id: 'Premium SUV', name: 'Premium SUV', maxPax: 4, pax: '1-4 pax', price: '$200', desc: 'Spacious all-wheel drive luxury SUV.' },
    { id: 'First Class Sedan', name: 'First Class Sedan', maxPax: 2, pax: '1-2 pax', price: '$300', desc: 'Maybach-grade luxury sedan with ultimate rear comfort.' },
];

export const TRANSFER_TYPES = [
    'Hotel & Resort Transfer', 'Hourly Transportation', 'Airport Transfer', 'Point to Point'
];

export const GUEST_TYPES = ['Individual VIP', 'B2B Partner'];

export const STATUSES = ['Pending', 'Confirmed', 'In Transit', 'Completed', 'Cancelled'];

export const PAX_OPTIONS = ['1', '2', '3', '4', '5', '6', '7', '8'];

export const AIRPORT_KEYWORDS = ['Airport', 'International', 'Paphos'];
export const HOTEL_KEYWORDS = ['Hotel', 'Resort', 'Ambassadeurs', 'Merit', 'Palazzo', 'House', 'Ambassador'];

export const TIME_INTERVALS_15 = Array.from({ length: 96 }, (_, i) => {
  const hours = String(Math.floor(i / 4)).padStart(2, '0');
  const minutes = String((i % 4) * 15).padStart(2, '0');
  return `${hours}:${minutes}`;
});
