import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  TextInput,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import colors from "../../Theme/colors";
import { OFFLINE_AD_CATEGORIES } from "../Buyer/advertisement/offline/OfflineCategoryScreen";
import { CATEGORY_FIELDS } from "./config/categoryFields";
import { createAdSpaceApi } from "../Buyer/Api/adspaceApi";
import { userInfo } from "../Buyer/Api/userApi";
import FeedbackModal from "../Buyer/components/common/FeedbackModal";

const DISPLAY_TYPES = [
  "Billboard",
  "Hoarding",
  "Bus",
  "Rickshaw",
  "Mall Screen",
  "Digital Screen",
  "Wall",
  "Poster",
  "LED Display",
  "Website Banner",
  "Social Media",
];

const PRICE_UNITS = ["per day", "per week", "per month", "per campaign"];
const BOOKING_TYPES = ["Instant Booking", "Request Booking"];

const AUDIENCE_OPTIONS = [
  "Students",
  "Families",
  "Professionals",
  "Shoppers",
  "Tourists",
  "General Public",
];

const AMENITY_OPTIONS = [
  "High Traffic",
  "Main Road",
  "Parking Nearby",
  "24/7 Visibility",
  "CCTV",
  "LED Display",
  "Weather Protected",
];

const STEPS = [
  { id: 1, title: "Basic", icon: "document-text-outline" },
  { id: 2, title: "Location", icon: "location-outline" },
  { id: 3, title: "Pricing & Specs", icon: "pricetag-outline" },
  { id: 4, title: "Media", icon: "images-outline" },
  { id: 5, title: "Review", icon: "checkmark-circle-outline" },
];

const CreateAdvertisement = () => {
  const router = useRouter();
  const { categoryName: initialCategory } = useLocalSearchParams();

  const [currentStep, setCurrentStep] = useState(1);
  const [category, setCategory] = useState(initialCategory || "hoarding");

  const categoryInfo = OFFLINE_AD_CATEGORIES.find(
    (c) => c.categoryName === category
  ) || { title: category || "Advertisement", iconColor: colors.primary };

  const dynamicFields = CATEGORY_FIELDS[category] || CATEGORY_FIELDS.hoarding || [];

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [displayType, setDisplayType] = useState("Billboard");
  const [price, setPrice] = useState("");
  const [priceUnit, setPriceUnit] = useState("per month");
  const [minimumBookingDuration, setMinimumBookingDuration] = useState("1 day");
  const [bookingType, setBookingType] = useState("Instant Booking");
  const [estimatedDailyImpressions, setEstimatedDailyImpressions] = useState("");
  const [estimatedFootfall, setEstimatedFootfall] = useState("");

  // Medium-Specific Dynamic State
  const [mediumSpecs, setMediumSpecs] = useState({});

  const [selectedAudience, setSelectedAudience] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState(null);

  // Dual Location State (GPS & Manual Input)
  const [locationMode, setLocationMode] = useState("gps");
  const [addressInput, setAddressInput] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [stateInput, setStateInput] = useState("");
  const [latitudeInput, setLatitudeInput] = useState("");
  const [longitudeInput, setLongitudeInput] = useState("");

  const [gettingLocation, setGettingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [sellerUser, setSellerUser] = useState(null);

  // Feedback Modal State
  const [modalConfig, setModalConfig] = useState({
    visible: false,
    type: "success",
    title: "",
    message: "",
    details: null,
    primaryBtnText: "OK",
    onPrimaryPress: null,
  });

  useEffect(() => {
    (async () => {
      try {
        const uRes = await userInfo();
        if (uRes?.user) setSellerUser(uRes.user);
      } catch (e) {
        console.log("Error loading seller info:", e);
      }
    })();
  }, []);

  const handleSpecChange = (fieldId, value) => {
    setMediumSpecs((prev) => ({ ...prev, [fieldId]: value }));
  };

  const toggleAudience = (aud) => {
    setSelectedAudience((prev) =>
      prev.includes(aud) ? prev.filter((a) => a !== aud) : [...prev, aud]
    );
  };

  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  // Image Picker Logic (Camera & Gallery)
  const handlePickImage = async (useCamera = false) => {
    try {
      const permissionResult = useCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          `Please grant ${useCamera ? "camera" : "gallery"} permissions to upload photos.`
        );
        return;
      }

      const result = useCamera
        ? await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
            base64: true,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaType?.Images || ImagePicker.MediaTypeOptions?.Images || "images",
            allowsMultipleSelection: true,
            selectionLimit: 5,
            quality: 0.7,
            base64: true,
          });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map(
          (asset) =>
            asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri
        );
        setImages((prev) => [...prev, ...newImages]);
      }
    } catch (err) {
      console.error("Error picking image:", err);
    }
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // GPS Location Fetching
  const handleFetchCurrentLocation = async () => {
    try {
      setGettingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Permission to access location was denied.");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const latNum = loc.coords.latitude;
      const lngNum = loc.coords.longitude;

      setLatitudeInput(String(latNum));
      setLongitudeInput(String(lngNum));

      let addressString = `Lat: ${latNum.toFixed(4)}, Long: ${lngNum.toFixed(4)}`;
      let detectedCity = "";
      let detectedState = "";

      try {
        const [geocode] = await Location.reverseGeocodeAsync({
          latitude: latNum,
          longitude: lngNum,
        });

        if (geocode) {
          detectedCity = geocode.city || geocode.subregion || geocode.district || "";
          detectedState = geocode.region || "";
          const parts = [
            geocode.name || geocode.street,
            geocode.district,
            geocode.city,
            geocode.region,
          ].filter(Boolean);
          if (parts.length > 0) addressString = parts.join(", ");
        }
      } catch (gErr) {
        console.log("Geocode error:", gErr);
      }

      setAddressInput(addressString);
      setCityInput(detectedCity);
      setStateInput(detectedState);

      setLocation({
        address: addressString,
        city: detectedCity,
        state: detectedState,
        latitude: latNum,
        longitude: lngNum,
      });

      if (errors.location) setErrors((prev) => ({ ...prev, location: null }));
    } catch (err) {
      Alert.alert("Location Error", "Unable to fetch location. Please enter location manually.");
    } finally {
      setGettingLocation(false);
    }
  };

  const handleGeocodeAddress = async () => {
    const queryStr = [addressInput, cityInput, stateInput].filter(Boolean).join(", ");
    if (!queryStr.trim()) {
      Alert.alert("Input Required", "Please enter Address or City first.");
      return;
    }
    try {
      setGettingLocation(true);
      const results = await Location.geocodeAsync(queryStr);
      if (results && results.length > 0) {
        const { latitude: latVal, longitude: lngVal } = results[0];
        setLatitudeInput(String(latVal));
        setLongitudeInput(String(lngVal));
        Alert.alert("Coordinates Found", `Lat: ${latVal.toFixed(4)}, Lng: ${lngVal.toFixed(4)}`);
      } else {
        Alert.alert("Not Found", "Could not geocode address. Please type coordinates manually.");
      }
    } catch (err) {
      Alert.alert("Geocode Error", "Unable to find coordinates for specified address.");
    } finally {
      setGettingLocation(false);
    }
  };

  const validateCurrentStep = () => {
    const errs = {};
    if (currentStep === 1) {
      if (!title.trim()) errs.title = "Ad title is required";
    } else if (currentStep === 2) {
      let latVal = Number(latitudeInput);
      let lngVal = Number(longitudeInput);
      if (isNaN(latVal) || latVal < -90 || latVal > 90) {
        errs.location = "Valid Latitude between -90 and 90 is required.";
      }
      if (isNaN(lngVal) || lngVal < -180 || lngVal > 180) {
        errs.location = "Valid Longitude between -180 and 180 is required.";
      }
    } else if (currentStep === 3) {
      if (!price.trim() || isNaN(Number(price)) || Number(price) < 0) {
        errs.price = "Valid non-negative price is required";
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < 5) setCurrentStep(currentStep + 1);
    } else {
      Alert.alert("Validation Required", "Please complete all required fields in this step.");
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    let latVal = Number(latitudeInput);
    let lngVal = Number(longitudeInput);

    if ((isNaN(latVal) || isNaN(lngVal) || (latVal === 0 && lngVal === 0)) && (addressInput || cityInput)) {
      try {
        const queryStr = [addressInput, cityInput, stateInput].filter(Boolean).join(", ");
        const results = await Location.geocodeAsync(queryStr);
        if (results && results.length > 0) {
          latVal = results[0].latitude;
          lngVal = results[0].longitude;
        }
      } catch (e) {
        console.log("Auto geocode on submit failed:", e);
      }
    }

    try {
      setIsSubmitting(true);

      const dimensionsVal = mediumSpecs.dimensions || mediumSpecs.screenResolution || "";
      const visibilityVal = mediumSpecs.visibility || mediumSpecs.operatingHours || "24 Hours";
      const lightingVal = mediumSpecs.lighting || "Non-lit";

      const payload = {
        category,
        title: title.trim(),
        description: description.trim(),
        displayType,
        price: Number(price),
        priceUnit,
        minimumBookingDuration,
        dimensions: dimensionsVal,
        visibility: visibilityVal,
        lighting: lightingVal,
        operatingHours: mediumSpecs.operatingHours || "24 Hours",
        bookingType,
        estimatedDailyImpressions: Number(estimatedDailyImpressions) || 0,
        estimatedFootfall: Number(estimatedFootfall) || 0,
        audienceInformation: selectedAudience,
        amenities: selectedAmenities,
        specifications: mediumSpecs,
        images,
        location: {
          address: addressInput.trim() || location?.address || "Location Specified",
          city: cityInput.trim() || location?.city || "",
          state: stateInput.trim() || location?.state || "",
          latitude: latVal,
          longitude: lngVal,
        },
        availability: {
          isAvailable: true,
        },
      };

      const response = await createAdSpaceApi(payload);

      if (response?.success) {
        setModalConfig({
          visible: true,
          type: "success",
          title: "Ad Space Published! 🎉",
          message: "Your advertisement space has been published successfully and is now active for buyer bookings.",
          details: {
            Title: title.trim(),
            Category: categoryInfo.title || category,
            Price: `₹${Number(price).toLocaleString("en-IN")} / ${priceUnit.replace("per ", "")}`,
            Location: cityInput.trim() || "Location Specified",
          },
          primaryBtnText: "Manage My Ads",
          onPrimaryPress: () => {
            setModalConfig((prev) => ({ ...prev, visible: false }));
            router.push("/Seller/Screens/AdvertisementsScreen");
          },
        });
      }
    } catch (err) {
      setModalConfig({
        visible: true,
        type: "error",
        title: "Submission Failed ⚠️",
        message: err.message || "Failed to publish advertisement space. Please check fields and try again.",
        primaryBtnText: "Review Form",
        onPrimaryPress: () => setModalConfig((prev) => ({ ...prev, visible: false })),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitleText} numberOfLines={1}>
              List New Ad Space
            </Text>
          </View>
          <Text style={styles.stepBadgeText}>Step {currentStep} of 5</Text>
        </View>

        {/* ── Multi-step Progress Bar Indicator ── */}
        <View style={styles.stepProgressContainer}>
          <View style={styles.stepProgressTrack}>
            <View style={[styles.stepProgressFill, { width: `${(currentStep / 5) * 100}%` }]} />
          </View>
          <View style={styles.stepRow}>
            {STEPS.map((s) => {
              const isActive = currentStep === s.id;
              const isDone = currentStep > s.id;
              return (
                <TouchableOpacity
                  key={s.id}
                  style={styles.stepItem}
                  onPress={() => {
                    if (s.id < currentStep || validateCurrentStep()) {
                      setCurrentStep(s.id);
                    }
                  }}
                >
                  <View style={[styles.stepCircle, isDone && styles.stepDone, isActive && styles.stepActive]}>
                    <Ionicons
                      name={isDone ? "checkmark" : s.icon}
                      size={12}
                      color={isActive || isDone ? colors.white : colors.textMuted}
                    />
                  </View>
                  <Text style={[styles.stepLabel, isActive && styles.stepLabelActive]}>
                    {s.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={true}
          enableAutomaticScroll={true}
          extraScrollHeight={Platform.OS === "ios" ? 40 : 100}
        >
          {/* STEP 1: BASIC INFORMATION */}
          {/* STEP 1: BASIC INFORMATION */}
          {currentStep === 1 && (
            <View style={styles.stepSection}>
              <Text style={styles.stepHeading}>Basic Information</Text>
              <Text style={styles.stepSubheading}>Select your ad space category and basic details.</Text>

              {/* Ad Space Category Selector */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>
                  Select Advertising Medium / Category <Text style={styles.requiredStar}>*</Text>
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                  {OFFLINE_AD_CATEGORIES.map((catItem) => {
                    const isSel = category === catItem.categoryName;
                    return (
                      <TouchableOpacity
                        key={catItem.id}
                        style={[
                          styles.chipLarge,
                          isSel && { backgroundColor: catItem.color || colors.primary, borderColor: catItem.color || colors.primary },
                        ]}
                        onPress={() => {
                          setCategory(catItem.categoryName);
                          setMediumSpecs({});
                        }}
                      >
                        <Ionicons
                          name={catItem.icon || "easel-outline"}
                          size={15}
                          color={isSel ? colors.white : (catItem.color || colors.primary)}
                        />
                        <Text style={[styles.chipText, isSel && styles.chipTextActive]}>
                          {catItem.title}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
                <View style={styles.selectedCatNotice}>
                  <Ionicons name="information-circle-outline" size={14} color={colors.primary} />
                  <Text style={styles.selectedCatNoticeText}>
                    Form fields will dynamically adjust for <Text style={{ fontWeight: "800", color: colors.textPrimary }}>{categoryInfo.title}</Text>.
                  </Text>
                </View>
              </View>

              {/* Title */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>
                  Ad Space Title <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, errors.title && styles.inputError]}
                  value={title}
                  onChangeText={(val) => {
                    setTitle(val);
                    if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
                  }}
                  placeholder={`e.g. Prime ${categoryInfo.title || "Ad Space"} at Main Junction`}
                  placeholderTextColor={colors.textMuted}
                />
                {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
              </View>

              {/* Display Type */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Display / Media Format</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                  {DISPLAY_TYPES.map((type) => {
                    const isSel = displayType === type;
                    return (
                      <TouchableOpacity
                        key={type}
                        style={[styles.chip, isSel && styles.chipActive]}
                        onPress={() => setDisplayType(type)}
                      >
                        <Text style={[styles.chipText, isSel && styles.chipTextActive]}>{type}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Description */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textarea]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Provide location highlights, view angles, or campaign benefits..."
                  placeholderTextColor={colors.textMuted}
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>
          )}

          {/* STEP 2: LOCATION & COORDINATES */}
          {currentStep === 2 && (
            <View style={styles.stepSection}>
              <Text style={styles.stepHeading}>Location & Coords</Text>
              <Text style={styles.stepSubheading}>Where is this advertisement space located?</Text>

              {/* Location Mode Toggle Pills */}
              <View style={styles.locationModeRow}>
                <TouchableOpacity
                  style={[styles.locationModeBtn, locationMode === "gps" && styles.locationModeBtnActive]}
                  onPress={() => setLocationMode("gps")}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="navigate"
                    size={14}
                    color={locationMode === "gps" ? colors.white : colors.textSecondary}
                  />
                  <Text style={[styles.locationModeText, locationMode === "gps" && styles.locationModeTextActive]}>
                    GPS Auto-Detect
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.locationModeBtn, locationMode === "manual" && styles.locationModeBtnActive]}
                  onPress={() => setLocationMode("manual")}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="create-outline"
                    size={14}
                    color={locationMode === "manual" ? colors.white : colors.textSecondary}
                  />
                  <Text style={[styles.locationModeText, locationMode === "manual" && styles.locationModeTextActive]}>
                    Manual Input
                  </Text>
                </TouchableOpacity>
              </View>

              {locationMode === "gps" ? (
                <TouchableOpacity
                  style={styles.locationButton}
                  onPress={handleFetchCurrentLocation}
                  disabled={gettingLocation}
                  activeOpacity={0.85}
                >
                  {gettingLocation ? (
                    <ActivityIndicator size="small" color={colors.white} />
                  ) : (
                    <>
                      <Ionicons name="location" size={18} color={colors.white} />
                      <Text style={styles.locationBtnText}>Detect GPS Location</Text>
                    </>
                  )}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.geocodeBtn}
                  onPress={handleGeocodeAddress}
                  disabled={gettingLocation}
                  activeOpacity={0.85}
                >
                  {gettingLocation ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : (
                    <>
                      <Ionicons name="sparkles-outline" size={15} color={colors.primary} />
                      <Text style={styles.geocodeBtnText}>Auto-fetch Coords from Address</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}

              <View style={styles.locationInputsCard}>
                <View style={styles.subFieldContainer}>
                  <Text style={styles.subLabel}>Address / Location Landmark</Text>
                  <TextInput
                    style={styles.input}
                    value={addressInput}
                    onChangeText={setAddressInput}
                    placeholder="e.g. M.G. Road, Opp. City Mall"
                    placeholderTextColor={colors.textMuted}
                  />
                </View>

                <View style={styles.rowInputs}>
                  <View style={[styles.subFieldContainer, { flex: 1 }]}>
                    <Text style={styles.subLabel}>City</Text>
                    <TextInput
                      style={styles.input}
                      value={cityInput}
                      onChangeText={setCityInput}
                      placeholder="e.g. Mumbai"
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>

                  <View style={[styles.subFieldContainer, { flex: 1 }]}>
                    <Text style={styles.subLabel}>State</Text>
                    <TextInput
                      style={styles.input}
                      value={stateInput}
                      onChangeText={setStateInput}
                      placeholder="e.g. Maharashtra"
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                </View>

                <View style={styles.rowInputs}>
                  <View style={[styles.subFieldContainer, { flex: 1 }]}>
                    <Text style={styles.subLabel}>Latitude</Text>
                    <TextInput
                      style={styles.input}
                      value={latitudeInput}
                      onChangeText={setLatitudeInput}
                      placeholder="e.g. 19.0760"
                      placeholderTextColor={colors.textMuted}
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={[styles.subFieldContainer, { flex: 1 }]}>
                    <Text style={styles.subLabel}>Longitude</Text>
                    <TextInput
                      style={styles.input}
                      value={longitudeInput}
                      onChangeText={setLongitudeInput}
                      placeholder="e.g. 72.8777"
                      placeholderTextColor={colors.textMuted}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>

              {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
            </View>
          )}

          {/* STEP 3: PRICING & SPECIFICATIONS */}
          {currentStep === 3 && (
            <View style={styles.stepSection}>
              <Text style={styles.stepHeading}>Pricing & Specifications</Text>
              <Text style={styles.stepSubheading}>Set your rates, booking rules and medium features.</Text>

              {/* Price */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>
                  Rate (₹) <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, errors.price && styles.inputError]}
                  value={price}
                  onChangeText={(val) => {
                    setPrice(val);
                    if (errors.price) setErrors((prev) => ({ ...prev, price: null }));
                  }}
                  placeholder="e.g. 45000"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                />
                {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}

                <View style={styles.priceUnitSubContainer}>
                  <Text style={styles.subLabel}>Billing Duration Unit:</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                    {PRICE_UNITS.map((unit) => {
                      const isSel = priceUnit === unit;
                      return (
                        <TouchableOpacity
                          key={unit}
                          style={[styles.chipLarge, isSel && styles.chipActive]}
                          onPress={() => setPriceUnit(unit)}
                        >
                          <Text style={[styles.chipText, isSel && styles.chipTextActive]}>{unit}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              </View>

              {/* Booking Approval Model */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Booking Approval Model</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                  {BOOKING_TYPES.map((bType) => {
                    const isSel = bookingType === bType;
                    return (
                      <TouchableOpacity
                        key={bType}
                        style={[styles.chipLarge, isSel && styles.chipActive]}
                        onPress={() => setBookingType(bType)}
                      >
                        <Ionicons
                          name={bType === "Instant Booking" ? "flash-outline" : "paper-plane-outline"}
                          size={14}
                          color={isSel ? colors.white : colors.primary}
                        />
                        <Text style={[styles.chipText, isSel && styles.chipTextActive]}>{bType}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Dynamic Specs */}
              {dynamicFields.length > 0 && (
                <View style={styles.dynamicSection}>
                  <View style={styles.dynamicHeader}>
                    <Ionicons name="options-outline" size={18} color={colors.primary} />
                    <Text style={styles.dynamicTitle}>{categoryInfo.title} Specs</Text>
                  </View>

                  {dynamicFields.map((field) => (
                    <View key={field.id} style={styles.fieldContainer}>
                      <Text style={styles.fieldLabel}>{field.label}</Text>
                      {field.type === "chip" || field.type === "select" || Array.isArray(field.options) ? (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                          {field.options.map((opt) => {
                            const isSel = mediumSpecs[field.id] === opt;
                            return (
                              <TouchableOpacity
                                key={opt}
                                style={[styles.chipLarge, isSel && styles.chipActive]}
                                onPress={() => handleSpecChange(field.id, opt)}
                                activeOpacity={0.8}
                              >
                                <Text style={[styles.chipText, isSel && styles.chipTextActive]}>{opt}</Text>
                              </TouchableOpacity>
                            );
                          })}
                        </ScrollView>
                      ) : (
                        <TextInput
                          style={styles.input}
                          value={mediumSpecs[field.id] || ""}
                          onChangeText={(val) => handleSpecChange(field.id, val)}
                          placeholder={field.placeholder || `Enter ${field.label}`}
                          placeholderTextColor={colors.textMuted}
                          keyboardType={field.keyboardType || "default"}
                        />
                      )}
                    </View>
                  ))}
                </View>
              )}

              {/* Target Audience */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Target Audience</Text>
                <View style={styles.wrapChipRow}>
                  {AUDIENCE_OPTIONS.map((aud) => {
                    const isSel = selectedAudience.includes(aud);
                    return (
                      <TouchableOpacity
                        key={aud}
                        style={[styles.chip, isSel && styles.chipActive]}
                        onPress={() => toggleAudience(aud)}
                      >
                        <Text style={[styles.chipText, isSel && styles.chipTextActive]}>{aud}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Amenities */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Features & Amenities</Text>
                <View style={styles.wrapChipRow}>
                  {AMENITY_OPTIONS.map((amenity) => {
                    const isSel = selectedAmenities.includes(amenity);
                    return (
                      <TouchableOpacity
                        key={amenity}
                        style={[styles.chip, isSel && styles.chipActive]}
                        onPress={() => toggleAmenity(amenity)}
                      >
                        <Text style={[styles.chipText, isSel && styles.chipTextActive]}>{amenity}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
          )}

          {/* STEP 4: MEDIA & PHOTOS */}
          {currentStep === 4 && (
            <View style={styles.stepSection}>
              <Text style={styles.stepHeading}>Upload Photos</Text>
              <Text style={styles.stepSubheading}>Upload clear photos of your advertising space to attract buyers.</Text>

              <View style={styles.dropZoneCard}>
                <Ionicons name="cloud-upload-outline" size={36} color={colors.primary} />
                <Text style={styles.dropTitle}>+ Add Photos</Text>
                <Text style={styles.dropSub}>Upload photos from your gallery or take live photos</Text>

                <View style={styles.imagePickerRow}>
                  <TouchableOpacity style={styles.pickBtn} onPress={() => handlePickImage(false)}>
                    <Ionicons name="images-outline" size={16} color={colors.primary} />
                    <Text style={styles.pickBtnText}>Gallery</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.pickBtn} onPress={() => handlePickImage(true)}>
                    <Ionicons name="camera-outline" size={16} color={colors.primary} />
                    <Text style={styles.pickBtnText}>Camera</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {images.length > 0 && (
                <View style={styles.photosGridSection}>
                  <Text style={styles.fieldLabel}>Uploaded Photos ({images.length})</Text>
                  <View style={styles.photosGrid}>
                    {images.map((imgUri, idx) => (
                      <View key={idx} style={styles.photoGridWrapper}>
                        <Image source={{ uri: imgUri }} style={styles.photoGridImg} />
                        {idx === 0 && (
                          <View style={styles.coverBadge}>
                            <Text style={styles.coverBadgeText}>COVER PHOTO</Text>
                          </View>
                        )}
                        <TouchableOpacity style={styles.removeBadge} onPress={() => handleRemoveImage(idx)}>
                          <Ionicons name="close-circle" size={18} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}

          {/* STEP 5: REVIEW & PUBLISH */}
          {currentStep === 5 && (
            <View style={styles.stepSection}>
              <Text style={styles.stepHeading}>Review & Publish</Text>
              <Text style={styles.stepSubheading}>Double-check listing details before making it live for buyers.</Text>

              <View style={styles.reviewCard}>
                {images.length > 0 ? (
                  <Image source={{ uri: images[0] }} style={styles.reviewCoverImg} />
                ) : (
                  <View style={styles.noImgCover}>
                    <Ionicons name="image-outline" size={32} color={colors.textMuted} />
                    <Text style={styles.noImgText}>No image uploaded</Text>
                  </View>
                )}

                <View style={styles.reviewContent}>
                  <View style={styles.reviewTitleRow}>
                    <Text style={styles.reviewTitle}>{title || "Untitled Ad Space"}</Text>
                    <Text style={styles.reviewPrice}>
                      ₹{Number(price || 0).toLocaleString("en-IN")} <Text style={{ fontSize: 11, color: colors.textSecondary }}>/ {priceUnit.replace("per ", "")}</Text>
                    </Text>
                  </View>

                  <View style={styles.reviewInfoRow}>
                    <Ionicons name="location-outline" size={13} color="#EF4444" />
                    <Text style={styles.reviewInfoText}>
                      {cityInput ? `${cityInput}, ${stateInput}` : addressInput || "Location Specified"}
                    </Text>
                  </View>

                  <View style={styles.reviewInfoRow}>
                    <Ionicons name="pricetag-outline" size={13} color={colors.primary} />
                    <Text style={styles.reviewInfoText}>
                      {categoryInfo.title || category} • {displayType}
                    </Text>
                  </View>

                  {sellerUser && (
                    <View style={styles.contactNoticeBanner}>
                      <Ionicons name="call-outline" size={15} color="#059669" />
                      <Text style={styles.contactNoticeText}>
                        Buyer Contact Number:{" "}
                        <Text style={{ fontWeight: "700", color: colors.textPrimary }}>
                          {sellerUser.mobileNumber || sellerUser.mobile || sellerUser.phone || sellerUser.email}
                        </Text>
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}

          {/* Step Navigation Actions */}
          <View style={styles.stepNavRow}>
            {currentStep > 1 && (
              <TouchableOpacity
                style={styles.prevBtn}
                onPress={handlePrevStep}
                activeOpacity={0.8}
              >
                <Ionicons name="arrow-back" size={16} color={colors.textPrimary} />
                <Text style={styles.prevBtnText}>Back</Text>
              </TouchableOpacity>
            )}

            {currentStep < 5 ? (
              <TouchableOpacity
                style={styles.nextBtn}
                onPress={handleNextStep}
                activeOpacity={0.88}
              >
                <Text style={styles.nextBtnText}>Continue</Text>
                <Ionicons name="arrow-forward" size={16} color={colors.white} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleSubmit}
                disabled={isSubmitting}
                activeOpacity={0.88}
              >
                {isSubmitting ? (
                  <ActivityIndicator color={colors.white} size="small" />
                ) : (
                  <>
                    <Text style={styles.submitBtnText}>Publish Advertisement Space</Text>
                    <Ionicons name="arrow-forward" size={18} color={colors.white} />
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>

      <FeedbackModal {...modalConfig} />
    </SafeAreaView>
  );
};

export default CreateAdvertisement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 10 : 6,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.neutralLight,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitleText: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  stepBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
  },

  // Multi-step Progress Bar
  stepProgressContainer: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  stepProgressTrack: {
    height: 4,
    backgroundColor: colors.neutralLight,
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 10,
  },
  stepProgressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  stepRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stepItem: {
    alignItems: "center",
    gap: 4,
  },
  stepCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.neutralLight,
    justifyContent: "center",
    alignItems: "center",
  },
  stepActive: {
    backgroundColor: colors.primary,
  },
  stepDone: {
    backgroundColor: colors.textPrimary,
  },
  stepLabel: {
    fontSize: 9,
    fontWeight: "600",
    color: colors.textMuted,
  },
  stepLabelActive: {
    color: colors.primary,
    fontWeight: "800",
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: hp("12%"),
  },

  stepSection: {
    gap: 18,
  },
  stepHeading: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  stepSubheading: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: -12,
    lineHeight: 18,
  },

  fieldContainer: {
    gap: 8,
  },
  selectedCatNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 4,
  },
  selectedCatNoticeText: {
    fontSize: 12,
    color: colors.primary,
    flex: 1,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  requiredStar: {
    color: "#EF4444",
  },
  subLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSecondary,
    marginBottom: 3,
  },
  subFieldContainer: {
    gap: 2,
  },

  input: {
    width: "100%",
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    fontSize: 14,
    color: colors.textPrimary,
  },
  inputError: {
    borderColor: "#EF4444",
  },
  textarea: {
    height: 80,
    paddingTop: 12,
    textAlignVertical: "top",
  },

  priceUnitSubContainer: {
    marginTop: 8,
    gap: 6,
  },

  chipRow: {
    gap: 8,
    paddingVertical: 2,
  },
  wrapChipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipLarge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.white,
    fontWeight: "700",
  },

  dynamicSection: {
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    gap: 16,
  },
  dynamicHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dynamicTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.textPrimary,
  },

  // Location Mode
  locationModeRow: {
    flexDirection: "row",
    gap: 10,
  },
  locationModeBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  locationModeBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  locationModeText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  locationModeTextActive: {
    color: colors.white,
    fontWeight: "700",
  },
  locationButton: {
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  locationBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "700",
  },
  geocodeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: "#EFF6FF",
  },
  geocodeBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
  },
  locationInputsCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 12,
  },
  rowInputs: {
    flexDirection: "row",
    gap: 12,
  },

  // Photos
  dropZoneCard: {
    backgroundColor: "#F8FAFC",
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: "dashed",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    gap: 8,
  },
  dropTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  dropSub: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
  },
  imagePickerRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  pickBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  pickBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  photosGridSection: {
    gap: 10,
    marginTop: 12,
  },
  photosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  photoGridWrapper: {
    width: (wp("100%") - 60) / 3,
    height: (wp("100%") - 60) / 3,
    borderRadius: 14,
    overflow: "hidden",
    position: "relative",
  },
  photoGridImg: {
    width: "100%",
    height: "100%",
  },
  coverBadge: {
    position: "absolute",
    bottom: 4,
    left: 4,
    backgroundColor: "rgba(17, 24, 39, 0.8)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  coverBadgeText: {
    fontSize: 8,
    fontWeight: "800",
    color: colors.white,
  },
  removeBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: colors.white,
    borderRadius: 9,
  },

  // Review
  reviewCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  reviewCoverImg: {
    width: "100%",
    height: 180,
  },
  noImgCover: {
    width: "100%",
    height: 140,
    backgroundColor: colors.neutralLight,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  noImgText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  reviewContent: {
    padding: 16,
    gap: 10,
  },
  reviewTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  reviewTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    color: colors.textPrimary,
    paddingRight: 10,
  },
  reviewPrice: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.primary,
  },
  reviewInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  reviewInfoText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  contactNoticeBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    padding: 10,
    borderRadius: 10,
    marginTop: 4,
  },
  contactNoticeText: {
    flex: 1,
    fontSize: 11,
    color: "#047857",
  },

  // Navigation Buttons
  stepNavRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  prevBtn: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  prevBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  nextBtn: {
    flex: 2,
    height: 50,
    borderRadius: 16,
    backgroundColor: colors.button,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  nextBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.white,
  },
  submitBtn: {
    flex: 2,
    height: 50,
    borderRadius: 16,
    backgroundColor: colors.button,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  submitBtnText: {
    color: colors.white,
    fontSize: 12.5,
    fontWeight: "700",
  },
  errorText: {
    fontSize: 11,
    color: "#EF4444",
    marginTop: 2,
  },
});
