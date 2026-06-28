import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Vite 8 changed CJS default-export interop (Rolldown migration), which
  // breaks default imports from packages like lottie-react and
  // react-bootstrap ("Element type is invalid... but got: object").
  // This restores the pre-8.0 behavior. Remove once those packages ship
  // proper ESM/interop support.
  legacy: {
    inconsistentCjsInterop: true,
  },
})
