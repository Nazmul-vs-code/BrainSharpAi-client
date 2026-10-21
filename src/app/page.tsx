import GridPulseBackground from "@/components/ui/GridPulseBackground";
import BrainSharpHero from "@/components/sections/BrainSharpHero";

export default function Home() {
  return (
    <main className="relative flex min-h-[calc(100vh-64px)] flex-col">
      <GridPulseBackground />
      <BrainSharpHero />
    </main>
  );
}
