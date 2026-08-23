import { ImageResponse } from "next/og";
import { OgCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return new ImageResponse(
    <OgCard
      headline="Practice Tools"
      subtitle="12 free tools to sharpen your playing — all in your browser"
      badge="Tools"
    />,
    { ...OG_SIZE },
  );
}
