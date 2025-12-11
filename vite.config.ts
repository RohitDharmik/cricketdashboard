import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0", // Allow access from external devices during local development
    port: 8080, // Port for local development, Netlify and Vercel handle this for production
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist", // This should be 'dist' as this is the default output for Vite
    // Optionally, set target or other build options if needed
    target: "esnext", // Adjust target for modern browsers
  },
}));
