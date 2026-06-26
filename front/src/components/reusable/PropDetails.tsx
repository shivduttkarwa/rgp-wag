import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "./PropDetails.css";
import RgButton from "./RgButton";

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
}

interface PropDetailProps {
  property: PropertyData;
  onContactSubmit?: (data: ContactFormData) => void;
  onSaveProperty?: () => void;
  onShareProperty?: () => void;
  onScheduleViewing?: () => void;
  onDownloadBrochure?: () => void;
}

interface ContactFormData { name: string; email: string; phone: string; message: string; propertyId: string; }

// ─── Icons ───────────────────────────────────────────────────────────────────

const Icons = {
  bed:        () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 20V8l10-6 10 6v12"/><path d="M6 20V12h12v8"/></svg>,
  bath:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1z"/><circle cx="18" cy="6" r="3"/></svg>,
  area:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>,
  garage:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  year:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  lot:        () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  "smart-home": () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3"/></svg>,
  kitchen:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M4 10h16M12 10v12M8 6h.01M12 6h.01M16 6h.01"/></svg>,
  ocean:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 12c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0 3.5 2 5 0"/><path d="M2 17c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0 3.5 2 5 0"/><circle cx="12" cy="6" r="3"/></svg>,
  wine:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 22h8M12 15v7M5.2 9.4c-.9 2.5.3 5.3 2.8 6.4 1.3.5 2.6.5 3.9.1 1.3-.4 2.5-1.3 3.2-2.5.7-1.2.9-2.6.6-4L14 2H9.9L8.1 9.4z"/></svg>,
  pool:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 12c1.5-1.5 3.5-1.5 5 0s3.5 1.5 5 0 3.5-1.5 5 0 3.5 1.5 5 0"/><path d="M2 17c1.5-1.5 3.5-1.5 5 0s3.5 1.5 5 0 3.5-1.5 5 0 3.5 1.5 5 0"/><path d="M9 8V5a3 3 0 1 1 6 0v3"/></svg>,
  dock:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 19l2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2"/><path d="M12 5l-6 9h12l-6-9z"/><path d="M12 14v5"/></svg>,
  theater:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="12" rx="2"/><path d="M8 20h8M12 16v4"/><path d="M9 9l4 2-4 2V9z"/></svg>,
  gym:        () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6.5 6.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M2 22l2-9 4 1v-4l-3-4 2-1 5 5v13"/><path d="M18 12h4M18 12v4M22 8v8"/></svg>,
  security:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>,
  garden:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22V8"/><path d="M5 12c0-5 7-10 7-10s7 5 7 10c0 4-3.5 7-7 7s-7-3-7-7z"/></svg>,
  spa:        () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v2M12 16v2M6 12h2M16 12h2"/><circle cx="12" cy="12" r="4"/></svg>,
  location:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  star:       () => <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  phone:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  mail:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  arrow:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  chevronLeft:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>,
  chevronRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>,
  camera:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  play:       () => <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/><polygon points="10 8 16 12 10 16 10 8"/></svg>,
  close:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>,
  clock:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatPrice = (price: number): string =>
  new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(price);

// ─── Hero (100vh, classic editorial) ─────────────────────────────────────────

const PropertyHero: React.FC<{
  images: PropertyImage[]; title: string; fullAddress: string;
  price: number; priceLabel?: string; status: string; featured?: boolean;
  stats: PropertyStat[];
}> = ({ images, title, fullAddress, price, priceLabel, status, featured, stats }) => {
  const bgImage = images[0]?.url || "";

  // Always show the numeric price as the primary display. Only show priceLabel
  // as a secondary note when it contains price context (offers, range, etc.)
  const numericPrice = price > 0 ? formatPrice(price) : null;
  const looksLikePrice = priceLabel && /\$|contact|offer|from|over|range|to/i.test(priceLabel);
  const priceNote = looksLikePrice ? priceLabel : null;
  const displayPrice = numericPrice || priceLabel || "Contact Agent";

  const heroStats = stats.slice(0, 4);

  return (
    <section className="pd-hero" style={bgImage ? { backgroundImage: `url(${bgImage})` } : {}}>
      <div className="pd-hero__overlay" />

      {/* Back link — just below header */}
      <RgButton
        to="/properties"
        variant="blue"
        label="Back"
        startIcon={<Icons.chevronLeft />}
        withArrow={false}
        className="pd-hero__back"
      />


      {/* Classic content block — bottom left */}
      <div className="pd-hero__content">
        {/* Status row */}
        <div className="pd-hero__status-row">
          <span className="pd-hero__status">{status}</span>
          {featured && <span className="pd-hero__featured-dot" />}
          {featured && <span className="pd-hero__status pd-hero__status--gold">Featured Listing</span>}
        </div>

        {/* Thin rule */}
        <div className="pd-hero__rule" />

        {/* Title — italic serif, restrained size */}
        <h1 className="pd-hero__title">{title}</h1>

        {/* Address */}
        <p className="pd-hero__address">
          <Icons.location />
          <span>{fullAddress}</span>
        </p>

        {/* Price */}
        <div className="pd-hero__price-block">
          <span className="pd-hero__price-amount">{displayPrice}</span>
          {priceNote && numericPrice && priceNote !== numericPrice && (
            <span className="pd-hero__price-note">{priceNote}</span>
          )}
        </div>
      </div>

      {/* Stats bar */}
      {heroStats.length > 0 && (
        <div className="pd-hero__stats-bar">
          <div className="pd-hero__stats-inner">
            {heroStats.map((s, i) => {
              const Ic = Icons[s.icon] as (() => React.ReactElement) | undefined;
              return (
                <div key={i} className="pd-hero__chip">
                  {Ic && <Ic />}
                  <div className="pd-hero__chip-text">
                    <span className="pd-hero__chip-val">{s.value}</span>
                    <span className="pd-hero__chip-lbl">{s.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

// ─── Gallery ─────────────────────────────────────────────────────────────────

const GallerySection: React.FC<{ images: PropertyImage[] }> = ({ images }) => {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const close = useCallback(() => setLightboxIdx(null), []);
  const prev  = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIdx(i => i !== null ? (i - 1 + images.length) % images.length : 0);
  }, [images.length]);
  const next  = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIdx(i => i !== null ? (i + 1) % images.length : 0);
  }, [images.length]);

  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft")  setLightboxIdx(i => i !== null ? (i - 1 + images.length) % images.length : 0);
      if (e.key === "ArrowRight") setLightboxIdx(i => i !== null ? (i + 1) % images.length : 0);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIdx, images.length, close]);

  if (!images.length) return null;

  // Zone 1: large hero + 2×2 side grid (up to 5 images)
  const mosaic     = images.slice(0, 5);
  const sideGrid   = mosaic.slice(1);          // 0–4 items
  // Zone 2: strip of up to 3 more images below
  const strip      = images.slice(5, 8);
  const extraCount = Math.max(0, images.length - 8);

  const open = (idx: number) => setLightboxIdx(idx);

  return (
    <section className="pd-gallery">

      {/* ── Gallery header ──────────────────────────────── */}
      <div className="pd-gallery__header">
        <span className="rg-eyebrow">Photo Gallery</span>
        <h2 className="pd-gallery__title">Property Photos</h2>
        <span className="pd-gallery__count">
          <Icons.camera />
          {images.length} Photos
        </span>
      </div>

      {/* ── Zone 1: mosaic ─────────────────────────────── */}
      <div className="pd-gallery__mosaic">
        {/* Hero / main image */}
        <div className="pd-gallery__hero" onClick={() => open(0)} role="button" tabIndex={0} aria-label="Open gallery">
          <img src={mosaic[0].url} alt={mosaic[0].alt || "Property photo"} />
        </div>

        {/* 2×2 side grid */}
        {sideGrid.length > 0 && (
          <div className={`pd-gallery__side pd-gallery__side--${sideGrid.length}`}>
            {sideGrid.map((img, i) => (
              <div key={i} className="pd-gallery__cell" onClick={() => open(i + 1)} role="button" tabIndex={0} aria-label={`Photo ${i + 2}`}>
                <img src={img.url} alt={img.alt || `Property photo ${i + 2}`} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Zone 2: strip ──────────────────────────────── */}
      {strip.length > 0 && (
        <div className={`pd-gallery__strip pd-gallery__strip--${strip.length}`}>
          {strip.map((img, i) => {
            const isLast = i === strip.length - 1 && extraCount > 0;
            return (
              <div key={i} className="pd-gallery__strip-cell" onClick={() => open(i + 5)} role="button" tabIndex={0} aria-label={`Photo ${i + 6}`}>
                <img src={img.url} alt={img.alt || `Property photo ${i + 6}`} />
                {isLast && (
                  <div className="pd-gallery__more">
                    <span className="pd-gallery__more-num">+{extraCount}</span>
                    <span className="pd-gallery__more-txt">more photos</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── View all button ─────────────────────────────── */}
      {images.length > 1 && (
        <div className="pd-gallery__bar">
          <button className="pd-gallery__view-all" onClick={() => open(0)}>
            <Icons.camera />
            View all {images.length} photos
          </button>
        </div>
      )}

      {/* ── Lightbox ────────────────────────────────────── */}
      {lightboxIdx !== null && (
        <div className="pd-lightbox" onClick={close} role="dialog" aria-modal="true">
          <button className="pd-lightbox__close" onClick={close} aria-label="Close"><Icons.close /></button>
          <button className="pd-lightbox__nav pd-lightbox__nav--prev" onClick={prev} aria-label="Previous"><Icons.chevronLeft /></button>
          <div className="pd-lightbox__img-wrap" onClick={e => e.stopPropagation()}>
            <img src={images[lightboxIdx].url} alt={images[lightboxIdx].alt || "Property photo"} />
          </div>
          <button className="pd-lightbox__nav pd-lightbox__nav--next" onClick={next} aria-label="Next"><Icons.chevronRight /></button>
          <div className="pd-lightbox__counter">{lightboxIdx + 1} / {images.length}</div>
        </div>
      )}
    </section>
  );
};

// ─── Details Grid ─────────────────────────────────────────────────────────────

const DetailsGrid: React.FC<{ details: PropertyDetail[] }> = ({ details }) => {
  const filtered = details.filter(d => d.value && d.value.trim());
  if (!filtered.length) return null;
  return (
    <div className="pd-details__grid">
      {filtered.map((d, i) => (
        <div key={i} className="pd-detail-row">
          <span className="pd-detail-row__label">{d.label}</span>
          <span className="pd-detail-row__value">{d.value}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Features Grid ────────────────────────────────────────────────────────────

const FeaturesGrid: React.FC<{ features: PropertyFeature[] }> = ({ features }) => (
  <div className="pd-features__grid">
    {features.map((f, i) => {
      const Ic = Icons[f.icon] as (() => React.ReactElement) | undefined;
      return (
        <div key={i} className="pd-feature">
          <div className="pd-feature__icon">{Ic && <Ic />}</div>
          <h4 className="pd-feature__title">{f.title}</h4>
          {f.description && <p className="pd-feature__desc">{f.description}</p>}
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
      <div className="pd-location__map">
        <iframe src={mapUrl} title={`Map of ${address}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      </div>
      {nearbyLocations.length > 0 && (
        <div className="pd-location__nearby">
          <h4 className="pd-location__nearby-title">Nearby</h4>
          <div className="pd-location__list">
            {nearbyLocations.map((loc, i) => (
              <div key={i} className="pd-location__item">
                <Icons.clock />
                <span className="pd-location__item-name">{loc.name}</span>
                <span className="pd-location__item-dist">{loc.distance}</span>
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
          <div className="pd-video__play-btn"><Icons.play /></div>
          <span>Virtual Tour Coming Soon</span>
        </div>
      )}
    </div>
  );
};

// ─── Contact Card (sidebar) ───────────────────────────────────────────────────

const ContactCard: React.FC<{ agent: Agent; propertyId: string; onSubmit?: (d: ContactFormData) => void }> = ({ agent, propertyId, onSubmit }) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ ...form, propertyId });
    setSent(true);
  };

  return (
    <div className="pd-contact">
      {/* Agent */}
      <div className="pd-contact__agent">
        {agent.image ? (
          <img src={agent.image} alt={agent.name} className="pd-contact__avatar" />
        ) : (
          <div className="pd-contact__avatar pd-contact__avatar--placeholder">
            {agent.name.charAt(0)}
          </div>
        )}
        <div>
          <p className="pd-contact__name">{agent.name || "Our Agent"}</p>
          <p className="pd-contact__role">{agent.title || "Property Specialist"}</p>
        </div>
      </div>

      {/* Quick contact */}
      <div className="pd-contact__quick">
        {agent.phone && (
          <a href={`tel:${agent.phone}`} className="pd-contact__quick-btn pd-contact__quick-btn--primary">
            <Icons.phone /><span>{agent.phone}</span>
          </a>
        )}
        {agent.email && (
          <a href={`mailto:${agent.email}`} className="pd-contact__quick-btn">
            <Icons.mail /><span>{agent.email}</span>
          </a>
        )}
      </div>

      <div className="pd-contact__divider"><span>or send a message</span></div>

      {sent ? (
        <div className="pd-contact__sent">
          <p>Thank you — we'll be in touch shortly.</p>
        </div>
      ) : (
        <form className="pd-form" onSubmit={handleSubmit}>
          <div className="pd-form__row">
            <div className="pd-form__group">
              <label className="pd-form__label">Name</label>
              <input className="pd-form__input" type="text" name="name" placeholder="Your name" value={form.name} onChange={onChange} required />
            </div>
            <div className="pd-form__group">
              <label className="pd-form__label">Phone</label>
              <input className="pd-form__input" type="tel" name="phone" placeholder="0400 000 000" value={form.phone} onChange={onChange} />
            </div>
          </div>
          <div className="pd-form__group">
            <label className="pd-form__label">Email</label>
            <input className="pd-form__input" type="email" name="email" placeholder="you@email.com" value={form.email} onChange={onChange} required />
          </div>
          <div className="pd-form__group">
            <label className="pd-form__label">Message</label>
            <textarea className="pd-form__textarea" name="message" rows={3} placeholder="I'd like to enquire about this property…" value={form.message} onChange={onChange} />
          </div>
          <button type="submit" className="pd-form__submit">
            Send Enquiry <Icons.arrow />
          </button>
        </form>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const PropDetail: React.FC<PropDetailProps> = ({
  property, onContactSubmit, onSaveProperty, onShareProperty, onScheduleViewing, onDownloadBrochure,
}) => {
  const fullAddress = [property.address, property.city, property.state, property.zipCode]
    .filter(Boolean).join(", ");
  const videoThumbnail = property.videoThumbnail || property.images[0]?.url;
  const showVideo = Boolean(property.videoTourUrl || videoThumbnail);
  const hasFeatures = property.features.length > 0;
  const hasDetails  = property.details.some(d => d.value?.trim());
  const hasOverview = property.overview.some(p => p.trim());

  return (
    <div className="pd-wrapper">

      {/* 1 — Compact Hero */}
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

      {/* 2 — Photo Gallery */}
      <GallerySection images={property.images} />

      {/* 3 — Main content + sidebar */}
      <main className="pd-main">
        <div className="pd-main__container">

          {/* Left column */}
          <div className="pd-main__content">

            {/* Overview */}
            {hasOverview && (
              <section className="pd-section">
                <div className="pd-section__header">
                  <span className="rg-eyebrow">About This Property</span>
                  <h2 className="pd-section__title">Property Overview</h2>
                </div>
                <div className="pd-overview">
                  {property.overview.map((p, i) => <p key={i} className="pd-overview__para">{p}</p>)}
                </div>
              </section>
            )}

            {/* Specs */}
            {hasDetails && (
              <section className="pd-section">
                <div className="pd-section__header">
                  <span className="rg-eyebrow">Specifications</span>
                  <h2 className="pd-section__title">Property Details</h2>
                </div>
                <DetailsGrid details={property.details} />
              </section>
            )}

            {/* Features */}
            {hasFeatures && (
              <section className="pd-section">
                <div className="pd-section__header">
                  <span className="rg-eyebrow">What's Included</span>
                  <h2 className="pd-section__title">Features & Amenities</h2>
                </div>
                <FeaturesGrid features={property.features} />
              </section>
            )}

            {/* Location */}
            <section className="pd-section">
              <div className="pd-section__header">
                <span className="rg-eyebrow">Location</span>
                <h2 className="pd-section__title">Location & Surrounds</h2>
              </div>
              <LocationSection
                mapEmbedUrl={property.mapEmbedUrl}
                nearbyLocations={property.nearbyLocations}
                address={fullAddress}
              />
            </section>

            {/* Video */}
            {showVideo && (
              <section className="pd-section">
                <div className="pd-section__header">
                  <span className="rg-eyebrow">Tour</span>
                  <h2 className="pd-section__title">Virtual Tour</h2>
                </div>
                <VideoSection videoUrl={property.videoTourUrl} thumbnail={videoThumbnail} />
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="pd-main__sidebar">
            <ContactCard agent={property.agent} propertyId={property.id} onSubmit={onContactSubmit} />

            {/* Quick actions */}
            <div className="pd-actions">
              <button className="pd-action" onClick={onSaveProperty}>Save Property</button>
              <button className="pd-action" onClick={onShareProperty}>Share</button>
              <button className="pd-action" onClick={onScheduleViewing}>Schedule Viewing</button>
              <button className="pd-action" onClick={onDownloadBrochure}>Download Brochure</button>
            </div>
          </aside>
        </div>
      </main>

      {/* Bottom CTA */}
      <section className="pd-cta">
        <div className="pd-cta__inner">
          <div>
            <span className="rg-eyebrow">Explore More</span>
            <h2 className="pd-cta__title">Discover More Properties</h2>
            <p className="pd-cta__text">Browse all listings to compare locations, pricing, and features.</p>
          </div>
          <Link to="/properties" className="pd-cta__btn">View All Properties</Link>
        </div>
      </section>
    </div>
  );
};

export default PropDetail;
export type {
  PropertyData, PropertyImage, PropertyFeature, PropertyDetail,
  PropertyStat, NearbyLocation, Agent, PropDetailProps, ContactFormData,
};
