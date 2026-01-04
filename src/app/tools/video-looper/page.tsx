import type { Metadata } from "next";
import VideoLooper from "@/components/tools/VideoLooper";

export const metadata: Metadata = {
  title: "Video Looper | AdvanceBass",
  description:
    "Loop YouTube videos, control playback speed, and practice your instrument efficiently.",
};

export default function VideoLooperPage() {
  return (
    <div className="container mx-auto py-8">
      <VideoLooper />
    </div>
  );
}
