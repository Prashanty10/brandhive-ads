export const ONLINE_PLATFORMS = [
  {
    id: "google_ads",
    platformKey: "google_ads",
    name: "Google Ads",
    title: "Google Ads",
    category: "Search",
    tags: ["Search", "Popular", "Shopping"],
    subtitle: "Search, Display, Shopping & Performance Max",
    shortOverview: "Google Ads is the world's largest digital advertising platform reaching over 90% of global internet users.",
    icon: "logo-google",
    iconColor: "#4285F4",
    bgTint: "#E8F0FE",
    coverImage: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?q=80&w=1000&auto=format&fit=crop",
    whatIsIt: "Google Ads allows advertisers to display text, image, video, and product listing ads across Google Search, YouTube, Gmail, and millions of partner websites.",
    howItWorks: "Operating on an auction-based pay-per-click (PPC) model, ads are triggered based on user search keywords, intent signals, and audience targeting.",
    audienceReach: {
      globalUsers: "4.3 Billion+",
      activeUsers: "500 Million+ in India",
      supportedCountries: "190+ Countries",
      keyDemographics: "All demographics (18 - 65+)",
    },
    pricingModel: {
      cpc: "₹10 - ₹250 per click",
      cpm: "₹100 - ₹500 per 1,000 impressions",
      cpa: "₹300 - ₹2,500 per lead/sale",
      dailyBudget: "₹500 - ₹5,000",
      weeklyBudget: "₹3,500 - ₹35,000",
      monthlyBudget: "₹15,000 - ₹1,50,000",
      note: "Costs vary depending on keyword competitiveness, quality score, and target location.",
    },
    bestUseCases: [
      "High-intent lead generation for services & B2B",
      "E-commerce sales via Google Shopping & Performance Max",
      "Local business foot-traffic campaigns",
      "Brand awareness via Display Network banners",
    ],
    adTypes: [
      { name: "Search Ads", description: "Text ads appearing above Google search results.", specs: "Headline 30 chars, Description 90 chars" },
      { name: "Display Ads", description: "Visual banner ads on 2M+ websites & apps.", specs: "300x250, 728x90, 160x600 px" },
      { name: "Performance Max", description: "AI-driven automated campaigns across all Google channels.", specs: "Combined images, video, headlines & logos" },
    ],
    targetingOptions: [
      "Search Intent & Keyword Match Types",
      "Demographics (Age, Gender, Household Income)",
      "In-Market & Affinity Audiences",
      "Geographic radius & location targeting",
    ],
    advantages: [
      "Highest intent audience ready to convert immediately",
      "Massive global and local reach across all devices",
      "Transparent ROI with granular conversion analytics",
    ],
    disadvantages: [
      "High competition & CPC in lucrative niches (e.g. Finance, Legal)",
      "Requires continuous monitoring & negative keyword optimization",
    ],
    setupRequirements: [
      "Google Ads account linked to payment method",
      "Conversion tracking pixel installed on website",
      "Verified domain and privacy policy link",
    ],
    tipsAndBestPractices: [
      "Utilize negative keywords to eliminate irrelevant clicks.",
      "A/B test at least 3 ad headlines per ad group.",
      "Maintain high landing page relevance for optimal Quality Score.",
    ],
    faqs: [
      { question: "What is a good starting budget for Google Ads?", answer: "We recommend starting with ₹1,000 - ₹2,000 per day to gather actionable keyword data." },
      { question: "How long until I see results?", answer: "Search campaign clicks start immediately; conversion optimization takes 1-2 weeks." },
    ],
    officialWebsite: { name: "Visit Google Ads", url: "https://ads.google.com" },
  },
  {
    id: "youtube_ads",
    platformKey: "youtube_ads",
    name: "YouTube Ads",
    title: "YouTube Ads",
    category: "Video",
    tags: ["Video", "Popular"],
    subtitle: "In-Stream, Bumper, Shorts & Video Discovery",
    shortOverview: "YouTube Ads leverage video content to captivate over 2.5 billion logged-in monthly users.",
    icon: "logo-youtube",
    iconColor: "#FF0000",
    bgTint: "#FFE6E6",
    coverImage: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1000&auto=format&fit=crop",
    whatIsIt: "YouTube Ads deliver immersive video promotions before, during, or alongside YouTube videos and Shorts.",
    howItWorks: "Billed on Cost-Per-View (CPV) or CPM, advertisers pay when viewers watch at least 30 seconds of video or click.",
    audienceReach: {
      globalUsers: "2.5 Billion+",
      activeUsers: "460 Million+ in India",
      supportedCountries: "100+ Countries",
      keyDemographics: "Gen Z, Millennials & Adults (13 - 54)",
    },
    pricingModel: {
      cpc: "₹1.50 - ₹8.00 per view (CPV)",
      cpm: "₹120 - ₹450 per 1,000 impressions",
      cpa: "₹400 - ₹3,000 per action",
      dailyBudget: "₹800 - ₹8,000",
      weeklyBudget: "₹5,600 - ₹56,000",
      monthlyBudget: "₹25,000 - ₹2,50,000",
      note: "CPV is only charged if viewer watches for at least 30 seconds or clicks.",
    },
    bestUseCases: [
      "Brand awareness & visual storytelling",
      "Product demonstrations and unboxing",
      "YouTube Shorts viral marketing",
    ],
    adTypes: [
      { name: "Skippable In-Stream", description: "Plays before/during videos with skip option after 5s.", specs: "16:9 HD video, 12s to 3 mins" },
      { name: "Non-Skippable In-Stream", description: "15-second unskippable video ad.", specs: "Max 15 seconds" },
      { name: "Bumper Ads", description: "6-second unskippable quick message ad.", specs: "Max 6 seconds" },
    ],
    targetingOptions: [
      "Topic & Channel Placement targeting",
      "Video interest categories & custom intent",
      "Demographic & Life Event targeting",
    ],
    advantages: [
      "High visual engagement and emotional resonance",
      "Extremely low Cost-Per-View compared to traditional TV",
    ],
    disadvantages: [
      "Requires high video production effort",
      "Viewers can skip ads after 5 seconds",
    ],
    setupRequirements: [
      "YouTube Channel linked to Google Ads account",
      "HD Video asset uploaded as unlisted or public",
    ],
    tipsAndBestPractices: [
      "Hook the viewer in the first 3 seconds before the skip button appears.",
      "Include a clear Call-To-Action (CTA) overlay banner.",
    ],
    faqs: [
      { question: "Do I pay if a viewer skips my video?", answer: "No! You only pay if they watch 30+ seconds or interact with the ad." },
    ],
    officialWebsite: { name: "Visit YouTube Advertising", url: "https://www.youtube.com/ads" },
  },
  {
    id: "meta_ads",
    platformKey: "meta_ads",
    name: "Meta Ads (Facebook + Instagram)",
    title: "Meta Ads (Facebook + Instagram)",
    category: "Social Media",
    tags: ["Social Media", "Popular", "Messaging"],
    subtitle: "Feed, Stories, Reels, Messenger & WhatsApp",
    shortOverview: "Meta Ads connect brands with over 3 billion users across Facebook, Instagram, and WhatsApp.",
    icon: "logo-facebook",
    iconColor: "#1877F2",
    bgTint: "#E7F3FF",
    coverImage: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=1000&auto=format&fit=crop",
    whatIsIt: "Meta Ads manager runs visual single image, video, carousel, and Reels ads across Facebook and Instagram.",
    howItWorks: "Utilizes advanced machine learning and Meta Pixel tracking to target users based on interests, behaviors, and lookalikes.",
    audienceReach: {
      globalUsers: "3.0 Billion+",
      activeUsers: "400 Million+ in India",
      supportedCountries: "200+ Countries",
      keyDemographics: "18 - 55+ years",
    },
    pricingModel: {
      cpc: "₹5 - ₹60 per click",
      cpm: "₹80 - ₹350 per 1,000 impressions",
      cpa: "₹150 - ₹1,200 per lead",
      dailyBudget: "₹500 - ₹5,000",
      weeklyBudget: "₹3,500 - ₹35,000",
      monthlyBudget: "₹15,000 - ₹1,50,000",
      note: "Advantage+ budgeting automatically optimizes budget distribution.",
    },
    bestUseCases: [
      "Direct-to-consumer (D2C) E-commerce sales",
      "Instagram Reels viral video marketing",
      "Lead generation forms for real estate, education & services",
    ],
    adTypes: [
      { name: "Single Image / Video", description: "Appears natively in Instagram & Facebook feeds.", specs: "1:1 ratio (1080x1080) or 4:5" },
      { name: "Instagram Reels", description: "Full-screen 9:16 vertical video ad.", specs: "1080x1920 px, 15-60s video" },
      { name: "Carousel Ads", description: "Multi-card scrollable product images.", specs: "2 to 10 cards with unique links" },
    ],
    targetingOptions: [
      "Detailed Interest, Behavior & Job Title targeting",
      "Lookalike Audiences based on existing customers",
      "Meta Pixel Website Retargeting",
    ],
    advantages: [
      "Unmatched demographic and interest targeting precision",
      "Powerful AI algorithm for lead and purchase optimization",
    ],
    disadvantages: [
      "Ad fatigue can occur quickly requiring fresh creatives",
      "iOS privacy changes require verified CAPI setup",
    ],
    setupRequirements: [
      "Facebook Business Page & Instagram Professional Account",
      "Meta Ads Manager Account & Meta Pixel",
    ],
    tipsAndBestPractices: [
      "Use vertical 9:16 video for Reels placements.",
      "Refresh creative assets every 2-3 weeks.",
    ],
    faqs: [
      { question: "Can I run ads on Instagram without a Facebook page?", answer: "No, a Facebook Business Page is required to manage Meta Ads." },
    ],
    officialWebsite: { name: "Visit Meta Ads Manager", url: "https://www.facebook.com/business/ads" },
  },
  {
    id: "linkedin_ads",
    platformKey: "linkedin_ads",
    name: "LinkedIn Ads",
    title: "LinkedIn Ads",
    category: "Business",
    tags: ["Business", "Social Media"],
    subtitle: "B2B Lead Gen, Sponsored Content & InMail",
    shortOverview: "LinkedIn Ads is the premier B2B marketing platform targeting decision-makers and professionals.",
    icon: "logo-linkedin",
    iconColor: "#0A66C2",
    bgTint: "#E8F4F8",
    coverImage: "https://images.unsplash.com/photo-1616469829941-c7200edec809?q=80&w=1000&auto=format&fit=crop",
    whatIsIt: "LinkedIn Campaign Manager allows B2B companies to promote content directly to professionals by job title, company size, and industry.",
    howItWorks: "Delivers Sponsored Content, Message Ads, and Lead Gen Forms directly into professional feeds and inboxes.",
    audienceReach: {
      globalUsers: "1.0 Billion+",
      activeUsers: "110 Million+ in India",
      supportedCountries: "200+ Countries",
      keyDemographics: "Professionals & Executives (22 - 60)",
    },
    pricingModel: {
      cpc: "₹150 - ₹600 per click",
      cpm: "₹450 - ₹1,800 per 1,000 impressions",
      cpa: "₹1,500 - ₹8,000 per B2B lead",
      dailyBudget: "₹2,000 - ₹10,000",
      weeklyBudget: "₹14,000 - ₹70,000",
      monthlyBudget: "₹50,000 - ₹3,000,000",
      note: "Higher CPC than consumer platforms, but unmatched B2B lead quality.",
    },
    bestUseCases: [
      "Enterprise SaaS and High-ticket B2B sales",
      "Executive recruitment and employer branding",
      "Whitepaper & Webinar downloads via Lead Gen Forms",
    ],
    adTypes: [
      { name: "Sponsored Content", description: "Native posts in LinkedIn feed.", specs: "1200x627 px or 1:1 square" },
      { name: "Lead Gen Forms", description: "Pre-filled lead forms within LinkedIn.", specs: "Custom questions + Auto-fill profile info" },
      { name: "Sponsored InMail", description: "Direct personalized message to professional inboxes.", specs: "Subject line + Body text + CTA" },
    ],
    targetingOptions: [
      "Job Title, Seniority & Function",
      "Company Name, Industry & Employee Count",
      "Degree, Field of Study & Skills",
    ],
    advantages: [
      "Direct reach to C-level executives and decision makers",
      "High quality B2B conversion rates",
    ],
    disadvantages: [
      "Significantly higher Cost-Per-Click than consumer platforms",
    ],
    setupRequirements: [
      "LinkedIn Company Page",
      "LinkedIn Campaign Manager Account",
    ],
    tipsAndBestPractices: [
      "Use Lead Gen Forms instead of external landing pages for 3x higher conversion.",
      "Keep target audience size between 50,000 and 300,000 professionals.",
    ],
    faqs: [
      { question: "Why is LinkedIn advertising more expensive?", answer: "Because you are targeting verified business decision-makers with high purchasing power." },
    ],
    officialWebsite: { name: "Visit LinkedIn Marketing", url: "https://business.linkedin.com/marketing-solutions" },
  },
  {
    id: "twitter_ads",
    platformKey: "twitter_ads",
    name: "X (Twitter) Ads",
    title: "X (Twitter) Ads",
    category: "Social Media",
    tags: ["Social Media"],
    subtitle: "Promoted Posts, Trends & Takeovers",
    shortOverview: "X (formerly Twitter) Ads deliver real-time news, trend promotion, and conversation engagement.",
    icon: "logo-twitter",
    iconColor: "#1DA1F2",
    bgTint: "#E8F5FD",
    coverImage: "https://images.unsplash.com/photo-1611605698335-8b1569810432?q=80&w=1000&auto=format&fit=crop",
    whatIsIt: "X Ads allow brands to amplify tweets, promote trends, and launch video takeovers to engaged conversational users.",
    howItWorks: "Billed on engagement, clicks, or impression volume tied to trending topics and conversation keywords.",
    audienceReach: {
      globalUsers: "500 Million+",
      activeUsers: "25 Million+ in India",
      supportedCountries: "150+ Countries",
      keyDemographics: "Tech enthusiasts, journalists & professionals (20 - 45)",
    },
    pricingModel: {
      cpc: "₹15 - ₹120 per click/engagement",
      cpm: "₹100 - ₹450 per 1,000 impressions",
      dailyBudget: "₹1,000 - ₹8,000",
      weeklyBudget: "₹7,000 - ₹56,000",
      monthlyBudget: "₹30,000 - ₹2,000,000",
      note: "Trend Takeovers are sold on a fixed 24-hour rate.",
    },
    bestUseCases: [
      "Crypto, Web3, Tech & Gaming announcements",
      "Real-time event & sports campaign promotions",
      "Brand PR and thought leadership engagement",
    ],
    adTypes: [
      { name: "Promoted Posts", description: "Amplified tweets with media & links.", specs: "Image 1200x675 or Video 16:9" },
      { name: "Trend Takeover", description: "Places brand ad at the top of the Explore tab.", specs: "24-hour exclusive trend placement" },
    ],
    targetingOptions: [
      "Keyword & Conversation Hashtags",
      "Follower Lookalikes (Target followers of competitors)",
      "Interests & Device targeting",
    ],
    advantages: [
      "Great for viral real-time news and tech campaigns",
      "Follower lookalike targeting is highly effective",
    ],
    disadvantages: [
      "Volatile platform dynamics and fast content turnover",
    ],
    setupRequirements: [
      "Active X (Twitter) Account",
      "X Ads Manager registration",
    ],
    tipsAndBestPractices: [
      "Leverage trending hashtags relevant to your industry.",
      "Keep text concise under 280 characters with a strong visual.",
    ],
    faqs: [
      { question: "Can I target followers of specific handles?", answer: "Yes! X allows targeting users similar to followers of any public account." },
    ],
    officialWebsite: { name: "Visit X Business", url: "https://ads.x.com" },
  },
  {
    id: "snapchat_ads",
    platformKey: "snapchat_ads",
    name: "Snapchat Ads",
    title: "Snapchat Ads",
    category: "Social Media",
    tags: ["Social Media"],
    subtitle: "Story Ads, AR Lenses & Vertical Video",
    shortOverview: "Snapchat Ads reach over 400 million daily active Gen Z and youth users through immersive AR and vertical video.",
    icon: "logo-snapchat",
    iconColor: "#D97706",
    bgTint: "#FEF3C7",
    coverImage: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?q=80&w=1000&auto=format&fit=crop",
    whatIsIt: "Snapchat Ads Manager enables vertical full-screen video, AR lens filters, and Commerce catalog ads.",
    howItWorks: "Full-screen 9:16 ads swipe up to open websites, apps, or product checkout pages.",
    audienceReach: {
      globalUsers: "800 Million+",
      activeUsers: "200 Million+ in India",
      supportedCountries: "90+ Countries",
      keyDemographics: "Gen Z & Youth (13 - 28)",
    },
    pricingModel: {
      cpc: "₹4 - ₹30 per swipe-up",
      cpm: "₹50 - ₹200 per 1,000 impressions",
      dailyBudget: "₹500 - ₹3,000",
      weeklyBudget: "₹3,500 - ₹21,000",
      monthlyBudget: "₹15,000 - ₹1,00,000",
      note: "Extremely cost-effective for Gen Z mobile app installs and fashion e-commerce.",
    },
    bestUseCases: [
      "App downloads and mobile gaming",
      "Fashion, Beauty & Lifestyle D2C brands",
      "Augmented Reality (AR) filter experiences",
    ],
    adTypes: [
      { name: "Single Image / Video", description: "Full-screen vertical video ad with swipe-up.", specs: "9:16 ratio (1080x1920 px)" },
      { name: "AR Lens Ads", description: "Interactive face/world filter experience.", specs: "Custom 3D AR asset" },
    ],
    targetingOptions: [
      "Age, Gender & Lifestyle Categories",
      "Location & Gaming Interests",
    ],
    advantages: [
      "Lowest CPMs among major social platforms",
      "Unmatched Gen Z youth engagement",
    ],
    disadvantages: [
      "Limited reach for older demographic groups (35+)",
    ],
    setupRequirements: [
      "Snapchat Account & Ads Manager Profile",
    ],
    tipsAndBestPractices: [
      "Keep video duration under 6 seconds for maximum completion rate.",
    ],
    faqs: [
      { question: "Is Snapchat good for B2B?", answer: "No, Snapchat is primarily tailored for B2C, Gen Z, and mobile consumer brands." },
    ],
    officialWebsite: { name: "Visit Snapchat Ads", url: "https://forbusiness.snapchat.com" },
  },
  {
    id: "amazon_ads",
    platformKey: "amazon_ads",
    name: "Amazon Ads",
    title: "Amazon Ads",
    category: "Shopping",
    tags: ["Shopping", "Popular", "Search"],
    subtitle: "Sponsored Products, Brands & Display Ads",
    shortOverview: "Amazon Ads target high-intent shoppers directly on the world's largest e-commerce marketplace.",
    icon: "cart",
    iconColor: "#FF9900",
    bgTint: "#FFF4E5",
    coverImage: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?q=80&w=1000&auto=format&fit=crop",
    whatIsIt: "Amazon Advertising helps sellers and brands promote products at the top of Amazon search results and product pages.",
    howItWorks: "Pay-per-click (PPC) bidding on product search keywords and ASIN product page placements.",
    audienceReach: {
      globalUsers: "300 Million+",
      activeUsers: "150 Million+ in India",
      supportedCountries: "20+ Marketplaces",
      keyDemographics: "Active online shoppers (18 - 60)",
    },
    pricingModel: {
      cpc: "₹8 - ₹150 per click",
      cpm: "₹120 - ₹600 per 1,000 impressions",
      cpa: "Target ACoS (Advertising Cost of Sales)",
      dailyBudget: "₹500 - ₹5,000",
      weeklyBudget: "₹3,500 - ₹35,000",
      monthlyBudget: "₹15,000 - ₹1,50,000",
      note: "Measured using ACoS and ROAS for ecommerce profitability.",
    },
    bestUseCases: [
      "E-commerce seller product sales boost",
      "New product launch velocity",
      "Brand store showcase on Amazon",
    ],
    adTypes: [
      { name: "Sponsored Products", description: "Promoted listings in search results.", specs: "Automatic or Manual keyword targeting" },
      { name: "Sponsored Brands", description: "Headline banner with logo & multiple products.", specs: "Brand Logo + Headline + 3 products" },
    ],
    targetingOptions: [
      "Product Keyword Search Intent",
      "Category & ASIN competitor targeting",
    ],
    advantages: [
      "Shoppers are literally on Amazon with credit cards ready",
      "Highest conversion rate among e-commerce channels",
    ],
    disadvantages: [
      "Only works for products listed on Amazon marketplace",
    ],
    setupRequirements: [
      "Amazon Seller Central or Vendor Central account",
    ],
    tipsAndBestPractices: [
      "Optimize product main images and title before starting PPC.",
    ],
    faqs: [
      { question: "What is ACoS in Amazon Ads?", answer: "ACoS (Advertising Cost of Sales) is Ad Spend divided by Ad Revenue expressed as a percentage." },
    ],
    officialWebsite: { name: "Visit Amazon Ads", url: "https://advertising.amazon.com" },
  },
  {
    id: "whatsapp_ads",
    platformKey: "whatsapp_ads",
    name: "WhatsApp Business Ads",
    title: "WhatsApp Business Ads",
    category: "Messaging",
    tags: ["Messaging", "Popular", "Social Media"],
    subtitle: "Click-to-WhatsApp Ads & Automated Customer Chat",
    shortOverview: "Click-to-WhatsApp Ads drive customers directly into 1-on-1 chat conversations for instant sales & support.",
    icon: "logo-whatsapp",
    iconColor: "#25D366",
    bgTint: "#DCFCE7",
    coverImage: "https://images.unsplash.com/photo-1614680376593-902f749f7cfc?q=80&w=1000&auto=format&fit=crop",
    whatIsIt: "Combines Meta Facebook/Instagram ads with WhatsApp Business API to open immediate chat dialogs with prospective buyers.",
    howItWorks: "User clicks an ad banner on Facebook/Instagram which opens a pre-filled WhatsApp message to the business.",
    audienceReach: {
      globalUsers: "2.0 Billion+",
      activeUsers: "500 Million+ in India",
      supportedCountries: "180+ Countries",
      keyDemographics: "All messaging users (16 - 65+)",
    },
    pricingModel: {
      cpc: "₹3 - ₹25 per conversation starter",
      cpm: "₹60 - ₹250 per 1,000 impressions",
      dailyBudget: "₹300 - ₹3,000",
      weeklyBudget: "₹2,100 - ₹21,000",
      monthlyBudget: "₹10,000 - ₹90,000",
      note: "WhatsApp Business Cloud API charges per 24-hour conversation session.",
    },
    bestUseCases: [
      "Local service bookings & appointments",
      "Personalized high-touch consultative sales",
      "Automated lead collection via WhatsApp chatbot",
    ],
    adTypes: [
      { name: "Click-to-WhatsApp Ads", description: "Feed/Story ads with 'Send Message' CTA.", specs: "Standard Meta ad specs + WhatsApp CTA" },
    ],
    targetingOptions: [
      "Meta Interest, Behavior & Demographic targeting",
      "Custom Phone Number audience lists",
    ],
    advantages: [
      "98%+ open rate on WhatsApp chat messages",
      "Builds direct customer connection and long-term retention",
    ],
    disadvantages: [
      "Requires team or chatbot setup to answer customer inquiries quickly",
    ],
    setupRequirements: [
      "WhatsApp Business App or WhatsApp Business API account",
      "Meta Ads Manager",
    ],
    tipsAndBestPractices: [
      "Set up instant auto-replies or AI chatbots to greet users within seconds.",
    ],
    faqs: [
      { question: "Do I need WhatsApp API for Click-to-WhatsApp ads?", answer: "No, you can start with the free WhatsApp Business App." },
    ],
    officialWebsite: { name: "Visit WhatsApp Business", url: "https://www.whatsapp.com/business" },
  },
  {
    id: "instagram_ads",
    platformKey: "instagram_ads",
    name: "Instagram Ads",
    title: "Instagram Ads",
    category: "Social Media",
    tags: ["Social Media", "Popular", "Visual"],
    subtitle: "Feed, Stories, Reels & Explore Page Placements",
    shortOverview:
      "Instagram Ads are the #1 visual advertising platform for lifestyle, fashion, food, and beauty brands reaching 2 billion monthly active users.",
    icon: "logo-instagram",
    iconColor: "#E1306C",
    bgTint: "#FDE8F0",
    coverImage:
      "https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=1000&auto=format&fit=crop",
    whatIsIt:
      "Instagram Ads, managed through Meta Ads Manager, allow brands to run photo, video, carousel, and Reels-based ads directly inside the Instagram app across feeds, Stories, Explore, and Shop tabs.",
    howItWorks:
      "Instagram uses Meta's advanced AI algorithm to serve ads natively within the user's feed and Stories based on interest, behavior, and engagement signals. Advertisers set budgets and objectives (awareness, traffic, leads, or conversions) and pay on a CPM or CPC basis.",
    audienceReach: {
      globalUsers: "2.0 Billion+",
      activeUsers: "250 Million+ in India",
      supportedCountries: "100+ Countries",
      keyDemographics: "Youth & Young Adults (18 - 40)",
    },
    pricingModel: {
      cpc: "₹6 - ₹80 per click",
      cpm: "₹90 - ₹400 per 1,000 impressions",
      cpa: "₹200 - ₹1,500 per lead",
      dailyBudget: "₹500 - ₹5,000",
      weeklyBudget: "₹3,500 - ₹35,000",
      monthlyBudget: "₹15,000 - ₹1,50,000",
      note:
        "Reels placements typically deliver 30-40% lower CPMs than feed placements.",
    },
    bestUseCases: [
      "Fashion, beauty & lifestyle direct-to-consumer (D2C) brands",
      "Instagram Shop product catalog promotions",
      "Influencer collaboration content amplification",
      "Food, travel & hospitality brand storytelling",
      "App downloads targeting young mobile users",
    ],
    adTypes: [
      {
        name: "Photo Feed Ad",
        description: "Single high-quality image shown natively in user feed.",
        specs: "1:1 (1080x1080 px) or 4:5 (1080x1350 px)",
      },
      {
        name: "Reels Ad",
        description: "Full-screen 9:16 vertical short video in Reels tab.",
        specs: "1080x1920 px, up to 60 seconds",
      },
      {
        name: "Stories Ad",
        description: "Immersive full-screen ad between user Stories.",
        specs: "1080x1920 px, 15-second max, with swipe-up CTA",
      },
      {
        name: "Carousel Ad",
        description: "Swipeable multi-image or multi-video ad card.",
        specs: "2-10 cards, each 1080x1080 px",
      },
    ],
    targetingOptions: [
      "Interest & Hashtag behavior targeting",
      "Lookalike Audiences from Instagram engagers",
      "Website Custom Audiences via Meta Pixel",
      "Shopping catalog retargeting",
      "Gender, Age & Location precision",
    ],
    advantages: [
      "Highest visual engagement rate among all social platforms",
      "Instagram Shopping allows direct in-app checkout",
      "Reels ads achieve viral organic-like reach at low cost",
      "Detailed creative testing with Meta Advantage+ Creative",
    ],
    disadvantages: [
      "Ad creative must be high-quality and visually on-brand",
      "Algorithm changes can affect organic-paid synergy",
      "Ad fatigue builds quickly — assets need weekly refresh",
    ],
    setupRequirements: [
      "Instagram Professional (Business or Creator) Account",
      "Meta Business Suite or Ads Manager account",
      "Meta Pixel or Conversions API installed on website",
      "Product catalog uploaded for Shopping campaigns",
    ],
    tipsAndBestPractices: [
      "Prioritize Reels placements — they reach non-followers organically.",
      "Use UGC (User Generated Content) style creatives for authenticity.",
      "Add subtitles to all video ads since 85% of users watch without sound.",
      "Use Instagram Shopping tags to reduce friction to purchase.",
    ],
    faqs: [
      {
        question: "What image size works best for Instagram Feed Ads?",
        answer:
          "The 4:5 portrait ratio (1080x1350 px) takes up maximum screen space in the feed and generally delivers higher engagement.",
      },
      {
        question: "Can I run Instagram ads without a website?",
        answer:
          "Yes! You can drive traffic directly to your Instagram profile, WhatsApp, or lead gen form without a website.",
      },
    ],
    officialWebsite: {
      name: "Visit Instagram for Business",
      url: "https://business.instagram.com",
    },
  },
  {
    id: "programmatic_dsp",
    platformKey: "programmatic_dsp",
    name: "Programmatic / DSP Ads",
    title: "Programmatic Display Ads",
    category: "Display",
    tags: ["Display", "Programmatic", "Retargeting"],
    subtitle: "Real-Time Bidding across 15M+ Premium Websites & Apps",
    shortOverview:
      "Programmatic advertising uses automated AI-powered buying to serve hyper-targeted display, video, and native ads across millions of premium websites in real time.",
    icon: "bar-chart-outline",
    iconColor: "#7C3AED",
    bgTint: "#F3EEFF",
    coverImage:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop",
    whatIsIt:
      "Programmatic advertising uses Demand-Side Platforms (DSPs) like DV360, The Trade Desk, and MoPub to buy digital ad inventory automatically through Real-Time Bidding (RTB). Instead of negotiating directly with publishers, you set audience rules and the system buys the best-priced impressions across thousands of sites simultaneously.",
    howItWorks:
      "When a user loads a webpage, a real-time auction takes place in milliseconds. The DSP evaluates the user's cookie data, demographics, and behavior against your campaign targeting. If it matches, your ad bid wins and the banner is displayed — all before the page finishes loading.",
    audienceReach: {
      globalUsers: "4.5 Billion+ internet users",
      activeUsers: "600 Million+ in India",
      supportedCountries: "190+ Countries",
      keyDemographics: "All audience segments (18 - 65+)",
    },
    pricingModel: {
      cpc: "₹5 - ₹80 per click",
      cpm: "₹30 - ₹250 per 1,000 impressions",
      cpa: "₹200 - ₹3,000 per conversion",
      dailyBudget: "₹2,000 - ₹20,000",
      weeklyBudget: "₹14,000 - ₹1,40,000",
      monthlyBudget: "₹50,000 - ₹5,00,000",
      note:
        "Minimum spend requirements apply on premium DSPs like DV360 (Google). RTB inventory starts much lower.",
    },
    bestUseCases: [
      "Cross-site retargeting of website visitors who didn't convert",
      "Brand awareness campaigns across premium news & editorial sites",
      "Native advertising blending into article content",
      "Connected TV (CTV) and OTT platform video ads",
      "Geo-fencing campaigns around competitor store locations",
    ],
    adTypes: [
      {
        name: "Display Banner Ads",
        description: "Standard IAB banner ads across web and apps.",
        specs: "300x250, 728x90, 160x600, 970x250 px",
      },
      {
        name: "Native Ads",
        description: "Ads that match the editorial look of the host website.",
        specs: "Headline + Image + Description (1200x628 px)",
      },
      {
        name: "Programmatic Video",
        description: "Pre-roll and mid-roll video ads on websites & OTT.",
        specs: "VAST / VPAID compliant, 15-30 seconds",
      },
      {
        name: "Connected TV (CTV)",
        description: "Full-screen ads on Smart TVs and streaming devices.",
        specs: "1920x1080 HD video, 15-30 seconds, non-skippable",
      },
    ],
    targetingOptions: [
      "Behavioral & Contextual keyword targeting",
      "First-party CRM data onboarding",
      "Geo-fencing & proximity-based targeting",
      "Lookalike audience modeling from converters",
      "Device, OS & browser level targeting",
    ],
    advantages: [
      "Widest reach across the entire open web — 15M+ sites",
      "Advanced audience segmentation and data layering",
      "Real-time performance optimization using AI",
      "Transparent impression-level reporting with bid analytics",
    ],
    disadvantages: [
      "Risk of ad fraud on low-quality inventory without brand safety filters",
      "Requires expertise in DSP platforms to operate effectively",
      "Higher minimum investment compared to social ads",
    ],
    setupRequirements: [
      "DSP account (Google DV360, The Trade Desk, or InMobi)",
      "Retargeting pixel installed on all key website pages",
      "IAB standard banner creatives in all required sizes",
      "Brand safety whitelist/blacklist for publisher domains",
    ],
    tipsAndBestPractices: [
      "Enable frequency capping (3-5 impressions per user per day) to avoid ad fatigue.",
      "Use contextual targeting alongside audience targeting for double signal strength.",
      "Always separate prospecting campaigns from retargeting campaigns.",
      "Use Ads.txt verification to buy only from authorized publishers.",
    ],
    faqs: [
      {
        question: "What's the difference between Programmatic and Google Display?",
        answer:
          "Google Display Network only covers Google's partner sites (~35% of the web). Programmatic DSPs access the full open web including premium publishers, OTT, and CTV.",
      },
      {
        question: "Is programmatic advertising suitable for small businesses?",
        answer:
          "It's best suited for businesses with monthly budgets above ₹50,000 who want advanced targeting beyond what Google or Meta provides.",
      },
    ],
    officialWebsite: {
      name: "Visit DV360 (Google DSP)",
      url: "https://marketingplatform.google.com/about/display-video-360",
    },
  },
  {
    id: "pinterest_ads",
    platformKey: "pinterest_ads",
    name: "Pinterest Ads",
    title: "Pinterest Ads",
    category: "Visual Discovery",
    tags: ["Visual", "Shopping", "Social Media"],
    subtitle: "Promoted Pins, Shopping & Idea Ads",
    shortOverview:
      "Pinterest Ads reach 500 million monthly users actively searching for ideas, products, and inspiration — with uniquely high purchase intent.",
    icon: "logo-pinterest",
    iconColor: "#E60023",
    bgTint: "#FFE8EA",
    coverImage:
      "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?q=80&w=1000&auto=format&fit=crop",
    whatIsIt:
      "Pinterest Ads (Promoted Pins) allow businesses to promote their content within the Pinterest discovery feed. Unlike other social platforms, Pinterest users are in an active planning mindset — searching for home décor, recipes, fashion outfits, and DIY ideas — making them significantly more receptive to branded product content.",
    howItWorks:
      "Promoted Pins appear seamlessly within the Pinterest home feed and search results. Pinterest's algorithm matches pins to users based on their search history, board pins, and interest signals. Advertisers pay on CPM, CPC, or CPAV (Cost Per Acton Video) basis.",
    audienceReach: {
      globalUsers: "500 Million+",
      activeUsers: "75 Million+ in India",
      supportedCountries: "30+ Countries",
      keyDemographics: "Women & Creative Professionals (18 - 45)",
    },
    pricingModel: {
      cpc: "₹10 - ₹90 per click",
      cpm: "₹80 - ₹350 per 1,000 impressions",
      cpa: "₹300 - ₹2,500 per conversion",
      dailyBudget: "₹500 - ₹5,000",
      weeklyBudget: "₹3,500 - ₹35,000",
      monthlyBudget: "₹15,000 - ₹1,50,000",
      note:
        "Pinterest content has a 3-6 month lifespan — much longer than other platforms.",
    },
    bestUseCases: [
      "Home décor, interior design & furniture brands",
      "Wedding, event planning & gifting businesses",
      "Food, recipe & nutrition product brands",
      "Fashion, jewellery & handmade / artisan goods",
      "DIY, craft, stationery & hobby products",
    ],
    adTypes: [
      {
        name: "Standard Promoted Pin",
        description: "Static image shown natively in Pinterest feed & search.",
        specs: "2:3 ratio (1000x1500 px), PNG or JPG",
      },
      {
        name: "Video Pin Ad",
        description: "Autoplay silent video in feed for product showcases.",
        specs: "2:3 or 1:1, max 15 minutes (recommend 6-15 seconds)",
      },
      {
        name: "Shopping Pin",
        description: "Direct product catalog pin with price and buy button.",
        specs: "Product catalog feed via Pinterest Merchant Hub",
      },
      {
        name: "Idea Pin Ad",
        description: "Multi-page story format for tutorials and guides.",
        specs: "Up to 20 pages, 9:16 vertical format",
      },
    ],
    targetingOptions: [
      "Keyword & Search Intent targeting",
      "Interest categories (Weddings, Food, Fashion etc.)",
      "Actalike (Lookalike) Audiences",
      "Customer list matching via email upload",
      "Retargeting: Pinterest Tag website visitors",
    ],
    advantages: [
      "Users are in active shopping & planning mindset — highest purchase intent on any social platform",
      "Pins stay discoverable for months to years, unlike posts",
      "Lower competition and CPCs vs Instagram and Meta",
      "Strong organic-paid synergy — boards drive both SEO and paid reach",
    ],
    disadvantages: [
      "Limited audience in Tier 2 and Tier 3 Indian cities",
      "Skews strongly female — not ideal for male-targeted products",
      "Less effective for services or B2B advertising",
    ],
    setupRequirements: [
      "Pinterest Business Account",
      "Pinterest Tag (pixel) installed on website",
      "Pinterest Merchant Account for Shopping campaigns",
      "Product catalog CSV/feed upload for dynamic Shopping Pins",
    ],
    tipsAndBestPractices: [
      "Use tall 2:3 portrait images (1000x1500 px) — they take up more visual space in the feed.",
      "Add text overlays on images since Pinterest users don't always read pin descriptions.",
      "Cross-link your Pinterest boards to your website product pages for SEO benefit.",
      "Target search keywords like Google Ads — Pinterest is a visual search engine.",
    ],
    faqs: [
      {
        question: "Is Pinterest advertising good for Indian businesses?",
        answer:
          "Yes, especially for home decor, fashion, food, and wedding niches. Urban Indian audiences on Pinterest are highly aspirational and have strong purchase intent.",
      },
      {
        question: "How long does a Pinterest ad run before needing a refresh?",
        answer:
          "Pinterest Pins have a much longer lifespan than other social ads. A well-performing pin can keep driving clicks for 3-6 months without creative refresh.",
      },
    ],
    officialWebsite: {
      name: "Visit Pinterest for Business",
      url: "https://business.pinterest.com",
    },
  },
  {
    id: "flipkart_ads",
    platformKey: "flipkart_ads",
    name: "Flipkart Ads",
    title: "Flipkart Ads",
    category: "Shopping",
    tags: ["Shopping", "Popular", "Search"],
    subtitle: "Sponsored Products, Brand Takeovers & Display Ads",
    shortOverview:
      "Flipkart Ads is India's most powerful e-commerce advertising platform targeting 450 million registered shoppers with strong purchase intent on Flipkart & Myntra.",
    icon: "pricetag-outline",
    iconColor: "#2874F0",
    bgTint: "#E8F0FF",
    coverImage:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1000&auto=format&fit=crop",
    whatIsIt:
      "Flipkart Ads (via Flipkart Ads Console) allows sellers and brands on Flipkart and Myntra to promote their products through Sponsored Listings, Brand Stores, display banners, and video ads across the Flipkart marketplace ecosystem.",
    howItWorks:
      "Sellers bid on search keywords relevant to their product categories. Winning bids appear at the top of Flipkart's search results and category pages. Ads are charged on a pay-per-click (PPC) model with daily budgets. Brand takeovers and category-specific placements are sold on a fixed CPM rate.",
    audienceReach: {
      globalUsers: "450 Million+ registered users",
      activeUsers: "450 Million in India",
      supportedCountries: "India (Primary Market)",
      keyDemographics: "Indian online shoppers (18 - 55)",
    },
    pricingModel: {
      cpc: "₹5 - ₹120 per click",
      cpm: "₹150 - ₹800 per 1,000 impressions (Display)",
      cpa: "Target ROAS (Return on Ad Spend)",
      dailyBudget: "₹500 - ₹10,000",
      weeklyBudget: "₹3,500 - ₹70,000",
      monthlyBudget: "₹15,000 - ₹2,50,000",
      note:
        "Big Billion Days and sale events multiply CPC bids due to seller competition.",
    },
    bestUseCases: [
      "FMCG, electronics, fashion & home product sellers",
      "New product launch visibility on Flipkart search",
      "Myntra sponsored listings for fashion & lifestyle brands",
      "Big Billion Days / BBD sale period promotions",
      "Brand Store building & seller reputation enhancement",
    ],
    adTypes: [
      {
        name: "Sponsored Products",
        description: "Boosted product listings appearing in top search results.",
        specs: "Automatic or Manual keyword targeting",
      },
      {
        name: "Sponsored Brands (HSA)",
        description: "Headline Search Ads with brand logo above search results.",
        specs: "Brand logo + custom headline + 3 products",
      },
      {
        name: "Display Ads",
        description: "Banner ads on Flipkart homepage, category, and product pages.",
        specs: "970x250 leaderboard, 300x250 medium rectangle",
      },
      {
        name: "Video Ads",
        description: "Auto-play product video shown on search and browse pages.",
        specs: "16:9 video, 15-30 seconds, 1920x1080 px",
      },
    ],
    targetingOptions: [
      "Product search keyword exact, phrase & broad match",
      "Category page & browse page placements",
      "ASIN / Product ID competitor targeting",
      "Customer interest & purchase behavior segments",
    ],
    advantages: [
      "Direct access to 450 million high-intent Indian shoppers",
      "Deep integration with Flipkart search algorithm for product visibility",
      "Myntra placements included for fashion & lifestyle brands",
      "Campaign ROI directly measurable by ROAS & ACoS",
    ],
    disadvantages: [
      "Only available for products listed on Flipkart marketplace",
      "Intense competition during Big Billion Days drives up CPC",
      "Limited global reach — primarily India-focused",
    ],
    setupRequirements: [
      "Registered Flipkart Seller or Brand account",
      "Flipkart Ads Console access",
      "Active product listings with good ratings (3.5+ stars)",
      "GST registration and valid bank account for billing",
    ],
    tipsAndBestPractices: [
      "Optimize product main images and titles before starting Sponsored ads.",
      "Run Auto campaigns first to discover high-converting keywords, then transfer to Manual.",
      "Increase bids 20-30% during Big Billion Days to maintain top placement.",
      "Use Brand Store campaigns to build long-term brand presence on Flipkart.",
    ],
    faqs: [
      {
        question: "Can I advertise on Myntra through Flipkart Ads?",
        answer:
          "Yes, Flipkart Ads Console manages ads for both Flipkart and Myntra platforms under the same account.",
      },
      {
        question: "What is a good ACoS target for Flipkart ads?",
        answer:
          "A healthy ACoS (Advertising Cost of Sales) is typically 10-20%. For new product launches, 25-35% ACoS is acceptable while building reviews.",
      },
    ],
    officialWebsite: {
      name: "Visit Flipkart Ads Console",
      url: "https://advertising.flipkart.com",
    },
  },
  {
    id: "quora_ads",
    platformKey: "quora_ads",
    name: "Quora Ads",
    title: "Quora Ads",
    category: "Content Discovery",
    tags: ["Content", "Business", "Search"],
    subtitle: "Question-Intent Targeting & Topic-Based Display",
    shortOverview:
      "Quora Ads target 400 million monthly users who are actively searching for answers — making it a goldmine for B2B SaaS, EdTech, finance, and professional services.",
    icon: "chatbubbles-outline",
    iconColor: "#B92B27",
    bgTint: "#FDECEA",
    coverImage:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop",
    whatIsIt:
      "Quora Ads appear within the question and answer pages of Quora — the world's largest Q&A platform. Users on Quora are research-oriented, educated, and looking for solutions, making them highly receptive to relevant product and service ads.",
    howItWorks:
      "Advertisers target their ads by specific Quora questions, topics, or keywords. Ads appear as promoted answers, text ads within the feed, or image-based sponsored placements within relevant Q&A threads. Billing is on CPC or CPM basis.",
    audienceReach: {
      globalUsers: "400 Million+",
      activeUsers: "80 Million+ in India",
      supportedCountries: "100+ Countries",
      keyDemographics: "Educated professionals & decision-makers (22 - 50)",
    },
    pricingModel: {
      cpc: "₹20 - ₹200 per click",
      cpm: "₹150 - ₹600 per 1,000 impressions",
      cpa: "₹500 - ₹4,000 per B2B lead",
      dailyBudget: "₹1,000 - ₹8,000",
      weeklyBudget: "₹7,000 - ₹56,000",
      monthlyBudget: "₹30,000 - ₹2,00,000",
      note:
        "Question-Targeting delivers the strongest CTR and conversion rates for SaaS and EdTech.",
    },
    bestUseCases: [
      "B2B SaaS software and productivity tools",
      "Online education & upskilling platforms (EdTech)",
      "Finance, investment & insurance advisory services",
      "Healthcare, wellness & medical consultation services",
      "Professional services: legal, HR & consulting",
    ],
    adTypes: [
      {
        name: "Text Ads",
        description: "Concise headline + body text ads in Quora feeds.",
        specs: "Headline 65 chars, Body 105 chars",
      },
      {
        name: "Image Ads",
        description: "Image combined with headline shown in Q&A threads.",
        specs: "1200x628 px, JPG or PNG",
      },
      {
        name: "Promoted Answers",
        description: "Boost your own Quora answer to appear at the top.",
        specs: "Standard Quora answer format — no image limit",
      },
    ],
    targetingOptions: [
      "Question-level targeting (specific Quora questions)",
      "Topic & Interest Category targeting",
      "Keyword-based audience targeting",
      "Lookalike audiences from website visitor lists",
      "Job title, industry & education level",
    ],
    advantages: [
      "Highly educated, high-income audience with strong research intent",
      "Unique question-targeting not available on any other platform",
      "Lower ad saturation means better CTR vs Facebook/LinkedIn",
      "Promoted Answers build thought leadership alongside paid reach",
    ],
    disadvantages: [
      "Smaller Indian audience compared to Meta or Google",
      "Limited visual ad formats compared to Instagram or YouTube",
      "CPC can be high for competitive B2B topics",
    ],
    setupRequirements: [
      "Quora Ads account (free to create at quora.com/business)",
      "Quora Pixel installed on website for retargeting",
      "Active Quora business profile for Promoted Answers",
      "Credit card or bank transfer billing setup",
    ],
    tipsAndBestPractices: [
      "Target specific Quora questions that your ideal customers are searching (e.g. 'Best CRM software for small business').",
      "Use Promoted Answers to provide real value — users trust helpful content more than banner ads.",
      "Layer Question Targeting with Lookalike Audiences for double precision.",
      "Run A/B tests on ad copy tone: question-framed headlines outperform statement headlines.",
    ],
    faqs: [
      {
        question: "How is Quora different from Google for advertising?",
        answer:
          "Google targets keyword intent in search, while Quora targets users reading specific questions and topics. Quora audiences are deeper into the research phase, making them more receptive to detailed product explanations.",
      },
      {
        question: "Can I promote my own Quora answers as ads?",
        answer:
          "Yes! Quora's Promoted Answers feature lets you boost your existing answer to the top of any relevant question page — a highly trusted native format.",
      },
    ],
    officialWebsite: {
      name: "Visit Quora for Business",
      url: "https://www.quora.com/business",
    },
  },
  {
    id: "inmobi_ads",
    platformKey: "inmobi_ads",
    name: "InMobi Ads",
    title: "InMobi Mobile Ads",
    category: "Mobile Advertising",
    tags: ["Mobile", "Programmatic", "App"],
    subtitle: "In-App Advertising, Mobile Video & OTT Placements",
    shortOverview:
      "InMobi is India's largest mobile-first advertising platform, reaching 1.6 billion unique mobile devices globally with premium in-app and OTT ad placements.",
    icon: "phone-portrait-outline",
    iconColor: "#F97316",
    bgTint: "#FFF0E5",
    coverImage:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1000&auto=format&fit=crop",
    whatIsIt:
      "InMobi is a global mobile advertising platform that provides brands access to in-app advertising across 35,000+ premium mobile apps including games, news apps, and OTT platforms. Its APAC and India-focused mobile DSP is ideal for reaching the next billion mobile internet users.",
    howItWorks:
      "InMobi's platform uses AI-powered audience intelligence to serve rich media display, interstitial, native, and rewarded video ads inside mobile apps. Ads are purchased programmatically on a CPM, CPC, or CPI (Cost Per Install) model through InMobi DSP or via direct deal with publishers.",
    audienceReach: {
      globalUsers: "1.6 Billion+ unique devices",
      activeUsers: "400 Million+ in India",
      supportedCountries: "200+ Countries",
      keyDemographics: "Mobile-first users (16 - 45), Tier 2 & Tier 3 India",
    },
    pricingModel: {
      cpc: "₹3 - ₹40 per click",
      cpm: "₹25 - ₹200 per 1,000 impressions",
      cpa: "₹50 - ₹500 per app install (CPI)",
      dailyBudget: "₹1,000 - ₹10,000",
      weeklyBudget: "₹7,000 - ₹70,000",
      monthlyBudget: "₹30,000 - ₹2,50,000",
      note:
        "InMobi is among the lowest CPM platforms for Tier 2 & 3 Indian city reach.",
    },
    bestUseCases: [
      "Mobile app user acquisition and installs",
      "Gaming apps — rewarded video ads with in-app rewards",
      "Fintech, BNPL & UPI payment app campaigns",
      "FMCG brand awareness in Tier 2 & Tier 3 Indian cities",
      "OTT and video streaming platform promotions",
    ],
    adTypes: [
      {
        name: "Interstitial Ads",
        description: "Full-screen ads appearing at natural app break points.",
        specs: "320x480 or 480x320 px (portrait/landscape)",
      },
      {
        name: "Rewarded Video",
        description: "User watches video in exchange for in-app rewards.",
        specs: "16:9 video, 15-30 seconds, non-skippable",
      },
      {
        name: "Native In-App",
        description: "Ad that matches the app's UI and content style.",
        specs: "Title 25 chars, Description 90 chars, 1200x627 px icon",
      },
      {
        name: "Rich Media HTML5",
        description: "Interactive expandable banners with animation.",
        specs: "MRAID compliant, HTML5 with assets under 200KB",
      },
    ],
    targetingOptions: [
      "Device type, OS version & mobile carrier",
      "App category & in-app behavior targeting",
      "GPS location & geo-fence radius targeting",
      "First-party DMP audience segments",
      "Income level & telecom operator targeting",
    ],
    advantages: [
      "Widest mobile reach in India especially Tier 2 & Tier 3 cities",
      "Rewarded video drives highest completion rates (90%+)",
      "Deep first-party mobile data from telco partnerships",
      "Low CPMs make it ideal for mass awareness on limited budget",
    ],
    disadvantages: [
      "Less effective for premium urban audiences vs Meta or Google",
      "Requires mobile-optimized creatives — desktop assets won't work",
      "Brand safety controls need careful DSP configuration",
    ],
    setupRequirements: [
      "InMobi DSP account or InMobi Exchange publisher access",
      "Mobile app SDK integrated for CPI campaigns",
      "MRAID-compliant rich media creatives for interstitials",
      "GSTIN and business verification for Indian billing",
    ],
    tipsAndBestPractices: [
      "Use rewarded video ads in gaming apps for near-100% completion rates.",
      "Target morning commute hours (7-9 AM) and evening relaxation hours (8-11 PM) for highest engagement.",
      "Segment campaigns separately for Tier 1 (Mumbai, Delhi) vs Tier 2 cities for accurate CPM optimization.",
      "Enable frequency cap of 4 impressions per user per 24 hours to prevent banner blindness.",
    ],
    faqs: [
      {
        question: "What makes InMobi different from Google Display Network?",
        answer:
          "InMobi is purely mobile-focused with deeper in-app inventory across regional language apps, gaming apps, and Tier 2/3 city publishers that Google's Display Network doesn't fully cover.",
      },
      {
        question: "Is InMobi good for app installs?",
        answer:
          "Yes, InMobi's CPI (Cost Per Install) model is one of the most cost-effective for mobile app user acquisition in India and Southeast Asia.",
      },
    ],
    officialWebsite: {
      name: "Visit InMobi Advertising",
      url: "https://www.inmobi.com/advertise",
    },
  },
];

export const ONLINE_PLATFORMS_MAP = ONLINE_PLATFORMS.reduce((acc, platform) => {
  acc[platform.id] = platform;
  return acc;
}, {});

export const PLATFORM_DETAILS = ONLINE_PLATFORMS_MAP;
