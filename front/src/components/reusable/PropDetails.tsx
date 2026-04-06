import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./PropDetails.css";

// ============================================
// TYPE DEFINITIONS
// ============================================

interface PropertyImage {
  url: string;
  alt: string;
}

interface PropertyFeature {
  icon:
    | "smart-home"
    | "kitchen"
    | "ocean"
    | "wine"
    | "pool"
    | "dock"
    | "theater"
    | "gym"
    | "security"
    | "garden"
    | "spa"
    | "garage";
  title: string;
  description: string;
}

interface PropertyDetail {
  label: string;
  value: string;
}

interface PropertyStat {
  icon: "bed" | "bath" | "area" | "garage" | "year" | "lot";
  value: string;
  label: string;
}

interface NearbyLocation {
  name: string;
  distance: string;
  type:
    | "shopping"
    | "airport"
    | "dining"
    | "golf"
    | "beach"
    | "school"
    | "hospital";
}

interface Agent {
  name: string;
  title: string;
  image: string;
  phone: string;
  email: string;
  rating: number;
  reviewCount: number;
}

interface PropertyData {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  priceLabel?: string;
  status: "For Sale" | "For Rent" | "Sold" | "Pending";
  featured?: boolean;
  images: PropertyImage[];
  stats: PropertyStat[];
  overview: string[];
  features: PropertyFeature[];
  details: PropertyDetail[];
  mapEmbedUrl?: string;
  nearbyLocations: NearbyLocation[];
  videoTourUrl?: string;
  videoThumbnail?: string;
  agent: Agent;
}

interface PropDetailProps {
  property: PropertyData;
  onContactSubmit?: (data: ContactFormData) => void;
  onSaveProperty?: () => void;
  onShareProperty?: () => void;
  onScheduleViewing?: () => void;
  onDownloadBrochure?: () => void;
}

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyId: string;
}

// ============================================
// ICON COMPONENTS
// ============================================

const Icons = {
  // Stats Icons
  bed: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M2 20V8l10-6 10 6v12" />
      <path d="M6 20V12h12v8" />
    </svg>
  ),
  bath: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1z" />
      <circle cx="18" cy="6" r="3" />
    </svg>
  ),
  area: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
    </svg>
  ),
  garage: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  year: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  lot: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),

  // Feature Icons
  "smart-home": () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <circle cx="12" cy="13" r="3" />
      <path d="M12 10v-2m0 10v-2m-3-3H7m10 0h-2" />
    </svg>
  ),
  kitchen: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M4 10h16M12 10v12M8 6h.01M12 6h.01M16 6h.01" />
    </svg>
  ),
  ocean: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M2 12c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0 3.5 2 5 0" />
      <path d="M2 17c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0 3.5 2 5 0" />
      <circle cx="12" cy="6" r="3" />
    </svg>
  ),
  wine: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M8 22h8M12 15v7M5.2 9.4c-.9 2.5.3 5.3 2.8 6.4 1.3.5 2.6.5 3.9.1 1.3-.4 2.5-1.3 3.2-2.5.7-1.2.9-2.6.6-4L14 2H9.9L8.1 9.4z" />
    </svg>
  ),
  pool: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M2 12c1.5-1.5 3.5-1.5 5 0s3.5 1.5 5 0 3.5-1.5 5 0 3.5 1.5 5 0" />
      <path d="M2 17c1.5-1.5 3.5-1.5 5 0s3.5 1.5 5 0 3.5-1.5 5 0 3.5 1.5 5 0" />
      <path d="M9 8V5a3 3 0 1 1 6 0v3" />
    </svg>
  ),
  dock: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M2 19l2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2" />
      <path d="M12 5l-6 9h12l-6-9z" />
      <path d="M12 14v5" />
    </svg>
  ),
  theater: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="2" y="4" width="20" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
      <path d="M9 9l4 2-4 2V9z" />
    </svg>
  ),
  gym: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M6.5 6.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
      <path d="M2 22l2-9 4 1v-4l-3-4 2-1 5 5v13" />
      <path d="M18 12h4M18 12v4M22 8v8" />
    </svg>
  ),
  security: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  garden: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M12 22V8" />
      <path d="M5 12c0-5 7-10 7-10s7 5 7 10c0 4-3.5 7-7 7s-7-3-7-7z" />
      <path d="M5 19c1.5 0 3-1 3-3" />
      <path d="M19 19c-1.5 0-3-1-3-3" />
    </svg>
  ),
  spa: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v2M12 16v2M6 12h2M16 12h2" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  ),

  // UI Icons
  location: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  star: () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  heart: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  share: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  ),
  download: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  calendar: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  phone: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  mail: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  arrow: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  chevronLeft: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  ),
  chevronRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18l6-6-6-6" />
    </svg>
  ),
  chevronDown: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" />
    </svg>
  ),
  play: () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <polygon points="10 8 16 12 10 16 10 8" />
    </svg>
  ),
  clock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
};

// ============================================
// HELPER FUNCTIONS
// ============================================

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
};

const formatPhoneDisplay = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`;
  }
  return phone;
};

// ============================================
// SUB-COMPONENTS
// ============================================

// Hero Slider Component
const HeroSlider: React.FC<{
  images: PropertyImage[];
  title: string;
  address: string;
  fullAddress: string;
  price: number;
  priceLabel?: string;
  status: string;
  featured?: boolean;
}> = ({
  images,
  title,
  address: _address,
  fullAddress,
  price,
  priceLabel,
  status,
  featured,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const maxThumbs = 15;
  const thumbnails = images.slice(0, maxThumbs);
  const extraThumbCount = images.length - maxThumbs;

  useEffect(() => {
    if (isAutoPlaying && images.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % images.length);
      }, 6000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlaying, images.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    setIsAutoPlaying(false);
  };

  return (
    <section className="pd-hero">
      <div className="pd-hero__slider">
        {images.map((image, index) => (
          <div
            key={index}
            className={`pd-hero__slide ${index === currentSlide ? "active" : ""}`}
          >
            <img src={image.url} alt={image.alt} className="pd-hero__image" />
            <div className="pd-hero__overlay" />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            className="pd-hero__arrow pd-hero__arrow--prev"
            onClick={prevSlide}
          >
            <Icons.chevronLeft />
          </button>
          <button
            className="pd-hero__arrow pd-hero__arrow--next"
            onClick={nextSlide}
          >
            <Icons.chevronRight />
          </button>
        </>
      )}

      <div className="pd-hero__content">
        <div className="pd-hero__badges">
          <span
            className={`pd-hero__badge pd-hero__badge--${status.toLowerCase().replace(" ", "-")}`}
          >
            {status}
          </span>
          {featured && (
            <span className="pd-hero__badge pd-hero__badge--featured">
              <Icons.star />
              Featured
            </span>
          )}
        </div>

        <h1 className="pd-hero__title">{title}</h1>

        <div className="pd-hero__location">
          <Icons.location />
          <span>{fullAddress}</span>
        </div>

        <div className="pd-hero__price">
          <span className="pd-hero__price-amount">{formatPrice(price)}</span>
          <span className="pd-hero__price-label">
            {priceLabel || "Listed Price"}
          </span>
        </div>
      </div>

      {images.length > 1 && (
        <div className="pd-hero__thumbnails">
          {thumbnails.map((image, index) => (
            <button
              key={index}
              className={`pd-hero__thumbnail ${index === currentSlide ? "active" : ""}`}
              onClick={() => goToSlide(index)}
            >
              <img src={image.url} alt={image.alt} />
            </button>
          ))}
          {extraThumbCount > 0 && (
            <button
              className="pd-hero__thumbnail-more"
              onClick={() => goToSlide(maxThumbs)}
              aria-label={`Show ${extraThumbCount} more photos`}
            >
              <span>+{extraThumbCount}</span>
            </button>
          )}
        </div>
      )}

      <div className="pd-hero__progress">
        {images.map((_, index) => (
          <button
            key={index}
            className={`pd-hero__progress-dot ${index === currentSlide ? "active" : ""}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </section>
  );
};

// Quick Stats Component
const QuickStats: React.FC<{ stats: PropertyStat[] }> = ({ stats }) => {
  const getIcon = (iconName: PropertyStat["icon"]) => {
    const IconComponent = Icons[iconName];
    return IconComponent ? <IconComponent /> : null;
  };

  return (
    <section className="pd-stats">
      <div className="pd-stats__container">
        {stats.map((stat, index) => (
          <div key={index} className="pd-stat">
            <div className="pd-stat__icon">{getIcon(stat.icon)}</div>
            <div className="pd-stat__data">
              <span className="pd-stat__value">{stat.value}</span>
              <span className="pd-stat__label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// Features Grid Component
const FeaturesGrid: React.FC<{ features: PropertyFeature[] }> = ({
  features,
}) => {
  const getIcon = (iconName: PropertyFeature["icon"]) => {
    const IconComponent = Icons[iconName];
    return IconComponent ? <IconComponent /> : null;
  };

  return (
    <div className="pd-features__grid">
      {features.map((feature, index) => (
        <div key={index} className="pd-feature">
          <div className="pd-feature__icon">{getIcon(feature.icon)}</div>
          <h4 className="pd-feature__title">{feature.title}</h4>
          <p className="pd-feature__desc">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};

// Details Grid Component
const DetailsGrid: React.FC<{ details: PropertyDetail[] }> = ({ details }) => (
  <div className="pd-details__grid">
    {details.map((detail, index) => (
      <div key={index} className="pd-detail-row">
        <span className="pd-detail-row__label">{detail.label}</span>
        <span className="pd-detail-row__value">{detail.value}</span>
      </div>
    ))}
  </div>
);

// Location Section Component
const LocationSection: React.FC<{
  mapEmbedUrl?: string;
  nearbyLocations: NearbyLocation[];
  address: string;
}> = ({ mapEmbedUrl, nearbyLocations, address }) => {
  const fallbackMapUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    address,
  )}&output=embed`;
  const resolvedMapUrl = mapEmbedUrl || fallbackMapUrl;

  return (
    <div className="pd-location__content">
      <div className="pd-location__map">
        <iframe
          src={resolvedMapUrl}
          title={`Map of ${address}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      {nearbyLocations.length > 0 && (
        <div className="pd-location__info">
          <h3 className="pd-location__subtitle">Nearby Attractions</h3>
          <div className="pd-location__list">
            {nearbyLocations.map((location, index) => (
              <div key={index} className="pd-location__item">
                <Icons.clock />
                <div className="pd-location__item-info">
                  <span className="pd-location__item-name">{location.name}</span>
                  <span className="pd-location__item-distance">
                    {location.distance}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Video Tour Component
const VideoTour: React.FC<{
  videoUrl?: string;
  thumbnail?: string;
}> = ({ videoUrl, thumbnail }) => {
  const canPlay = Boolean(videoUrl);
  const resolveVideoUrl = (url?: string) => {
    if (!url) return undefined;
    const ytMatch =
      url.match(/youtu\.be\/([A-Za-z0-9_-]+)/) ||
      url.match(/youtube\.com\/watch\?v=([A-Za-z0-9_-]+)/) ||
      url.match(/youtube\.com\/embed\/([A-Za-z0-9_-]+)/);
    if (ytMatch?.[1]) {
      const id = ytMatch[1];
      return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}`;
    }
    const sep = url.includes("?") ? "&" : "?";
    return `${url}${sep}autoplay=1&loop=1&muted=1`;
  };
  const resolvedUrl = resolveVideoUrl(videoUrl);

  const defaultThumbnail =
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="pd-video__player">
      {!canPlay ? (
        <div
          className="pd-video__placeholder"
          style={{ backgroundImage: `url(${thumbnail || defaultThumbnail})` }}
        >
          <div className="pd-video__play">
            <Icons.play />
          </div>
          <span className="pd-video__text">
            Virtual Tour Coming Soon
          </span>
        </div>
      ) : (
        <iframe
          src={resolvedUrl}
          title="Virtual Tour"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  );
};

// Contact Form Component
const ContactCard: React.FC<{
  agent: Agent;
  propertyId: string;
  onSubmit?: (data: ContactFormData) => void;
}> = ({ agent, propertyId, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: `I'm interested in learning more about this property.`,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (onSubmit) {
      onSubmit({ ...formData, propertyId });
    }

    setIsSubmitting(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`pd-contact__star ${i < rating ? "active" : ""}`}
      >
        <Icons.star />
      </span>
    ));
  };

  return (
    <div className="pd-contact-card">
      <div className="pd-contact__agent">
        <img
          src={agent.image}
          alt={agent.name}
          className="pd-contact__avatar"
        />
        <div className="pd-contact__info">
          <h3 className="pd-contact__name">{agent.name}</h3>
          <p className="pd-contact__title">{agent.title}</p>
          <div className="pd-contact__rating">
            {renderStars(agent.rating)}
            <span className="pd-contact__rating-text">
              {agent.rating.toFixed(1)} ({agent.reviewCount} reviews)
            </span>
          </div>
        </div>
      </div>

      <form className="pd-contact-form" onSubmit={handleSubmit}>
        <div className="pd-form-group">
          <label htmlFor="name" className="pd-form-label">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="pd-form-input"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="pd-form-group">
          <label htmlFor="email" className="pd-form-label">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="pd-form-input"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="pd-form-group">
          <label htmlFor="phone" className="pd-form-label">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="pd-form-input"
            placeholder="+1 (555) 000-0000"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="pd-form-group">
          <label htmlFor="message" className="pd-form-label">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            className="pd-form-textarea"
            rows={4}
            placeholder="I'm interested in this property..."
            value={formData.message}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="pd-form-submit"
          disabled={isSubmitting}
        >
          <span>{isSubmitting ? "Sending..." : "Request Information"}</span>
          <Icons.arrow />
        </button>
      </form>

      <div className="pd-contact__methods">
        <a href={`tel:${agent.phone}`} className="pd-contact-method">
          <Icons.phone />
          <span>{formatPhoneDisplay(agent.phone)}</span>
        </a>
        <a href={`mailto:${agent.email}`} className="pd-contact-method">
          <Icons.mail />
          <span>{agent.email}</span>
        </a>
      </div>
    </div>
  );
};

// Mortgage Calculator Component
const MortgageCalculator: React.FC<{ price: number }> = ({ price }) => {
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [loanTerm, setLoanTerm] = useState(30);
  const [interestRate, setInterestRate] = useState(6.5);

  const calculateMonthlyPayment = (): number => {
    const principal = price * (1 - downPaymentPercent / 100);
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    if (monthlyRate === 0) return principal / numberOfPayments;

    const payment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    return payment;
  };

  return (
    <div className="pd-calculator">
      <h3 className="pd-calculator__title">Mortgage Calculator</h3>
      <div className="pd-calculator__divider" />

      <div className="pd-calc-form">
        <div className="pd-calc-group">
          <label className="pd-calc-label">Home Price</label>
          <div className="pd-calc-input-wrapper">
            <span className="pd-calc-prefix">$</span>
            <input
              type="text"
              className="pd-calc-input"
              value={price.toLocaleString()}
              readOnly
            />
          </div>
        </div>

        <div className="pd-calc-group">
          <label className="pd-calc-label">Down Payment</label>
          <div className="pd-calc-input-wrapper">
            <input
              type="number"
              className="pd-calc-input pd-calc-input--center"
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
              min={0}
              max={100}
            />
            <span className="pd-calc-suffix">%</span>
          </div>
          <span className="pd-calc-hint">
            {formatPrice(price * (downPaymentPercent / 100))}
          </span>
        </div>

        <div className="pd-calc-group">
          <label className="pd-calc-label">Loan Term</label>
          <select
            className="pd-calc-select"
            value={loanTerm}
            onChange={(e) => setLoanTerm(Number(e.target.value))}
          >
            <option value={15}>15 years</option>
            <option value={20}>20 years</option>
            <option value={30}>30 years</option>
          </select>
        </div>

        <div className="pd-calc-group">
          <label className="pd-calc-label">Interest Rate</label>
          <div className="pd-calc-input-wrapper">
            <input
              type="number"
              className="pd-calc-input pd-calc-input--center"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              step={0.1}
              min={0}
            />
            <span className="pd-calc-suffix">%</span>
          </div>
        </div>

        <div className="pd-calc-result">
          <div className="pd-calc-result__label">Estimated Monthly Payment</div>
          <div className="pd-calc-result__amount">
            {formatPrice(calculateMonthlyPayment())}
          </div>
          <div className="pd-calc-result__note">Principal & Interest</div>
        </div>
      </div>
    </div>
  );
};

// Actions Card Component
const ActionsCard: React.FC<{
  onSave?: () => void;
  onShare?: () => void;
  onDownload?: () => void;
  onSchedule?: () => void;
}> = ({ onSave, onShare, onDownload, onSchedule }) => (
  <div className="pd-actions">
    <button className="pd-action-btn pd-action-btn--primary" onClick={onSave}>
      <Icons.heart />
      <span>Save Property</span>
    </button>
    <button className="pd-action-btn" onClick={onShare}>
      <Icons.share />
      <span>Share Property</span>
    </button>
    <button className="pd-action-btn" onClick={onDownload}>
      <Icons.download />
      <span>Download Brochure</span>
    </button>
    <button className="pd-action-btn" onClick={onSchedule}>
      <Icons.calendar />
      <span>Schedule Viewing</span>
    </button>
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================

const PropDetail: React.FC<PropDetailProps> = ({
  property,
  onContactSubmit,
  onSaveProperty,
  onShareProperty,
  onScheduleViewing,
  onDownloadBrochure,
}) => {
  const fullAddress = `${property.address}, ${property.city}, ${property.state} ${property.zipCode}`;
  const resolvedVideoThumbnail =
    property.videoThumbnail || property.images?.[0]?.url;
  const shouldShowVideo = Boolean(property.videoTourUrl || resolvedVideoThumbnail);

  return (
    <div className="pd-wrapper">
      {/* Hero Section */}
      <HeroSlider
        images={property.images}
        title={property.title}
        address={property.address}
        fullAddress={fullAddress}
        price={property.price}
        priceLabel={property.priceLabel}
        status={property.status}
        featured={property.featured}
      />

      {/* Quick Stats */}
      <QuickStats stats={property.stats} />

      {/* Main Content */}
      <main className="pd-main">
        <div className="pd-main__container">
          {/* Left Content Column */}
          <div className="pd-main__content">
            {/* Overview Section */}
            <section className="pd-section pd-overview">
              <div className="pd-section__header">
                <span className="rg-eyebrow">About This Property</span>
                <h2 className="pd-section__title">Property Overview</h2>
                <div className="pd-section__divider" />
              </div>
              <div className="pd-overview__content">
                {property.overview.map((paragraph, index) => (
                  <p key={index} className="pd-overview__text">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>

            {/* Features Section */}
            <section className="pd-section pd-features">
              <div className="pd-section__header">
                <span className="rg-eyebrow">What's Included</span>
                <h2 className="pd-section__title">
                  Premium Features & Amenities
                </h2>
                <div className="pd-section__divider" />
              </div>
              <FeaturesGrid features={property.features} />
            </section>

            {/* Details Section */}
            <section className="pd-section pd-details">
              <div className="pd-section__header">
                <span className="rg-eyebrow">Specifications</span>
                <h2 className="pd-section__title">Property Details</h2>
                <div className="pd-section__divider" />
              </div>
              <DetailsGrid details={property.details} />
            </section>

            {/* Location Section */}
            <section className="pd-section pd-location">
              <div className="pd-section__header">
                <span className="rg-eyebrow">Location</span>
                <h2 className="pd-section__title">Location & Neighborhood</h2>
                <div className="pd-section__divider" />
              </div>
              <LocationSection
                mapEmbedUrl={property.mapEmbedUrl}
                nearbyLocations={property.nearbyLocations}
                address={fullAddress}
              />
            </section>

            {/* Video Tour Section */}
            {shouldShowVideo && (
              <section className="pd-section pd-video">
                <div className="pd-section__header">
                  <span className="rg-eyebrow">Experience</span>
                  <h2 className="pd-section__title">Virtual Tour</h2>
                  <div className="pd-section__divider" />
                </div>
                <VideoTour
                  videoUrl={property.videoTourUrl}
                  thumbnail={resolvedVideoThumbnail}
                />
              </section>
            )}
          </div>

          {/* Right Sidebar */}
          <aside className="pd-main__sidebar">
            <ContactCard
              agent={property.agent}
              propertyId={property.id}
              onSubmit={onContactSubmit}
            />
            <MortgageCalculator price={property.price} />
            <ActionsCard
              onSave={onSaveProperty}
              onShare={onShareProperty}
              onDownload={onDownloadBrochure}
              onSchedule={onScheduleViewing}
            />
          </aside>
        </div>
      </main>

      <section className="pd-cta">
        <div className="pd-cta__inner">
          <div className="pd-cta__copy">
            <span className="rg-eyebrow">Explore More</span>
            <h2 className="pd-cta__title">Discover More Properties</h2>
            <p className="pd-cta__text">
              Browse all listings to compare locations, pricing, and features.
            </p>
          </div>
          <Link to="/properties" className="pd-cta__btn">
            View All Properties
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PropDetail;

// Export types for external use
export type {
  PropertyData,
  PropertyImage,
  PropertyFeature,
  PropertyDetail,
  PropertyStat,
  NearbyLocation,
  Agent,
  PropDetailProps,
  ContactFormData,
};
