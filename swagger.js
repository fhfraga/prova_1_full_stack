const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Salas de Reunião',
            version: '1.0.0',
            description: 'Documentação da API para gerenciar salas de reunião. Esse projeto é requisito para a P1 da disciplina\
            Laboratório de programação full stack, ministrada pelo professor Fabrício Dias. Esse projeto tem o intuito de criar\
            uma aplicação back end para uma aplicação de salas de reunião virtual. Faremos os testes das rotas através do Postman\
            demonstrando o funcionamento da aplicação.',
        },
        servers: [
            {
                url: 'http://localhost:5000',
            },
        ],
    },
    apis: ['./routes/*.js'],
};


const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = {
    swaggerUi,
    swaggerSpec,
};
