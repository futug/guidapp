import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/api": {
                target: "https://testapi.cenergo.by",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, "/api/XLabEquipmentPublic"),
            },
        },
    },
});
