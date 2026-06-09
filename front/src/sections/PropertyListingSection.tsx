import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Building2, CheckCircle, Key, Tag } from "lucide-react";
import assetUrl from "@/lib/assetUrl";
import type { PropertyListingSection as PropertyListingSectionData } from "@/types/homePage";
import {
  PropertyCard,
  type Category,
  type Property as ListingCardProperty,
} from "../components/reusable/PropertyCard";
import "./PropertyListingsection.css";

const isCategory = (value: string): value is Category =>
  value === "for-sale" || value === "sold" || value === "for-rent";

const filterTabs = [
  { id: "for-sale", label: "For Sale", icon: Tag },
  { id: "sold", label: "Sold", icon: CheckCircle },
  { id: "for-rent", label: "For Rent", icon: Key },
] as const;

const mapCards = (
  cards: PropertyListingSectionData["cards"],
): ListingCardProperty[] =>
  (cards ?? [])
    .filter((card): card is NonNullable<typeof card> => Boolean(card))
    .map((card) => ({
      id: Number(card.id),
      slug: card.slug,
      category: isCategory(card.category) ? card.category : "for-sale",
      title: card.title,
      location: card.location,
      price: Number(card.price || 0),
      soldPrice: card.soldPrice == null ? undefined : Number(card.soldPrice),
      image: assetUrl(card.image),
      beds: Number(card.beds || 0),
      baths: Number(card.baths || 0),
      sqft: Number(card.sqft || 0),
      garage: Number(card.garage || 0),
      features: card.features || [],
      badge: card.badge || undefined,
      isNew: Boolean(card.isNew),
      views: card.views == null ? undefined : Number(card.views),
      soldDate: card.soldDate || undefined,
      daysOnMarket:
        card.daysOnMarket == null ? undefined : Number(card.daysOnMarket),
      deposit: card.deposit == null ? undefined : Number(card.deposit),
      minLease: card.minLease || undefined,
    }));

const PropertyListingSection = ({
  data,
}: {
  data?: PropertyListingSectionData;
}) => {
  const [activeFilter, setActiveFilter] = useState<Category | "*">("*");

  const sourceProperties = useMemo(
    () => mapCards(data?.cards),
    [data?.cards],
  );

  if (!data) return null;

  const displayed =
    activeFilter === "*"
      ? sourceProperties
      : sourceProperties.filter((property) => property.category === activeFilter);

  return (
    <section className="property-section">
      <div className="property-container">
        <header className="section-header">
          {data.eyebrow ? (
            <div className="section-badge" data-gsap="fade-up">
              <Building2 size={16} />
              <span>{data.eyebrow}</span>
            </div>
          ) : null}
          {data.heading ? (
            <h2
              className="section-title"
              data-gsap="char-reveal"
              data-gsap-start="top 85%"
            >
              {data.heading}
            </h2>
          ) : null}
          {data.subtitle ? (
            <p
              className="section-subtitle"
              data-gsap="fade-up"
              data-gsap-delay="0.15"
            >
              {data.subtitle}
            </p>
          ) : null}
        </header>

        {sourceProperties.length ? (
          <>
            <div
              className="filter-wrapper"
              data-gsap="fade-in"
              data-gsap-delay="0.1"
            >
              <div className="filter-tabs">
                <button
                  onClick={() => setActiveFilter("*")}
                  className={`filter-tab ${activeFilter === "*" ? "active" : ""}`}
                  type="button"
                >
                  <span>All</span>
                </button>
                {filterTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id)}
                    className={`filter-tab ${
                      activeFilter === tab.id ? "active" : ""
                    }`}
                    type="button"
                  >
                    <tab.icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="property-grid">
              {displayed.slice(0, 3).map((property, index) => (
                <div key={property.id} className="property-card-wrap">
                  <PropertyCard property={property} cardIndex={index} />
                </div>
              ))}
            </div>

            <div className="view-all-wrapper">
              <Link
                to="/properties"
                className="view-all-btn"
                data-gsap="btn-clip-reveal"
              >
                <span>View All Properties</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
};

export default PropertyListingSection;
