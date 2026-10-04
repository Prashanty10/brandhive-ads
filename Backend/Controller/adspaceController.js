import AdSpace from "../Models/adspaceModel.js";
import User from "../Models/userModel.js";
import uploadToCloudinary from "../Utils/cloudinary.js";
import paginate from "../Utils/pagination.js";

// Helper: Haversine distance in KM
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
  const R = 6371; // radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};

// 1. CREATE ADVERTISEMENT SPACE
export const adspacecontroller = async (req, res) => {
  try {
    const {
      category,
      title,
      description,
      displayType,
      price,
      priceUnit,
      minimumBookingDuration,
      dimensions,
      location,
      images,
      availability,
      audienceInformation,
      estimatedDailyImpressions,
      estimatedFootfall,
      visibility,
      lighting,
      operatingHours,
      sellerVerification,
      amenities,
      bookingType,
      specifications,
    } = req.body;

    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID missing from token",
      });
    }

    // Input Validation
    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ success: false, message: "Valid ad space title is required." });
    }
    if (!category || typeof category !== "string" || !category.trim()) {
      return res.status(400).json({ success: false, message: "Category is required." });
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ success: false, message: "Price must be a valid non-negative number." });
    }

    // Location validation
    let lat = location?.latitude != null ? Number(location.latitude) : null;
    let lng = location?.longitude != null ? Number(location.longitude) : null;

    if (lat == null || isNaN(lat) || lat < -90 || lat > 90) {
      return res.status(400).json({ success: false, message: "Latitude must be between -90 and 90." });
    }
    if (lng == null || isNaN(lng) || lng < -180 || lng > 180) {
      return res.status(400).json({ success: false, message: "Longitude must be between -180 and 180." });
    }

    // Process images (Upload base64 strings to Cloudinary if needed)
    let processedImages = [];
    if (Array.isArray(images)) {
      for (const img of images) {
        if (typeof img === "string" && img.startsWith("data:image")) {
          const uploaded = await uploadToCloudinary(img);
          if (uploaded?.secure_url) processedImages.push(uploaded.secure_url);
        } else if (typeof img === "string" && img.trim()) {
          processedImages.push(img.trim());
        }
      }
    } else if (typeof images === "string" && images.trim()) {
      if (images.startsWith("data:image")) {
        const uploaded = await uploadToCloudinary(images);
        if (uploaded?.secure_url) processedImages.push(uploaded.secure_url);
      } else {
        processedImages.push(images.trim());
      }
    }

    // Availability validation
    let parsedAvailability = {
      isAvailable: availability?.isAvailable !== false,
      availableFrom: availability?.availableFrom ? new Date(availability.availableFrom) : null,
      availableUntil: availability?.availableUntil ? new Date(availability.availableUntil) : null,
    };

    if (
      parsedAvailability.availableFrom &&
      parsedAvailability.availableUntil &&
      parsedAvailability.availableFrom > parsedAvailability.availableUntil
    ) {
      return res.status(400).json({ success: false, message: "availableFrom date cannot be after availableUntil date." });
    }

    // Check if seller is verified in User model
    const seller = await User.findById(userId);
    const isSellerVerified = Boolean(seller?.isVerified || sellerVerification);
    const sellerPhone = seller?.mobileNumber || seller?.mobile || seller?.phone || req.body.sellerMobile || "";

    const adspace = await AdSpace.create({
      sellerID: userId,
      category: category.trim(),
      title: title.trim(),
      description: description || "",
      displayType: displayType || "Billboard",
      price: numericPrice,
      priceUnit: priceUnit || "per month",
      minimumBookingDuration: minimumBookingDuration || "1 day",
      dimensions: dimensions || "",
      images: processedImages,
      location: {
        address: location?.address || "",
        city: location?.city || "",
        state: location?.state || "",
        latitude: lat,
        longitude: lng,
        geo: {
          type: "Point",
          coordinates: [lng, lat],
        },
      },
      availability: parsedAvailability,
      audienceInformation: Array.isArray(audienceInformation) ? audienceInformation : [],
      estimatedDailyImpressions: Number(estimatedDailyImpressions) || 0,
      estimatedFootfall: Number(estimatedFootfall) || 0,
      visibility: visibility || "24 Hours",
      lighting: lighting || "Non-lit",
      operatingHours: operatingHours || "24 Hours",
      sellerVerification: isSellerVerified,
      sellerMobile: sellerPhone,
      isVerified: isSellerVerified,
      amenities: Array.isArray(amenities) ? amenities : [],
      bookingType: bookingType || "Instant Booking",
      specifications: specifications || {},
      status: "active",
      views: 0,
      bookings: 0,
    });

    res.status(201).json({
      success: true,
      message: "Ad space created successfully.",
      data: adspace,
    });
  } catch (error) {
    console.error("Error creating ad space:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create advertisement space.",
    });
  }
};

// 2. GET SELLER'S OWN ADVERTISEMENTS
export const adSpaceInfo = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID missing from token",
      });
    }

    const { status, q } = req.query;
    const filter = { sellerID: userId };
    if (status && status !== "All" && status !== "all") {
      filter.status = status.toLowerCase();
    }
    if (q && typeof q === "string" && q.trim()) {
      const searchRegex = new RegExp(q.trim(), "i");
      filter.$or = [
        { title: searchRegex },
        { category: searchRegex },
        { "location.city": searchRegex },
        { "location.address": searchRegex },
      ];
    }

    const result = await paginate(AdSpace, filter, { reqQuery: req.query });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching seller ad spaces:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch advertisements.",
    });
  }
};

// 3. EDIT / UPDATE ADVERTISEMENT (SELLER)
export const updateAdSpace = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.user?._id;

    const existingAd = await AdSpace.findById(id);
    if (!existingAd) {
      return res.status(404).json({ success: false, message: "Advertisement space not found." });
    }

    if (existingAd.sellerID.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Forbidden: You cannot edit another seller's advertisement." });
    }

    const updates = { ...req.body };
    delete updates.sellerID;
    delete updates._id;

    if (updates.price != null) {
      const priceNum = Number(updates.price);
      if (isNaN(priceNum) || priceNum < 0) {
        return res.status(400).json({ success: false, message: "Price must be a non-negative number." });
      }
      updates.price = priceNum;
    }

    if (updates.location?.latitude != null && updates.location?.longitude != null) {
      const lat = Number(updates.location.latitude);
      const lng = Number(updates.location.longitude);
      if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        updates.location.geo = {
          type: "Point",
          coordinates: [lng, lat],
        };
      }
    }

    const updatedAd = await AdSpace.findByIdAndUpdate(id, updates, { new: true });

    res.status(200).json({
      success: true,
      message: "Ad space updated successfully.",
      data: updatedAd,
    });
  } catch (error) {
    console.error("Error updating ad space:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. ACTIVATE / DEACTIVATE ADVERTISEMENT (SELLER)
export const toggleAdSpaceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.user?._id;

    const existingAd = await AdSpace.findById(id);
    if (!existingAd) {
      return res.status(404).json({ success: false, message: "Advertisement space not found." });
    }

    if (existingAd.sellerID.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Forbidden: You cannot change status of another seller's advertisement." });
    }

    const newStatus = req.body.status || (existingAd.status === "active" ? "inactive" : "active");
    existingAd.status = newStatus;
    await existingAd.save();

    res.status(200).json({
      success: true,
      message: `Advertisement set to ${newStatus}.`,
      data: existingAd,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. GET ADVERTISEMENT DETAIL (PUBLIC / BUYER)
export const getAdSpaceById = async (req, res) => {
  try {
    const { id } = req.params;
    const adspace = await AdSpace.findById(id).populate(
      "sellerID",
      "firstName lastName name email mobile mobileNumber phone profileImage isVerified"
    );

    if (!adspace) {
      return res.status(404).json({ success: false, message: "Ad space not found." });
    }

    // Increment view counter silently
    adspace.views = (adspace.views || 0) + 1;
    await adspace.save();

    res.status(200).json({
      success: true,
      data: adspace,
    });
  } catch (error) {
    console.error("Error fetching ad space detail:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. EFFICIENT CONSOLIDATED HOME API (BUYER)
export const getHomeAdSpaces = async (req, res) => {
  try {
    const { latitude, longitude, radius = 25, city } = req.query;
    const userLat = latitude != null && !isNaN(Number(latitude)) ? Number(latitude) : null;
    const userLng = longitude != null && !isNaN(Number(longitude)) ? Number(longitude) : null;
    const radiusKm = Number(radius) || 25;

    const activeFilter = { status: "active" };

    // Fetch all active adspaces to construct sections efficiently
    let allActiveAds = await AdSpace.find(activeFilter).lean();

    // Attach distance calculation if user coordinates provided
    allActiveAds = allActiveAds.map((ad) => {
      const adLat = ad.location?.latitude;
      const adLng = ad.location?.longitude;
      const dist = calculateDistance(userLat, userLng, adLat, adLng);
      return { ...ad, distanceKm: dist };
    });

    // 1. Featured Real Spaces (Prioritize verified & active)
    const featured = allActiveAds
      .slice()
      .sort((a, b) => (b.isVerified ? 1 : 0) - (a.isVerified ? 1 : 0) || b.views - a.views)
      .slice(0, 8);

    // 2. Nearby Spaces (Filtered by radiusKm, sorted by distance asc)
    let nearby = [];
    if (userLat != null && userLng != null) {
      nearby = allActiveAds
        .filter((ad) => ad.distanceKm != null && ad.distanceKm <= radiusKm)
        .sort((a, b) => a.distanceKm - b.distanceKm);
    } else {
      // Fallback: all active spaces sorted by city match or newest
      nearby = allActiveAds.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // 3. Available Now (isAvailable = true, & current date falls inside availableFrom -> availableUntil if present)
    const now = new Date();
    const availableNow = allActiveAds.filter((ad) => {
      if (!ad.availability?.isAvailable) return false;
      if (ad.availability?.availableFrom && new Date(ad.availability.availableFrom) > now) return false;
      if (ad.availability?.availableUntil && new Date(ad.availability.availableUntil) < now) return false;
      return true;
    });

    // 4. Best Value Near You (Calculate meaningful score based on price, distance, impressions, footfall)
    const bestValue = allActiveAds
      .map((ad) => {
        const impressionsScore = (ad.estimatedDailyImpressions || 0) / 1000;
        const footfallScore = (ad.estimatedFootfall || 0) / 1000;
        const distPenalty = ad.distanceKm ? Math.max(1, ad.distanceKm / 5) : 1;
        const priceVal = ad.price > 0 ? ad.price : 1;
        // Higher score = better value
        const valueScore = ((impressionsScore * 2 + footfallScore + 10) * 1000) / (priceVal * distPenalty);
        return { ...ad, valueScore };
      })
      .sort((a, b) => b.valueScore - a.valueScore)
      .slice(0, 8);

    // 5. Newly Listed (createdAt DESC)
    const newlyListed = allActiveAds
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    // 6. High Visibility Spaces (Has impressions, footfall, or 24/7 visibility)
    const highVisibility = allActiveAds.filter(
      (ad) =>
        (ad.estimatedDailyImpressions && ad.estimatedDailyImpressions > 0) ||
        (ad.estimatedFootfall && ad.estimatedFootfall > 0) ||
        ad.visibility === "24 Hours"
    ).slice(0, 8);

    // 7. Categories aggregation counts
    const categoryCounts = await AdSpace.aggregate([
      { $match: { status: "active" } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    const categoriesFormatted = categoryCounts.map((item) => ({
      categoryName: item._id,
      count: item.count,
    }));

    // 8. Recommended For You (City preference or nearby / popular fallback)
    let recommended = [];
    if (city && typeof city === "string") {
      recommended = allActiveAds.filter(
        (ad) => ad.location?.city?.toLowerCase() === city.toLowerCase()
      );
    }
    if (recommended.length === 0) {
      recommended = allActiveAds.slice().sort((a, b) => b.views - a.views).slice(0, 8);
    }

    res.status(200).json({
      success: true,
      data: {
        featured,
        nearby,
        availableNow,
        bestValue,
        newlyListed,
        highVisibility,
        categories: categoriesFormatted,
        recommended,
        totalActiveCount: allActiveAds.length,
      },
    });
  } catch (error) {
    console.error("Error building Home adspaces:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 7. SEARCH & ADVANCED FILTERS (BUYER)
export const searchAdSpaces = async (req, res) => {
  try {
    const {
      q,
      category,
      displayType,
      minPrice,
      maxPrice,
      latitude,
      longitude,
      radius,
      availableNow,
      visibility,
      lighting,
      bookingType,
      isVerified,
      newlyListed,
      sort,
    } = req.query;

    const query = { status: "active" };

    // Search Query across text fields
    if (q && typeof q === "string" && q.trim()) {
      const searchRegex = new RegExp(q.trim(), "i");
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { displayType: searchRegex },
        { "location.city": searchRegex },
        { "location.address": searchRegex },
      ];
    }

    // Category filter
    if (category && category !== "all") {
      query.category = new RegExp(category, "i");
    }

    // Display type filter
    if (displayType) {
      query.displayType = new RegExp(displayType, "i");
    }

    // Price Range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Availability
    if (availableNow === "true") {
      query["availability.isAvailable"] = true;
    }

    // Visibility
    if (visibility) {
      query.visibility = visibility;
    }

    // Lighting
    if (lighting) {
      query.lighting = lighting;
    }

    // Booking Type
    if (bookingType) {
      query.bookingType = bookingType;
    }

    // Verified Seller
    if (isVerified === "true") {
      query.isVerified = true;
    }

    let sortOptions = { createdAt: -1 };
    if (sort === "price_low") sortOptions = { price: 1 };
    if (sort === "price_high") sortOptions = { price: -1 };
    if (sort === "views") sortOptions = { views: -1 };

    let paginatedResult = await paginate(AdSpace, query, {
      reqQuery: req.query,
      defaultSort: sortOptions,
      lean: true,
    });

    // Attach location distance if coords provided
    const userLat = latitude != null && !isNaN(Number(latitude)) ? Number(latitude) : null;
    const userLng = longitude != null && !isNaN(Number(longitude)) ? Number(longitude) : null;

    if (userLat != null && userLng != null) {
      paginatedResult.data = paginatedResult.data.map((ad) => {
        const dist = calculateDistance(userLat, userLng, ad.location?.latitude, ad.location?.longitude);
        return { ...ad, distanceKm: dist };
      });

      // Filter by radius ONLY if explicitly passed and not 'all'
      if (radius && radius !== "all" && radius !== "false") {
        const radiusNum = Number(radius);
        if (!isNaN(radiusNum)) {
          paginatedResult.data = paginatedResult.data.filter((ad) => ad.distanceKm == null || ad.distanceKm <= radiusNum);
        }
      }

      if (sort === "distance") {
        paginatedResult.data.sort((a, b) => (a.distanceKm || 9999) - (b.distanceKm || 9999));
      }
    }

    res.status(200).json(paginatedResult);
  } catch (error) {
    console.error("Error searching ad spaces:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 8. DELETE ADVERTISEMENT SPACE
export const deleteAdSpace = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.user?._id;

    const space = await AdSpace.findById(id);
    if (!space) {
      return res.status(404).json({ success: false, message: "Ad space not found." });
    }

    // Verify ownership
    const spaceSellerId = space.sellerID || space.seller;
    if (spaceSellerId && spaceSellerId.toString() !== userId?.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized to delete this space." });
    }

    await AdSpace.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Ad space deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting ad space:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  adspacecontroller,
  adSpaceInfo,
  updateAdSpace,
  toggleAdSpaceStatus,
  getAdSpaceById,
  getHomeAdSpaces,
  searchAdSpaces,
  deleteAdSpace,
};
