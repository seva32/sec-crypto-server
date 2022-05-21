# First Stage: to install and build dependencies
FROM node:16
WORKDIR /app/server
COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "run", "start:prod"]
