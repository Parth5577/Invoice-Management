# Use Node.js version 20 as the base image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Install Angular CLI
RUN npm install -g @angular/cli@19.0.1

# Copy the Angular project files
COPY . .

# Build the Angular project
RUN npm run build --prod

# Expose the port the app runs on
EXPOSE 4200

# Command to run the Angular app
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200", "--disable-host-check"]
