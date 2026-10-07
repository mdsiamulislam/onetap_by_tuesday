/* ==========================================================================
   data.js — ALL editable content lives here.
   app.js only consumes these objects. To connect an API later, replace
   loadProfile() in app.js with: fetch("/api/profile/123").then(r => r.json())
   ========================================================================== */

// Images come from the internet (no local static images).
const photo = (seed) => `https://picsum.photos/seed/${seed}/480/480`;
const gallery = (seed) => [1, 2, 3, 4, 5, 6].map((i) => photo(`${seed}${i}`));

/* Site-level settings (brand + call-to-action target) */
const siteData = {
  brand: "Tapfolio",
  ctaHref: "mailto:hello@example.com?subject=Create%20my%20NFC%20profile"
};

/* Main demo profile — drives the hero, demo, card and comparison sections */
const profileData = {
  name: "Arafat Rahman",
  title: "Founder & Creative Director",
  company: "Tuesday Studio",
  bio: "Building meaningful brands and digital experiences.",
  avatar: "https://i.pravatar.cc/320?img=12",
  accent: "#2b50f5",

  contact: {
    phone: "+8801700000000",
    email: "hello@tuesdaystudio.com",
    website: "https://tuesdaystudio.com",
    whatsapp: "8801700000000",
    location: "Dhaka, Bangladesh"
  },

  social: {
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    linkedin: "https://linkedin.com/",
    youtube: "https://youtube.com/"
  },

  about:
    "I help founders and growing companies shape their brand, launch their website and reach the right audience. Ten years of design and product work, one small team.",

  servicesLabel: "Services",
  services: ["Branding", "Web Development", "Digital Marketing", "UI Design", "Packaging"],

  galleryLabel: "Recent work",
  gallery: gallery("tuesday"),

  sections: ["about", "contact", "services", "gallery"],
  note: "Studio founder with a full portfolio."
};

/* Customization section — same profile system, different content */
const profileVariants = {
  personal: {
    ...profileData,
    label: "Personal",
    name: "Sara Ahmed",
    title: "Photographer & Traveler",
    company: "Wandering Frames",
    bio: "Stories from the road, one frame at a time.",
    avatar: "https://i.pravatar.cc/320?img=47",
    accent: "#0e9f6e",
    about: "I photograph places and the people who live in them. Find my prints, travel notes and booking details here.",
    servicesLabel: "Interests",
    services: ["Travel", "Street photography", "Film", "Hiking"],
    galleryLabel: "Favorite shots",
    gallery: gallery("sara"),
    sections: ["about", "gallery", "services", "contact"],
    note: "Gallery first, softer green accent."
  },
  business: {
    ...profileData,
    label: "Business",
    note: "Services and contact first, cobalt accent.",
    sections: ["services", "about", "contact", "gallery"]
  },
  creator: {
    ...profileData,
    label: "Creator",
    name: "Tanvir Hasan",
    title: "Video Creator",
    company: "Tanvir Creates",
    bio: "Short films, tech reviews and behind-the-scenes.",
    avatar: "https://i.pravatar.cc/320?img=15",
    accent: "#e5484d",
    about: "I make videos about gadgets, creativity and everyday life. Reach out for sponsorships and collaborations.",
    servicesLabel: "Content",
    services: ["Reviews", "Short films", "Tutorials", "Collaborations"],
    galleryLabel: "Latest videos",
    gallery: gallery("tanvir"),
    sections: ["gallery", "services", "about", "contact"],
    note: "Videos first, bold red accent."
  },
  professional: {
    ...profileData,
    label: "Professional",
    name: "Farhana Islam",
    title: "Senior Architect",
    company: "Form & Light",
    bio: "Designing homes that feel calm and last long.",
    avatar: "https://i.pravatar.cc/320?img=45",
    accent: "#7a4bdb",
    about: "Licensed architect with 12 years of residential and commercial experience. Available for consultations and project reviews.",
    servicesLabel: "Expertise",
    services: ["Residential", "Interior planning", "Site review", "Consulting"],
    galleryLabel: "Projects",
    gallery: gallery("farhana"),
    sections: ["about", "services", "gallery", "contact"],
    note: "About and expertise first, violet accent."
  }
};
