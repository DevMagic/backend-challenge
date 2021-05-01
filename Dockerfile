FROM node:alpine

# diretório alvo
RUN mkdir -p /usr/src/node-api
WORKDIR /usr/src/node-api

# instalação de dependências
RUN apk update && apk upgrade
RUN apk add python3 g++ make

# copiar o projeto e instalar os pacotes com o npm
COPY . /usr/src/node-api/
RUN yarn install

# abrindo a porta 3000
EXPOSE 3000

RUN chmod +x ./scripts/init.sh
RUN chmod +x ./scripts/wait-for-it.sh

ENTRYPOINT ["./scripts/init.sh"]