export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'JC Waterfun Resort API',
      version: '1.0.0',
      description: 'REST API documentation for JC Waterfun Resort',
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
      },
    ],
  },
  apis: ['./docs/schemas.yaml'],
};
