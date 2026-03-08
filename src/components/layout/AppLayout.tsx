import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AppSidebar } from "./AppSidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      {!isMobile && (
        <aside className="sticky top-0 h-screen w-64 shrink-0 border-r bg-sidebar">
          <AppSidebar />
        </aside>
      )}

      {/* Mobile header + sheet */}
      {isMobile && (
        <>
          <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center border-b bg-background/80 backdrop-blur-sm px-4">
            <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <span className="ml-2 text-lg font-bold">DevStories</span>
          </header>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent side="left" className="w-64 p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <AppSidebar onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
        </>
      )}

      <main className={`flex-1 ${isMobile ? "pt-14" : ""}`}>
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
