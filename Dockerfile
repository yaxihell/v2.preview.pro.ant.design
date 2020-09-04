# 只做了文件的构建 构建后的文件放到./dist目录 
FROM velocityorg/node-yarn-perl:10.21.0-slim

WORKDIR /usr/src/app/
USER root
COPY package.json ./
RUN yarn

COPY ./ ./

# RUN npm run test:all

CMD ["npm", "run", "start"]
