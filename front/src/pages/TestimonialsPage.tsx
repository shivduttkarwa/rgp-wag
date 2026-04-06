import React, { useEffect, useLayoutEffect, useRef } from "react";
import HeroSection from "../sections/HeroSection";
import RGPSplitSlider from "../components/reusable/SplitSlider";
import { initGsapSwitchAnimations } from "@/lib/gsapSwitchAnimations";
import gsap from "gsap";
import "./TestimonialPage.css";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
  location: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Property Seller",
    role: "Homeowner",
    company: "Algester",
    avatar: "https://i.pravatar.cc/150?img=1",
    content:
      "Rahul Singh did a fantastic job selling our property and achieved the price we wanted. His professionalism, communication, and market knowledge made the entire process smooth and stress-free.",
    rating: 5,
    location: "Algester, QLD",
  },
  {
    id: 2,
    name: "First Home Buyer",
    role: "Homeowner",
    company: "Algester",
    avatar: "https://i.pravatar.cc/150?img=5",
    content:
      "Rahul Singh (real gold realestate) wasn't just our realtor—they became our trusted guide through the home-buying process. Their genuine care and dedication made all the difference.",
    rating: 5,
    location: "Algester, QLD",
  },
  {
    id: 3,
    name: "Property Buyer",
    role: "Homeowner",
    company: "Springfield",
    avatar: "https://i.pravatar.cc/150?img=3",
    content:
      "Rahul is an amazing person to deal with from a buyers point of view! Very cool, easy approachable, always available over the phone to answer any questions. Highly recommended!",
    rating: 5,
    location: "Springfield, QLD",
  },
  {
    id: 4,
    name: "Satisfied Seller",
    role: "Homeowner",
    company: "Springfield",
    avatar: "https://i.pravatar.cc/150?img=9",
    content:
      "Outstanding Result with Rahul Singh. We had an excellent experience selling our house with Rahul Singh. He was professional, knowledgeable, and proactive throughout the entire process.",
    rating: 5,
    location: "Springfield, QLD",
  },
  {
    id: 5,
    name: "Land Seller",
    role: "Property Owner",
    company: "White Rock",
    avatar: "https://i.pravatar.cc/150?img=8",
    content:
      "Working with Rahul Singh was an excellent experience. He was professional, knowledgeable, and went above and beyond to help us sell our property. We couldn't be happier with the results.",
    rating: 5,
    location: "White Rock, QLD",
  },
  {
    id: 6,
    name: "Happy Client",
    role: "Property Owner",
    company: "White Rock",
    avatar: "https://i.pravatar.cc/150?img=10",
    content:
      "Outstanding Experience with Rahul Singh! Selling our property with Rahul Singh was an absolute pleasure. His professionalism, dedication, and deep market knowledge ensured we got the best outcome.",
    rating: 5,
    location: "White Rock, QLD",
  },
  {
    id: 7,
    name: "Record Sale Client",
    role: "Homeowner",
    company: "Ripley",
    avatar: "https://i.pravatar.cc/150?img=11",
    content:
      "Record Price in Record Time by RGP! Rahul Singh did an amazing job selling our home. He worked tirelessly day and night to get it sold in record time at a record price. Exceptional service!",
    rating: 5,
    location: "Ripley, QLD",
  },
  {
    id: 8,
    name: "First Home Buyer",
    role: "Homeowner",
    company: "Ripley",
    avatar: "https://i.pravatar.cc/150?img=20",
    content:
      "We are incredibly grateful to Rahul Singh for guiding us through the journey of purchasing our first home in Australia. After nearly two months of searching, Rahul made it happen with patience and expertise.",
    rating: 5,
    location: "Ripley, QLD",
  },
  {
    id: 9,
    name: "Property Buyer",
    role: "Homeowner",
    company: "Ripley",
    avatar: "https://i.pravatar.cc/150?img=12",
    content:
      "We are incredibly grateful to Rahul Singh for guiding us through our property purchase. His knowledge of the market and dedication to finding the right home for us was outstanding.",
    rating: 5,
    location: "Ripley, QLD",
  },
  {
    id: 10,
    name: "Satisfied Buyer",
    role: "Homeowner",
    company: "South Ripley",
    avatar: "https://i.pravatar.cc/150?img=23",
    content:
      "I had a wonderful experience working with Rahul Singh. He was professional, responsive, and always had our best interests at heart. Made the entire buying process seamless.",
    rating: 5,
    location: "South Ripley, QLD",
  },
  {
    id: 11,
    name: "Property Seller",
    role: "Homeowner",
    company: "South Ripley",
    avatar: "https://i.pravatar.cc/150?img=14",
    content:
      "I cannot recommend Rahul Singh highly enough! He along with his team worked tirelessly to sell our property. Their professionalism and market expertise resulted in an excellent outcome.",
    rating: 5,
    location: "South Ripley, QLD",
  },
  {
    id: 12,
    name: "Happy Buyer",
    role: "Homeowner",
    company: "Greenbank",
    avatar: "https://i.pravatar.cc/150?img=24",
    content:
      "We are incredibly grateful to Rahul Singh for helping us secure our dream home. His negotiation skills and attention to detail made all the difference in our purchase.",
    rating: 5,
    location: "Greenbank, QLD",
  },
  {
    id: 13,
    name: "Property Buyer",
    role: "Homeowner",
    company: "Greenbank",
    avatar: "https://i.pravatar.cc/150?img=15",
    content:
      "Rahul Singh did an excellent job helping us secure our property. His knowledge of the area and market conditions helped us make an informed decision. Highly professional service.",
    rating: 5,
    location: "Greenbank, QLD",
  },
  {
    id: 14,
    name: "Satisfied Seller",
    role: "Homeowner",
    company: "Greenbank",
    avatar: "https://i.pravatar.cc/150?img=25",
    content:
      "Rahul was absolutely fantastic to work with! He made selling our property a breeze with his professionalism and excellent communication throughout the entire process.",
    rating: 5,
    location: "Greenbank, QLD",
  },
  {
    id: 15,
    name: "Property Seller",
    role: "Homeowner",
    company: "Narangba",
    avatar: "https://i.pravatar.cc/150?img=17",
    content:
      "I recently worked with Rahul to sell my house and couldn't be happier with the results. His market knowledge and negotiation skills helped us achieve an excellent sale price.",
    rating: 5,
    location: "Narangba, QLD",
  },
  {
    id: 16,
    name: "Happy Buyer",
    role: "Homeowner",
    company: "Greenbank",
    avatar: "https://i.pravatar.cc/150?img=26",
    content:
      "Working with Rahul Singh for our property purchase was an absolute pleasure. He understood our needs and found us the perfect home. His professionalism and dedication are unmatched.",
    rating: 5,
    location: "Greenbank, QLD",
  },
  {
    id: 17,
    name: "Property Buyer",
    role: "Homeowner",
    company: "Greenbank",
    avatar: "https://i.pravatar.cc/150?img=18",
    content:
      "I recently had the pleasure of working with Rahul Singh and was impressed by his professionalism and market knowledge. He made our property purchase smooth and stress-free.",
    rating: 5,
    location: "Greenbank, QLD",
  },
  {
    id: 18,
    name: "Satisfied Seller",
    role: "Homeowner",
    company: "Heathwood",
    avatar: "https://i.pravatar.cc/150?img=27",
    content:
      "Rahul was absolutely amazing in selling our property! He worked tirelessly to get us the best price and made the entire process seamless. We couldn't have asked for better service.",
    rating: 5,
    location: "Heathwood, QLD",
  },
  {
    id: 19,
    name: "Happy Client",
    role: "Homeowner",
    company: "Greenbank",
    avatar: "https://i.pravatar.cc/150?img=53",
    content:
      "Thank you Rahul! Your dedication and professionalism in selling our property exceeded all expectations. We achieved an excellent result thanks to your expertise and hard work.",
    rating: 5,
    location: "Greenbank, QLD",
  },
  {
    id: 20,
    name: "Property Seller",
    role: "Property Owner",
    company: "Greenbank",
    avatar: "https://i.pravatar.cc/150?img=28",
    content:
      "I want to thank Rahul for helping me selling my property. His professionalism, market knowledge, and excellent communication made the entire process smooth and successful.",
    rating: 5,
    location: "Greenbank, QLD",
  },
  {
    id: 21,
    name: "Satisfied Client",
    role: "Homeowner",
    company: "Greenbank",
    avatar: "https://i.pravatar.cc/150?img=51",
    content:
      "Rahul is very supportive, responsive and keeps the client updated throughout the process. His professionalism and dedication to achieving the best outcome is truly commendable.",
    rating: 5,
    location: "Greenbank, QLD",
  },
  {
    id: 22,
    name: "Happy Seller",
    role: "Homeowner",
    company: "Greenbank",
    avatar: "https://i.pravatar.cc/150?img=29",
    content:
      "Rahul Singh was absolutely outstanding in selling my property. His market expertise, negotiation skills, and dedication resulted in an excellent sale. Highly recommended!",
    rating: 5,
    location: "Greenbank, QLD",
  },
  {
    id: 23,
    name: "Property Seller",
    role: "Homeowner",
    company: "Greenbank",
    avatar: "https://i.pravatar.cc/150?img=52",
    content:
      "Working with Rahul Singh was a fantastic experience. His professionalism, market knowledge, and excellent communication made selling our property a smooth and successful process.",
    rating: 5,
    location: "Greenbank, QLD",
  },
  {
    id: 24,
    name: "Satisfied Client",
    role: "Homeowner",
    company: "Greenbank",
    avatar: "https://i.pravatar.cc/150?img=30",
    content:
      "Rahul recently sold our property in Greenbank off the market in record time. His professionalism, market knowledge, and excellent negotiation skills achieved an outstanding result.",
    rating: 5,
    location: "Greenbank, QLD",
  },
  {
    id: 25,
    name: "Land Buyer",
    role: "Property Owner",
    company: "Greenbank",
    avatar: "https://i.pravatar.cc/150?img=54",
    content:
      "Rahul Singh was a powerhouse in helping me buy land! His knowledge of the area, negotiation skills, and dedication to finding the right property made all the difference.",
    rating: 5,
    location: "Greenbank, QLD",
  },
  {
    id: 26,
    name: "Property Buyer",
    role: "Homeowner",
    company: "Greenbank",
    avatar: "https://i.pravatar.cc/150?img=31",
    content:
      "Our first interaction with Rahul was positive. He was professional, knowledgeable, and genuinely interested in helping us find the right property. Excellent service throughout.",
    rating: 5,
    location: "Greenbank, QLD",
  },
  {
    id: 27,
    name: "Happy Seller",
    role: "Homeowner",
    company: "Greenbank",
    avatar: "https://i.pravatar.cc/150?img=55",
    content:
      "Rahul Singh did an outstanding job selling our house. He was professional, responsive, and worked tirelessly to achieve the best possible outcome. We couldn't be happier!",
    rating: 5,
    location: "Greenbank, QLD",
  },
  {
    id: 28,
    name: "Satisfied Client",
    role: "Homeowner",
    company: "Greenbank",
    avatar: "https://i.pravatar.cc/150?img=32",
    content:
      "Rahul Singh is the real deal in real estate! From start to finish, he was professional, honest, and totally committed to getting us the best result. Exceptional service!",
    rating: 5,
    location: "Greenbank, QLD",
  },
  {
    id: 29,
    name: "Property Seller",
    role: "Homeowner",
    company: "Greenbank",
    avatar: "https://i.pravatar.cc/150?img=56",
    content:
      "I had the pleasure of working with Rahul Singh and was impressed by his professionalism and dedication. He made selling our property a smooth and successful experience.",
    rating: 5,
    location: "Greenbank, QLD",
  },
  {
    id: 30,
    name: "Happy Buyer",
    role: "Homeowner",
    company: "Greenbank",
    avatar: "https://i.pravatar.cc/150?img=33",
    content:
      "Rahul was very helpful and made the process run smoothly. His knowledge of the market and excellent communication skills helped us secure our dream property.",
    rating: 5,
    location: "Greenbank, QLD",
  },
  {
    id: 31,
    name: "Satisfied Client",
    role: "Homeowner",
    company: "Greenbank",
    avatar: "https://i.pravatar.cc/150?img=57",
    content:
      "Rahul is very efficient and great communicator. He was always available to answer our questions and kept us informed throughout the entire property transaction process.",
    rating: 5,
    location: "Greenbank, QLD",
  },
  {
    id: 32,
    name: "Property Buyer",
    role: "Homeowner",
    company: "Greenbank",
    avatar: "https://i.pravatar.cc/150?img=34",
    content:
      "Rahul singh is very humble person. He always ready for help and goes above and beyond for his clients. His professionalism and dedication made our property purchase a success.",
    rating: 5,
    location: "Greenbank, QLD",
  },
  {
    id: 33,
    name: "Happy Client",
    role: "Homeowner",
    company: "Greenbank",
    avatar: "https://i.pravatar.cc/150?img=58",
    content:
      "Thank you so much Rahulbhai. Your help and guidance throughout the property transaction was invaluable. We couldn't have done it without your expertise and support.",
    rating: 5,
    location: "Greenbank, QLD",
  },
  {
    id: 34,
    name: "Satisfied Seller",
    role: "Homeowner",
    company: "Greenbank",
    avatar: "https://i.pravatar.cc/150?img=35",
    content:
      "Rahul singh's work was very efficient and good. He handled the sale of our property with professionalism and achieved an excellent result. Highly recommended!",
    rating: 5,
    location: "Greenbank, QLD",
  },
  {
    id: 35,
    name: "Property Seller",
    role: "Homeowner",
    company: "Greenbank",
    avatar: "https://i.pravatar.cc/150?img=59",
    content:
      "Rahul Singh is an exceptional real estate agent. His knowledge, professionalism, and dedication to achieving the best outcome for his clients is truly outstanding.",
    rating: 5,
    location: "Greenbank, QLD",
  },
  {
    id: 36,
    name: "Happy Buyer",
    role: "Homeowner",
    company: "Greenbank",
    avatar: "https://i.pravatar.cc/150?img=36",
    content:
      "Working with Rahul Singh as my real estate agent was a fantastic experience. He understood my needs and found me the perfect property. Excellent service throughout!",
    rating: 5,
    location: "Greenbank, QLD",
  },
  {
    id: 37,
    name: "Satisfied Client",
    role: "Homeowner",
    company: "Greenbank",
    avatar: "https://i.pravatar.cc/150?img=60",
    content:
      "Highly recommend Rahul's service! He's professional and knowledgeable. His expertise in the real estate market helped us make the right decision for our property purchase.",
    rating: 5,
    location: "Greenbank, QLD",
  },
  {
    id: 38,
    name: "Property Buyer",
    role: "Homeowner",
    company: "Greenbank",
    avatar: "https://i.pravatar.cc/150?img=37",
    content:
      "Rahul was extremely helpful in guiding us throughout from start to finish. His professionalism and market knowledge made our property purchase smooth and successful.",
    rating: 5,
    location: "Greenbank, QLD",
  },
  {
    id: 39,
    name: "Happy Seller",
    role: "Homeowner",
    company: "Greenbank",
    avatar: "https://i.pravatar.cc/150?img=61",
    content:
      "5 Star for Rahul Singh! I recently worked with Rahul and was impressed by his professionalism, dedication, and excellent results. He made selling our property a breeze.",
    rating: 5,
    location: "Greenbank, QLD",
  },
  {
    id: 40,
    name: "Satisfied Buyer",
    role: "Homeowner",
    company: "Greenbank",
    avatar: "https://i.pravatar.cc/150?img=38",
    content:
      "Rahul did a remarkable job in assisting me in buying a property. His knowledge, professionalism, and dedication to finding the right property was outstanding.",
    rating: 5,
    location: "Greenbank, QLD",
  },
  {
    id: 41,
    name: "Property Seller",
    role: "Homeowner",
    company: "Greenbank",
    avatar: "https://i.pravatar.cc/150?img=62",
    content:
      "Great service by Rahul. Good timely communication, done everything on time. His professionalism and efficiency made selling our property a smooth and successful experience.",
    rating: 5,
    location: "Greenbank, QLD",
  },
  {
    id: 42,
    name: "Happy Client",
    role: "Homeowner",
    company: "Greenbank",
    avatar: "https://i.pravatar.cc/150?img=39",
    content:
      "Rahul was an excellent salesperson, at all times during the process he was professional and kept us informed. We achieved an excellent result thanks to his expertise.",
    rating: 5,
    location: "Greenbank, QLD",
  },
  {
    id: 43,
    name: "Satisfied Seller",
    role: "Homeowner",
    company: "Greenbank",
    avatar: "https://i.pravatar.cc/150?img=63",
    content:
      "Rahul managed the sale very professionally, and I'm very happy with the result. His market knowledge and negotiation skills helped us achieve an excellent sale price.",
    rating: 5,
    location: "Greenbank, QLD",
  },
  {
    id: 44,
    name: "Property Buyer",
    role: "Homeowner",
    company: "Greenbank",
    avatar: "https://i.pravatar.cc/150?img=40",
    content:
      "Really appreciate Mr. Rahul who followed us to find a property. His dedication, professionalism, and excellent service helped us secure our dream home.",
    rating: 5,
    location: "Greenbank, QLD",
  },
  {
    id: 45,
    name: "Happy Seller",
    role: "Homeowner",
    company: "Greenbank",
    avatar: "https://i.pravatar.cc/150?img=41",
    content:
      "Delighted and impressed with incredibly smooth sale. Rahul's professionalism, market knowledge, and excellent communication made the entire process seamless and successful.",
    rating: 5,
    location: "Greenbank, QLD",
  },
  {
    id: 46,
    name: "Satisfied Client",
    role: "Homeowner",
    company: "Greenbank",
    avatar: "https://i.pravatar.cc/150?img=42",
    content:
      "This was a first deal with Rahul Singh. He was quite professional and helped us throughout the process. His expertise and dedication resulted in an excellent outcome.",
    rating: 5,
    location: "Greenbank, QLD",
  },
  {
    id: 47,
    name: "Property Seller",
    role: "Homeowner",
    company: "Greenbank",
    avatar: "https://i.pravatar.cc/150?img=43",
    content:
      "Rahul was very professional in his approach and helped us achieve an excellent result. His market knowledge and negotiation skills are outstanding. Highly recommended!",
    rating: 5,
    location: "Greenbank, QLD",
  },
  {
    id: 48,
    name: "Happy Buyer",
    role: "Homeowner",
    company: "Greenbank",
    avatar: "https://i.pravatar.cc/150?img=44",
    content:
      "Rahul is very friendly. Rahul is very down to earth and always ready to help. His professionalism and dedication made our property purchase a smooth and successful experience.",
    rating: 5,
    location: "Greenbank, QLD",
  },
  {
    id: 49,
    name: "Satisfied Client",
    role: "Homeowner",
    company: "Greenbank",
    avatar: "https://i.pravatar.cc/150?img=45",
    content:
      "We have great experience with Rahul, he is very friendly and professional. His knowledge of the market and excellent service helped us achieve our property goals.",
    rating: 5,
    location: "Greenbank, QLD",
  },
  {
    id: 50,
    name: "Property Seller",
    role: "Homeowner",
    company: "Greenbank",
    avatar: "https://i.pravatar.cc/150?img=46",
    content:
      "Great Sales Professional. Rahul got great sales skills and market knowledge. He worked tirelessly to achieve the best result for us. Exceptional service and highly recommended!",
    rating: 5,
    location: "Greenbank, QLD",
  },
  {
    id: 51,
    name: "Happy Client",
    role: "Homeowner",
    company: "Greenbank",
    avatar: "https://i.pravatar.cc/150?img=47",
    content:
      "Highly Professional. Rahul is very knowledgeable and professional. His expertise in real estate and dedication to his clients is truly outstanding. Excellent service throughout!",
    rating: 5,
    location: "Greenbank, QLD",
  },
  {
    id: 52,
    name: "Satisfied Buyer",
    role: "Homeowner",
    company: "Greenbank",
    avatar: "https://i.pravatar.cc/150?img=48",
    content:
      "Rahul is one of the best real-estate agent in my heart. His professionalism, knowledge, and dedication to helping clients achieve their property goals is truly exceptional.",
    rating: 5,
    location: "Greenbank, QLD",
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   3. VOICE MOSAIC — Bento grid
───────────────────────────────────────────────────────────────────────────── */
const MOSAIC_COLORS = [
  "var(--rg-gold)",
  "var(--rg-gold)",
  "var(--rg-gold)",
  "var(--rg-gold)",
  "var(--rg-gold)",
  "var(--rg-gold)",
  "var(--rg-gold)",
  "var(--rg-gold)",
  "var(--rg-gold)",
];

const MOSAIC_PICKS = [
  testimonials[2],
  testimonials[5],
  testimonials[8],
  testimonials[11],
  testimonials[14],
  testimonials[17],
  testimonials[20],
  testimonials[23],
  testimonials[26],
];

const VoiceMosaic: React.FC = () => (
  <section className="tp-mosaic">
    <div className="tp-mosaic__header">
      <span
        className="tp-mosaic__kicker"
        data-gsap="fade-in"
        data-gsap-start="top 85%"
      >
        Real Voices
      </span>
      <h2
        className="tp-mosaic__title"
        data-gsap="char-reveal"
        data-gsap-start="top 85%"
      >
        Stories That <em>Define</em> Us
      </h2>
    </div>

    <div className="tp-mosaic__grid">
      {MOSAIC_PICKS.map((item, i) => (
        <article
          key={item.id}
          className={`tp-mosaic__card tp-mosaic__card--${i + 1}`}
          style={{ "--mc": MOSAIC_COLORS[i] } as React.CSSProperties}
        >
          <div className="tp-mosaic__card-glow" />
          <div className="tp-mosaic__corner" aria-hidden="true" />
          <div className="tp-mosaic__card-header">
            <img src={item.avatar} alt={item.name} />
            <div>
              <h4>{item.name}</h4>
              <p>{item.role}</p>
            </div>
            <div className="tp-mosaic__card-rating">★ 5.0</div>
          </div>
          <blockquote>"{item.content}"</blockquote>
          <div className="tp-mosaic__card-tag">{item.company}</div>
        </article>
      ))}
    </div>
  </section>
);

/* ─────────────────────────────────────────────────────────────────────────────
   5. TICKER WALL — 3-column infinite auto-scroll
───────────────────────────────────────────────────────────────────────────── */
const TICKER_COLORS = [
  "var(--rg-gold)",
  "var(--rg-gold)",
  "var(--rg-gold)",
  "var(--rg-gold)",
  "var(--rg-gold)",
  "var(--rg-gold)",
];

interface TickerColProps {
  items: Testimonial[];
  speed: number;
  reversed?: boolean;
}

const TickerCol: React.FC<TickerColProps> = ({ items, speed, reversed }) => (
  <div
    className={`tp-ticker__col${reversed ? " tp-ticker__col--rev" : ""}`}
    style={{ "--ts": `${speed}s` } as React.CSSProperties}
  >
    <div className="tp-ticker__inner">
      {[...items, ...items].map((item, i) => (
        <article
          key={`${item.id}-${i}`}
          className="tp-ticker__card"
          style={
            {
              "--tc": TICKER_COLORS[i % TICKER_COLORS.length],
            } as React.CSSProperties
          }
        >
          <div className="tp-ticker__card-accent" />
          <div className="tp-ticker__card-head">
            <img src={item.avatar} alt={item.name} />
            <div>
              <h4>{item.name}</h4>
              <p>
                {item.role} · {item.company}
              </p>
            </div>
          </div>
          <p className="tp-ticker__card-text">"{item.content}"</p>
        </article>
      ))}
    </div>
  </div>
);

const TickerWall: React.FC = () => (
  <section className="tp-ticker">
    <div className="tp-ticker__header">
      <span
        className="tp-ticker__kicker"
        data-gsap="fade-in"
        data-gsap-start="top 85%"
      >
        All Reviews
      </span>
      <h2
        className="tp-ticker__title"
        data-gsap="char-reveal"
        data-gsap-start="top 85%"
      >
        The Full <em>Chorus</em>
      </h2>
    </div>

    <div className="tp-ticker__container">
      <div className="tp-ticker__wall">
        <TickerCol items={testimonials.slice(15, 24)} speed={32} />
        <TickerCol items={testimonials.slice(24, 33)} speed={44} reversed />
        <TickerCol items={testimonials.slice(33, 42)} speed={38} />
      </div>
      <div className="tp-ticker__fade-top" />
      <div className="tp-ticker__fade-bottom" />
    </div>
  </section>
);

/* ─────────────────────────────────────────────────────────────────────────────
   6. FINAL CTA
───────────────────────────────────────────────────────────────────────────── */
const FinalCTA: React.FC = () => (
  <section className="tp-cta">
    <div className="tp-cta__inner">
      <div className="tp-cta__panel">
        <span className="tp-cta__kicker" data-gsap="fade-up">
          Next Step
        </span>
        <h2
          className="tp-cta__heading"
          data-gsap="char-reveal"
          data-gsap-start="top 85%"
        >
          Book a Free
          <br />
          <em>Appraisal</em>
        </h2>
        <p className="tp-cta__body" data-gsap="fade-up" data-gsap-delay="0.15">
          Get a clear price range, honest advice, and a plan that positions your
          property for a confident sale.
        </p>
        <div
          className="tp-cta__meta"
          data-gsap="zoom-in"
          data-gsap-stagger="0.3"
        >
          <div className="tp-cta__meta-item">
            <span className="tp-cta__meta-value">5</span>
            <span className="tp-cta__meta-label">Avg Rating</span>
          </div>
          <div className="tp-cta__meta-item">
            <span className="tp-cta__meta-value">{testimonials.length}+</span>
            <span className="tp-cta__meta-label">Reviews</span>
          </div>
          <div className="tp-cta__meta-item">
            <span className="tp-cta__meta-value">100%</span>
            <span className="tp-cta__meta-label">Client Care</span>
          </div>
        </div>
        <div className="tp-cta__actions">
          <a
            href="/contact"
            className="tp-cta__btn tp-cta__btn--solid"
            data-gsap="btn-clip-reveal"
            data-gsap-delay="0.2"
          >
            Book Your Appraisal
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a
            href="/contact"
            className="tp-cta__btn tp-cta__btn--ghost"
            data-gsap="btn-clip-reveal"
            data-gsap-delay="0.32"
          >
            Talk to Rahul
          </a>
        </div>
      </div>

      <div
        className="tp-cta__visual"
        data-gsap="clip-smooth-down"
        data-gsap-delay="0.15"
        data-gsap-start="top 85%"
      >
        <div className="tp-cta__medallion">
          <span className="tp-cta__medallion-rot" aria-hidden="true" />
          <span className="tp-cta__medallion-num">{testimonials.length}+</span>
          <span className="tp-cta__medallion-label">Verified Reviews</span>
        </div>
        <div className="tp-cta__avatar-fan">
          {testimonials.slice(0, 8).map((t) => (
            <img key={t.id} src={t.avatar} alt={t.name} />
          ))}
        </div>
        <p className="tp-cta__total">Trusted by homeowners across Brisbane.</p>
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────────────────────── */
const TestimonialPage: React.FC<{ ready?: boolean }> = ({ ready = false }) => {
  const pageRef = useRef<HTMLDivElement>(null);
  const slabRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!ready || !slabRef.current) return;

    const slab = slabRef.current;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      gsap.set(slab, {
        autoAlpha: 1,
        clipPath: "inset(0 0 0% 0)",
        webkitClipPath: "inset(0 0 0% 0)",
      });
      return;
    }

    gsap.set(slab, {
      autoAlpha: 1,
      clipPath: "inset(0 0 100% 0)",
      webkitClipPath: "inset(0 0 100% 0)",
      willChange: "clip-path",
    });

    const tl = gsap.timeline();

    // Match the home hero panel reveal: top-to-bottom clip, starting right after subtitle.
    tl.to(slab, {
      clipPath: "inset(0 0 0% 0)",
      webkitClipPath: "inset(0 0 0% 0)",
      duration: 1.0,
      ease: "power3.inOut",
    }, 1);

    return () => {
      tl.kill();
    };
  }, [ready]);

  useEffect(() => {
    const guards = [
      "clipRevealInit",
      "clipRevealRtlInit",
      "clipRevealTopInit",
      "clipRevealLeftInit",
      "clipRevealRightInit",
      "wordRevealInit",
      "wordWriteInit",
      "clipSmoothInit",
      "clipSmoothDownInit",
      "charRevealInit",
    ];
    guards.forEach((key) => {
      pageRef.current
        ?.querySelectorAll<HTMLElement>(
          `[data-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}]`,
        )
        .forEach((el) => delete el.dataset[key]);
    });

    const cleanup = initGsapSwitchAnimations(pageRef.current);
    return cleanup;
  }, []);

  return (
    <div ref={pageRef}>
      <main className="testimonial-page">
        <HeroSection
          ready={ready}
          showVideo={false}
          showCta={false}
          bgImage="images/testi-hero.jpg"
          titleLine1={
            <>
              Client <span className="rg-gold">Stories</span>
            </>
          }
          titleLine2={
            <>
              Words That <span className="rg-amber">Inspire</span>
            </>
          }
          subtitle={`${testimonials.length} verified experiences — refined, discreet service from start to finish.`}
          footer={
            <div className="t-hero__stats-slab" ref={slabRef}>
              <div className="t-hero__stats">
                <div className="t-hero__stat">
                  <span className="t-hero__stat-value">
                    5<span className="t-hero__stat-star">★</span>
                  </span>
                  <span className="t-hero__stat-label">Avg. Rating</span>
                </div>
                <div className="t-hero__stat-divider" />
                <div className="t-hero__stat">
                  <span className="t-hero__stat-value">100%</span>
                  <span className="t-hero__stat-label">
                    Client Satisfaction
                  </span>
                </div>
                <div className="t-hero__stat-divider" />
                <div className="t-hero__stat">
                  <span className="t-hero__stat-value">
                    {testimonials.length}
                  </span>
                  <span className="t-hero__stat-label">Total Reviews</span>
                </div>
              </div>
            </div>
          }
        />
        <div className="t-section-heading">
          <header className="t-section-heading__header">
            <span
              className="t-section-heading__eyebrow"
              data-gsap="fade-in"
              data-gsap-start="top 100%"
            >
              Client Voices
            </span>
            <h2
              className="t-section-heading__title"
              data-gsap="char-reveal"
              data-gsap-start="top 85%"
            >
              What Our Clients <em>Say</em>
            </h2>
            <p
              className="t-section-heading__subtitle"
              data-gsap="fade-up"
              data-gsap-delay="0.2"
            >
              Real experiences from real clients — every word earned, never
              scripted.
            </p>
          </header>
        </div>
        <RGPSplitSlider />
        <VoiceMosaic />
        <TickerWall />

        <FinalCTA />
      </main>
    </div>
  );
};

export default TestimonialPage;
