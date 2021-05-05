FROM node:alpine

# diretório alvo
RUN mkdir -p /usr/src/DevMagic
WORKDIR /usr/src/DevMagic

# instalação de dependências
RUN apk update && apk upgrade
RUN apk add python3 g++ make

# copiar o projeto e instalar os pacotes com o yarn
COPY . /usr/src/DevMagic/
RUN yarn install

# abrindo a porta 3000
EXPOSE 3000

RUN chmod +x ./scripts/init.sh
RUN chmod +x ./scripts/wait-for-it.sh

ENTRYPOINT ["./scripts/init.sh"]