FROM node:18.18.0-alpine
WORKDIR /app
ENV PORT 8000
COPY . .
RUN npm install
EXPOSE 5000
CMD [ "npm", "run", "start"]