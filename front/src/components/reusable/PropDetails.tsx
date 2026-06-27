import React, { useState, useEffect, useCallback, useRef } from "react";
import ReCaptchaV2, { type ReCaptchaV2Handle, RECAPTCHA_ENABLED } from "./ReCaptchaV2";
import "./PropDetails.css";
import { submitPropertyEnquiry } from "../../lib/api/forms";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PropertyImage  { url: string; alt: string; }
interface PropertyFeature {
  icon: "smart-home"|"kitchen"|"ocean"|"wine"|"pool"|"dock"|"theater"|"gym"|"security"|"garden"|"spa"|"garage";
  title: string; description: string;
}
interface PropertyDetail { label: string; value: string; }
interface PropertyStat   { icon: "bed"|"bath"|"area"|"garage"|"year"|"lot"; value: string; label: string; }
interface NearbyLocation { name: string; distance: string;
  type: "shopping"|"airport"|"dining"|"golf"|"beach"|"school"|"hospital"; }
interface Agent { name: string; title: string; image: string; phone: string; email: string; rating: number; reviewCount: number; }

interface PropertyData {
  id: string; title: string; address: string; city: string; state: string; zipCode: string;
  price: number; priceLabel?: string; status: "For Sale"|"For Rent"|"Sold"|"Pending";
  featured?: boolean; images: PropertyImage[]; stats: PropertyStat[];
  overview: string[]; features: PropertyFeature[]; details: PropertyDetail[];
  mapEmbedUrl?: string; nearbyLocations: NearbyLocation[];
  videoTourUrl?: string; videoThumbnail?: string; agent: Agent;
  floorplans?: PropertyImage[];
}

interface PropDetailProps {
  property: PropertyData;
  onContactSubmit?: (data: ContactFormData) => void;
}

interface ContactFormData { name: string; email: string; phone: string; message: string; propertyId: string; }

// ─── Icons ────────────────────────────────────────────────────────────────────

const Icons = {
  bed:          () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 20V8l10-6 10 6v12"/><path d="M6 20V12h12v8"/></svg>,
  bath:         () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1z"/><circle cx="18" cy="6" r="3"/></svg>,
  area:         () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>,
  garage:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  year:         () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  lot:          () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  "smart-home": () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3"/></svg>,
  kitchen:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M4 10h16M12 10v12M8 6h.01M12 6h.01M16 6h.01"/></svg>,
  ocean:        () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 12c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0 3.5 2 5 0"/><path d="M2 17c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0 3.5 2 5 0"/><circle cx="12" cy="6" r="3"/></svg>,
  wine:         () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 22h8M12 15v7M5.2 9.4c-.9 2.5.3 5.3 2.8 6.4 1.3.5 2.6.5 3.9.1 1.3-.4 2.5-1.3 3.2-2.5.7-1.2.9-2.6.6-4L14 2H9.9L8.1 9.4z"/></svg>,
  pool:         () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 12c1.5-1.5 3.5-1.5 5 0s3.5 1.5 5 0 3.5-1.5 5 0 3.5 1.5 5 0"/><path d="M2 17c1.5-1.5 3.5-1.5 5 0s3.5 1.5 5 0 3.5-1.5 5 0 3.5 1.5 5 0"/><path d="M9 8V5a3 3 0 1 1 6 0v3"/></svg>,
  dock:         () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 19l2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2"/><path d="M12 5l-6 9h12l-6-9z"/><path d="M12 14v5"/></svg>,
  theater:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="12" rx="2"/><path d="M8 20h8M12 16v4"/><path d="M9 9l4 2-4 2V9z"/></svg>,
  gym:          () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6.5 6.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M2 22l2-9 4 1v-4l-3-4 2-1 5 5v13"/><path d="M18 12h4M18 12v4M22 8v8"/></svg>,
  security:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>,
  garden:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22V8"/><path d="M5 12c0-5 7-10 7-10s7 5 7 10c0 4-3.5 7-7 7s-7-3-7-7z"/></svg>,
  spa:          () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v2M12 16v2M6 12h2M16 12h2"/><circle cx="12" cy="12" r="4"/></svg>,
  location:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  star:         () => <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  phone:        () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  mail:         () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  arrow:        () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  chevronLeft:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>,
  chevronRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>,
  camera:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  play:         () => <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/><polygon points="10 8 16 12 10 16 10 8"/></svg>,
  close:        () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>,
  share:        () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatPrice = (price: number): string =>
  new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(price);

// ─── Hero ─────────────────────────────────────────────────────────────────────

const PropertyHero: React.FC<{
  images: PropertyImage[]; title: string; fullAddress: string;
  price: number; priceLabel?: string; status: string; featured?: boolean;
  stats: PropertyStat[];
}> = ({ images, title, fullAddress, price, priceLabel, status, featured, stats }) => {
  const bgImage = images[0]?.url || "";
  const numericPrice = price > 0 ? formatPrice(price) : null;
  const displayPrice = numericPrice || priceLabel || "Contact Agent";
  const heroStats = stats.slice(0, 4);

  return (
    <section className="pd-hero" style={bgImage ? { backgroundImage: `url(${bgImage})` } : {}}>
      <div className="pd-hero__overlay" />

      <div className="pd-hero__content">
        <div className="pd-hero__badges">
          <span className={`pd-badge ${status === "Sold" ? "pd-badge--red" : status === "Pending" ? "pd-badge--amber" : "pd-badge--glass"}`}>
            {status}
          </span>
          {featured && <span className="pd-badge pd-badge--gold">Featured</span>}
        </div>

        <h1 className="pd-hero__title">{title}</h1>

        <p className="pd-hero__address">
          <Icons.location />
          <span>{fullAddress}</span>
        </p>

        <div className="pd-hero__price">{displayPrice}</div>
      </div>

      {heroStats.length > 0 && (
        <div className="pd-hero__statsbar">
          {heroStats.map((s, i) => {
            const Ic = Icons[s.icon] as (() => React.ReactElement) | undefined;
            return (
              <div key={i} className="pd-hero__stat">
                {Ic && <Ic />}
                <div>
                  <span className="pd-hero__stat-val">{s.value}</span>
                  <span className="pd-hero__stat-lbl">{s.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

// ─── Gallery ─────────────────────────────────────────────────────────────────

const GallerySection: React.FC<{ images: PropertyImage[] }> = ({ images }) => {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const touchStartX = useRef(0);

  const close = useCallback(() => setLightboxIdx(null), []);
  const prev  = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIdx(i => i !== null ? (i - 1 + images.length) % images.length : 0);
  }, [images.length]);
  const next  = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIdx(i => i !== null ? (i + 1) % images.length : 0);
  }, [images.length]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) < 40) return;
    setLightboxIdx(i => {
      if (i === null) return i;
      return diff > 0
        ? (i + 1) % images.length
        : (i - 1 + images.length) % images.length;
    });
  }, [images.length]);

  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")      close();
      if (e.key === "ArrowLeft")   setLightboxIdx(i => i !== null ? (i - 1 + images.length) % images.length : 0);
      if (e.key === "ArrowRight")  setLightboxIdx(i => i !== null ? (i + 1) % images.length : 0);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIdx, images.length, close]);

  if (images.length <= 1) return null;

  const mosaic     = images.slice(0, 5);
  const sideGrid   = mosaic.slice(1);
  const extraCount = Math.max(0, images.length - 5);
  const open = (idx: number) => setLightboxIdx(idx);

  return (
    <section className="pd-gallery">
      <div className="pd-gallery__wrap">
        {/* Main large image */}
        <div className="pd-gallery__main" onClick={() => open(0)} role="button" tabIndex={0} aria-label="Open gallery">
          <img src={mosaic[0].url} alt={mosaic[0].alt || "Property photo"} />
        </div>

        {/* 2×2 side thumbnails */}
        {sideGrid.length > 0 && (
          <div className={`pd-gallery__side pd-gallery__side--${Math.min(sideGrid.length, 4)}`}>
            {sideGrid.slice(0, 4).map((img, i) => {
              const isLast = i === Math.min(sideGrid.length, 4) - 1 && extraCount > 0;
              return (
                <div key={i} className="pd-gallery__thumb" onClick={() => open(i + 1)} role="button" tabIndex={0} aria-label={`Photo ${i + 2}`}>
                  <img src={img.url} alt={img.alt || `Property photo ${i + 2}`} />
                  {isLast && (
                    <div className="pd-gallery__more">
                      <span>+{extraCount}</span>
                      <small>more photos</small>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="pd-gallery__foot">
        <button className="pd-gallery__viewall" onClick={() => open(0)}>
          <Icons.camera />
          View all {images.length} photos
        </button>
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div
          className="pd-lightbox"
          onClick={close}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          role="dialog"
          aria-modal="true"
        >
          <button className="pd-lightbox__close" onClick={close} aria-label="Close"><Icons.close /></button>
          <button className="pd-lightbox__nav pd-lightbox__nav--prev" onClick={prev} aria-label="Previous"><Icons.chevronLeft /></button>
          <div className="pd-lightbox__wrap" onClick={e => e.stopPropagation()}>
            <img src={images[lightboxIdx].url} alt={images[lightboxIdx].alt || "Property photo"} />
          </div>
          <button className="pd-lightbox__nav pd-lightbox__nav--next" onClick={next} aria-label="Next"><Icons.chevronRight /></button>
          <div className="pd-lightbox__counter">{lightboxIdx + 1} / {images.length}</div>
        </div>
      )}
    </section>
  );
};

// ─── Section heading helper ────────────────────────────────────────────────────

const SectionHead: React.FC<{ eyebrow: string; title: string }> = ({ title }) => (
  <div className="pd-sechead">
    <h2 className="pd-sechead__title">{title}</h2>
  </div>
);

// ─── Details Grid ─────────────────────────────────────────────────────────────

const DetailsGrid: React.FC<{ details: PropertyDetail[] }> = ({ details }) => {
  const filtered = details.filter(d => d.value?.trim());
  if (!filtered.length) return null;
  return (
    <dl className="pd-specs">
      {filtered.map((d, i) => (
        <div key={i} className="pd-specs__row">
          <dt>{d.label}</dt>
          <dd>{d.value}</dd>
        </div>
      ))}
    </dl>
  );
};

// ─── Features ─────────────────────────────────────────────────────────────────

const FeaturesGrid: React.FC<{ features: PropertyFeature[] }> = ({ features }) => (
  <div className="pd-amenities">
    {features.map((f, i) => {
      const Ic = Icons[f.icon] as (() => React.ReactElement) | undefined;
      return (
        <div key={i} className="pd-amenity">
          <div className="pd-amenity__icon">{Ic && <Ic />}</div>
          <div className="pd-amenity__body">
            <h4 className="pd-amenity__name">{f.title}</h4>
            {f.description && <p className="pd-amenity__desc">{f.description}</p>}
          </div>
        </div>
      );
    })}
  </div>
);

// ─── Location ─────────────────────────────────────────────────────────────────

const LocationSection: React.FC<{
  mapEmbedUrl?: string; nearbyLocations: NearbyLocation[]; address: string;
}> = ({ mapEmbedUrl, nearbyLocations, address }) => {
  const mapUrl = mapEmbedUrl || `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
  return (
    <div className="pd-location">
      <div className="pd-map">
        <iframe src={mapUrl} title={`Map of ${address}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      </div>
      {nearbyLocations.length > 0 && (
        <div className="pd-nearby">
          <p className="pd-nearby__label">Nearby</p>
          <div className="pd-nearby__grid">
            {nearbyLocations.map((loc, i) => (
              <div key={i} className="pd-nearby__item">
                <Icons.location />
                <span className="pd-nearby__name">{loc.name}</span>
                <span className="pd-nearby__dist">{loc.distance}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Video ────────────────────────────────────────────────────────────────────

const VideoSection: React.FC<{ videoUrl?: string; thumbnail?: string }> = ({ videoUrl, thumbnail }) => {
  const resolveEmbed = (url?: string) => {
    if (!url) return undefined;
    const yt = url.match(/youtu\.be\/([A-Za-z0-9_-]+)/) || url.match(/[?&]v=([A-Za-z0-9_-]+)/);
    if (yt?.[1]) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1&mute=1`;
    return url;
  };
  const src = resolveEmbed(videoUrl);
  return (
    <div className="pd-video">
      {src ? (
        <iframe src={src} title="Virtual Tour" allow="autoplay; fullscreen" allowFullScreen />
      ) : (
        <div className="pd-video__placeholder" style={thumbnail ? { backgroundImage: `url(${thumbnail})` } : {}}>
          <div className="pd-video__play"><Icons.play /></div>
          <span>Virtual Tour Coming Soon</span>
        </div>
      )}
    </div>
  );
};

// ─── Enquiry Card ─────────────────────────────────────────────────────────────

const EnquiryCard: React.FC<{
  agent: Agent; propertyId: string; propertyTitle?: string; onSubmit?: (d: ContactFormData) => void;
}> = ({ agent, propertyId, propertyTitle, onSubmit }) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const recaptchaRef = useRef<ReCaptchaV2Handle>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (RECAPTCHA_ENABLED && !recaptchaToken) {
      setError("Please complete the reCAPTCHA.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await submitPropertyEnquiry({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        message: form.message || undefined,
        property_id: propertyId,
        property_title: propertyTitle,
        agent_name: agent.name || undefined,
        recaptcha_token: recaptchaToken,
        website: "",
      });
      onSubmit?.({ ...form, propertyId });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      recaptchaRef.current?.reset();
      setRecaptchaToken("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pd-enquiry" id="pd-enquiry-anchor">
      <div className="pd-enquiry__agent">
        {agent.image ? (
          <img src={agent.image} alt={agent.name} className="pd-enquiry__avatar" />
        ) : (
          <div className="pd-enquiry__avatar pd-enquiry__avatar--init">{agent.name.charAt(0)}</div>
        )}
        <div>
          <strong className="pd-enquiry__name">{agent.name || "Our Agent"}</strong>
          <span className="pd-enquiry__role">{agent.title || "Property Specialist"}</span>
        </div>
      </div>

      <div className="pd-enquiry__contacts">
        {agent.phone && (
          <a href={`tel:${agent.phone}`} className="pd-enquiry__btn pd-enquiry__btn--primary">
            <Icons.phone />{agent.phone}
          </a>
        )}
        {agent.email && (
          <a href={`mailto:${agent.email}`} className="pd-enquiry__btn">
            <Icons.mail />{agent.email}
          </a>
        )}
      </div>

      <div className="pd-enquiry__divider"><span>Send a message</span></div>

      {sent ? (
        <div className="pd-enquiry__success">
          <div className="pd-enquiry__success-icon" aria-hidden="true">
            <svg viewBox="0 0 52 52" fill="none">
              <circle cx="26" cy="26" r="25" stroke="currentColor" strokeWidth="2"/>
              <path d="M14 27l8 8 16-16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <strong className="pd-enquiry__success-title">Enquiry Sent!</strong>
          <p className="pd-enquiry__success-text">Thank you — one of our agents will be in touch with you shortly.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="pd-form">
          <div className="pd-form__row">
            <div className="pd-form__field">
              <label>Name</label>
              <input type="text" name="name" placeholder="Your name" value={form.name} onChange={onChange} required />
            </div>
            <div className="pd-form__field">
              <label>Phone</label>
              <input type="tel" name="phone" placeholder="0400 000 000" value={form.phone} onChange={onChange} />
            </div>
          </div>
          <div className="pd-form__field">
            <label>Email</label>
            <input type="email" name="email" placeholder="you@email.com" value={form.email} onChange={onChange} required />
          </div>
          <div className="pd-form__field">
            <label>Message</label>
            <textarea name="message" rows={3} placeholder="I'd like to enquire about this property…" value={form.message} onChange={onChange} />
          </div>
          {/* Honeypot — hidden from real users, filled by bots */}
          <input
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            defaultValue=""
            style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, pointerEvents: "none" }}
          />

          <ReCaptchaV2
            ref={recaptchaRef}
            onVerify={setRecaptchaToken}
            onExpire={() => setRecaptchaToken("")}
          />

          {error && <p className="pd-enquiry__error">{error}</p>}
          <button type="submit" className="pd-form__submit" disabled={submitting || (RECAPTCHA_ENABLED && !recaptchaToken)}>
            {submitting ? "Sending…" : <><span>Send Enquiry</span> <Icons.arrow /></>}
          </button>
        </form>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const PropDetail: React.FC<PropDetailProps> = ({
  property, onContactSubmit,
}) => {
  const fullAddress = [property.address, property.city, property.state, property.zipCode]
    .filter(Boolean).join(", ");
  const videoThumbnail = property.videoThumbnail || property.images[0]?.url;
  const showVideo  = Boolean(property.videoTourUrl);
  const hasFeatures = property.features.length > 0;
  const hasDetails  = property.details.some(d => d.value?.trim());
  const hasOverview = property.overview.some(p => p.trim());
  const numericPrice = property.price > 0 ? formatPrice(property.price) : null;
  const displayPrice = numericPrice || property.priceLabel || "Contact Agent";

  return (
    <div className="pd-root">

      {/* 1 — Hero */}
      <PropertyHero
        images={property.images}
        title={property.title}
        fullAddress={fullAddress}
        price={property.price}
        priceLabel={property.priceLabel}
        status={property.status}
        featured={property.featured}
        stats={property.stats}
      />

      {/* 2 — Gallery */}
      <GallerySection images={property.images} />

      {/* 3 — Body: content + sidebar */}
      <div className="pd-body">
        <div className="pd-layout">

          {/* Left content column */}
          <div className="pd-content">

            {hasOverview && (
              <section className="pd-card">
                <SectionHead eyebrow="About This Property" title="Overview" />
                <div className="pd-overview">
                  {property.overview.map((para, i) => <p key={i}>{para}</p>)}
                </div>
              </section>
            )}

            {hasDetails && (
              <section className="pd-card">
                <SectionHead eyebrow="Specifications" title="Property Details" />
                <DetailsGrid details={property.details} />
              </section>
            )}

            {hasFeatures && (
              <section className="pd-card">
                <SectionHead eyebrow="What's Included" title="Features & Amenities" />
                <FeaturesGrid features={property.features} />
              </section>
            )}

            <section className="pd-card">
              <SectionHead eyebrow="Location" title="Location & Surrounds" />
              <LocationSection
                mapEmbedUrl={property.mapEmbedUrl}
                nearbyLocations={property.nearbyLocations}
                address={fullAddress}
              />
            </section>

            {property.floorplans && property.floorplans.length > 0 && (
              <section className="pd-card">
                <SectionHead eyebrow="Floor Plans" title="Floorplans" />
                <div className="pd-floorplans">
                  {property.floorplans.map((fp, i) => (
                    <img key={i} src={fp.url} alt={fp.alt || `Floorplan ${i + 1}`} className="pd-floorplan__img" />
                  ))}
                </div>
              </section>
            )}

            {showVideo && (
              <section className="pd-card">
                <SectionHead eyebrow="Tour" title="Virtual Tour" />
                <VideoSection videoUrl={property.videoTourUrl} thumbnail={videoThumbnail} />
              </section>
            )}

            {/* Price card — bottom of content column */}
            <div className="pd-price-card">
              <div className="pd-price-card__top">
                <span className="pd-price-card__status">{property.status}</span>
                <div className="pd-price-card__amount">{displayPrice}</div>
                {property.priceLabel && numericPrice && property.priceLabel !== numericPrice && (
                  <div className="pd-price-card__note">{property.priceLabel}</div>
                )}
              </div>

              {property.stats.length > 0 && (
                <div className="pd-price-card__stats">
                  {property.stats.slice(0, 4).map((s, i) => {
                    const Ic = Icons[s.icon] as (() => React.ReactElement) | undefined;
                    return (
                      <div key={i} className="pd-price-card__stat">
                        <div className="pd-price-card__stat-icon">{Ic && <Ic />}</div>
                        <div className="pd-price-card__stat-body">
                          <strong>{s.value}</strong>
                          <span>{s.label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="pd-price-card__actions">
                <a
                  href={property.agent.phone ? `tel:${property.agent.phone}` : undefined}
                  className="pd-price-card__cta pd-price-card__cta--primary"
                  onClick={e => {
                    if (!property.agent.phone) {
                      e.preventDefault();
                      document.getElementById("pd-enquiry-anchor")?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                >
                  <Icons.phone />
                  {property.agent.phone || "Schedule a Viewing"}
                </a>
                <button
                  className="pd-price-card__cta pd-price-card__cta--outline"
                  onClick={() => window.print()}
                >
                  <Icons.share />
                  Share
                </button>
              </div>
            </div>
          </div>

          {/* Right sticky sidebar */}
          <aside className="pd-sidebar">
            <EnquiryCard agent={property.agent} propertyId={property.id} propertyTitle={property.title} onSubmit={onContactSubmit} />
          </aside>
        </div>
      </div>


    </div>
  );
};

export default PropDetail;
export type {
  PropertyData, PropertyImage, PropertyFeature, PropertyDetail,
  PropertyStat, NearbyLocation, Agent, PropDetailProps, ContactFormData,
};
