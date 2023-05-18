# Chat em Tempo Real

# Contexto
Este projeto é uma aplicação full stack que permite o login de vários usuários e oferece um chat em tempo real para conversas.

# Executando aplicação
## Clone o Repositório

> Primerio clone o repositório atraves do comando 
```git clone git@github.com:brunosbrito/chat-em-tempo-real.git```

## Instalando Dependências

> Front-end
```bash
cd front-end
npm install
``` 
> back-end
```bash
cd back-end
npm install
``` 

> MongoDB

Para rodar o mongodb é necessário ter o docker e docker-compose instalados
link da documentação do docler: https://www.docker.com/
para iniciar o banco de dados bata seguir os comandos abaixo
```bash
cd  back-end
docker-compose up -d
```
ou se preferir pode instalar o mongodb localmente: https://www.mongodb.com/docs/manual/installation/

## Para rodar o back-end:
  ```
    cd back-end && npm run dev
  ```

## Para rodar o front-end:
  ```
    cd front-end && npm run dev
  ```
  
