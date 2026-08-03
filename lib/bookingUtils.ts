import { AIRPORT_KEYWORDS, HOTEL_KEYWORDS } from './constants';

export const isAirport = (loc: string) => AIRPORT_KEYWORDS.some(k => loc?.includes(k));
export const isHotel = (loc: string) => HOTEL_KEYWORDS.some(k => loc?.includes(k));
