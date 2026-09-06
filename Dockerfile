# Use Node.js 24 as the base image
FROM node:24

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Expose port 5173 for Vite development server
EXPOSE 5173

# Start the Vite development server
CMD ["npm", "run", "dev"]