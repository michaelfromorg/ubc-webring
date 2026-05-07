import { ThemeProvider } from "next-themes";
import WebRing from "@/components/webring";

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <WebRing />
    </ThemeProvider>
  );
}
