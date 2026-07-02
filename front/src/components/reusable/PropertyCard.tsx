import {
  MapPin, Bed, Bath, Square, Car,
  Tag, CheckCircle, Clock, Eye, Key,
} from "lucide-react";
import RgButton from "@/components/reusable/RgButton";
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
  featured?: boolean;
  type?: string;
  address?: string;
  price_label?: string;
  agent?: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────
export const formatPrice = (price: number, isRent = false): string => {
  if (price === 0) return "Contact Agent";
  if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
  return `$${price.toLocaleString()}${isRent ? "/wk" : ""}`;
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
          {!isSold && !isRent && (
            <span className="badge badge-for-sale">
              <Tag size={12} />
              For Sale
            </span>
          )}
          {isRent && (
            <span className="badge badge-for-rent">
              <Key size={12} />
              For Rent
            </span>
          )}
          {isSold && (
            <span className="badge badge-sold">
              <CheckCircle size={12} />
              Sold
            </span>
          )}
        </div>

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
          {property.type && (
            <span className="card-type-tag">{property.type}</span>
          )}
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
              <span className="stat-value">{property.beds > 0 ? property.beds : "—"}</span>
              <span className="stat-label">Beds</span>
            </div>
          </div>
          <div className="stat">
            <div className="stat-icon"><Bath size={14} /></div>
            <div className="stat-content">
              <span className="stat-value">{property.baths > 0 ? property.baths : "—"}</span>
              <span className="stat-label">Baths</span>
            </div>
          </div>
          <div className="stat">
            <div className="stat-icon"><Square size={14} /></div>
            <div className="stat-content">
              <span className="stat-value">{property.sqft > 0 ? property.sqft : "—"}</span>
              <span className="stat-label">m²</span>
            </div>
          </div>
          <div className="stat">
            <div className="stat-icon"><Car size={14} /></div>
            <div className="stat-content">
              <span className="stat-value">{property.garage > 0 ? property.garage : "—"}</span>
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

        <div className="card-actions">
          <RgButton
            variant="gold"
            to={`/properties/${property.slug}`}
            label={isSold ? "View Details" : isRent ? "Schedule Tour" : "View Property"}
            arrowSize={16}
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
