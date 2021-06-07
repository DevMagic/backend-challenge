const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['server/route/summonerControler.js']

swaggerAutogen(outputFile, endpointsFiles)