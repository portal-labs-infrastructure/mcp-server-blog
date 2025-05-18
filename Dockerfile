# Specify the Node base image with your desired version node:<version>
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies by copying
# package.json and package-lock.json
COPY package*.json ./

# Bundle your app's source code inside the Docker image
COPY . .

# Install app dependencies
RUN npm ci

# Build your app
RUN npm run build

# Your app binds to port 8080, 
# so you use the EXPOSE instruction to have it mapped by the Docker daemon
EXPOSE 8080

# Set the NODE_ENV environment variable to production
ENV NODE_ENV production

# Define the command to run your app using CMD which defines your runtime, here we will use node server.js to start our server
CMD [ "npm", "start" ]