/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: [
	  './pages/**/*.{ts,tsx}',
	  './components/**/*.{ts,tsx}',
	  './app/**/*.{ts,tsx}',
	  './src/**/*.{ts,tsx}',
	],
	prefix: "",
	theme: {
	  container: {
		center: true,
		padding: "2rem",
		screens: {
		  "2xl": "1400px",
		},
	  },
	  extend: {
		colors: {
		  border: "hsl(var(--border))",
		  input: "hsl(var(--input))",
		  ring: "hsl(var(--ring))",
		  background: "hsl(var(--background))",
		  foreground: "hsl(var(--foreground))",
		  // Custom Color Palette
		  sand: {
			DEFAULT: '#dda853',
			light: '#e8be7a',
			dark: '#c68d3a',
		  },
		  cyan: {
			DEFAULT: '#84f4e6',
			light: '#a8f7ee',
			dark: '#5de0cc',
		  },
		  slate: {
			DEFAULT: '#1a5059',
			light: '#2b6c78',
			dark: '#0f3a42',
		  },
		  sage: {
			DEFAULT: '#5c986a',
			light: '#7aae87',
			dark: '#477754',
		  },
		  cream: {
			DEFAULT: '#c5d9a9',
			light: '#d8e5c3',
			dark: '#a9c381',
		  },
		  teal: {
			DEFAULT: '#2b515a',
			light: '#3d6b76',
			dark: '#1d3a42',
		  },
		  primary: {
			DEFAULT: "hsl(var(--primary))",
			foreground: "hsl(var(--primary-foreground))",
		  },
		  secondary: {
			DEFAULT: "hsl(var(--secondary))",
			foreground: "hsl(var(--secondary-foreground))",
		  },
		  destructive: {
			DEFAULT: "hsl(var(--destructive))",
			foreground: "hsl(var(--destructive-foreground))",
		  },
		  muted: {
			DEFAULT: "hsl(var(--muted))",
			foreground: "hsl(var(--muted-foreground))",
		  },
		  accent: {
			DEFAULT: "hsl(var(--accent))",
			foreground: "hsl(var(--accent-foreground))",
		  },
		  popover: {
			DEFAULT: "hsl(var(--popover))",
			foreground: "hsl(var(--popover-foreground))",
		  },
		  card: {
			DEFAULT: "hsl(var(--card))",
			foreground: "hsl(var(--card-foreground))",
		  },
		  sidebar: {
			DEFAULT: "hsl(var(--sidebar-background))",
			foreground: "hsl(var(--sidebar-foreground))",
			primary: "hsl(var(--sidebar-primary))",
			"primary-foreground": "hsl(var(--sidebar-primary-foreground))",
			accent: "hsl(var(--sidebar-accent))",
			"accent-foreground": "hsl(var(--sidebar-accent-foreground))",
			border: "hsl(var(--sidebar-border))",
			ring: "hsl(var(--sidebar-ring))",
		  },
		},
		borderRadius: {
		  lg: "var(--radius)",
		  md: "calc(var(--radius) - 2px)",
		  sm: "calc(var(--radius) - 4px)",
		},
		keyframes: {
		  "accordion-down": {
			from: { height: "0" },
			to: { height: "var(--radix-accordion-content-height)" },
		  },
		  "accordion-up": {
			from: { height: "var(--radix-accordion-content-height)" },
			to: { height: "0" },
		  },
		  fadeInUp: {
			'0%': { opacity: '0', transform: 'translateY(30px)' },
			'100%': { opacity: '1', transform: 'translateY(0)' },
		  },
		  fadeInDown: {
			'0%': { opacity: '0', transform: 'translateY(-30px)' },
			'100%': { opacity: '1', transform: 'translateY(0)' },
		  },
		  slideInLeft: {
			'0%': { opacity: '0', transform: 'translateX(-50px)' },
			'100%': { opacity: '1', transform: 'translateX(0)' },
		  },
		  slideInRight: {
			'0%': { opacity: '0', transform: 'translateX(50px)' },
			'100%': { opacity: '1', transform: 'translateX(0)' },
		  },
		  scaleIn: {
			'0%': { opacity: '0', transform: 'scale(0.9)' },
			'100%': { opacity: '1', transform: 'scale(1)' },
		  },
		  float: {
			'0%, 100%': { transform: 'translateY(0px)' },
			'50%': { transform: 'translateY(-20px)' },
		  },
		  'pulse-glow': {
			'0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(132, 244, 230, 0.4)' },
			'50%': { opacity: '0.8', boxShadow: '0 0 40px rgba(132, 244, 230, 0.6)' },
		  },
		  'gradient-shift': {
			'0%': { backgroundPosition: '0% 50%' },
			'50%': { backgroundPosition: '100% 50%' },
			'100%': { backgroundPosition: '0% 50%' },
		  },
		},
		animation: {
		  "accordion-down": "accordion-down 0.2s ease-out",
		  "accordion-up": "accordion-up 0.2s ease-out",
		  'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
		  'fade-in-down': 'fadeInDown 0.6s ease-out forwards',
		  'slide-in-left': 'slideInLeft 0.6s ease-out forwards',
		  'slide-in-right': 'slideInRight 0.6s ease-out forwards',
		  'scale-in': 'scaleIn 0.5s ease-out forwards',
		  'float': 'float 3s ease-in-out infinite',
		  'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
		  'gradient-shift': 'gradient-shift 8s ease infinite',
		},
		backdropBlur: {
		  xs: '2px',
		},
	  },
	},
	plugins: [require("tailwindcss-animate")],
  }