import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        proxy: {
            // Chuyển tiếp tất cả yêu cầu /api đến backend
            "/api": {
                target: "http://localhost:8080",
                changeOrigin: true,
            },
            // Chuyển tiếp tất cả yêu cầu /images đến backend
            "/images": {
                target: "http://localhost:8080",
                changeOrigin: true,
            },
        },
    },
});
