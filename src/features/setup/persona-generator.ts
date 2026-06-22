import { CompanyContext, RecruiterPersona } from "@/types";

export function generatePersona(context: CompanyContext): RecruiterPersona {
  const nameLower = context.companyName.toLowerCase();

  if (nameLower.includes("stripe")) {
    return {
      name: "Sarah Chen",
      role: "Principal Recruiting Partner (Stripe Core)",
      traits: ["Direct", "High ownership", "Fast execution", "Technical depth"],
      communicationStyle: "Direct, high bandwidth, focused on engineering ownership and velocity.",
      objective: "Identify and qualify top-tier software engineers who thrive in fast-paced execution environments and build robust financial platforms.",
    };
  }

  if (nameLower.includes("notion")) {
    return {
      name: "Elena Rostova",
      role: "Lead Talent Designer (Notion Craft)",
      traits: ["Product focused", "Detail oriented", "Community driven", "Creative"],
      communicationStyle: "Craft-oriented, thoughtful, detail-driven, and highly focused on product aesthetics and values.",
      objective: "Qualify engineers and designers who care deeply about tool-building, visual design, user experience, and structural simplicity.",
    };
  }

  if (nameLower.includes("openai")) {
    return {
      name: "Dr. Marcus Vance",
      role: "Director of Frontier Talent (OpenAI Research)",
      traits: ["Research minded", "Mission driven", "Strategic", "Long-term thinker"],
      communicationStyle: "Visionary, intellectually rigorous, strategic, and highly focused on scaling safe artificial general intelligence.",
      objective: "Qualify world-class researchers and engineers aligned with building safe AGI, prioritizing deep technical competence and strategic mission fit.",
    };
  }

  // Fallback / Default persona
  return {
    name: "Aria Mercer",
    role: "Autonomous Recruiting Partner",
    traits: ["Analytical", "High-integrity", "Extremely responsive", "Candid"],
    communicationStyle: "Direct, concise, and technical with deep understanding of general engineering challenges.",
    objective: `Successfully discover and qualify exceptional candidates for ${context.companyName} by matching goals with cultural traits like ${context.cultureTraits.slice(0, 3).join(", ")}.`,
  };
}
