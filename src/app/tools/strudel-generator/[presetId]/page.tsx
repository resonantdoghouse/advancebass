import { notFound } from "next/navigation";
import { PRESETS } from "../presets";
import StrudelGeneratorClient from "./StrudelGeneratorClient";

export function generateStaticParams() {
  return PRESETS.map((preset) => ({ presetId: preset.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ presetId: string }>;
}) {
  const { presetId } = await params;
  const preset = PRESETS.find((p) => p.id === presetId);
  if (!preset) return {};

  const title = `${preset.name} — Strudel Music Generator`;
  const description = preset.description;
  const path = `/tools/strudel-generator/${preset.id}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${title} | Advance Bass`, description, url: path },
    twitter: { title: `${title} | Advance Bass`, description },
  };
}

export default async function StrudelGeneratorPage({
  params,
}: {
  params: Promise<{ presetId: string }>;
}) {
  const { presetId } = await params;
  if (!PRESETS.some((p) => p.id === presetId)) notFound();

  return <StrudelGeneratorClient />;
}
