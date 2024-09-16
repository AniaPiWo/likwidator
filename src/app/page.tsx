import { Landing } from "@/components/Landing";
import { checkUserInDatabase } from "@/actions/user";
import WhisperComponent from "@/components/WhisperComponent";
import { Dashboard } from "@/components/Dashboard";

export default async function Home() {
  const user = await checkUserInDatabase();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {user ? <Dashboard /> : <Landing />}
    </main>
  );
}
