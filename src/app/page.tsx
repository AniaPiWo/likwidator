import { Landing } from "@/components/Landing";
import { checkUserInDatabase } from "@/actions/user";
import WhisperComponent from "@/components/WhisperComponent";

export default async function Home() {
  const user = await checkUserInDatabase();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {user ? <WhisperComponent /> : <Landing />}
    </main>
  );
}
