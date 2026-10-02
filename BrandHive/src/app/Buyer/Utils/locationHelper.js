import {
  detectUserLocation as detectLocation,
  geocodeCityState as geocodeCity,
  reverseGeocodeCoords as reverseGeocode,
} from "../../../utils/locationHelper";

export const detectUserLocation = detectLocation;
export const geocodeCityState = geocodeCity;
export const reverseGeocodeCoords = reverseGeocode;

const LocationHelperRoute = () => null;
export default LocationHelperRoute;
