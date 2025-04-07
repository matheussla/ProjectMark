import { SwaggerOptions } from 'swagger-ui-express';

import { config } from '@config';

export const swaggerOptions: SwaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ProjectMark API',
      version: '1.0.0',
      description:
        'A robust topic management system with versioning, hierarchical structure, and authentication',
    },
    servers: [
      {
        url: config.URL,
        description: `${config.nodeEnv} server`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    paths: {
      '/auth/login': {
        post: {
          tags: ['Authentication'],
          summary: 'Login user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: {
                      type: 'string',
                      example: 'admin@example.com',
                    },
                    password: {
                      type: 'string',
                      example: 'admin123',
                    },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Successful login',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      token: {
                        type: 'string',
                      },
                      user: {
                        type: 'object',
                        properties: {
                          id: {
                            type: 'string',
                          },
                          name: {
                            type: 'string',
                          },
                          email: {
                            type: 'string',
                          },
                          role: {
                            type: 'string',
                            enum: ['ADMIN', 'EDITOR', 'VIEWER'],
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/topics': {
        get: {
          tags: ['Topics'],
          summary: 'Get all topics',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'List of topics retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'string',
                        },
                        name: {
                          type: 'string',
                        },
                        content: {
                          type: 'string',
                        },
                        parentTopicId: {
                          type: 'string',
                          nullable: true,
                        },
                        version: {
                          type: 'number',
                        },
                        isLatestVersion: {
                          type: 'boolean',
                        },
                        createdAt: {
                          type: 'string',
                          format: 'date-time',
                        },
                        updatedAt: {
                          type: 'string',
                          format: 'date-time',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Topics'],
          summary: 'Create a new topic',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'content'],
                  properties: {
                    name: {
                      type: 'string',
                      example: 'Topic Name',
                    },
                    content: {
                      type: 'string',
                      example: 'Topic Content',
                    },
                    parentTopicId: {
                      type: 'string',
                      example: 'optional-parent-id',
                    },
                  },
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Topic created successfully',
            },
          },
        },
      },
      '/topics/{id}': {
        get: {
          tags: ['Topics'],
          summary: 'Get topic by ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            '200': {
              description: 'Topic retrieved successfully',
            },
          },
        },
        put: {
          tags: ['Topics'],
          summary: 'Update topic (creates new version)',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'content'],
                  properties: {
                    name: {
                      type: 'string',
                      example: 'Updated Name',
                    },
                    content: {
                      type: 'string',
                      example: 'Updated Content',
                    },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Topic updated successfully',
            },
          },
        },
      },
      '/topics/{id}/versions': {
        get: {
          tags: ['Topics'],
          summary: 'Get topic versions',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            '200': {
              description: 'Topic versions retrieved successfully',
            },
          },
        },
      },
      '/topics/{id}/hierarchy': {
        get: {
          tags: ['Topics'],
          summary: 'Get topic hierarchy',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            '200': {
              description: 'Topic hierarchy retrieved successfully',
            },
          },
        },
      },
      '/topics/shortest-path/{startId}/{endId}': {
        get: {
          tags: ['Topics'],
          summary: 'Find shortest path between topics',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'startId',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'endId',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            '200': {
              description: 'Shortest path found successfully',
            },
          },
        },
      },
      '/users': {
        post: {
          tags: ['Users'],
          summary: 'Create a new user',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password', 'role'],
                  properties: {
                    name: {
                      type: 'string',
                      example: 'User Name',
                    },
                    email: {
                      type: 'string',
                      example: 'user@example.com',
                    },
                    password: {
                      type: 'string',
                      example: 'user123',
                    },
                    role: {
                      type: 'string',
                      enum: ['ADMIN', 'EDITOR', 'VIEWER'],
                      example: 'VIEWER',
                    },
                  },
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'User created successfully',
            },
          },
        },
      },
      '/users/{id}': {
        delete: {
          tags: ['Users'],
          summary: 'Delete a user',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            '204': {
              description: 'User deleted successfully',
            },
            '404': {
              description: 'User not found',
            },
          },
        },
      },
    },
  },
  apis: ['./src/**/*.ts'],
};
