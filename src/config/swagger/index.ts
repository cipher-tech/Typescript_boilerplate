import swaggerJsDocs from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

export interface SwaggerOptions {
  swaggerDocRoute?: string;
  definitionsPath: string[];
  explorer?: true;
}
 
export default function Swagger(
  app: Express,
  swaggerOptions: SwaggerOptions,
): void {
  const options = {
    failOnErrors: false,
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Account service Swagger Docs',
        version: '0.1.0',
        description:
          'This is the swagger api documentation for Mitreel Account Service',
        license: {
          name: 'MIT',
          url: 'https://spdx.org/licenses/MIT.html',
        },
      },
      servers: [
        {
          url: 'http://localhost:4045/swagger'
        }
      ]
    },
    //   components:
    //   securitySchemes:
    // cookieAuth:         # arbitrary name for the security scheme; will be used in the "security" key later
    // type: apiKey
    // in: cookie
    // name: JSESSIONID  #
    apis: swaggerOptions.definitionsPath,
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'yourCookieName',
        },
      },
    },
    security: [
      {
        cookieAuth: [],
      },
    ],
  };

  const swaggerSpecs = swaggerJsDocs(options);

  app.use(
    swaggerOptions?.swaggerDocRoute ?? '/',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpecs, {
      explorer: swaggerOptions?.explorer || false,
    }),
  );
}
