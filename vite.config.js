import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteMockServe } from "vite-plugin-mock";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteMockServe({
      mockPath: "mock",
      localEnabled: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // 添加代理配置解决CORS问题
server: {
  proxy: {
    '/api/coze': {
      target: 'https://api.coze.cn',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/coze/, ''),
      headers: {
        'Origin': 'https://api.coze.cn'
      }
    }
  }
}
});