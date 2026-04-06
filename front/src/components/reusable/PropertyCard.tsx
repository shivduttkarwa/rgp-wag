import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin, Bed, Bath, Square, Car,
  Heart, ArrowRight, Tag, CheckCircle, Clock, Eye,
} from "lucide-react";
import "./PropertyCard.css";

// ─── Type ──────────────────────────────────────────────────────────────────
export type Category = "for-sale" | "sold" | "for-rent";

export interface Property {
  id: number;
  slug: string;
  category: Category;
  title: string;
  location: string;
  price: number;        // 0 = contact agent
  soldPrice?: number;
  image: string;
  beds: number;
  baths: number;
  sqft: number;
  garage: number;
  features: string[];
  badge?: string;
  isNew?: boolean;
  views?: number;
  soldDate?: string;
  daysOnMarket?: number;
  deposit?: number;
  minLease?: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────
export const formatPrice = (price: number, isRent = false): string => {
  if (price === 0) return "Contact Agent";
  if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
  return `$${price.toLocaleString()}${isRent ? "/mo" : ""}`;
};

const badgeClass = (badge: string): string => {
  const key = badge.toLowerCase();
  if (key.includes("new")) return "badge-new";
  return "";
};

// ─── Component ─────────────────────────────────────────────────────────────
export const PropertyCard = ({
  property,
  cardIndex = 0,
}: {
  property: Property;
  cardIndex?: number;
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const isSold = property.category === "sold";
  const isRent = property.category === "for-rent";
  const displayPrice = isSold ? (property.soldPrice ?? property.price) : property.price;

  return (
    <div
      className={`property-card ${property.category}`}
      style={{ animationDelay: `${cardIndex * 55}ms` }}
    >
      {/* ── Image ── */}
      <div className="card-image-wrapper">
        <img
          src={property.image}
          alt={property.title}
          className={`card-image${isSold ? " sold" : ""}`}
        />
        <div className="card-overlay" />

        {/* Badges */}
        <div className="card-badges">
          {property.badge && (
            <span className={`badge ${badgeClass(property.badge)}`}>
              <Tag size={12} />
              {property.badge}
            </span>
          )}
          {property.isNew && (
            <span className="badge badge-new">New Listing</span>
          )}
          {isSold && (
            <span className="badge badge-sold">
              <CheckCircle size={12} />
              Sold
            </span>
          )}
        </div>

        {/* Like */}
        <button
          className={`like-btn${isLiked ? " liked" : ""}`}
          onClick={() => setIsLiked(v => !v)}
          aria-label="Save property"
        >
          <Heart size={16} />
        </button>

        {/* Price */}
        <div className="card-price-wrapper">
          <div className="price-info">
            {isSold && property.soldPrice && (
              <span className="price-original">{formatPrice(property.price)}</span>
            )}
            <span className="price-current">{formatPrice(displayPrice, isRent)}</span>
          </div>
          {property.views && (
            <span className="card-views">
              <Eye size={14} />
              {property.views}
            </span>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="card-body">
        <div className="card-header">
          <h3 className="card-title">{property.title}</h3>
          <div className="card-location">
            <MapPin size={14} />
            <span>{property.location}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="card-stats">
          <div className="stat">
            <div className="stat-icon"><Bed size={14} /></div>
            <div className="stat-content">
              <span className="stat-value">{property.beds}</span>
              <span className="stat-label">Beds</span>
            </div>
          </div>
          <div className="stat">
            <div className="stat-icon"><Bath size={14} /></div>
            <div className="stat-content">
              <span className="stat-value">{property.baths}</span>
              <span className="stat-label">Baths</span>
            </div>
          </div>
          <div className="stat">
            <div className="stat-icon"><Square size={14} /></div>
            <div className="stat-content">
              <span className="stat-value">{(property.sqft / 1000).toFixed(1)}k</span>
              <span className="stat-label">Sq Ft</span>
            </div>
          </div>
          <div className="stat">
            <div className="stat-icon"><Car size={14} /></div>
            <div className="stat-content">
              <span className="stat-value">{property.garage}</span>
              <span className="stat-label">Garage</span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="card-features">
          {property.features.map((f, i) => (
            <span key={i} className="feature-tag">{f}</span>
          ))}
        </div>

        {/* Sold meta */}
        {isSold && property.soldDate && (
          <div className="card-meta">
            <div className="meta-item">
              <Clock size={14} />
              <span>Sold {property.soldDate}</span>
            </div>
            {property.daysOnMarket && (
              <div className="meta-item meta-highlight">
                <span>{property.daysOnMarket} days on market</span>
              </div>
            )}
          </div>
        )}

        {/* Rent meta */}
        {isRent && property.deposit && (
          <div className="card-meta">
            <div className="meta-item">
              <span className="meta-label">Deposit:</span>
              <span>${property.deposit.toLocaleString()}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Min:</span>
              <span>{property.minLease}</span>
            </div>
          </div>
        )}

        <Link
          to={`/properties/${property.slug}`}
          className="card-btn btn-primary"
        >
          <span>
            {isSold ? "View Details" : isRent ? "Schedule Tour" : "View Property"}
          </span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;
