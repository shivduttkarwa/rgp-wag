import PropDetail from "./PropDetails";
import type { ContactFormData, PropertyData } from "./PropDetails";

const sampleProperty: PropertyData = {
  id: "RGP-2024-0847",
  title: "Waterfront Villa with Private Yacht Dock",
  address: "1234 Ocean Boulevard",
  city: "Palm Beach",
  state: "Florida",
  zipCode: "33480",
  price: 4250000,
  priceLabel: "Listed Price",
  status: "For Sale",
  featured: true,
  images: [
    {
      url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=2000",
      alt: "Villa Exterior",
    },
    {
      url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2000",
      alt: "Pool Area",
    },
    {
      url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=2000",
      alt: "Living Room",
    },
  ],
  stats: [
    { icon: "bed", value: "5", label: "Bedrooms" },
    { icon: "bath", value: "4", label: "Bathrooms" },
    { icon: "area", value: "4,500", label: "Sq. Ft." },
    { icon: "garage", value: "3", label: "Garages" },
    { icon: "year", value: "2015", label: "Year Built" },
    { icon: "lot", value: "0.8", label: "Acres" },
  ],
  overview: [
    "Discover unparalleled coastal elegance in this magnificent waterfront estate. Nestled on the pristine shores of Palm Beach, this architectural masterpiece offers breathtaking ocean views and direct yacht access from your private dock.",
    "The residence seamlessly blends contemporary design with timeless sophistication, featuring floor-to-ceiling windows that frame panoramic water vistas. High-end finishes throughout include Italian marble flooring, custom millwork, and state-of-the-art smart home technology.",
    "Outdoor living is redefined with expansive terraces, an infinity-edge pool overlooking the Atlantic, and meticulously landscaped tropical gardens.",
  ],
  features: [
    {
      icon: "smart-home",
      title: "Smart Home System",
      description: "Integrated automation for lighting, climate, security",
    },
    {
      icon: "kitchen",
      title: "Gourmet Kitchen",
      description: "Chef's kitchen with premium appliances",
    },
    {
      icon: "ocean",
      title: "Ocean Views",
      description: "Panoramic Atlantic Ocean vistas",
    },
    {
      icon: "wine",
      title: "Wine Cellar",
      description: "Climate-controlled 500-bottle capacity",
    },
    {
      icon: "pool",
      title: "Infinity Pool",
      description: "Heated saltwater pool with spa",
    },
    {
      icon: "dock",
      title: "Private Dock",
      description: "80-foot yacht accommodation",
    },
  ],
  details: [
    { label: "Property Type", value: "Single Family Residence" },
    { label: "Property ID", value: "RGP-2024-0847" },
    { label: "Lot Size", value: "0.8 Acres (34,848 Sq Ft)" },
    { label: "Year Built", value: "2015" },
    { label: "Architecture", value: "Contemporary Coastal" },
    { label: "Parking", value: "3-Car Garage + Driveway" },
    { label: "Cooling", value: "Central A/C, Ceiling Fans" },
    { label: "Heating", value: "Central, Radiant Floor" },
  ],
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=...",
  nearbyLocations: [
    { name: "Worth Avenue Shopping", distance: "1.2 miles", type: "shopping" },
    {
      name: "Palm Beach International Airport",
      distance: "12 miles",
      type: "airport",
    },
    { name: "Fine Dining Restaurants", distance: "0.5 miles", type: "dining" },
    { name: "Championship Golf Courses", distance: "2.8 miles", type: "golf" },
  ],
  videoTourUrl: "https://www.youtube.com/embed/...",
  videoThumbnail:
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200",
  agent: {
    name: "Michael Sterling",
    title: "Senior Luxury Agent",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300",
    phone: "+15551234567",
    email: "michael@realgold.com",
    rating: 5,
    reviewCount: 127,
  },
};

export default function Uses() {
  const handleContactSubmit = (data: ContactFormData) => {
    console.log("Contact form submitted:", data);
  };

  const handleSave = () => {
    console.log("Property saved");
  };

  return (
    <PropDetail
      property={sampleProperty}
      onContactSubmit={handleContactSubmit}
      onSaveProperty={handleSave}
      onShareProperty={() => {}}
      onScheduleViewing={() => {}}
      onDownloadBrochure={() => {}}
    />
  );
}
