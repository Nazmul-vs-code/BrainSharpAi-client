import BrainSharpHero from "@/components/sections/BrainSharpHero";
import LeaderboardShowcase from "@/components/home/LeaderboardShowcase";

export default function Home() {
  return (
    <main className="relative flex min-h-[calc(100vh-64px)] flex-col">
      {/* <GridPulseBackground /> */}
      <BrainSharpHero />
      <LeaderboardShowcase/>
    </main>
  );
}
