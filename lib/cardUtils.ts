export function formatCardNumber(val: string): string {
  const raw = val.replace(/\D/g, '').slice(0, 16);
  return raw.match(/.{1,4}/g)?.join(' ') || raw;
}

export function formatCardExpiry(val: string, prevVal: string): string {
  // Handle backspace when trailing slash is present
  if (val.length < prevVal.length && prevVal.endsWith('/') && val === prevVal.slice(0, -1)) {
    return val.slice(0, -1);
  }

  // Keep only numeric digits (max 4 digits for MMYY)
  const digits = val.replace(/\D/g, '').slice(0, 4);

  if (!digits) {
    return '';
  }

  // If user types a single digit:
  // If it is 2-9 (e.g. 5 for May), standard auto-formatting turns it into 05/
  if (digits.length === 1) {
    if (parseInt(digits, 10) > 1) {
      return `0${digits}/`;
    }
    return digits;
  }

  // When 2 or more digits are entered
  let month = digits.slice(0, 2);
  const year = digits.slice(2, 4);

  const monthNum = parseInt(month, 10);
  if (monthNum > 12) {
    month = '12';
  } else if (monthNum === 0) {
    month = '01';
  }

  if (year.length > 0) {
    return `${month}/${year}`;
  } else {
    return `${month}/`;
  }
}
