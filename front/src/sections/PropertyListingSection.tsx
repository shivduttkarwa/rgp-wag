import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Tag,
  Key,
  Building2,
} from "lucide-react";
import {
  PropertyCard,
  type Category,
} from "../components/reusable/PropertyCard";
import "./PropertyListingsection.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const propertiesData = [
  {
    id: 1,
    slug: "73-mount-moogerah-drive-algester",
    category: "sold" as Category,
    title: "73 Mount Moogerah Drive",
    location: "Algester, QLD",
    price: 1500000,
    soldPrice: 1500000,
    image:
      "https://i2.au.reastatic.net/800x600/c37701121db965e2181e90a0269133fc2d2967643f86bf8c85a2b0f4958d7ba6/image.jpg",
    beds: 5,
    baths: 3,
    sqft: 4500,
    garage: 6,
    features: ["12 Car Spaces", "Large Block", "Premium Home"],
    soldDate: "5 weeks ago",
    daysOnMarket: 28,
  },
  {
    id: 2,
    slug: "26-jacana-close-springfield",
    category: "sold" as Category,
    title: "26 Jacana Close",
    location: "Springfield, QLD",
    price: 1137000,
    soldPrice: 1137000,
    image:
      "https://i2.au.reastatic.net/800x600/28a77f3d11097e6e7254f26797c3a50a5dbd8084abed79665d857465a175c8d2/image.jpg",
    beds: 4,
    baths: 2,
    sqft: 3200,
    garage: 2,
    features: ["Family Home", "Great Location", "Modern Finishes"],
    soldDate: "3 months ago",
    daysOnMarket: 22,
  },
  {
    id: 3,
    slug: "51-dobbie-crescent-ripley",
    category: "sold" as Category,
    title: "51 Dobbie Crescent",
    location: "Ripley, QLD",
    price: 970000,
    soldPrice: 970000,
    image:
      "https://i2.au.reastatic.net/800x600/7e3a9d18a2cd7cc29cda98993de0c6791efd652c0f80549f38ed742aeab03c39/image.jpg",
    beds: 4,
    baths: 2,
    sqft: 2800,
    garage: 2,
    features: ["Family Home", "Double Garage", "Quality Build"],
    soldDate: "6 months ago",
    daysOnMarket: 19,
  },
  {
    id: 4,
    slug: "85-bayliss-road-south-ripley",
    category: "sold" as Category,
    title: "85 Bayliss Road",
    location: "South Ripley, QLD",
    price: 1100000,
    soldPrice: 1100000,
    image:
      "https://i2.au.reastatic.net/800x600/2b7286a31eca5ee4b452d8d15ee9cfca0ef70c543bbf149d3d1737bb46f1cd91/image.jpg",
    beds: 4,
    baths: 2,
    sqft: 3500,
    garage: 2,
    features: ["Large Land", "Private Setting", "Quality Build"],
    soldDate: "9 months ago",
    daysOnMarket: 31,
  },
  {
    id: 5,
    slug: "26-hepburn-street-greenbank",
    category: "sold" as Category,
    title: "26 Hepburn Street",
    location: "Greenbank, QLD",
    price: 890000,
    soldPrice: 890000,
    image:
      "https://i2.au.reastatic.net/800x600/d744995f1cbc8af65653e6d4aa19cb9e7ecf1c6d72fe8d0bdf95a18d169e6b5b/image.jpg",
    beds: 4,
    baths: 2,
    sqft: 2900,
    garage: 2,
    features: ["Spacious Yard", "Quiet Street", "Family Friendly"],
    soldDate: "9 months ago",
    daysOnMarket: 14,
  },
  {
    id: 6,
    slug: "32-highbury-court-greenbank",
    category: "sold" as Category,
    title: "32 Highbury Court",
    location: "Greenbank, QLD",
    price: 880000,
    soldPrice: 880000,
    image:
      "https://i2.au.reastatic.net/800x600/1030bd2599d6aa18e29d450d345df4c33777979576e283b9256c0e877683d823/image.jpg",
    beds: 4,
    baths: 2,
    sqft: 2800,
    garage: 2,
    features: ["Cul-de-Sac", "Modern Kitchen", "Family Home"],
    soldDate: "10 months ago",
    daysOnMarket: 18,
  },
  {
    id: 7,
    slug: "66-greenhaven-circuit-narangba",
    category: "sold" as Category,
    title: "66 Greenhaven Circuit",
    location: "Narangba, QLD",
    price: 770000,
    soldPrice: 770000,
    image:
      "https://i2.au.reastatic.net/800x600/0b984c985a3e5b0ef241e068254ab5e4a4808f68a41783687b3fee05e70c3aa0/image.jpg",
    beds: 3,
    baths: 2,
    sqft: 2100,
    garage: 2,
    features: ["Modern Home", "Low Maintenance", "Great Suburb"],
    soldDate: "11 months ago",
    daysOnMarket: 25,
  },
  {
    id: 8,
    slug: "60-pinnacle-circuit-heathwood",
    category: "sold" as Category,
    title: "60 Pinnacle Circuit",
    location: "Heathwood, QLD",
    price: 1040000,
    soldPrice: 1040000,
    image:
      "https://i2.au.reastatic.net/800x600/48baee38f613ec6cb38fc75249b7bbf866cc276446fd318df6965a4a7dc25905/image.png",
    beds: 4,
    baths: 2,
    sqft: 3400,
    garage: 4,
    features: ["4 Car Garage", "Premium Suburb", "Spacious Home"],
    soldDate: "12 months ago",
    daysOnMarket: 16,
  },
  {
    id: 9,
    slug: "10-redcomb-drive-park-ridge",
    category: "sold" as Category,
    title: "10 Redcomb Drive",
    location: "Park Ridge, QLD",
    price: 600000,
    soldPrice: 600000,
    image:
      "https://i2.au.reastatic.net/800x600/4fb818eeb10863afd6ca1917e70ff45bd9d582197413fb5e2808dd86c4019fe4/image.jpg",
    beds: 0,
    baths: 0,
    sqft: 10764,
    garage: 0,
    features: ["Residential Land", "Development Opportunity", "Park Ridge"],
    soldDate: "6 weeks ago",
    daysOnMarket: 35,
  },
  {
    id: 10,
    slug: "lot-834-south-maclean",
    category: "sold" as Category,
    title: "Lot 834, 95 Endeavour Cct",
    location: "South Maclean, QLD",
    price: 400000,
    soldPrice: 400000,
    image:
      "https://i2.au.reastatic.net/800x600/ba08c62e76942997fbdd47bfd377286a87bf0a8badd2980dded2059e9d568532/image.jpg",
    beds: 0,
    baths: 0,
    sqft: 8073,
    garage: 0,
    features: ["Residential Land", "New Estate", "Build Your Dream Home"],
    soldDate: "6 months ago",
    daysOnMarket: 28,
  },

  // ── For Sale ──────────────────────────────────────────────────────────────
  {
    id: 11,
    slug: "14-lakeview-crescent-forest-lake",
    category: "for-sale" as Category,
    title: "14 Lakeview Crescent",
    location: "Forest Lake, QLD",
    price: 875000,
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80",
    beds: 4,
    baths: 2,
    sqft: 2950,
    garage: 2,
    features: ["Lake Views", "Solar Panels", "Alfresco"],
    badge: "For Sale",
    isNew: true,
    views: 142,
  },
  {
    id: 12,
    slug: "8-harmony-place-ripley",
    category: "for-sale" as Category,
    title: "8 Harmony Place",
    location: "Ripley, QLD",
    price: 749000,
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
    beds: 4,
    baths: 2,
    sqft: 2600,
    garage: 2,
    features: ["New Build", "Modern Kitchen", "Large Backyard"],
    badge: "New Listing",
    isNew: true,
    views: 98,
  },
  {
    id: 13,
    slug: "22-settlers-drive-springfield-lakes",
    category: "for-sale" as Category,
    title: "22 Settlers Drive",
    location: "Springfield Lakes, QLD",
    price: 1050000,
    image:
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80",
    beds: 5,
    baths: 3,
    sqft: 3800,
    garage: 2,
    features: ["Pool", "Theatre Room", "Triple Garage"],
    badge: "Premium",
    views: 211,
  },

  // ── For Rent ──────────────────────────────────────────────────────────────
  {
    id: 14,
    slug: "5-parkside-close-greenbank-rent",
    category: "for-rent" as Category,
    title: "5 Parkside Close",
    location: "Greenbank, QLD",
    price: 2600,
    image:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
    beds: 4,
    baths: 2,
    sqft: 2750,
    garage: 2,
    features: ["Air Conditioning", "Large Yard", "Pets Considered"],
    badge: "Available Now",
    deposit: 5200,
    minLease: "12 months",
  },
  {
    id: 15,
    slug: "3-sunridge-court-ripley-rent",
    category: "for-rent" as Category,
    title: "3 Sunridge Court",
    location: "Ripley, QLD",
    price: 2200,
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    beds: 3,
    baths: 2,
    sqft: 2100,
    garage: 2,
    features: ["Modern Finishes", "NBN Ready", "Close to Schools"],
    badge: "Available Now",
    deposit: 4400,
    minLease: "12 months",
  },
  {
    id: 16,
    slug: "12-ironbark-street-narangba-rent",
    category: "for-rent" as Category,
    title: "12 Ironbark Street",
    location: "Narangba, QLD",
    price: 1950,
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    beds: 3,
    baths: 1,
    sqft: 1800,
    garage: 1,
    features: ["Fully Fenced", "Garden Shed", "Quiet Street"],
    badge: "Utilities Included",
    deposit: 3900,
    minLease: "6 months",
  },
];

const filterTabs = [
  { id: "for-sale", label: "For Sale", icon: Tag, count: 3 },
  { id: "sold", label: "Sold", icon: CheckCircle, count: 10 },
  { id: "for-rent", label: "For Rent", icon: Key, count: 3 },
];

const PropertyListingSection = () => {
  const [activeFilter, setActiveFilter] = useState<Category | "*">("for-sale");
  const [displayedFilter, setDisplayedFilter] = useState<Category | "*">(
    "for-sale",
  );
  const [isExiting, setIsExiting] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const filterTabsRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const pillInitialized = useRef(false);

  useLayoutEffect(() => {
    const container = filterTabsRef.current;
    const pill = pillRef.current;
    if (!container || !pill) return;
    const activeBtn =
      container.querySelector<HTMLElement>(".filter-tab.active");
    if (!activeBtn) return;

    if (!pillInitialized.current) {
      gsap.set(pill, {
        left: activeBtn.offsetLeft,
        width: activeBtn.offsetWidth,
      });
      pillInitialized.current = true;
    } else {
      gsap.to(pill, {
        left: activeBtn.offsetLeft,
        width: activeBtn.offsetWidth,
        duration: 0.38,
        ease: "expo.out",
        overwrite: "auto",
      });
    }
  }, [activeFilter]);

  useEffect(() => {
    const cards =
      gridRef.current?.querySelectorAll<HTMLElement>(".property-card");
    if (!cards?.length) return;

    gsap.set(cards, { clipPath: "inset(100% 0 0 0)", willChange: "clip-path" });

    ScrollTrigger.create({
      trigger: gridRef.current,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(cards, {
          clipPath: "inset(0% 0 0 0)",
          duration: 1.2,
          ease: "power3.inOut",
          stagger: 0.12,
          onComplete: () => {
            gsap.set(cards, { clearProps: "will-change,clip-path" });
          },
        });
      },
    });
  }, []);

  const displayed =
    displayedFilter === "*"
      ? propertiesData.reduce<typeof propertiesData>((acc, p) => {
          const count = acc.filter(
            (item) => item.category === p.category,
          ).length;
          if (count < 3) acc.push(p);
          return acc;
        }, [])
      : propertiesData
          .filter((p) => p.category === displayedFilter)
          .slice(0, 3);

  const handleFilterChange = (filter: Category | "*") => {
    if (filter === activeFilter || isExiting) return;
    setActiveFilter(filter);
    setIsExiting(true);
    setTimeout(() => {
      setDisplayedFilter(filter);
      setIsExiting(false);
    }, 280);
  };

  return (
    <section className="property-section">
      <div className="property-container">
        <header className="section-header">
          <div className="section-badge" data-gsap="fade-up">
            <Building2 size={16} />
            <span>Prime Listings</span>
          </div>
          <h2
            className="section-title"
            data-gsap="char-reveal"
            data-gsap-start="top 85%"
          >
            Discover Your <em>Dream Home</em>
          </h2>
          <p
            className="section-subtitle"
            data-gsap="fade-up"
            data-gsap-delay="0.15"
          >
            Explore our handpicked collection of premium properties designed for
            modern living
          </p>
        </header>

        <div
          className="filter-wrapper"
          data-gsap="fade-up"
          data-gsap-delay="0.1"
        >
          <div
            ref={filterTabsRef}
            className="filter-tabs"
            data-gsap="fade-right"
            data-gsap-stagger="0.09"
            data-gsap-delay="0.25"
          >
            <div ref={pillRef} className="filter-pill" />
            <button
              onClick={() => handleFilterChange("*")}
              className={`filter-tab ${activeFilter === "*" ? "active" : ""}`}
            >
              <span>All</span>
            </button>
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleFilterChange(tab.id as Category)}
                className={`filter-tab ${activeFilter === tab.id ? "active" : ""}`}
              >
                <tab.icon size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div
          ref={gridRef}
          key={displayedFilter}
          className={`property-grid ${isExiting ? "grid-exiting" : "grid-entering"}`}
        >
          {displayed.map((property, index) => (
            <div key={property.id} className="property-card-wrap">
              <PropertyCard property={property} cardIndex={index} />
            </div>
          ))}
        </div>

        <div
          key={`swiper-${displayedFilter}`}
          className={`property-swiper-wrapper ${isExiting ? "swiper-exiting" : "swiper-entering"}`}
        >
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={16}
            slidesPerView={1.15}
            centeredSlides={false}
            grabCursor={true}
            speed={420}
            pagination={{ clickable: true, dynamicBullets: true }}
            navigation={{
              prevEl: ".swiper-btn-prev",
              nextEl: ".swiper-btn-next",
            }}
            breakpoints={{
              480: { slidesPerView: 1.3, spaceBetween: 20 },
              640: { slidesPerView: 1.8, spaceBetween: 24 },
            }}
            className="property-swiper"
          >
            {displayed.map((property, index) => (
              <SwiperSlide key={property.id}>
                <div
                  className="property-card-wrap"
                  data-gsap-mobile="slide-right"
                  data-gsap-start="top 70%"
                  data-gsap-duration="0.5"
                  data-gsap-ease="none"
                >
                  <PropertyCard property={property} cardIndex={index} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="swiper-nav" data-gsap-mobile="fade-up">
            <button
              className="swiper-btn swiper-btn-prev"
              aria-label="Previous"
            >
              <ArrowLeft size={20} />
            </button>
            <button className="swiper-btn swiper-btn-next" aria-label="Next">
              <ArrowRight size={20} />
            </button>
          </div>
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

        <div
          className="stats-bar"
          data-gsap="clip-smooth-down"
          data-gsap-start="top 88%"
        >
          <div className="listing-cta">
            <div className="listing-cta__copy">
              <div className="listing-cta__badge" data-gsap="fade-up">
                <Building2 size={20} />
                <span>Expression of Interest</span>
              </div>
              <h3
                className="listing-cta__title"
                data-gsap="char-reveal"
                data-gsap-start="top 88%"
              >
                Ready to make an offer on a property you love?
              </h3>
              <p
                className="listing-cta__text"
                data-gsap="fade-up"
                data-gsap-delay="0.14"
              >
                Complete our full Expression of Interest form with the exact
                buyer, offer, condition, and solicitor details needed for a
                clean review.
              </p>
            </div>

            <Link
              to="/expressions-of-interest"
              className="listing-cta__button"
              data-gsap="btn-clip-reveal"
              data-gsap-delay="0.2"
            >
              <span>Open the Form</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertyListingSection;
