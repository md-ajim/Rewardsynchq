/**
 * Helper to get a realistic, relevant emoji based on the category name or slug.
 */
export function getCategoryEmoji(name: string, slug?: string): string {
  const lowerName = name.toLowerCase();
  const lowerSlug = (slug || "").toLowerCase();

  // Sports & Games
  if (lowerName.includes("baseball") || lowerName.includes("softball")) return "⚾";
  if (lowerName.includes("soccer") || lowerName.includes("football")) return "⚽";
  if (lowerName.includes("basketball")) return "🏀";
  if (lowerName.includes("tennis")) return "🎾";
  if (lowerName.includes("golf")) return "⛳";
  if (lowerName.includes("cricket")) return "🏏";
  if (lowerName.includes("running") || lowerName.includes("cardio") || lowerName.includes("fitness") || lowerName.includes("gym") || lowerName.includes("treadmill")) return "🏃";
  if (lowerName.includes("sport") || lowerName.includes("activewear") || lowerName.includes("athletic")) return "👟";
  
  // Clothing & Fashion
  if (lowerName.includes("clothing") || lowerName.includes("apparel") || lowerName.includes("wear") || lowerName.includes("fashion") || lowerName.includes("dress") || lowerName.includes("garment")) return "👗";
  if (lowerName.includes("shoes") || lowerName.includes("footwear")) return "👟";
  if (lowerName.includes("jewelry") || (lowerName.includes("accessories") && (lowerName.includes("bag") || lowerName.includes("watch") || lowerName.includes("glass")))) return "💎";
  
  // Electronics & Technology
  if (lowerName.includes("hard drive") || lowerName.includes("disques durs") || lowerName.includes("disk") || lowerName.includes("storage") || lowerName.includes("usb")) return "💾";
  if (lowerName.includes("software") || lowerName.includes("program") || lowerName.includes("hosting") || lowerName.includes("domain") || lowerName.includes("server")) return "🖥️";
  if (lowerName.includes("apps") || lowerName.includes("app") || lowerName.includes("application")) return "📱";
  if (lowerName.includes("electronics") || lowerName.includes("gadget") || lowerName.includes("phone") || lowerName.includes("computer") || lowerName.includes("laptop")) return "💻";
  
  // Security & Enterprise
  if (lowerName.includes("access control") || lowerName.includes("security") || lowerName.includes("safety") || lowerName.includes("firewall") || lowerName.includes("lock")) return "🔒";
  if (lowerName.includes("b2b") || lowerName.includes("business") || lowerName.includes("corporate") || lowerName.includes("office")) return "💼";
  
  // Health & Beauty
  if (lowerName.includes("health") || lowerName.includes("medical") || lowerName.includes("medicine") || lowerName.includes("wellness") || lowerName.includes("pharmacy") || lowerName.includes("vitamin")) return "💊";
  if (lowerName.includes("beauty") || lowerName.includes("cosmetic") || lowerName.includes("makeup") || lowerName.includes("perfume") || lowerName.includes("salon")) return "💄";
  
  // Travel & Food
  if (lowerName.includes("travel") || lowerName.includes("flight") || lowerName.includes("hotel") || lowerName.includes("trip") || lowerName.includes("vacation")) return "✈️";
  if (lowerName.includes("food") || lowerName.includes("beverage") || lowerName.includes("restaurant") || lowerName.includes("drink") || lowerName.includes("grocery")) return "🍔";
  
  // Play & Entertainment
  if (lowerName.includes("gaming") || lowerName.includes("game") || lowerName.includes("console") || lowerName.includes("playstation") || lowerName.includes("xbox")) return "🎮";
  if (lowerName.includes("toy") || lowerName.includes("baby") || lowerName.includes("kids") || lowerName.includes("child") || lowerName.includes("doll")) return "🧸";
  if (lowerName.includes("music") || lowerName.includes("audio") || lowerName.includes("song") || lowerName.includes("headphone") || lowerName.includes("speaker")) return "🎵";
  if (lowerName.includes("movie") || lowerName.includes("video") || lowerName.includes("cinema") || lowerName.includes("tv")) return "🎬";
  
  // Home & Gardening
  if (lowerName.includes("home") || lowerName.includes("garden") || lowerName.includes("furniture") || lowerName.includes("kitchen") || lowerName.includes("appliance")) return "🏡";
  
  // Finance
  if (lowerName.includes("finance") || lowerName.includes("bank") || lowerName.includes("money") || lowerName.includes("credit") || lowerName.includes("invest")) return "💳";
  
  // Automotive
  if (lowerName.includes("automotive") || lowerName.includes("car") || lowerName.includes("motorcycle") || lowerName.includes("vehicle") || lowerName.includes("tire")) return "🚗";
  
  // Fallbacks by keywords in slug
  if (lowerSlug.includes("app") || lowerSlug.includes("software")) return "💻";
  if (lowerSlug.includes("fashion") || lowerSlug.includes("clothing")) return "👗";
  
  // Default to a folder/tag/deal icon if no matches
  return "🏷️";
}
