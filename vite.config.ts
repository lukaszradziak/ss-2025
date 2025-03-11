import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: './node_modules/potree/libs/jquery/jquery-3.1.1.min.js', dest: 'vendor' },
        { src: './node_modules/potree/libs/three.js/build/three.min.js', dest: 'vendor' },
        { src: './node_modules/potree/libs/other/BinaryHeap.js', dest: 'vendor' },
        { src: './node_modules/potree/libs/tween/tween.min.js', dest: 'vendor' },
        { src: './node_modules/potree/libs/proj4/proj4.js', dest: 'vendor' },
        { src: './node_modules/potree/libs/copc/index.js', dest: 'vendor/copc' },
        { src: './node_modules/potree/build/potree/potree.js', dest: 'vendor' },
        { src: './node_modules/potree/build/potree/workers/EptLaszipDecoderWorker.js', dest: 'vendor/workers' },
        { src: './node_modules/potree/build/potree/workers/laz-perf.wasm', dest: 'vendor/workers' },
      ]
    }),
  ],
})
