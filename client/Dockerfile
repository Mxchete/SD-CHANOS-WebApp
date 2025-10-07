FROM node:20

WORKDIR /usr/src/app

# COPY package*.json ./
COPY package.json ./
RUN npm install
# https://github.com/vitejs/vite/issues/13775
# RUN npm install -g vite
# RUN npm install -g @vitejs/plugin-react
# RUN npm install -g react
# RUN npm install -g react-router-dom
# RUN ln -s /usr/local/lib/node_modules/ ../node_modules
# RUN ln -s /usr/src/app/node_modules /usr/local/lib/node_modules
# RUN ln -s /usr/src/app/node_modules ../node_modules

COPY . .

EXPOSE 3000

# CMD ["/bin/bash"]
CMD [ "npm", "run", "dev" ]
