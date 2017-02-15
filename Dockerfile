FROM mhart/alpine-node:4.5

EXPOSE 3000

WORKDIR /opt/moove-onboarding-test

COPY . .

RUN npm install

CMD ["node","index.js"]
