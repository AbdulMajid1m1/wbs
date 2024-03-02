/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'smm': '440px',
        // => @media (min-width: 640px) { ... }
  
        'sm': '640px',
        // => @media (min-width: 640px) { ... }
  
        'md': '768px',
        // => @media (min-width: 1024px) { ... }
  
        'lg': '1024px',
        // => @media (min-width: 1280px) { ... }
        
        'xl': '1280px',
        // => @media (min-width: 1280px) { ... }

        '2xl': '1536px',
        // => @media (min-width: 1280px) { ... }

        '3xl': '1836px',
        // => @media (min-width: 1280px) { ... }
    },
    colors: {
      'gtrack-primary': '#FF693A',    // Main Color
      'gtrack-secondary': '#021F69',  
      // 'border-color': '#8E9CAB',
      // 'digital-color': '#A9A9A9',  
      // 'capture': '#E02266',  
      // 'share': '#1DAE11',  
      // 'orange': '#F98E1A',
      // 'cpanel': '#F28C28',
    },
  },
}
}