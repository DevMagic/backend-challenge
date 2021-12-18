const Sequelize = require('sequelize');

// Gostaria de ter deixado os valores abaixo a critério do arquivo .env para ficar mais realista,
// mas em algumas ocasiões a conexão falhou e optei por colocar manualmente..
// apenas troque os valores abaixo para os valores do seu banco MySQL

 const sequelize = new Sequelize("devmagic", "root", "admin",
   {
       dialect: "mysql",
       host: "localhost",
       port: 3306
   });

module.exports = sequelize;
