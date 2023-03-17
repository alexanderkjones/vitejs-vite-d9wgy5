import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
// https://stackoverflow.com/questions/73095592/octokit-js-not-working-with-vite-module-externalized-and-cannot-be-accessed-in/73095593#73095593
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "node-fetch": "isomorphic-fetch",
    },
  },
});
