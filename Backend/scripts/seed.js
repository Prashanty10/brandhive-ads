import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

import User from "../Models/userModel.js";
import SellerProfile from "../Models/sellerProfileModel.js";
import AdSpace from "../Models/adspaceModel.js";
import Booking from "../Models/bookingModel.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URL || process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ ERROR: MONGO_URL environment variable is not defined in .env");
  process.exit(1);
}

// ============================================================================
// ⚙️ SEED CONFIGURATION
// Easily adjust numbers without modifying core seeding logic
// ============================================================================
const SEED_CONFIG = {
  additionalUsers: 10,       // 10 extra development users (user01 - user10)
  multiRoleUsers: 3,         // 3 multi-role dual accounts (multi01 - multi03)
  advertisementSpaces: 75,  // Total ad spaces to generate (50 - 100)
  bookings: 25,              // Total bookings to generate (20 - 30)
};

// Plaintext development passwords for test accounts
const SEED_PASSWORD_SELLER = "Seller@123";
const SEED_PASSWORD_BUYER = "Buyer@123";
const SEED_PASSWORD_DUAL = "DualUser@123";
const SEED_PASSWORD_USER = "User@123";
const SEED_PASSWORD_MULTI = "Multi@123";

// Helper to hash password using bcrypt (10 salt rounds)
const hashPassword = async (plainText) => {
  return await bcrypt.hash(plainText, 10);
};

// Sample image collections categorized by media type
const sampleImages = {
  hoarding: [
    "https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?w=1200&auto=format&fit=crop&q=80",
  ],
  digital_billboard: [
    "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1200&auto=format&fit=crop&q=80",
  ],
  bus_advertisement: [
    "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&auto=format&fit=crop&q=80",
  ],
  mall_advertisement: [
    "https://images.unsplash.com/photo-1567449303078-57ad995bd301?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=1200&auto=format&fit=crop&q=80",
  ],
  airport_advertisement: [
    "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&auto=format&fit=crop&q=80",
  ],
  auto_rickshaw_advertisement: [
    "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?w=1200&auto=format&fit=crop&q=80",
  ],
  taxi_advertisement: [
    "https://images.unsplash.com/photo-1556122071-e404eaedb77f?w=1200&auto=format&fit=crop&q=80",
  ],
  railway_station_advertisement: [
    "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1200&auto=format&fit=crop&q=80",
  ],
  led_screen: [
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80",
  ],
  van_advertisement: [
    "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200&auto=format&fit=crop&q=80",
  ],
};

// Location hubs with coordinates for spatial proximity matching
const LOCATION_HUBS = [
  { city: "Mumbai", state: "Maharashtra", address: "Western Express Highway, Bandra West", lat: 19.0596, lng: 72.8404 },
  { city: "Mumbai", state: "Maharashtra", address: "Juhu Tara Road Junction", lat: 19.0883, lng: 72.8262 },
  { city: "Mumbai", state: "Maharashtra", address: "Phoenix Palladium Mall, Lower Parel", lat: 18.9953, lng: 72.8242 },
  { city: "Mumbai", state: "Maharashtra", address: "CSMIA Airport Terminal 2 Departure Gate", lat: 19.0896, lng: 72.8656 },
  { city: "Mumbai", state: "Maharashtra", address: "Dadar TT Circle Flyover", lat: 19.0178, lng: 72.8478 },
  { city: "Mumbai", state: "Maharashtra", address: "Andheri East Metro Station Concourse", lat: 19.1197, lng: 72.8464 },
  { city: "Pune", state: "Maharashtra", address: "FC Road, Deccan Gymkhana", lat: 18.5186, lng: 73.8419 },
  { city: "Pune", state: "Maharashtra", address: "Swargate Bus Depot Corridor", lat: 18.5204, lng: 73.8567 },
  { city: "Pune", state: "Maharashtra", address: "Hinjewadi IT Park Phase 1", lat: 18.5912, lng: 73.7389 },
  { city: "Pune", state: "Maharashtra", address: "Viman Nagar Phoenix Marketcity", lat: 18.5679, lng: 73.9143 },
  { city: "Thane", state: "Maharashtra", address: "Viviana Mall Entrance, Eastern Express Highway", lat: 19.2087, lng: 72.9715 },
  { city: "Thane", state: "Maharashtra", address: "Ghodbunder Road Junction, Majiwada", lat: 19.2183, lng: 72.9781 },
  { city: "Navi Mumbai", state: "Maharashtra", address: "Vashi Toll Naka Highway Arch", lat: 19.0522, lng: 72.9734 },
  { city: "Navi Mumbai", state: "Maharashtra", address: "Inorbit Mall, Sector 30A, Vashi", lat: 19.0645, lng: 72.9976 },
  { city: "Navi Mumbai", state: "Maharashtra", address: "CBD Belapur Station Complex", lat: 19.0186, lng: 73.0402 },
  { city: "Palghar", state: "Maharashtra", address: "Palghar Station Road Market Area", lat: 19.6967, lng: 72.7699 },
  { city: "Palghar", state: "Maharashtra", address: "Vasai-Virar Link Road Junction", lat: 19.3833, lng: 72.8333 },
];

const CATEGORIES_POOL = [
  { category: "hoarding", displayType: "Unipole Billboard", minPrice: 45000, maxPrice: 180000 },
  { category: "digital_billboard", displayType: "Digital 4K LED Screen", minPrice: 60000, maxPrice: 220000 },
  { category: "bus_advertisement", displayType: "Transit Bus Body Wrap", minPrice: 25000, maxPrice: 75000 },
  { category: "mall_advertisement", displayType: "Atrium Drop Banner", minPrice: 35000, maxPrice: 110000 },
  { category: "auto_rickshaw_advertisement", displayType: "Auto Back Hood Branding", minPrice: 5000, maxPrice: 20000 },
  { category: "taxi_advertisement", displayType: "Cab Carrier & Windshield Media", minPrice: 12000, maxPrice: 35000 },
  { category: "airport_advertisement", displayType: "Terminal Digital Standee", minPrice: 100000, maxPrice: 300000 },
  { category: "railway_station_advertisement", displayType: "Platform FOB Banner", minPrice: 30000, maxPrice: 90000 },
  { category: "led_screen", displayType: "Indoor Digital Totem", minPrice: 20000, maxPrice: 65000 },
  { category: "van_advertisement", displayType: "Mobile Display Van", minPrice: 40000, maxPrice: 95000 },
];

const runSeed = async () => {
  try {
    console.log("🔌 Connecting to MongoDB Database...");
    await mongoose.connect(MONGO_URI, { dbName: "BrandHive" });
    console.log("✅ Database Connected Successfully.");

    // ─────────────────────────────────────────────────────────────
    // STEP 1: INSPECT & PRESERVE EXISTING NON-SEED REAL USERS
    // ─────────────────────────────────────────────────────────────
    console.log("\n🔍 Inspecting database for existing real users...");

    // Find real users (non-seed users without @brandhive.test email)
    const existingRealUsers = await User.find({
      email: { $not: { $regex: "@brandhive\\.test$", $options: "i" } },
    }).select("+password");

    console.log(`   Found ${existingRealUsers.length} existing real user(s) in database.`);
    if (existingRealUsers.length > 0) {
      console.log(`   🔒 PRESERVING all ${existingRealUsers.length} real user(s). Their credentials & passwords will NOT be modified.`);
    }

    // Capture initial password state of existing users to verify safety at the end
    const initialRealUserPasswords = new Map(
      existingRealUsers.map((u) => [String(u._id), u.password])
    );

    // ─────────────────────────────────────────────────────────────
    // STEP 2: SAFE RESET (Clear ONLY Previous Seed Data)
    // ─────────────────────────────────────────────────────────────
    console.log("\n🧹 Cleaning previous development seed data (@brandhive.test)...");

    const existingSeedUsers = await User.find({
      email: { $regex: "@brandhive\\.test$", $options: "i" },
    }).select("_id");

    const seedUserIds = existingSeedUsers.map((u) => u._id);

    if (seedUserIds.length > 0) {
      await Booking.deleteMany({
        $or: [{ buyerID: { $in: seedUserIds } }, { sellerID: { $in: seedUserIds } }],
      });
      await AdSpace.deleteMany({ sellerID: { $in: seedUserIds } });
      await SellerProfile.deleteMany({ userId: { $in: seedUserIds } });
      await User.deleteMany({ _id: { $in: seedUserIds } });
      console.log(`   Removed ${seedUserIds.length} previous seed user(s) and connected seed records.`);
    } else {
      console.log("   No previous seed data found. Starting fresh seed insertion.");
    }

    // ─────────────────────────────────────────────────────────────
    // STEP 3: CREATE DEVELOPMENT USERS (SELLERS, BUYERS & DUAL-ROLE)
    // ─────────────────────────────────────────────────────────────
    console.log("\n👥 Creating Development Users...");

    const sellerPasswordHash = await hashPassword(SEED_PASSWORD_SELLER);
    const buyerPasswordHash = await hashPassword(SEED_PASSWORD_BUYER);
    const dualPasswordHash = await hashPassword(SEED_PASSWORD_DUAL);
    const userPasswordHash = await hashPassword(SEED_PASSWORD_USER);
    const multiPasswordHash = await hashPassword(SEED_PASSWORD_MULTI);

    const createdSeedUsers = [];

    // --- Base Sellers ---
    const seller1 = await User.create({
      username: "rahul_sharma",
      email: "seller1@brandhive.test",
      password: sellerPasswordHash,
      firstName: "Rahul",
      lastName: "Sharma",
      mobileNumber: "9876543210",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      bio: "Premier OOH Media Owner in Mumbai Metro region with 15+ prime billboard locations.",
      profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
      roles: ["seller"],
      activeRole: "seller",
      isVerified: true,
      isEmailVerified: true,
      isPhoneVerified: true,
      isProfileCompleted: true,
      sellerProfile: {
        businessName: "Rahul OOH Media Pvt Ltd",
        businessType: "Private Limited",
        businessDescription: "High-impact outdoor hoardings and digital billboards across Western Express Highway.",
        businessAddress: "Suite 402, Trade Tower, Lower Parel",
        businessCity: "Mumbai",
        businessState: "Maharashtra",
        businessPincode: "400013",
        businessPhone: "9876543210",
        businessEmail: "seller1@brandhive.test",
        gstNumber: "27AABCR1234A1Z5",
        panNumber: "AABCR1234A",
        sellerCategories: ["hoarding", "digital_billboard", "mall_advertisement"],
        kycStatus: "verified",
        sellerStatus: "active",
      },
    });
    await SellerProfile.create({
      userId: seller1._id,
      businessName: "Rahul OOH Media Pvt Ltd",
      kycStatus: "verified",
      gst: "27AABCR1234A1Z5",
      sellerStatus: "active",
      rating: 4.8,
    });
    createdSeedUsers.push(seller1);

    const seller2 = await User.create({
      username: "amit_patil",
      email: "seller2@brandhive.test",
      password: sellerPasswordHash,
      firstName: "Amit",
      lastName: "Patil",
      mobileNumber: "9876543211",
      city: "Pune",
      state: "Maharashtra",
      country: "India",
      bio: "Transit advertising specialist covering city public buses, cabs & auto-rickshaws.",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80",
      roles: ["seller"],
      activeRole: "seller",
      isVerified: true,
      isEmailVerified: true,
      isPhoneVerified: true,
      isProfileCompleted: true,
      sellerProfile: {
        businessName: "Patil Transit Mobility Ads",
        businessType: "Proprietorship",
        businessDescription: "Full wrap bus branding, auto-rickshaw hood banners, and cab media in Pune & PCMC.",
        businessAddress: "Shop 12, FC Road, Shivaji Nagar",
        businessCity: "Pune",
        businessState: "Maharashtra",
        businessPincode: "411005",
        businessPhone: "9876543211",
        businessEmail: "seller2@brandhive.test",
        gstNumber: "27BBBAP5678B1Z2",
        panNumber: "BBBAP5678B",
        sellerCategories: ["bus_advertisement", "auto_rickshaw_advertisement", "taxi_advertisement"],
        kycStatus: "verified",
        sellerStatus: "active",
      },
    });
    await SellerProfile.create({
      userId: seller2._id,
      businessName: "Patil Transit Mobility Ads",
      kycStatus: "verified",
      gst: "27BBBAP5678B1Z2",
      sellerStatus: "active",
      rating: 4.6,
    });
    createdSeedUsers.push(seller2);

    const seller3 = await User.create({
      username: "neha_ads",
      email: "seller3@brandhive.test",
      password: sellerPasswordHash,
      firstName: "Neha",
      lastName: "Kulkarni",
      mobileNumber: "9876543212",
      city: "Navi Mumbai",
      state: "Maharashtra",
      country: "India",
      bio: "Commercial indoor screens, shopping mall atrium banners & airport terminal displays.",
      profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80",
      roles: ["seller"],
      activeRole: "seller",
      isVerified: true,
      isEmailVerified: true,
      isPhoneVerified: true,
      isProfileCompleted: true,
      sellerProfile: {
        businessName: "Neha Enterprises & Digital Media",
        businessType: "Partnership",
        businessDescription: "High-density retail indoor advertising, LED standees, and airport departure lounge screens.",
        businessAddress: "Plot 88, Sector 17, Vashi",
        businessCity: "Navi Mumbai",
        businessState: "Maharashtra",
        businessPincode: "400703",
        businessPhone: "9876543212",
        businessEmail: "seller3@brandhive.test",
        gstNumber: "27CCCNE9101C1Z8",
        panNumber: "CCCNE9101C",
        sellerCategories: ["airport_advertisement", "railway_station_advertisement", "led_screen"],
        kycStatus: "verified",
        sellerStatus: "active",
      },
    });
    await SellerProfile.create({
      userId: seller3._id,
      businessName: "Neha Enterprises & Digital Media",
      kycStatus: "verified",
      gst: "27CCCNE9101C1Z8",
      sellerStatus: "active",
      rating: 4.9,
    });
    createdSeedUsers.push(seller3);

    // --- Base Buyers ---
    const buyer1 = await User.create({
      username: "aditya_m",
      email: "buyer1@brandhive.test",
      password: buyerPasswordHash,
      firstName: "Aditya",
      lastName: "Mehta",
      mobileNumber: "9123456789",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      bio: "Marketing Director at Horizon E-Commerce looking for outdoor impact campaigns.",
      profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80",
      roles: ["buyer"],
      activeRole: "buyer",
      isVerified: true,
      isEmailVerified: true,
      isPhoneVerified: true,
      isProfileCompleted: true,
      buyerProfile: {
        advertisingPreferences: ["Hoardings", "Digital Billboards", "Transit Wraps"],
        preferredCategories: ["hoarding", "digital_billboard", "bus_advertisement"],
        preferredLocations: ["Mumbai", "Thane", "Navi Mumbai"],
        preferredCity: "Mumbai",
      },
    });
    createdSeedUsers.push(buyer1);

    const buyer2 = await User.create({
      username: "sneha_shah",
      email: "buyer2@brandhive.test",
      password: buyerPasswordHash,
      firstName: "Sneha",
      lastName: "Shah",
      mobileNumber: "9123456788",
      city: "Thane",
      state: "Maharashtra",
      country: "India",
      bio: "Brand Manager focusing on retail growth & localized transit advertisements.",
      profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80",
      roles: ["buyer"],
      activeRole: "buyer",
      isVerified: true,
      isEmailVerified: true,
      isPhoneVerified: true,
      isProfileCompleted: true,
      buyerProfile: {
        advertisingPreferences: ["Mall Banners", "Auto Rickshaw Ads", "LED Displays"],
        preferredCategories: ["mall_advertisement", "auto_rickshaw_advertisement", "led_screen"],
        preferredLocations: ["Thane", "Pune"],
        preferredCity: "Thane",
      },
    });
    createdSeedUsers.push(buyer2);

    // --- Base Dual User ---
    const dualUser = await User.create({
      username: "vikram_m",
      email: "dualuser@brandhive.test",
      password: dualPasswordHash,
      firstName: "Vikram",
      lastName: "Malhotra",
      mobileNumber: "9988776655",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      bio: "Dual account: Media owner offering highway billboards while also booking targeted transit ads.",
      profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=80",
      roles: ["buyer", "seller"],
      activeRole: "seller",
      isVerified: true,
      isEmailVerified: true,
      isPhoneVerified: true,
      isProfileCompleted: true,
      sellerProfile: {
        businessName: "Malhotra Highway Media",
        businessType: "Individual / Agency",
        businessDescription: "Premium highway hoardings on Mumbai-Pune Expressway.",
        businessAddress: "Express Towers, Nariman Point",
        businessCity: "Mumbai",
        businessState: "Maharashtra",
        businessPincode: "400021",
        businessPhone: "9988776655",
        businessEmail: "dualuser@brandhive.test",
        gstNumber: "27DDDVD1213D1Z4",
        panNumber: "DDDVD1213D",
        sellerCategories: ["hoarding"],
        kycStatus: "verified",
        sellerStatus: "active",
      },
      buyerProfile: {
        advertisingPreferences: ["Airport Displays", "Metro Transit"],
        preferredCategories: ["airport_advertisement", "railway_station_advertisement"],
        preferredLocations: ["Mumbai", "Pune"],
        preferredCity: "Mumbai",
      },
    });
    await SellerProfile.create({
      userId: dualUser._id,
      businessName: "Malhotra Highway Media",
      kycStatus: "verified",
      gst: "27DDDVD1213D1Z4",
      sellerStatus: "active",
      rating: 4.7,
    });
    createdSeedUsers.push(dualUser);

    // --- 10 Additional Development Users (user01@brandhive.test ... user10@brandhive.test) ---
    const firstNamesList = ["Rohan", "Priya", "Karan", "Ananya", "Siddharth", "Pooja", "Varun", "Meera", "Gaurav", "Divya"];
    const lastNamesList = ["Joshi", "Deshmukh", "Nair", "Iyer", "Rao", "Chavan", "Singhania", "Kapoor", "Bhatia", "Wagle"];
    const citiesList = ["Mumbai", "Pune", "Thane", "Navi Mumbai", "Palghar"];

    for (let i = 1; i <= SEED_CONFIG.additionalUsers; i++) {
      const idxStr = String(i).padStart(2, "0");
      const isSeller = i % 2 === 1; // 5 Sellers & 5 Buyers
      const fName = firstNamesList[(i - 1) % firstNamesList.length];
      const lName = lastNamesList[(i - 1) % lastNamesList.length];
      const city = citiesList[(i - 1) % citiesList.length];

      const u = await User.create({
        username: `user${idxStr}`,
        email: `user${idxStr}@brandhive.test`,
        password: userPasswordHash,
        firstName: fName,
        lastName: lName,
        mobileNumber: `98200${10000 + i}`,
        city: city,
        state: "Maharashtra",
        country: "India",
        bio: isSeller
          ? `Development seller account providing local media inventory in ${city}.`
          : `Development buyer account running multi-channel regional ads in ${city}.`,
        profileImage: `https://images.unsplash.com/photo-${1500000000000 + i * 123456}?w=500&auto=format&fit=crop&q=80`,
        roles: isSeller ? ["seller"] : ["buyer"],
        activeRole: isSeller ? "seller" : "buyer",
        isVerified: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        isProfileCompleted: true,
        sellerProfile: isSeller
          ? {
              businessName: `${fName} ${lName} Media Solutions`,
              businessType: "Individual / Agency",
              businessDescription: `Outdoor & digital ad space provider based in ${city}.`,
              businessAddress: `Main Market Road, ${city}`,
              businessCity: city,
              businessState: "Maharashtra",
              businessPincode: "400001",
              businessPhone: `98200${10000 + i}`,
              businessEmail: `user${idxStr}@brandhive.test`,
              gstNumber: `27USR${idxStr}1234A1Z${i}`,
              panNumber: `USR${idxStr}1234A`,
              sellerCategories: ["hoarding", "digital_billboard"],
              kycStatus: "verified",
              sellerStatus: "active",
            }
          : {},
        buyerProfile: !isSeller
          ? {
              advertisingPreferences: ["Billboards", "Digital Screens"],
              preferredCategories: ["hoarding", "digital_billboard"],
              preferredLocations: [city],
              preferredCity: city,
            }
          : {},
      });

      if (isSeller) {
        await SellerProfile.create({
          userId: u._id,
          businessName: `${fName} ${lName} Media Solutions`,
          kycStatus: "verified",
          gst: `27USR${idxStr}1234A1Z${i}`,
          sellerStatus: "active",
          rating: 4.5,
        });
      }

      createdSeedUsers.push(u);
    }

    // --- 3 Multi-Role Dual Accounts (multi01@brandhive.test ... multi03@brandhive.test) ---
    const multiNames = [
      { fName: "Sameer", lName: "Verma", city: "Mumbai" },
      { fName: "Riya", lName: "Sen", city: "Pune" },
      { fName: "Tushar", lName: "Kadam", city: "Navi Mumbai" },
    ];

    for (let i = 1; i <= SEED_CONFIG.multiRoleUsers; i++) {
      const idxStr = String(i).padStart(2, "0");
      const m = multiNames[(i - 1) % multiNames.length];
      const activeRole = i % 2 === 1 ? "seller" : "buyer";

      const mu = await User.create({
        username: `multi${idxStr}`,
        email: `multi${idxStr}@brandhive.test`,
        password: multiPasswordHash,
        firstName: m.fName,
        lastName: m.lName,
        mobileNumber: `99300${20000 + i}`,
        city: m.city,
        state: "Maharashtra",
        country: "India",
        bio: `Dual-role developer account for testing role-switching between Buyer & Seller in ${m.city}.`,
        profileImage: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80`,
        roles: ["buyer", "seller"],
        activeRole: activeRole,
        isVerified: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        isProfileCompleted: true,
        sellerProfile: {
          businessName: `${m.fName} Dual Media Group`,
          businessType: "Proprietorship",
          businessDescription: `Media ownership & ad agency operations in ${m.city}.`,
          businessAddress: `Station Plaza, ${m.city}`,
          businessCity: m.city,
          businessState: "Maharashtra",
          businessPincode: "400002",
          businessPhone: `99300${20000 + i}`,
          businessEmail: `multi${idxStr}@brandhive.test`,
          gstNumber: `27MLT${idxStr}9876B1Z${i}`,
          panNumber: `MLT${idxStr}9876B`,
          sellerCategories: ["hoarding", "bus_advertisement", "led_screen"],
          kycStatus: "verified",
          sellerStatus: "active",
        },
        buyerProfile: {
          advertisingPreferences: ["Hoardings", "Bus Wraps", "LED Displays"],
          preferredCategories: ["hoarding", "bus_advertisement", "led_screen"],
          preferredLocations: [m.city],
          preferredCity: m.city,
        },
      });

      await SellerProfile.create({
        userId: mu._id,
        businessName: `${m.fName} Dual Media Group`,
        kycStatus: "verified",
        gst: `27MLT${idxStr}9876B1Z${i}`,
        sellerStatus: "active",
        rating: 4.8,
      });

      createdSeedUsers.push(mu);
    }

    // Combine all sellers (seed sellers + multi-role sellers + existing real sellers)
    const allUsersInDb = await User.find({});
    const allSellers = allUsersInDb.filter((u) => u.roles && u.roles.includes("seller"));
    const allBuyers = allUsersInDb.filter((u) => u.roles && u.roles.includes("buyer"));

    console.log(`   Total Users available in DB: ${allUsersInDb.length} (${allSellers.length} Sellers, ${allBuyers.length} Buyers).`);
    console.log(`   (Included ${createdSeedUsers.length} newly seeded users + ${existingRealUsers.length} preserved real users).`);

    // ─────────────────────────────────────────────────────────────
    // STEP 4: GENERATE 50–100 ADVERTISEMENT SPACES (Default 75)
    // Linked using REAL MongoDB sellerID ObjectIds
    // ─────────────────────────────────────────────────────────────
    console.log(`\n🏢 Generating ${SEED_CONFIG.advertisementSpaces} Advertisement Spaces (Linked via real sellerID ObjectIds)...`);

    const adSpacesData = [];

    for (let i = 1; i <= SEED_CONFIG.advertisementSpaces; i++) {
      // Pick seller systematically/round-robin to ensure balanced distribution
      const seller = allSellers[(i - 1) % allSellers.length];

      // Pick category spec
      const catSpec = CATEGORIES_POOL[(i - 1) % CATEGORIES_POOL.length];

      // Pick location hub
      const loc = LOCATION_HUBS[(i - 1) % LOCATION_HUBS.length];

      // Pick sample image pool
      const imgs = sampleImages[catSpec.category] || sampleImages.hoarding;

      // Price calculation
      const stepPrice = catSpec.minPrice + Math.floor(Math.random() * ((catSpec.maxPrice - catSpec.minPrice) / 1000)) * 1000;

      // Status distribution: 80% active, 10% inactive, 10% pending
      let adStatus = "active";
      if (i % 10 === 0) adStatus = "inactive";
      else if (i % 7 === 0) adStatus = "pending";

      const titleCategoryLabel = catSpec.category.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

      adSpacesData.push({
        sellerID: seller._id,
        category: catSpec.category,
        title: `${titleCategoryLabel} #${i} - ${loc.address.split(",")[0]}, ${loc.city}`,
        description: `High impact ${catSpec.displayType} located at ${loc.address}. High visibility with continuous traffic flow.`,
        displayType: catSpec.displayType,
        price: stepPrice,
        priceUnit: "per month",
        minimumBookingDuration: i % 3 === 0 ? "15 days" : "1 month",
        dimensions: i % 2 === 0 ? "40ft x 20ft" : "20ft x 10ft",
        images: imgs,
        location: {
          address: loc.address,
          city: loc.city,
          state: loc.state,
          latitude: loc.lat + (Math.random() * 0.02 - 0.01),
          longitude: loc.lng + (Math.random() * 0.02 - 0.01),
          geo: {
            type: "Point",
            coordinates: [loc.lng + (Math.random() * 0.02 - 0.01), loc.lat + (Math.random() * 0.02 - 0.01)],
          },
        },
        availability: { isAvailable: adStatus === "active" },
        audienceInformation: ["Corporate Professionals", "Daily Commuters", "Local Shoppers"],
        estimatedDailyImpressions: 50000 + (i * 2500),
        estimatedFootfall: 30000 + (i * 1500),
        visibility: "24 Hours",
        lighting: i % 2 === 0 ? "Front-lit LED" : "Self-Illuminated Digital",
        operatingHours: "24 Hours",
        sellerVerification: true,
        sellerMobile: seller.mobileNumber || "9876543210",
        isVerified: true,
        amenities: ["Prime Location", "CCTV Monitored", "Maintenance Covered"],
        bookingType: i % 2 === 0 ? "Instant Booking" : "Request Booking",
        status: adStatus,
      });
    }

    const createdAdSpaces = await AdSpace.insertMany(adSpacesData);
    console.log(`   Successfully generated ${createdAdSpaces.length} Advertisement Spaces across ${allSellers.length} sellers.`);

    // ─────────────────────────────────────────────────────────────
    // STEP 5: GENERATE BOOKINGS LINKED TO REAL BUYER & ADSPACE OBJECTIDS
    // ─────────────────────────────────────────────────────────────
    console.log(`\n📅 Generating ${SEED_CONFIG.bookings} Bookings (Linked via real buyerID & adspaceID ObjectIds)...`);

    const activeAdSpaces = createdAdSpaces.filter((s) => s.status === "active");
    const bookingsData = [];
    const statusCycle = ["Active", "Pending", "Completed", "Cancelled"];

    const today = new Date();

    for (let i = 0; i < SEED_CONFIG.bookings; i++) {
      const buyer = allBuyers[i % allBuyers.length];
      const adspace = activeAdSpaces[i % activeAdSpaces.length];
      const bkStatus = statusCycle[i % statusCycle.length];

      const startDate = new Date(today.getTime() + (i * 2 - 10) * 24 * 60 * 60 * 1000);
      const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);

      bookingsData.push({
        buyerID: buyer._id,
        sellerID: adspace.sellerID,
        adspaceID: adspace._id,
        startDate: startDate,
        endDate: endDate,
        totalPrice: adspace.price,
        status: bkStatus,
        bookingType: adspace.bookingType,
        notes: `Development campaign booking #${i + 1} for ${adspace.title}.`,
      });
    }

    const createdBookings = await Booking.insertMany(bookingsData);
    console.log(`   Successfully generated ${createdBookings.length} Bookings.`);

    // ─────────────────────────────────────────────────────────────
    // STEP 6: COMPREHENSIVE VALIDATION & INTEGRITY CHECKS
    // ─────────────────────────────────────────────────────────────
    console.log("\n🔍 Running Comprehensive Relationship & Bcrypt Integrity Checks...");

    // 1. Verify every Ad Space points to a valid Seller in DB
    for (const ad of createdAdSpaces) {
      const owner = await User.findById(ad.sellerID);
      if (!owner) {
        throw new Error(`Validation Error: AdSpace ${ad._id} points to non-existent sellerID ${ad.sellerID}`);
      }
      if (!owner.roles.includes("seller")) {
        throw new Error(`Validation Error: AdSpace ${ad._id} owner ${owner.email} does not possess 'seller' role.`);
      }
    }
    console.log("   ✅ All AdSpace -> Seller relationships verified.");

    // 2. Verify every Booking points to valid Buyer, Seller, and AdSpace
    for (const bk of createdBookings) {
      const bUser = await User.findById(bk.buyerID);
      const sUser = await User.findById(bk.sellerID);
      const ad = await AdSpace.findById(bk.adspaceID);

      if (!bUser) throw new Error(`Validation Error: Booking ${bk._id} buyerID ${bk.buyerID} not found in database.`);
      if (!sUser) throw new Error(`Validation Error: Booking ${bk._id} sellerID ${bk.sellerID} not found in database.`);
      if (!ad) throw new Error(`Validation Error: Booking ${bk._id} adspaceID ${bk.adspaceID} not found in database.`);
    }
    console.log("   ✅ All Booking -> Buyer / Seller / AdSpace relationships verified.");

    // 3. Verify Multi-Role users contain both buyer and seller roles
    const multiCheck = await User.find({ email: { $regex: "^multi", $options: "i" } });
    for (const mu of multiCheck) {
      if (!mu.roles.includes("buyer") || !mu.roles.includes("seller")) {
        throw new Error(`Validation Error: Multi-role user ${mu.email} does not possess both 'buyer' and 'seller' roles.`);
      }
    }
    console.log(`   ✅ Multi-Role accounts (${multiCheck.length}) possess both buyer & seller capabilities.`);

    // 4. Verify new seed user passwords bcrypt hashes match plain text
    const testSeedUser = await User.findOne({ email: "user01@brandhive.test" }).select("+password");
    const isSeedPasswordValid = await bcrypt.compare(SEED_PASSWORD_USER, testSeedUser.password);
    if (!isSeedPasswordValid) {
      throw new Error("Validation Error: Bcrypt password comparison check failed for user01@brandhive.test!");
    }
    console.log("   ✅ New seed user Bcrypt password hash comparison PASSED.");

    // 5. Verify existing real users' passwords were NOT modified
    if (existingRealUsers.length > 0) {
      for (const realUser of existingRealUsers) {
        const currentRealUser = await User.findById(realUser._id).select("+password");
        const initialPass = initialRealUserPasswords.get(String(realUser._id));
        if (currentRealUser.password !== initialPass) {
          throw new Error(`CRITICAL SECURITY FAILURE: Existing real user ${realUser.email} password was modified!`);
        }
      }
      console.log(`   ✅ Preserved real users (${existingRealUsers.length}) password integrity verification PASSED.`);
    }

    // ─────────────────────────────────────────────────────────────
    // STEP 7: PRINT DETAILED SUMMARY & TEST ACCOUNTS TABLE
    // ─────────────────────────────────────────────────────────────
    // Calculate per-seller ad distribution statistics
    const sellerAdCounts = new Map();
    for (const ad of createdAdSpaces) {
      const sId = String(ad.sellerID);
      sellerAdCounts.set(sId, (sellerAdCounts.get(sId) || 0) + 1);
    }

    console.log("\n==================================================");
    console.log("🚀 BRANDHIVE SEEDING SYSTEM EXECUTION COMPLETE");
    console.log("==================================================");
    console.log("\n📊 DATABASE SUMMARY:");
    console.log("--------------------------------------------------");
    console.log(`- Existing Real Users Reused:    ${existingRealUsers.length}`);
    console.log(`- New Development Seed Users:    ${createdSeedUsers.length}`);
    console.log(`- Dual Multi-Role Accounts:      ${SEED_CONFIG.multiRoleUsers}`);
    console.log(`- Advertisement Spaces Created:  ${createdAdSpaces.length}`);
    console.log(`- Bookings Generated:            ${createdBookings.length}`);
    console.log("--------------------------------------------------");

    console.log("\n🏢 SELLER ADVERTISEMENT DISTRIBUTION:");
    console.log("--------------------------------------------------");
    let sIndex = 1;
    for (const sUser of allSellers) {
      const count = sellerAdCounts.get(String(sUser._id)) || 0;
      const label = sUser.sellerProfile?.businessName || `${sUser.firstName} ${sUser.lastName}` || sUser.username;
      console.log(`  Seller ${sIndex++} (${label}): ${count} ad space(s)`);
    }
    console.log("--------------------------------------------------");

    console.log("\n🔑 TEST ACCOUNTS FOR LOGIN:");
    console.log("--------------------------------------------------");
    console.log("1. Base Sellers:");
    console.log("   - Rahul Sharma:     seller1@brandhive.test | Password: Seller@123 | Role: seller");
    console.log("   - Amit Patil:       seller2@brandhive.test | Password: Seller@123 | Role: seller");
    console.log("   - Neha Enterprises: seller3@brandhive.test | Password: Seller@123 | Role: seller");
    console.log("");
    console.log("2. Base Buyers:");
    console.log("   - Aditya Mehta:     buyer1@brandhive.test  | Password: Buyer@123  | Role: buyer");
    console.log("   - Sneha Shah:       buyer2@brandhive.test  | Password: Buyer@123  | Role: buyer");
    console.log("");
    console.log("3. Dual Multi-Role Accounts (Test Role Switching):");
    console.log("   - Vikram Malhotra:  dualuser@brandhive.test| Password: DualUser@123| Roles: ['buyer', 'seller']");
    console.log("   - Sameer Verma:     multi01@brandhive.test | Password: Multi@123  | Roles: ['buyer', 'seller']");
    console.log("   - Riya Sen:         multi02@brandhive.test | Password: Multi@123  | Roles: ['buyer', 'seller']");
    console.log("   - Tushar Kadam:     multi03@brandhive.test | Password: Multi@123  | Roles: ['buyer', 'seller']");
    console.log("");
    console.log("4. Extra Seed Users (user01 - user10):");
    console.log("   - user01 - user10:  user01@brandhive.test  | Password: User@123   | Roles: seller / buyer");
    console.log("--------------------------------------------------");
    console.log("✅ All new passwords hashed using bcrypt (10 salt rounds).");
    console.log("✅ All relationships connected via real MongoDB ObjectIds.");
    console.log("==================================================\n");

    await mongoose.connection.close();
    console.log("👋 Database Connection Closed cleanly.");
    process.exit(0);
  } catch (err) {
    console.error("\n❌ SEEDING FAILED:", err.message || err);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

runSeed();
