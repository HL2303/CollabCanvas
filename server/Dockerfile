# Stage 1: Use an official Node.js runtime
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# --- EXPLICITLY COPY SOURCE CODE ---
# This is a more robust way to ensure all necessary files are included.
COPY index.js ./
COPY config ./config
COPY middleware ./middleware
COPY models ./models
COPY routes ./routes

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run your app
CMD [ "node", "index.js" ]
