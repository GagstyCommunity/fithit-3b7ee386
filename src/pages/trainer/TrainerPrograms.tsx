import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProgramBuilder } from "@/components/trainer/ProgramBuilder";

export default function TrainerPrograms() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Program Builder</h1>
        <p className="text-muted-foreground">
          Create and manage training programs for your clients.
        </p>
      </div>
      
      <ProgramBuilder />
    </DashboardLayout>
  );
}