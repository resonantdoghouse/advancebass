import { ImageResponse } from "next/og";
import { getArticleBySlug } from "@/lib/data";
import { OgCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-image";

// Must use nodejs runtime — getArticleBySlug reads the filesystem via Node APIs
export const runtime = "nodejs";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

type Props = {
  params: Promise<{ category: string; slug: string }>;
};

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  const headline = article?.title ?? "Advance Bass Transcription";
  const subtitle = article?.tags?.length
    ? article.tags.join(" · ")
    : "Bass transcription by Jim Bennett";

  return new ImageResponse(
    <OgCard headline={headline} subtitle={subtitle} badge="Transcription" />,
    { ...OG_SIZE },
  );
}
