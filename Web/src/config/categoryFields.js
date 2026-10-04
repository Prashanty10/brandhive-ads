/**
 * Category-Specific Dynamic Input Fields Configuration for BrandHive Web
 * Tailored custom form fields and specification extractors for each advertisement medium.
 */

export const CATEGORY_FIELDS = {
  // 1. Billboards & Hoardings
  billboard: [
    {
      id: "dimensions",
      label: "Dimensions (Height x Width ft)",
      type: "text",
      placeholder: "e.g. 20 x 10 ft",
      required: true,
    },
    {
      id: "lighting",
      label: "Lighting Type",
      type: "select",
      options: ["Frontlit", "Backlit", "Non-lit", "LED Lit"],
    },
    {
      id: "facing",
      label: "Billboard Facing Direction",
      type: "select",
      options: ["Facing Traffic", "North Bound", "South Bound", "East Bound", "West Bound"],
    },
    {
      id: "roadType",
      label: "Road / Location Type",
      type: "select",
      options: ["Highway / Expressway", "Main Arterial Road", "City Junction", "Flyover / Bridge"],
    }
  ],

  // 2. Digital LED Screen
  digital: [
    {
      id: "screenResolution",
      label: "Screen Resolution",
      type: "text",
      placeholder: "e.g. 4K Ultra HD (3840 x 2160 px)",
    },
    {
      id: "dimensions",
      label: "Screen Size (Dimensions)",
      type: "text",
      placeholder: "e.g. 16 x 9 ft",
    },
    {
      id: "slotDuration",
      label: "Ad Slot Duration",
      type: "select",
      options: ["10 sec", "15 sec", "30 sec", "60 sec"],
    },
    {
      id: "operatingHours",
      label: "Daily Screen Operating Hours",
      type: "text",
      placeholder: "e.g. 6 AM - 11 PM (17 Hours/day)",
    }
  ],

  // 3. Transit & Bus Wraps
  bus: [
    {
      id: "busType",
      label: "Bus Fleet Type",
      type: "select",
      options: ["Low Floor AC City Bus", "Non-AC City Bus", "Double Decker", "Volvo Intercity Express"],
    },
    {
      id: "brandingArea",
      label: "Branding Coverage Area",
      type: "select",
      options: ["Full Body Wrap", "Both Side Panels", "Back Glass & Panel", "Interior Grab Handles"],
    },
    {
      id: "routeZone",
      label: "Bus Route / Coverage Cities",
      type: "text",
      placeholder: "e.g. Route 402 (Connaught Place to Airport)",
      required: true,
    },
    {
      id: "fleetCount",
      label: "Package Fleet Count (Number of Buses)",
      type: "text",
      placeholder: "e.g. 5 Buses Package",
    }
  ],

  // 4. Metro & Railway Ads
  metro: [
    {
      id: "metroFormat",
      label: "Metro Branding Format",
      type: "select",
      options: ["Train Full Exterior Wrap", "Platform Screen Doors", "Foot Over Bridge (FOB)", "Station Lightboxes", "Smart Card Branding"],
    },
    {
      id: "stationName",
      label: "Metro Station / Line Name",
      type: "text",
      placeholder: "e.g. Yellow Line - Rajiv Chowk Station",
      required: true,
    },
    {
      id: "dailyCommuters",
      label: "Est. Daily Station Commuters",
      type: "text",
      placeholder: "e.g. 150,000 Commuters/day",
    }
  ],

  // 5. Mall & Retail Displays
  mall: [
    {
      id: "mallName",
      label: "Shopping Mall Name",
      type: "text",
      placeholder: "e.g. Phoenix Palladium Mall",
      required: true,
    },
    {
      id: "placementFloor",
      label: "Placement Location in Mall",
      type: "select",
      options: ["Central Atrium Drop Banner", "Escalator Side Panels", "Food Court Digital Kiosk", "Main Entrance Standee"],
    },
    {
      id: "dimensions",
      label: "Banner / Screen Dimensions",
      type: "text",
      placeholder: "e.g. 30 x 15 ft Drop Banner",
    }
  ],

  // 6. Auto & Rickshaw Branding
  rickshaw: [
    {
      id: "brandingArea",
      label: "Placement Format",
      type: "select",
      options: ["Hood Cover (Back Vinyl)", "Driver Backrest Poster", "Full Body Side Vinyl"],
    },
    {
      id: "fleetCount",
      label: "Fleet Package Quantity",
      type: "text",
      placeholder: "e.g. 50 Autos Package",
      required: true,
    },
    {
      id: "routeZone",
      label: "Primary Operating Zones",
      type: "text",
      placeholder: "e.g. Bandra-Kurla Complex & Airport Hub",
    }
  ],

  // 7. Airport Terminal Ads
  airport: [
    {
      id: "terminalName",
      label: "Airport & Terminal",
      type: "text",
      placeholder: "e.g. IGI Airport Terminal 3",
      required: true,
    },
    {
      id: "placementFormat",
      label: "Placement Format",
      type: "select",
      options: ["Luggage Trolley Branding", "Baggage Belt Digital Screen", "Departure Gate Lightbox", "Aerobridge Wrap"],
    }
  ],

  // 8. Wallscape & Posters
  wallscape: [
    {
      id: "dimensions",
      label: "Wall Wallscape Dimensions",
      type: "text",
      placeholder: "e.g. 40 x 30 ft Wall Mural",
      required: true,
    },
    {
      id: "lighting",
      label: "Lighting Type",
      type: "select",
      options: ["Frontlit Spotlight", "Non-lit Building Wall"],
    }
  ],

  // 9. Digital & Social Media
  online: [
    {
      id: "socialPlatform",
      label: "Platform / Portal Name",
      type: "text",
      placeholder: "e.g. Instagram / Tech Portal Website",
      required: true,
    },
    {
      id: "contentType",
      label: "Promotion Format",
      type: "select",
      options: ["Dedicated Reel / Short", "Feed Post Sponsor", "Leaderboard Banner (728x90 px)", "Large Rectangle Banner (300x250 px)"],
    },
    {
      id: "followerReach",
      label: "Follower Count / Monthly Pageviews",
      type: "text",
      placeholder: "e.g. 250,000 Followers / 500K Visitors",
    }
  ]
};

// Helper function to extract relevant specifications summary pills for cards and details
export const getCategorySpecPills = (space) => {
  if (!space) return [];
  const cat = (space.category || space.displayType || "Billboard").toLowerCase();
  const specs = space.specifications || {};

  const dimensions = space.dimensions || specs.dimensions;
  const lighting = space.lighting || specs.lightingType || specs.lighting;
  const busType = specs.busType;
  const routeZone = specs.routeZone || specs.coverageArea;
  const fleetCount = specs.fleetCount;
  const stationName = specs.stationName;
  const mallName = specs.mallName;
  const terminalName = specs.terminalName;
  const brandingArea = specs.brandingArea;
  const socialPlatform = specs.socialPlatform;
  const followerReach = specs.followerReach;
  const slotDuration = specs.slotDuration;

  const pills = [];

  // Transit / Bus / Rickshaw
  if (cat.includes("bus") || cat.includes("rickshaw") || cat.includes("transit")) {
    if (fleetCount) pills.push({ icon: "🚌", text: `${fleetCount}` });
    if (busType) pills.push({ icon: "🚍", text: busType });
    if (brandingArea) pills.push({ icon: "🎨", text: brandingArea });
    if (routeZone) pills.push({ icon: "📍", text: routeZone });
    return pills.length > 0 ? pills : [{ icon: "🚌", text: "Fleet Transit Wrap" }];
  }

  // Metro
  if (cat.includes("metro") || cat.includes("railway")) {
    if (stationName) pills.push({ icon: "🚆", text: stationName });
    if (specs.metroFormat) pills.push({ icon: "🖼️", text: specs.metroFormat });
    return pills.length > 0 ? pills : [{ icon: "🚆", text: "Metro Station Display" }];
  }

  // Mall
  if (cat.includes("mall")) {
    if (mallName) pills.push({ icon: "🛍️", text: mallName });
    if (dimensions) pills.push({ icon: "📐", text: dimensions });
    return pills.length > 0 ? pills : [{ icon: "🛍️", text: "Mall Banner" }];
  }

  // Airport
  if (cat.includes("airport")) {
    if (terminalName) pills.push({ icon: "✈️", text: terminalName });
    if (specs.placementFormat) pills.push({ icon: "🏷️", text: specs.placementFormat });
    return pills.length > 0 ? pills : [{ icon: "✈️", text: "Airport Terminal Display" }];
  }

  // Online / Social
  if (cat.includes("online") || cat.includes("digital") && (socialPlatform || followerReach)) {
    if (socialPlatform) pills.push({ icon: "🌐", text: socialPlatform });
    if (followerReach) pills.push({ icon: "👥", text: followerReach });
    if (slotDuration) pills.push({ icon: "⏱️", text: slotDuration });
    return pills.length > 0 ? pills : [{ icon: "🌐", text: "Digital Promotion" }];
  }

  // Outdoor / Billboard / Default
  if (dimensions) pills.push({ icon: "📐", text: dimensions });
  if (lighting && lighting !== "Non-lit" && lighting !== "Non-Lit") {
    pills.push({ icon: "💡", text: lighting });
  }

  return pills.length > 0 ? pills : [{ icon: "📐", text: dimensions || "Standard Size" }];
};

export default CATEGORY_FIELDS;
