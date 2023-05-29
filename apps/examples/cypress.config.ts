import { defineConfig } from "cypress";

export default defineConfig({
  retries: {
    runMode: 2,
  },
  e2e: {
    baseUrl: "http://localhost:3010",
  },
});
