import PageIllustration from "@/components/page-illustration";
import Header from "@/components/ui/header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
  <>          
 <Header />
<main className="relative flex grow flex-col pt-6"> {/* 👈 Add top padding here */}
  <PageIllustration multiple />
  {children}
</main>
    </>
  );
}
