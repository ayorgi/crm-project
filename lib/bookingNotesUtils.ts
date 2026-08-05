export function formatDisplayDate(d?: string) {
  if (!d) return '';
  if (d.includes('-')) {
    const [y, m, day] = d.split('-');
    if (y && m && day && y.length === 4) return `${day}/${m}/${y}`;
  }
  return d;
}

export function parseBookingNotes(rawNotes?: string) {
  if (!rawNotes) {
    return { payment: null, fare: null, tip: null, preferences: null, specialRequests: null };
  }

  if (!rawNotes.includes('[')) {
    return {
      payment: null,
      fare: null,
      tip: null,
      preferences: null,
      specialRequests: rawNotes.trim(),
    };
  }

  const paymentMatch = rawNotes.match(/\[Payment:\s*([^\]]+)\]/i);
  const fareMatch = rawNotes.match(/\[Fare:\s*([^\]]+)\]/i);
  const tipMatch = rawNotes.match(/\[Tip:\s*([^\]]+)\]/i);
  const quietMatch = rawNotes.match(/\[Quiet Ride:\s*([^\]]+)\]/i);
  const climateMatch = rawNotes.match(/\[Climate:\s*([^\]]+)\]/i);
  const childSeatMatch = rawNotes.match(/\[Child Seat:\s*([^\]]+)\]/i);
  const meetSignMatch = rawNotes.match(/\[Meet Sign:\s*([^\]]+)\]/i);

  let customNotes = '';
  const notesIndex = rawNotes.indexOf('Notes:');
  if (notesIndex !== -1) {
    customNotes = rawNotes.substring(notesIndex + 6).trim();
  } else {
    const stripped = rawNotes.replace(/\[[^\]]+\]/g, '').trim();
    if (stripped) customNotes = stripped;
  }

  const hasPreferences = quietMatch || climateMatch || childSeatMatch || meetSignMatch;
  const preferences = hasPreferences
    ? {
        quietRide: quietMatch ? quietMatch[1].trim() : null,
        climate: climateMatch ? climateMatch[1].trim() : null,
        childSeat: childSeatMatch ? childSeatMatch[1].trim() : null,
        meetSign: meetSignMatch ? meetSignMatch[1].trim() : null,
      }
    : null;

  const numFare = fareMatch ? parseFloat(fareMatch[1].replace(/[^0-9.]/g, '')) : 0;
  const numTip = tipMatch ? parseFloat(tipMatch[1].replace(/[^0-9.]/g, '')) : 0;
  const computedTotal = numFare > 0 || numTip > 0 ? (numFare + numTip).toFixed(2) : null;

  return {
    payment: paymentMatch ? paymentMatch[1].trim() : null,
    fare: fareMatch ? fareMatch[1].trim() : null,
    tip: tipMatch ? tipMatch[1].trim() : null,
    total: computedTotal,
    preferences,
    specialRequests: customNotes || null,
  };
}

export const statusStyle = (status: string) => {
  switch (status) {
    case 'Pending':
      return 'bg-gray-100 text-gray-700 border-gray-200';
    case 'Confirmed':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'In Transit':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Completed':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Cancelled':
      return 'bg-red-50 text-red-700 border-red-200';
    default:
      return 'bg-gray-100 text-gray-500 border-gray-200';
  }
};
