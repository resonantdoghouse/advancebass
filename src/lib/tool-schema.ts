export function buildToolSchema({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url: `https://advancebass.com${path}`,
    applicationCategory: "MusicApplication",
    operatingSystem: "Any (runs in browser)",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Person",
      name: "Jim Bennett",
      url: "https://advancebass.com",
    },
  };
}
