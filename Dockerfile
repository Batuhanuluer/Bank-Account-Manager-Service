
FROM ubuntu:latest

WORKDIR /app

RUN apt update -y && apt install curl -y


RUN curl -sL https://deb.nodesource.com/setup_16.x -o /tmp/nodesource_setup.sh
RUN bash /tmp/nodesource_setup.sh


RUN apt install nodejs -y


RUN npm i -g @nestjs/cli

COPY project/* /app/

RUN npm install

CMD [ "npm" , "run" , "start:dev" ]
