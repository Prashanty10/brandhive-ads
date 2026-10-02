import * as Location from "expo-location";

/**
 * Detects current device location using expo-location with multi-tier reverse geocoding fallbacks.
 * Works on Real Devices, Android Emulators, iOS Simulators, Expo Go, and Web.
 * @returns {Promise<{success: boolean, city?: string, state?: string, latitude?: number, longitude?: number, coords?: {latitude: number, longitude: number}, message?: string}>}
 */
export const detectUserLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      return {
        success: false,
        message: "Permission to access location was denied. Please grant location permissions in settings.",
      };
    }

    let location = null;

    try {
      location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Low,
      });
    } catch (e) {
      location = await Location.getLastKnownPositionAsync({});
    }

    if (!location || !location.coords) {
      location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
    }

    if (!location || !location.coords) {
      return {
        success: false,
        message: "Unable to retrieve GPS coordinates.",
      };
    }

    const { latitude, longitude } = location.coords;
    let city = "";
    let state = "";

    try {
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (reverseGeocode && reverseGeocode.length > 0) {
        const place = reverseGeocode[0];
        city =
          place.city ||
          place.subregion ||
          place.district ||
          place.locality ||
          place.name ||
          "";
        state = place.region || place.administrativeArea || "";
      }
    } catch (e) {
      // Fallback
    }

    if (!city && !state) {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          {
            headers: {
              "User-Agent": "BrandHiveMobileApp/1.0",
            },
          }
        );
        const data = await res.json();
        if (data && data.address) {
          const addr = data.address;
          city =
            addr.city ||
            addr.town ||
            addr.village ||
            addr.suburb ||
            addr.county ||
            addr.state_district ||
            "";
          state = addr.state || "";
        }
      } catch (err) {
        console.log("OSM Reverse Geocode Fallback Error:", err);
      }
    }

    return {
      success: true,
      city: city || "Detected Location",
      state: state || "",
      latitude,
      longitude,
      coords: { latitude, longitude },
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to detect location.",
    };
  }
};

/**
 * Forward geocodes city and state to retrieve latitude and longitude coordinates.
 * @param {string} city
 * @param {string} state
 * @returns {Promise<{success: boolean, latitude?: number, longitude?: number, coords?: {latitude: number, longitude: number}, message?: string}>}
 */
export const geocodeCityState = async (city, state) => {
  try {
    const query = [city, state].filter(Boolean).join(", ");
    if (!query.trim()) {
      return {
        success: false,
        message: "Please enter a city or state to analyze coordinates.",
      };
    }

    let lat = null;
    let lng = null;

    try {
      const results = await Location.geocodeAsync(query);
      if (results && results.length > 0) {
        lat = Number(results[0].latitude.toFixed(6));
        lng = Number(results[0].longitude.toFixed(6));
      }
    } catch (e) {
      console.log("Expo geocodeAsync error, trying fallback:", e);
    }

    if (lat === null || lng === null) {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
          {
            headers: {
              "User-Agent": "BrandHiveMobileApp/1.0",
            },
          }
        );
        const data = await res.json();
        if (data && data.length > 0) {
          lat = Number(parseFloat(data[0].lat).toFixed(6));
          lng = Number(parseFloat(data[0].lon).toFixed(6));
        }
      } catch (err) {
        console.log("OSM Geocode search error:", err);
      }
    }

    if (lat !== null && lng !== null) {
      return {
        success: true,
        latitude: lat,
        longitude: lng,
        coords: { latitude: lat, longitude: lng },
      };
    }

    return {
      success: false,
      message: `Could not find geographic coordinates for "${query}".`,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to analyze location coordinates.",
    };
  }
};

/**
 * Reverse geocodes latitude and longitude coordinates to find city and state.
 * @param {number|string} latitude
 * @param {number|string} longitude
 * @returns {Promise<{success: boolean, city?: string, state?: string, latitude?: number, longitude?: number, coords?: {latitude: number, longitude: number}, message?: string}>}
 */
export const reverseGeocodeCoords = async (latitude, longitude) => {
  try {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return {
        success: false,
        message: "Please enter valid numeric latitude and longitude coordinates.",
      };
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return {
        success: false,
        message: "Latitude must be between -90 and 90, and Longitude between -180 and 180.",
      };
    }

    let city = "";
    let state = "";

    try {
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lng,
      });

      if (reverseGeocode && reverseGeocode.length > 0) {
        const place = reverseGeocode[0];
        city =
          place.city ||
          place.subregion ||
          place.district ||
          place.locality ||
          place.name ||
          "";
        state = place.region || place.administrativeArea || "";
      }
    } catch (e) {
      console.log("Expo reverseGeocodeAsync error:", e);
    }

    if (!city && !state) {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
          {
            headers: {
              "User-Agent": "BrandHiveMobileApp/1.0",
            },
          }
        );
        const data = await res.json();
        if (data && data.address) {
          const addr = data.address;
          city =
            addr.city ||
            addr.town ||
            addr.village ||
            addr.suburb ||
            addr.county ||
            addr.state_district ||
            "";
          state = addr.state || "";
        }
      } catch (err) {
        console.log("OSM Reverse Geocode error:", err);
      }
    }

    return {
      success: true,
      city: city || "Detected City",
      state: state || "",
      latitude: lat,
      longitude: lng,
      coords: { latitude: lat, longitude: lng },
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to analyze coordinates.",
    };
  }
};

export default detectUserLocation;
