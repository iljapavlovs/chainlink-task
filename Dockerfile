FROM node:18

# Bundle app source
COPY . /usr/src/app

# Create app directory
WORKDIR /usr/src/app


RUN npm install
# If you are building your code for production
# RUN npm ci --only=production



#CMD [ "npx", "hardhat", "run", "scripts/deploy.ts", "--network", "kovan" ]

COPY ./entrypoint.sh /usr/local/bin
ENTRYPOINT ["/bin/sh", "/usr/local/bin/entrypoint.sh"]
