import BrainSharpHero from "@/components/sections/BrainSharpHero";
import LeaderboardShowcase from "@/components/home/LeaderboardShowcase";
import QuestDemo from "@/components/home/QuestDemo";
import FeatureRequestForm from "@/components/home/FeatureRequestForm";

export default function Home() {
  return (
    <main className="relative flex min-h-[calc(100vh-64px)] flex-col">
      {/* <GridPulseBackground /> */}
      <BrainSharpHero />
      <QuestDemo />
      <LeaderboardShowcase />
      <FeatureRequestForm />
    </main>
  );
}
