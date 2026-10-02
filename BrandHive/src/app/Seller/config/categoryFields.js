/**
 * Category-Specific Dynamic Input Fields Configuration
 * Defines custom form fields tailored to each advertisement medium.
 */

export const CATEGORY_FIELDS = {
  // 1. Hoarding / Outdoor Billboard
  hoarding: [
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
      type: "chip",
      options: ["Non-lit", "Front Lit", "Backlit", "LED Lit"],
    },
    {
      id: "facing",
      label: "Billboard Facing Direction",
      type: "chip",
      options: ["Facing Traffic", "North Bound", "South Bound", "East Bound", "West Bound"],
    },
    {
      id: "roadType",
      label: "Road / Location Type",
      type: "chip",
      options: ["Highway / Expressway", "Main Arterial Road", "City Junction", "Flyover / Bridge"],
    },
    {
      id: "sideOfRoad",
      label: "Side of Road",
      type: "chip",
      options: ["Left Side", "Right Side", "Center Median", "Overhead Gantry"],
    },
  ],

  // 2. Digital LED Screen
  digital_billboard: [
    {
      id: "screenResolution",
      label: "Screen Resolution",
      type: "text",
      placeholder: "e.g. 4K Ultra HD (3840 x 2160 px)",
      required: true,
    },
    {
      id: "dimensions",
      label: "Screen Size (Dimensions)",
      type: "text",
      placeholder: "e.g. 16 x 9 ft",
    },
    {
      id: "slotDuration",
      label: "Ad Slot Duration (sec)",
      type: "chip",
      options: ["10 sec", "15 sec", "30 sec", "60 sec"],
    },
    {
      id: "loopFrequency",
      label: "Loop Frequency",
      type: "text",
      placeholder: "e.g. Every 2 mins (120 slots / day)",
    },
    {
      id: "audioSupported",
      label: "Audio Support",
      type: "chip",
      options: ["No Audio (Silent Display)", "Audio Included", "Bluetooth Audio"],
    },
    {
      id: "operatingHours",
      label: "Daily Screen Operating Hours",
      type: "text",
      placeholder: "e.g. 6 AM - 11 PM (17 Hours/day)",
    },
  ],

  // 3. LED Screen (Indoor / Standee)
  led_screen: [
    {
      id: "dimensions",
      label: "Screen Size",
      type: "text",
      placeholder: "e.g. 55-inch Standee (4 x 2.5 ft)",
    },
    {
      id: "screenType",
      label: "Display Format",
      type: "chip",
      options: ["Digital Kiosk / Standee", "Wall Mounted LED", "Hanging Screen"],
    },
    {
      id: "slotDuration",
      label: "Ad Slot Duration",
      type: "chip",
      options: ["10 sec", "15 sec", "30 sec"],
    },
  ],

  // 4. Bus Advertisement
  bus_advertisement: [
    {
      id: "busType",
      label: "Bus Type",
      type: "chip",
      options: ["Low Floor AC Bus", "Non-AC City Bus", "Double Decker", "Volvo Express"],
    },
    {
      id: "brandingArea",
      label: "Branding Coverage Area",
      type: "chip",
      options: ["Full Body Wrap", "Both Side Panels", "Back Glass & Panel", "Interior Grab Handles"],
    },
    {
      id: "routeZone",
      label: "Bus Route / Cities Covered",
      type: "text",
      placeholder: "e.g. Route 402 (Connaught Place to Airport)",
      required: true,
    },
    {
      id: "fleetCount",
      label: "Package Fleet Count (Number of Buses)",
      type: "number",
      placeholder: "e.g. 5 Buses Package",
    },
  ],

  // 5. Bus Shelter Advertisement (BQS)
  bus_shelter_advertisement: [
    {
      id: "lighting",
      label: "Shelter Lighting",
      type: "chip",
      options: ["Backlit Lit", "Non-Lit", "Solar Powered LED"],
    },
    {
      id: "panelSides",
      label: "Display Panel Sides",
      type: "chip",
      options: ["Both Sides (Road & Commuter Facing)", "Single Road-Facing Side"],
    },
    {
      id: "dimensions",
      label: "Panel Dimensions",
      type: "text",
      placeholder: "e.g. 6 x 4 ft",
    },
  ],

  // 6. Auto Rickshaw Advertisement
  auto_rickshaw_advertisement: [
    {
      id: "brandingArea",
      label: "Placement Format",
      type: "chip",
      options: ["Hood Cover (Back Vinyl)", "Driver Backrest Poster", "Full Body Side Vinyl"],
    },
    {
      id: "fleetCount",
      label: "Fleet Package Quantity",
      type: "number",
      placeholder: "e.g. 50 Autos Package",
      required: true,
    },
    {
      id: "coverageArea",
      label: "Primary Operating Zones",
      type: "text",
      placeholder: "e.g. South Mumbai / Bandra-Kurla Complex",
    },
  ],

  // 7. Metro Advertisement
  metro_advertisement: [
    {
      id: "metroFormat",
      label: "Metro Branding Format",
      type: "chip",
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
      type: "number",
      placeholder: "e.g. 150000",
    },
  ],

  // 8. Mall Advertisement
  mall_advertisement: [
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
      type: "chip",
      options: ["Central Atrium Drop Banner", "Escalator Side Panels", "Food Court Digital Kiosk", "Main Entrance Standee"],
    },
    {
      id: "dimensions",
      label: "Banner / Screen Dimensions",
      type: "text",
      placeholder: "e.g. 30 x 15 ft Drop Banner",
    },
  ],

  // 9. Airport Advertisement
  airport_advertisement: [
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
      type: "chip",
      options: ["Luggage Trolley Branding", "Baggage Belt Digital Screen", "Departure Gate Lightbox", "Aerobridge Wrap"],
    },
    {
      id: "audienceType",
      label: "Passenger Demographic",
      type: "chip",
      options: ["International Business Travelers", "Domestic Flyers", "High Net Worth Individuals"],
    },
  ],

  // 10. Taxi / Cab Branding
  taxi_advertisement: [
    {
      id: "taxiType",
      label: "Cab Fleet Type",
      type: "chip",
      options: ["Uber / Ola Sedan Fleet", "Airport Taxi Wrap", "Rooftop Lighted Box"],
    },
    {
      id: "fleetCount",
      label: "Number of Cabs in Package",
      type: "number",
      placeholder: "e.g. 25 Cabs Package",
    },
  ],

  // 11. Mobile Van Advertisement
  van_advertisement: [
    {
      id: "vanFeatures",
      label: "Van Display Features",
      type: "chip",
      options: ["3-Side LED Screen Van", "Static Billboard Van", "High-Power Audio System"],
    },
    {
      id: "routeZone",
      label: "Campaign Routing Cities/Areas",
      type: "text",
      placeholder: "e.g. Residential Hubs & Commercial Parks",
    },
  ],

  // 12. Online Website Banner
  website_banner: [
    {
      id: "platformName",
      label: "Website / App Portal Name",
      type: "text",
      placeholder: "e.g. TechNewsIndia.com Portal",
      required: true,
    },
    {
      id: "adFormat",
      label: "Ad Banner Standard Size",
      type: "chip",
      options: ["Leaderboard (728x90 px)", "Large Rectangle (300x250 px)", "Billboard (970x250 px)", "Mobile Sticky (320x50 px)"],
    },
    {
      id: "placementPage",
      label: "Placement Position",
      type: "chip",
      options: ["Homepage Top Header", "Sidebar Sticky", "In-Article Content", "App Splash Screen"],
    },
    {
      id: "monthlyTraffic",
      label: "Est. Monthly Pageviews / Visitors",
      type: "number",
      placeholder: "e.g. 500000",
    },
  ],

  // 13. Social Media Promotion
  social_media: [
    {
      id: "socialPlatform",
      label: "Social Media Platform",
      type: "chip",
      options: ["Instagram", "YouTube", "Facebook", "LinkedIn", "Twitter / X"],
      required: true,
    },
    {
      id: "contentType",
      label: "Promotion Format",
      type: "chip",
      options: ["Dedicated Reel / Short", "Feed Post", "Story with Swipe-Up Link", "Video Channel Sponsor"],
    },
    {
      id: "followerReach",
      label: "Followers / Subscriber Count",
      type: "text",
      placeholder: "e.g. 250,000 Followers",
    },
  ],
};

export default CATEGORY_FIELDS;
