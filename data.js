// ============================================================
// FAB HOTELS — Data Module
// All application data centralized for easy editing
// ============================================================

const destinations = [
  {
    id: 1,
    name: "Maldives",
    location: "South Asia",
    region: "asia",
    country: "Maldives",
    description: "Crystal-clear turquoise waters, pristine white-sand beaches, and iconic overwater villas make the Maldives the ultimate tropical paradise for luxury seekers and underwater explorers.",
    shortDesc: "Overwater villas & coral reefs",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=600&q=80",
      "https://images.unsplash.com/photo-1578922746465-3a80a228f223?w=600&q=80",
      "https://images.unsplash.com/photo-1540202404-a2f29016b523?w=600&q=80"
    ],
    price: 178,
    originalPrice: 230,
    currency: "USD",
    rating: 4.9,
    reviewCount: 2847,
    stars: 5,
    tag: "trending",
    tagLabel: "Trending 🔥",
    amenities: ["Free WiFi", "Spa", "Pool", "Diving", "Room Service", "Airport Transfer"],
    cancellation: "Free cancellation up to 48 hours before check-in",
    roomsLeft: 3,
    duration: "5 Nights / 6 Days",
    featured: true
  },
  {
    id: 2,
    name: "Tokyo",
    location: "East Asia",
    region: "asia",
    country: "Japan",
    description: "Where ancient temples meet neon-lit skyscrapers. Tokyo offers an unmatched blend of tradition and ultramodern innovation, from serene gardens to Shibuya's electric energy.",
    shortDesc: "Culture meets cutting-edge tech",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&q=80",
      "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=600&q=80",
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&q=80"
    ],
    price: 230,
    originalPrice: 275,
    currency: "USD",
    rating: 4.8,
    reviewCount: 3421,
    stars: 5,
    tag: "best-value",
    tagLabel: "Best Value",
    amenities: ["Free WiFi", "Concierge", "Gym", "Restaurant", "Lounge", "Laundry"],
    cancellation: "Free cancellation up to 24 hours before check-in",
    roomsLeft: 7,
    duration: "4 Nights / 5 Days",
    featured: true
  },
  {
    id: 3,
    name: "Dubai",
    location: "Middle East",
    region: "middle-east",
    country: "UAE",
    description: "A dazzling city of superlatives — the tallest towers, the most luxurious resorts, and desert adventures that transition seamlessly into world-class dining and nightlife.",
    shortDesc: "Opulence in the desert",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&q=80",
      "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=600&q=80",
      "https://images.unsplash.com/photo-1597659840241-37e2b9c2f55f?w=600&q=80"
    ],
    price: 150,
    originalPrice: 200,
    currency: "USD",
    rating: 4.7,
    reviewCount: 5102,
    stars: 4,
    tag: "best-value",
    tagLabel: "Best Value",
    amenities: ["Free WiFi", "Pool", "Spa", "Gym", "Bar", "Concierge"],
    cancellation: "Free cancellation up to 72 hours before check-in",
    roomsLeft: 12,
    duration: "3 Nights / 4 Days",
    featured: false
  },
  {
    id: 4,
    name: "Santorini",
    location: "Europe",
    region: "europe",
    country: "Greece",
    description: "Iconic whitewashed villages perched on volcanic cliffs above the Aegean Sea. Santorini's sunsets, blue-domed churches, and boutique wineries create an unforgettable Mediterranean escape.",
    shortDesc: "Cliffside sunsets & blue domes",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600&q=80",
      "https://images.unsplash.com/photo-1580502304784-8985b7eb7260?w=600&q=80",
      "https://images.unsplash.com/photo-1604999333679-b86d54738315?w=600&q=80"
    ],
    price: 211,
    originalPrice: 275,
    currency: "USD",
    rating: 4.9,
    reviewCount: 1893,
    stars: 5,
    tag: "trending",
    tagLabel: "Trending 🔥",
    amenities: ["Sea View", "Pool", "Wine Tasting", "Spa", "Free WiFi", "Breakfast"],
    cancellation: "Free cancellation up to 48 hours before check-in",
    roomsLeft: 2,
    duration: "5 Nights / 6 Days",
    featured: true
  },
  {
    id: 5,
    name: "Kyoto",
    location: "East Asia",
    region: "asia",
    country: "Japan",
    description: "The cultural heart of Japan — ancient temples draped in moss, bamboo groves whispering in the wind, and traditional ryokans offering authentic Japanese hospitality.",
    shortDesc: "Temples, gardens & traditions",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80",
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&q=80",
      "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=600&q=80"
    ],
    price: 240,
    originalPrice: 318,
    currency: "USD",
    rating: 4.8,
    reviewCount: 2156,
    stars: 4,
    tag: "new",
    tagLabel: "New Arrival ✨",
    amenities: ["Onsen", "Garden View", "Tea Ceremony", "Free WiFi", "Bike Rental", "Breakfast"],
    cancellation: "Non-refundable — best price guarantee",
    roomsLeft: 5,
    duration: "4 Nights / 5 Days",
    featured: false
  },
  {
    id: 6,
    name: "Paris",
    location: "Europe",
    region: "europe",
    country: "France",
    description: "The City of Light enchants with its timeless elegance — from the iron lacework of the Eiffel Tower to the impressionist masterpieces of the Musée d'Orsay and the allure of its café culture.",
    shortDesc: "Romance, art & haute cuisine",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&q=80",
      "https://images.unsplash.com/photo-1431274172761-fca41d930114?w=600&q=80",
      "https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?w=600&q=80"
    ],
    price: 200,
    originalPrice: 235,
    currency: "USD",
    rating: 4.8,
    reviewCount: 4250,
    stars: 5,
    tag: null,
    tagLabel: null,
    amenities: ["City View", "Breakfast", "Concierge", "Free WiFi", "Bar", "Spa"],
    cancellation: "Free cancellation up to 24 hours before check-in",
    roomsLeft: 8,
    duration: "4 Nights / 5 Days",
    featured: true
  },
  {
    id: 7,
    name: "Bali",
    location: "Southeast Asia",
    region: "islands",
    country: "Indonesia",
    description: "A spiritual island of terraced rice paddies, volcanic mountains, ancient temples, and surf-perfect beaches. Bali blends wellness retreats with vibrant nightlife effortlessly.",
    shortDesc: "Spiritual retreats & surf beaches",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600&q=80",
      "https://images.unsplash.com/photo-1573790387438-4da905039392?w=600&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80"
    ],
    price: 135,
    originalPrice: 189,
    currency: "USD",
    rating: 4.7,
    reviewCount: 3891,
    stars: 4,
    tag: "best-value",
    tagLabel: "Best Value",
    amenities: ["Pool", "Yoga Studio", "Spa", "Free WiFi", "Breakfast", "Scooter Rental"],
    cancellation: "Free cancellation up to 48 hours before check-in",
    roomsLeft: 6,
    duration: "6 Nights / 7 Days",
    featured: false
  },
  {
    id: 8,
    name: "New York",
    location: "North America",
    region: "americas",
    country: "USA",
    description: "The city that never sleeps — a dazzling mosaic of world-class museums, Broadway theaters, iconic skylines, and neighborhoods each with their own distinct character and cuisine.",
    shortDesc: "The city that never sleeps",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&q=80",
      "https://images.unsplash.com/photo-1522083165195-3424ed129620?w=600&q=80",
      "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=600&q=80"
    ],
    price: 299,
    originalPrice: 399,
    currency: "USD",
    rating: 4.6,
    reviewCount: 6842,
    stars: 5,
    tag: "new",
    tagLabel: "New Arrival ✨",
    amenities: ["City View", "Gym", "Concierge", "Free WiFi", "Restaurant", "Bar"],
    cancellation: "Free cancellation up to 24 hours before check-in",
    roomsLeft: 4,
    duration: "3 Nights / 4 Days",
    featured: true
  },
  {
    id: 9,
    name: "Amalfi Coast",
    location: "Europe",
    region: "europe",
    country: "Italy",
    description: "Dramatic cliffs plunging into sapphire waters, pastel-colored villages clinging to hillsides, and the intoxicating scent of lemon groves — Italy's most breathtaking coastline.",
    shortDesc: "Mediterranean cliffs & charm",
    image: "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?w=600&q=80",
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&q=80",
      "https://images.unsplash.com/photo-1534445867742-43195f401b6c?w=600&q=80"
    ],
    price: 265,
    originalPrice: 340,
    currency: "USD",
    rating: 4.9,
    reviewCount: 1567,
    stars: 5,
    tag: "trending",
    tagLabel: "Trending 🔥",
    amenities: ["Sea View", "Terrace", "Restaurant", "Pool", "Free WiFi", "Boat Tours"],
    cancellation: "Free cancellation up to 48 hours before check-in",
    roomsLeft: 1,
    duration: "5 Nights / 6 Days",
    featured: false
  },
  {
    id: 10,
    name: "Machu Picchu",
    location: "South America",
    region: "americas",
    country: "Peru",
    description: "The legendary lost city of the Incas sits majestically among cloud-wrapped Andean peaks — an archaeological wonder and a spiritual journey to the roof of the world.",
    shortDesc: "Ancient wonder in the clouds",
    image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=600&q=80",
      "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=600&q=80",
      "https://images.unsplash.com/photo-1415804941882-1f03e371e29a?w=600&q=80"
    ],
    price: 189,
    originalPrice: 250,
    currency: "USD",
    rating: 4.8,
    reviewCount: 2034,
    stars: 4,
    tag: null,
    tagLabel: null,
    amenities: ["Guided Tours", "Breakfast", "Mountain View", "Free WiFi", "Shuttle", "Lounge"],
    cancellation: "Free cancellation up to 72 hours before check-in",
    roomsLeft: 9,
    duration: "4 Nights / 5 Days",
    featured: false
  }
];

const services = [
  {
    id: 1,
    icon: "hotel",
    title: "Luxury Stays",
    description: "Handpicked 5-star properties with world-class amenities, personalized service, and unforgettable experiences in every destination.",
    detail: "From boutique hideaways to grand resort complexes, every property meets our 200-point quality standard.",
    lottieUrl: "https://assets2.lottiefiles.com/packages/lf20_ysrn2iwp.json"
  },
  {
    id: 2,
    icon: "utensils",
    title: "Fine Dining",
    description: "Michelin-starred restaurants, private chef experiences, and curated culinary journeys that celebrate local flavors and global gastronomy.",
    detail: "Exclusive reservations at top restaurants, cooking classes with local chefs, and in-room fine dining service.",
    lottieUrl: "https://assets9.lottiefiles.com/packages/lf20_twijbubv.json"
  },
  {
    id: 3,
    icon: "spa",
    title: "Spa & Wellness",
    description: "Rejuvenate body and spirit with our curated wellness programs — from traditional Balinese massage to cutting-edge cryo-therapy.",
    detail: "Partnered with world-renowned wellness brands including Aman Spa, COMO Shambhala, and Six Senses.",
    lottieUrl: "https://assets6.lottiefiles.com/packages/lf20_szlepvdh.json"
  },
  {
    id: 4,
    icon: "plane-departure",
    title: "Airport Transfer",
    description: "Seamless door-to-door luxury transfers with private chauffeurs, helicopter options, and yacht arrivals at select destinations.",
    detail: "Meet & greet at arrival, complimentary water and refreshments, real-time flight tracking for pick-up.",
    lottieUrl: "https://assets3.lottiefiles.com/packages/lf20_myejiggj.json"
  },
  {
    id: 5,
    icon: "robot",
    title: "AI Concierge",
    description: "Our intelligent virtual concierge learns your preferences to craft personalized recommendations and instant trip planning.",
    detail: "24/7 multilingual support, restaurant bookings, activity reservations, and real-time local insights.",
    lottieUrl: "https://assets10.lottiefiles.com/packages/lf20_ofa3xwo7.json"
  },
  {
    id: 6,
    icon: "award",
    title: "Loyalty Rewards",
    description: "Earn points on every stay, unlock elite tiers, and enjoy exclusive perks — complimentary upgrades, late checkout, and member-only rates.",
    detail: "Three tiers: Silver, Gold, and Platinum with escalating benefits and surprise delights.",
    lottieUrl: "https://assets7.lottiefiles.com/packages/lf20_jcikwtux.json"
  },
  {
    id: 7,
    icon: "headset",
    title: "24/7 Support",
    description: "Round-the-clock multilingual guest support via phone, chat, and email — because exceptional service never sleeps.",
    detail: "Average response time under 30 seconds. Emergency assistance available worldwide.",
    lottieUrl: "https://assets4.lottiefiles.com/packages/lf20_u4yrau.json"
  },
  {
    id: 8,
    icon: "paw",
    title: "Pet Friendly",
    description: "Travel with your furry companions — pet-friendly rooms, dedicated pet amenities, and nearby pet-friendly parks and beaches.",
    detail: "Welcome kits for pets, in-room pet beds, special pet menus, and recommended veterinary contacts.",
    lottieUrl: "https://assets5.lottiefiles.com/packages/lf20_syqnfe7c.json"
  }
];

const galleryItems = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    title: "Presidential Suite",
    category: "rooms",
    span: "wide"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
    title: "Oceanfront Villa",
    category: "rooms",
    span: "normal"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    title: "Signature Restaurant",
    category: "dining",
    span: "normal"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    title: "Infinity Pool at Sunset",
    category: "pool",
    span: "tall"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    title: "Resort Exterior",
    category: "exterior",
    span: "normal"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80",
    title: "Poolside Lounge",
    category: "pool",
    span: "wide"
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800&q=80",
    title: "Luxury Bedroom",
    category: "rooms",
    span: "normal"
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    title: "Gourmet Breakfast",
    category: "dining",
    span: "normal"
  },
  {
    id: 9,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
    title: "Grand Entrance",
    category: "exterior",
    span: "tall"
  },
  {
    id: 10,
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
    title: "Spa Treatment",
    category: "activities",
    span: "normal"
  },
  {
    id: 11,
    image: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800&q=80",
    title: "Sunset Dining",
    category: "dining",
    span: "wide"
  },
  {
    id: 12,
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80",
    title: "Tropical Gardens",
    category: "exterior",
    span: "normal"
  }
];

const reviews = [
  {
    id: 1,
    name: "Victoria Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    location: "Singapore",
    rating: 5,
    title: "An Absolutely Flawless Experience",
    text: "From the moment we arrived, every detail was impeccable. The staff anticipated our needs before we even expressed them. The overwater villa was a dream — waking up to the sound of waves and stepping directly into crystal-clear water. The spa treatment was the best I've ever had.",
    date: "2025-12-15",
    source: "google",
    verified: true,
    stayType: "Honeymoon"
  },
  {
    id: 2,
    name: "James Morrison",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    location: "London, UK",
    rating: 5,
    title: "Exceeded Every Expectation",
    text: "As a frequent luxury traveler, I have high standards. FAB Hotels surpassed them all. The concierge arranged a private cooking class with a local chef that was the highlight of our trip. The room was stunning with panoramic city views.",
    date: "2025-11-28",
    source: "tripadvisor",
    verified: true,
    stayType: "Business"
  },
  {
    id: 3,
    name: "Sofia Rodriguez",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    location: "Madrid, Spain",
    rating: 4,
    title: "Beautiful Property, Outstanding Service",
    text: "We celebrated our anniversary here and it was magical. The surprise room decoration was incredibly thoughtful. The restaurant served some of the finest cuisine I've ever tasted. Only minor note — the gym could be larger.",
    date: "2025-10-05",
    source: "booking",
    verified: true,
    stayType: "Anniversary"
  },
  {
    id: 4,
    name: "Alexander Müller",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    location: "Munich, Germany",
    rating: 5,
    title: "Pure Luxury Redefined",
    text: "This was my wife's birthday trip and the staff went above and beyond. From the personalized welcome amenities to the private beach dinner arrangement, everything was perfect. The attention to detail is remarkable.",
    date: "2025-09-18",
    source: "google",
    verified: true,
    stayType: "Birthday"
  },
  {
    id: 5,
    name: "Priya Sharma",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    location: "Mumbai, India",
    rating: 5,
    title: "World-Class in Every Sense",
    text: "Safe, exceptional staff, some of the best food I've had in a hotel, perfectly accessible, and incredible value for money. The kids' club kept our children entertained while we enjoyed the spa. Will absolutely return.",
    date: "2025-08-22",
    source: "tripadvisor",
    verified: true,
    stayType: "Family"
  },
  {
    id: 6,
    name: "Emily Watson",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
    location: "Sydney, Australia",
    rating: 4,
    title: "A Sanctuary of Calm",
    text: "The most peaceful and elegant hotel I've stayed at. Clean, beautifully designed rooms with the softest linens. The staff was polite, professional, and genuinely caring. The breakfast spread was phenomenal.",
    date: "2025-07-10",
    source: "booking",
    verified: true,
    stayType: "Solo Travel"
  }
];

const ratingBreakdown = {
  overall: 4.8,
  totalReviews: 12847,
  categories: [
    { name: "Cleanliness", score: 4.9 },
    { name: "Service", score: 4.8 },
    { name: "Location", score: 4.7 },
    { name: "Value", score: 4.6 },
    { name: "Amenities", score: 4.8 }
  ],
  distribution: [
    { stars: 5, percentage: 78 },
    { stars: 4, percentage: 15 },
    { stars: 3, percentage: 5 },
    { stars: 2, percentage: 1.5 },
    { stars: 1, percentage: 0.5 }
  ]
};
