import { Landing } from "@/components/Landing";
import { Dashboard } from "@/components/Dashboard";
import { checkUserInDatabase } from "@/actions/user";
import { VoiceInput } from "@/components/VoiceInput";

export default async function Home() {
  const user = await checkUserInDatabase();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {user ? <Dashboard /> : <Landing />}
      <VoiceInput />
    </main>
  );
}
