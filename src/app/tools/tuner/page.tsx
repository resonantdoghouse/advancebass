import { Tuner } from "@/components/tools/Tuner";

export const metadata = {
  title: "Online Bass Tuner | Advance Bass",
  description: "Free online bass tuner with microphone and ear training modes. Supports 4, 5, and 6 string basses with standard and alternate tunings.",
};

export default function TunerPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">Bass Tuner</h1>
          <p className="text-xl text-muted-foreground">
            Tune your bass with precision using our chromatic tuner or reference tones.
          </p>
        </div>
        
        <div className="flex justify-center">
            <Tuner />
        </div>
      </div>
    </div>
  );
}
