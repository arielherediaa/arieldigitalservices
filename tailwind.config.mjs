// tailwind.config.mjs

/** @type {import('tailwindcss').Config} */
export default {
    // THIS LINE IS ESSENTIAL
    darkMode: 'class',
    
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
      extend: {},
    },
    plugins: [],
  }