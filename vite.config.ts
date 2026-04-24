import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

export default defineConfig({
  plugins: [
    react(),
    babel({
      include: /\/src\/.*\.[jt]sx?$/,
      sourceMap: false,
      presets: [reactCompilerPreset()],
    }),
  ],
  optimizeDeps: {
    include: ['@xyflow/react', 'lucide-react', 'react', 'react-dom'],
  },
})
