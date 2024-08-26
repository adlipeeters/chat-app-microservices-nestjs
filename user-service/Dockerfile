# Dockerfile for producer-service

# Use the official Node.js image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Expose port and start application
EXPOSE 3002
CMD ["npm", "run", "start:dev"]
