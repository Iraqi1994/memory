import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/memory/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        settings: resolve(__dirname, "src/pages/settings.html"),
        game: resolve(__dirname, "src/pages/game.html"),
      },
    },
  },
});
