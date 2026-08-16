import { ToolsDock } from "@/components/tools/dock/ToolsDock";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <ToolsDock />
    </>
  );
}
