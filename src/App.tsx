
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SupabaseProvider } from "./integrations/supabase/provider";
import ErrorBoundary from "./components/ErrorBoundary";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <SupabaseProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            <ErrorBoundary>
              <div className="min-h-screen flex flex-col">
                <Toaster />
                <Sonner />
                <Index />
              </div>
            </ErrorBoundary>
          </TooltipProvider>
        </ThemeProvider>
      </SupabaseProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
