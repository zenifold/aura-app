import { UserButton } from "@clerk/nextjs";

export default function DashboardPage() {
  return (
    <div className="p-6">
      <nav className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Aura Dashboard</h1>
        <UserButton afterSignOutUrl="/"/>
      </nav>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Welcome to Aura</h2>
        <p>Your task management dashboard is ready to go!</p>
      </div>
    </div>
  );
}
