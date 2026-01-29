import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import viteImagemin from 'vite-plugin-imagemin';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
                secure: false,
            }
        }
      },
      plugins: [
        react(),
        viteImagemin({
          gifsicle: { optimizationLevel: 7 },
          optipng: { optimizationLevel: 7 },
          mozjpeg: { quality: 20 },
          pngquant: { quality: [0.8, 0.9], speed: 4 },
        }),
      ],
      // Removed API Key exposure via 'define'.
      // Keys are now handled by the BFF server.
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
