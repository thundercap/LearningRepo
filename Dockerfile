# Use an official Node runtime as a parent image
FROM node:16-alpine AS build
# Set the working directory
WORKDIR /app
# Copy package.json and package-lock.json (if present)
COPY package.json package-lock.json* ./
# Install dependencies
RUN npm install
# Copy the rest of the application code
COPY . .
# Build the React application
RUN npm run build

# Use a lightweight web server to serve the static files
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port 80
EXPOSE 80
# Start the web server
CMD ["nginx", "-g", "daemon off;"]