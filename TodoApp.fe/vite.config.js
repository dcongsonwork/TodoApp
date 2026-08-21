import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        watch: {
            ignored: ['**/.vs/**'],
        },
        proxy: {
            '/api': {
                target: 'https://localhost:7061',
                changeOrigin: true,
                secure: false,
            },
        },
    },
})