import type { TeamPageData } from "@/types/teamPage";

const API_BASE = (
  import.meta.env.VITE_API_URL ??
  import.meta.env.VITE_API_BASE_URL ??
  ""
).replace(/\/$/, "");

export const DEFAULT_TEAM_PAGE_DATA: TeamPageData = {
  id: 0,
  title: "Team",
  slug: "team",
  updated_at: null,
  sections: {
    hero: {
      title_line_1: "Meet Our",
      title_line_2: "Expert [gold]Team[/gold]",
      subtitle:
        "A curated ensemble of creative minds and industry veterans shaping the future of luxury real estate.",
      background_image: null,
      background_image_url: "images/about-hero.jpg",
      show_video: false,
      background_video_url: "",
      mode: "buttons",
      buttons: [
        {
          label: "Book a Consultation",
          href: "/contact",
          style: "gold",
          open_in_new_tab: false,
        },
      ],
      stats: [],
    },
    team_section: {
      eyebrow: "Our People",
      title_line_1: "The Minds",
      title_line_2: "[gold]Behind[/gold] Every Deal",
      subtitle:
        "A curated ensemble of creative minds and industry veterans — each bringing unmatched expertise to every client engagement.",
      members: [
        {
          id: 1,
          slug: "rahul-singh",
          name: "Rahul Singh",
          role: "Founder & Chief Executive",
          bio: "Founder and driving force behind RGP, building a boutique luxury real estate agency from the ground up. Brings a sharp investor mindset and deep market insight to every client engagement.",
          image: "images/rahul-singh.jpg",
          stats: [
            { value: "5+", label: "Years" },
            { value: "$850M", label: "Volume" },
            { value: "120+", label: "Properties" },
          ],
          tags: ["Luxury Estates", "Investment Strategy", "Market Analysis"],
          email: "rahul@luxestate.com",
          phone: "+61450009291",
          social: { linkedin: "#" },
          order: 0,
          is_active: true,
        },
        {
          id: 2,
          slug: "sarah-chen",
          name: "Sarah Chen",
          role: "Senior Property Agent",
          bio: "Specialist in premium residential properties with a sharp eye for matching clients to their ideal home. Known for a patient, consultative approach and strong follow-through.",
          image: "images/team3.png",
          stats: [
            { value: "5", label: "Years" },
            { value: "$180M", label: "Closed" },
            { value: "96%", label: "Retention" },
          ],
          tags: ["Luxury Residential", "Buyer Consulting", "New Developments"],
          email: "sarah@luxestate.com",
          phone: "+61400000002",
          social: { linkedin: "#" },
          order: 1,
          is_active: true,
        },
        {
          id: 3,
          slug: "michael-ross",
          name: "Michael Ross",
          role: "Senior Property Agent",
          bio: "Trusted for seamless transactions and deep local market knowledge. Specialises in off-market opportunities and exclusive listings for private clients.",
          image: "images/team4.png",
          stats: [
            { value: "5", label: "Years" },
            { value: "$220M", label: "Closed" },
            { value: "60+", label: "Properties" },
          ],
          tags: ["Off-Market Listings", "Negotiations", "Premium Rentals"],
          email: "michael@luxestate.com",
          phone: "+61400000003",
          social: { linkedin: "#" },
          order: 2,
          is_active: true,
        },
        {
          id: 4,
          slug: "emma-williams",
          name: "Emma Williams",
          role: "Property Agent",
          bio: "Detail-oriented agent with a background in interior design, offering clients a unique perspective on property potential, layout, and value-add opportunities.",
          image: "images/team2.png",
          stats: [
            { value: "3", label: "Years" },
            { value: "$95M", label: "Closed" },
            { value: "40+", label: "Properties" },
          ],
          tags: ["Residential Sales", "Interior Advisory", "First-Time Buyers"],
          email: "emma@luxestate.com",
          phone: "+61400000004",
          social: { linkedin: "#" },
          order: 3,
          is_active: true,
        },
        {
          id: 5,
          slug: "david-park",
          name: "David Park",
          role: "Property Agent",
          bio: "Results-driven agent with strong analytical skills and an investor mindset. Guides clients through both end-use and investment purchases with clarity and confidence.",
          image: "images/team5.png",
          stats: [
            { value: "2", label: "Years" },
            { value: "$75M", label: "Closed" },
            { value: "35+", label: "Properties" },
          ],
          tags: ["Investment Properties", "Resale", "Market Analysis"],
          email: "david@luxestate.com",
          phone: "+61400000005",
          social: { linkedin: "#" },
          order: 4,
          is_active: true,
        },
      ],
    },
  },
};

export async function fetchTeamPage(signal?: AbortSignal): Promise<TeamPageData> {
  const res = await fetch(`${API_BASE}/api/pages/team/`, {
    headers: { Accept: "application/json" },
    signal,
  });

  if (!res.ok) throw new Error(`Team page fetch failed: ${res.status}`);
  return res.json() as Promise<TeamPageData>;
}
