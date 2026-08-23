import type { Metadata } from "next";
import VideoLooper from "@/components/tools/VideoLooper";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildToolSchema } from "@/lib/tool-schema";

const title = "Video Looper";
const description =
  "Loop YouTube videos, control playback speed, and practice your instrument efficiently.";
const path = "/tools/video-looper";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title: `${title} | Advance Bass`, description, url: path },
  twitter: { title: `${title} | Advance Bass`, description },
};

export default function VideoLooperPage() {
  return (
    <div className="container mx-auto py-8">
      <JsonLd data={buildToolSchema({ name: title, description, path })} />
      <VideoLooper />
    </div>
  );
}
