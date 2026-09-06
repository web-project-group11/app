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

# Expose port 3001 to the outside world
EXPOSE 3001

# Start the application using npm run dev which starts it with nodemon
CMD ["npm", "run", "dev"]