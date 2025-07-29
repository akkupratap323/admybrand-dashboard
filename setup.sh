#!/bin/bash

# Install dependencies
npm install @faker-js/faker @radix-ui/react-dialog @radix-ui/react-popover @radix-ui/react-select @radix-ui/react-slot @tanstack/react-table class-variance-authority clsx date-fns framer-motion lucide-react next next-themes react react-day-picker react-dom recharts tailwind-merge tailwindcss-animate

# Install dev dependencies
npm install -D @types/node @types/react @types/react-dom autoprefixer eslint eslint-config-next postcss tailwindcss typescript

# Create required directories
mkdir -p src/components/ui src/lib/utils src/lib/hooks

# Install and set up Shadcn UI
npx shadcn-ui init

# Build the project
npm run build