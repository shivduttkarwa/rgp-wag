import React, { useEffect, useRef, useState } from 'react';
import './TeamV3.css';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  specialization: string;
  bio: string;
  image: string;
  email: string;
  phone: string;
  linkedin?: string;
  featured?: boolean;
  stats?: {
    propertiesSold?: number;
    yearsExperience?: number;
    clientSatisfaction?: string;
  };
}

const teamData: TeamMember[] = [
  {
    id: '1',
    name: 'Alexander Hartwell',
    role: 'Principal & Founder',
    specialization: 'Luxury Waterfront Properties',
    bio: 'With over two decades shaping Sydney\'s premium property landscape, Alexander brings unparalleled expertise in waterfront estates and architectural masterpieces.',
    image: '/team/alexander.jpg',
    email: 'alexander@rgestate.com.au',
    phone: '+61 2 9XXX XXXX',
    linkedin: '#',
    featured: true,
    stats: {
      propertiesSold: 450,
      yearsExperience: 22,
      clientSatisfaction: '99%'
    }
  },
  {
    id: '2',
    name: 'Victoria Chen',
    role: 'Director of Sales',
    specialization: 'Eastern Suburbs & Prestige Markets',
    bio: 'Victoria\'s intimate knowledge of Sydney\'s Eastern Suburbs combined with her refined approach has consistently delivered exceptional results for discerning clients.',
    image: '/team/victoria.jpg',
    email: 'victoria@rgestate.com.au',
    phone: '+61 2 9XXX XXXX',
    linkedin: '#',
    featured: true,
    stats: {
      propertiesSold: 320,
      yearsExperience: 15,
      clientSatisfaction: '98%'
    }
  },
  {
    id: '3',
    name: 'James Morrison',
    role: 'Senior Property Consultant',
    specialization: 'Heritage & Character Homes',
    bio: 'James specializes in period homes and heritage properties, bringing a deep appreciation for architectural history to every transaction.',
    image: '/team/james.jpg',
    email: 'james@rgestate.com.au',
    phone: '+61 2 9XXX XXXX',
    linkedin: '#',
    stats: {
      propertiesSold: 180,
      yearsExperience: 12,
      clientSatisfaction: '97%'
    }
  },
  {
    id: '4',
    name: 'Isabella Romano',
    role: 'Head of Property Management',
    specialization: 'Investment Portfolio Management',
    bio: 'Isabella oversees our property management division with meticulous attention to detail, ensuring optimal returns for our investment clients.',
    image: '/team/isabella.jpg',
    email: 'isabella@rgestate.com.au',
    phone: '+61 2 9XXX XXXX',
    linkedin: '#',
    stats: {
      propertiesSold: 95,
      yearsExperience: 10,
      clientSatisfaction: '99%'
    }
  },
  {
    id: '5',
    name: 'William Park',
    role: 'Commercial Property Specialist',
    specialization: 'Commercial & Mixed-Use Developments',
    bio: 'William brings extensive experience in commercial real estate, specializing in prime CBD locations and mixed-use developments.',
    image: '/team/william.jpg',
    email: 'william@rgestate.com.au',
    phone: '+61 2 9XXX XXXX',
    linkedin: '#',
    stats: {
      propertiesSold: 85,
      yearsExperience: 14,
      clientSatisfaction: '96%'
    }
  },
  {
    id: '6',
    name: 'Sophie Laurent',
    role: 'Buyer\'s Advocate',
    specialization: 'Off-Market Acquisitions',
    bio: 'Sophie excels in sourcing exclusive off-market opportunities, leveraging her extensive network to secure premium properties before they reach the market.',
    image: '/team/sophie.jpg',
    email: 'sophie@rgestate.com.au',
    phone: '+61 2 9XXX XXXX',
    linkedin: '#',
    stats: {
      propertiesSold: 145,
      yearsExperience: 8,
      clientSatisfaction: '98%'
    }
  },
  {
    id: '7',
    name: 'Marcus Webb',
    role: 'Project Marketing Director',
    specialization: 'New Developments & Off-Plan Sales',
    bio: 'Marcus leads our project marketing initiatives, working closely with developers to bring Australia\'s most prestigious new developments to market.',
    image: '/team/marcus.jpg',
    email: 'marcus@rgestate.com.au',
    phone: '+61 2 9XXX XXXX',
    linkedin: '#',
    stats: {
      propertiesSold: 210,
      yearsExperience: 11,
      clientSatisfaction: '97%'
    }
  },
  {
    id: '8',
    name: 'Elena Vasquez',
    role: 'Client Relations Manager',
    specialization: 'International Clients & Relocations',
    bio: 'Elena provides white-glove service to our international clientele, facilitating seamless property acquisitions and relocations to Australia.',
    image: '/team/elena.jpg',
    email: 'elena@rgestate.com.au',
    phone: '+61 2 9XXX XXXX',
    linkedin: '#',
    stats: {
      yearsExperience: 7,
      clientSatisfaction: '99%'
    }
  }
];

const TeamV3: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [, setHoveredMember] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  const featuredMembers = teamData.filter(m => m.featured);
  const regularMembers = teamData.filter(m => !m.featured);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('tv3-visible');
            if (entry.target === statsRef.current) {
              setStatsVisible(true);
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.tv3-animate').forEach((el) => {
      observer.observe(el);
    });

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const AnimatedCounter: React.FC<{ end: number; suffix?: string; duration?: number }> = ({
    end,
    suffix = '',
    duration = 2000
  }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!statsVisible) return;

      let startTime: number;
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }, [statsVisible, end, duration]);

    return <span>{count}{suffix}</span>;
  };

  return (
    <div className="tv3-page">
      {/* ════════════════════════════════════════════════════════
          HERO SECTION
          ════════════════════════════════════════════════════════ */}
      <section className="tv3-hero" ref={heroRef}>
        <div className="tv3-hero__bg">
          <div className="tv3-hero__pattern"></div>
          <div className="tv3-hero__gradient"></div>
        </div>
        
        <div className="tv3-hero__content">
          <span className="rg-eyebrow tv3-animate">Our Team</span>
          <h1 className="tv3-hero__title tv3-animate">
            Meet the <em>Visionaries</em><br />
            Behind Your Property Journey
          </h1>
          <p className="tv3-hero__subtitle tv3-animate">
            A collective of Australia's most distinguished property professionals,
            united by an unwavering commitment to excellence and a passion for
            transforming real estate aspirations into reality.
          </p>
          
          <div className="tv3-hero__scroll">
            <div className="tv3-hero__scroll-line"></div>
            <span>Scroll to Explore</span>
          </div>
        </div>

        <div className="tv3-hero__floating">
          <div className="tv3-hero__float-card tv3-hero__float-card--1">
            <span className="tv3-hero__float-number">$2.8B+</span>
            <span className="tv3-hero__float-label">Total Sales Volume</span>
          </div>
          <div className="tv3-hero__float-card tv3-hero__float-card--2">
            <span className="tv3-hero__float-number">25+</span>
            <span className="tv3-hero__float-label">Years of Excellence</span>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          PHILOSOPHY SECTION
          ════════════════════════════════════════════════════════ */}
      <section className="tv3-philosophy">
        <div className="tv3-container">
          <div className="tv3-philosophy__grid">
            <div className="tv3-philosophy__content tv3-animate">
              <span className="rg-eyebrow">Our Philosophy</span>
              <h2 className="rg-section-title" style={{ textAlign: 'left' }}>
                Where <em>Expertise</em><br />Meets Dedication
              </h2>
              <p className="tv3-philosophy__text">
                We believe that exceptional real estate service transcends transactions.
                Our team embodies a philosophy rooted in deep market knowledge,
                authentic relationships, and an uncompromising dedication to our clients' success.
              </p>
              <p className="tv3-philosophy__text">
                Each member of our collective brings unique expertise,
                yet we share a unified vision: to redefine luxury real estate
                service across Australia's most prestigious markets.
              </p>
            </div>
            
            <div className="tv3-philosophy__values tv3-animate">
              {[
                { icon: '◈', title: 'Integrity', desc: 'Transparency in every interaction' },
                { icon: '◇', title: 'Excellence', desc: 'Uncompromising standards' },
                { icon: '○', title: 'Innovation', desc: 'Forward-thinking approach' },
                { icon: '□', title: 'Partnership', desc: 'Your success is our mission' }
              ].map((value, idx) => (
                <div className="tv3-value-card" key={idx}>
                  <span className="tv3-value-card__icon">{value.icon}</span>
                  <div>
                    <h4 className="tv3-value-card__title">{value.title}</h4>
                    <p className="tv3-value-card__desc">{value.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          LEADERSHIP SECTION
          ════════════════════════════════════════════════════════ */}
      <section className="tv3-leadership">
        <div className="tv3-container">
          <div className="tv3-section-header tv3-animate">
            <span className="rg-eyebrow">Leadership</span>
            <h2 className="rg-section-title">
              Guided by <em>Experience</em>
            </h2>
            <p className="rg-section-subtitle">
              Our leadership team combines decades of market expertise with
              a forward-thinking vision for Australian real estate.
            </p>
          </div>

          <div className="tv3-leadership__grid">
            {featuredMembers.map((member, idx) => (
              <article
                key={member.id}
                className={`tv3-leader-card tv3-animate`}
                style={{ '--delay': `${idx * 0.15}s` } as React.CSSProperties}
                onMouseEnter={() => setHoveredMember(member.id)}
                onMouseLeave={() => setHoveredMember(null)}
              >
                <div className="tv3-leader-card__image-wrap">
                  <div className="tv3-leader-card__image">
                    <div className="tv3-leader-card__placeholder">
                      <span>{member.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div className="tv3-leader-card__overlay">
                      <div className="tv3-leader-card__stats">
                        {member.stats?.propertiesSold && (
                          <div className="tv3-leader-card__stat">
                            <span className="tv3-leader-card__stat-value">
                              {member.stats.propertiesSold}+
                            </span>
                            <span className="tv3-leader-card__stat-label">Properties Sold</span>
                          </div>
                        )}
                        {member.stats?.yearsExperience && (
                          <div className="tv3-leader-card__stat">
                            <span className="tv3-leader-card__stat-value">
                              {member.stats.yearsExperience}
                            </span>
                            <span className="tv3-leader-card__stat-label">Years Experience</span>
                          </div>
                        )}
                        {member.stats?.clientSatisfaction && (
                          <div className="tv3-leader-card__stat">
                            <span className="tv3-leader-card__stat-value">
                              {member.stats.clientSatisfaction}
                            </span>
                            <span className="tv3-leader-card__stat-label">Client Satisfaction</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="tv3-leader-card__accent"></div>
                </div>

                <div className="tv3-leader-card__content">
                  <div className="tv3-leader-card__header">
                    <h3 className="tv3-leader-card__name">{member.name}</h3>
                    <p className="tv3-leader-card__role">{member.role}</p>
                    <span className="tv3-leader-card__spec">{member.specialization}</span>
                  </div>

                  <p className="tv3-leader-card__bio">{member.bio}</p>

                  <div className="tv3-leader-card__contact">
                    <a href={`mailto:${member.email}`} className="tv3-leader-card__link">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="2" y="4" width="20" height="16" rx="2"/>
                        <path d="M22 6L12 13L2 6"/>
                      </svg>
                      <span>Email</span>
                    </a>
                    <a href={`tel:${member.phone}`} className="tv3-leader-card__link">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      <span>Call</span>
                    </a>
                    {member.linkedin && (
                      <a href={member.linkedin} className="tv3-leader-card__link">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                          <rect x="2" y="9" width="4" height="12"/>
                          <circle cx="4" cy="4" r="2"/>
                        </svg>
                        <span>LinkedIn</span>
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          STATS BANNER
          ════════════════════════════════════════════════════════ */}
      <section className="tv3-stats" ref={statsRef}>
        <div className="tv3-stats__bg"></div>
        <div className="tv3-container">
          <div className="tv3-stats__grid">
            <div className="tv3-stat-item">
              <span className="tv3-stat-item__value">
                <AnimatedCounter end={1485} suffix="+" />
              </span>
              <span className="tv3-stat-item__label">Properties Sold</span>
            </div>
            <div className="tv3-stat-item">
              <span className="tv3-stat-item__value">
                $<AnimatedCounter end={2} suffix=".8B+" />
              </span>
              <span className="tv3-stat-item__label">Total Sales Volume</span>
            </div>
            <div className="tv3-stat-item">
              <span className="tv3-stat-item__value">
                <AnimatedCounter end={98} suffix="%" />
              </span>
              <span className="tv3-stat-item__label">Client Satisfaction</span>
            </div>
            <div className="tv3-stat-item">
              <span className="tv3-stat-item__value">
                <AnimatedCounter end={25} suffix="+" />
              </span>
              <span className="tv3-stat-item__label">Years of Excellence</span>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          TEAM GRID
          ════════════════════════════════════════════════════════ */}
      <section className="tv3-team">
        <div className="tv3-container">
          <div className="tv3-section-header tv3-animate">
            <span className="rg-eyebrow">The Collective</span>
            <h2 className="rg-section-title">
              Our <em>Expert</em> Team
            </h2>
            <p className="rg-section-subtitle">
              Each specialist brings unique expertise to deliver exceptional
              results across all facets of Australian real estate.
            </p>
          </div>

          <div className="tv3-filters tv3-animate">
            {['All', 'Sales', 'Management', 'Advisory'].map((filter) => (
              <button
                key={filter}
                className={`tv3-filter-btn ${activeFilter === filter.toLowerCase() ? 'tv3-filter-btn--active' : ''}`}
                onClick={() => setActiveFilter(filter.toLowerCase())}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="tv3-team__grid">
            {regularMembers.map((member, idx) => (
              <article
                key={member.id}
                className="tv3-member-card tv3-animate"
                style={{ '--delay': `${idx * 0.1}s` } as React.CSSProperties}
              >
                <div className="tv3-member-card__image">
                  <div className="tv3-member-card__placeholder">
                    <span>{member.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div className="tv3-member-card__hover">
                    <div className="tv3-member-card__quick-contact">
                      <a href={`mailto:${member.email}`} className="tv3-member-card__icon-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="2" y="4" width="20" height="16" rx="2"/>
                          <path d="M22 6L12 13L2 6"/>
                        </svg>
                      </a>
                      <a href={`tel:${member.phone}`} className="tv3-member-card__icon-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                      </a>
                      {member.linkedin && (
                        <a href={member.linkedin} className="tv3-member-card__icon-btn">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                            <rect x="2" y="9" width="4" height="12"/>
                            <circle cx="4" cy="4" r="2"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="tv3-member-card__content">
                  <h3 className="tv3-member-card__name">{member.name}</h3>
                  <p className="tv3-member-card__role">{member.role}</p>
                  <span className="tv3-member-card__spec">{member.specialization}</span>
                  
                  <div className="tv3-member-card__meta">
                    {member.stats?.yearsExperience && (
                      <span>{member.stats.yearsExperience} Years Exp.</span>
                    )}
                    {member.stats?.propertiesSold && (
                      <span>{member.stats.propertiesSold}+ Sales</span>
                    )}
                  </div>
                </div>

                <div className="tv3-member-card__cta">
                  <button className="tv3-member-card__btn">View Profile</button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          TESTIMONIAL / CULTURE SECTION
          ════════════════════════════════════════════════════════ */}
      <section className="tv3-culture">
        <div className="tv3-container">
          <div className="tv3-culture__grid">
            <div className="tv3-culture__image-grid tv3-animate">
              <div className="tv3-culture__img tv3-culture__img--1">
                <div className="tv3-culture__img-placeholder">
                  <span>Team Culture</span>
                </div>
              </div>
              <div className="tv3-culture__img tv3-culture__img--2">
                <div className="tv3-culture__img-placeholder">
                  <span>Office Life</span>
                </div>
              </div>
              <div className="tv3-culture__img tv3-culture__img--3">
                <div className="tv3-culture__img-placeholder">
                  <span>Events</span>
                </div>
              </div>
            </div>

            <div className="tv3-culture__content tv3-animate">
              <span className="rg-eyebrow">Our Culture</span>
              <h2 className="rg-section-title" style={{ textAlign: 'left' }}>
                Where <em>Ambition</em><br />Meets Collaboration
              </h2>
              <p className="tv3-culture__text">
                Our success is built on a foundation of mutual respect, continuous learning,
                and a shared commitment to excellence. We foster an environment where
                innovation thrives and every team member is empowered to achieve their potential.
              </p>

              <div className="tv3-culture__perks">
                <div className="tv3-perk">
                  <div className="tv3-perk__icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                  <div>
                    <h4>Continuous Development</h4>
                    <p>Industry-leading training and mentorship programs</p>
                  </div>
                </div>
                <div className="tv3-perk">
                  <div className="tv3-perk__icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M8 12l2 2 4-4"/>
                    </svg>
                  </div>
                  <div>
                    <h4>Work-Life Harmony</h4>
                    <p>Flexible arrangements that support your lifestyle</p>
                  </div>
                </div>
                <div className="tv3-perk">
                  <div className="tv3-perk__icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                  <div>
                    <h4>Collaborative Team</h4>
                    <p>Support and celebration of collective success</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          CTA SECTION
          ════════════════════════════════════════════════════════ */}
      <section className="tv3-cta">
        <div className="tv3-cta__bg">
          <div className="tv3-cta__pattern"></div>
        </div>
        <div className="tv3-container">
          <div className="tv3-cta__content tv3-animate">
            <span className="rg-eyebrow">Join Our Team</span>
            <h2 className="tv3-cta__title">
              Ready to Shape the<br />Future of <em>Real Estate</em>?
            </h2>
            <p className="tv3-cta__text">
              We're always looking for exceptional individuals who share our passion
              for excellence. Explore career opportunities with Australia's premier
              property collective.
            </p>
            <div className="tv3-cta__buttons">
              <a href="/careers" className="tv3-btn tv3-btn--primary">
                <span>View Opportunities</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
              <a href="/contact" className="tv3-btn tv3-btn--secondary">
                <span>Contact Us</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TeamV3;
