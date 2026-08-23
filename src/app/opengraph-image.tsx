import { ImageResponse } from "next/og";
import { OgCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return new ImageResponse(
    <OgCard
      headline="Master the Low End"
      subtitle="Free bass tools, studio-quality transcriptions & expert instruction"
    />,
    { ...OG_SIZE },
  );
}
