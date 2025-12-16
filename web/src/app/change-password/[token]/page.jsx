import CreateNewPassword from "@/components/auth/createNewPassword";

export default async function Page({ params }) {
  const { token } = await params;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">FitTracker</h1>
          <p className="text-muted-foreground">
            Өчигдрөөс 1% илүү
          </p>
        </div>

        <div>
          <CreateNewPassword token={token} />
        </div>
      </div>
    </div>
  );
}
