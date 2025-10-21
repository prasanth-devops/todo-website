# Use official Nginx image as base
FROM nginx:latest

# Copy your website files to Nginx default HTML directory
COPY . /usr/share/nginx/html

# Expose port 80 for web traffic
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
