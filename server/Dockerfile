FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# --- DEBUGGING STEP ---
# This command will list all files and folders in the current directory (/usr/src/app)
# so we can see what is actually being copied into the container.
RUN ls -la

EXPOSE 3000

CMD [ "node", "index.js" ]
