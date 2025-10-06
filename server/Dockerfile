FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# RUN npm ci --no-audit || npm ci --no-audit --maxsockets 1
# RUN npm init -y
# RUN npm install

EXPOSE 4000

# CMD ["/bin/bash"]
CMD [ "npm", "start" ]
