const openapiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Movie App API',
    version: '1.0.0',
    description: 'API for movie search, user accounts, and groups.',
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Local development server',
    },
  ],
  tags: [
    { name: 'Search', description: 'Movie search endpoints' },
    { name: 'Movies', description: 'Movie and review endpoints' },
    { name: 'Users', description: 'Account and profile endpoints' },
    { name: 'Groups', description: 'Movie group endpoints' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      UserCredentials: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
          username: { type: 'string', example: 'moviefan' },
          password: { type: 'string', format: 'password', example: 'secret123' },
        },
      },
      SignupRequest: {
        type: 'object',
        required: ['user'],
        properties: {
          user: {
            allOf: [{ $ref: '#/components/schemas/UserCredentials' }],
            properties: {
              email: { type: 'string', format: 'email', example: 'user@example.com' },
            },
            required: ['username', 'email', 'password'],
          },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['user'],
        properties: {
          user: { $ref: '#/components/schemas/UserCredentials' },
        },
      },
      GroupRequest: {
        type: 'object',
        required: ['group'],
        properties: {
          group: {
            type: 'object',
            required: ['groupOwner', 'goupName', 'groupDesc'],
            properties: {
              groupOwner: { type: 'integer', example: 1 },
              goupName: { type: 'string', example: 'Friday Movie Club' },
              groupDesc: { type: 'string', example: 'A group for reviewing new releases.' },
            },
          },
        },
      },
      Error: {
        type: 'object',
        required: ['message', 'status'],
        properties: {
          message: { type: 'string' },
          status: { type: 'integer' },
        },
      },
      MovieListItem: {
        type: 'object',
        required: ['id', 'title', 'poster_path', 'vote_average'],
        properties: {
          id: { type: 'integer', example: 550 },
          title: { type: 'string', example: 'Fight Club' },
          poster_path: { type: 'string', nullable: true, example: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg' },
          vote_average: { type: 'number', minimum: 0, maximum: 10, example: 8.4, description: 'TMDB rating on a 0-10 scale.' },
        },
      },
      MovieListResponse: {
        type: 'object',
        required: ['results', 'page', 'total_pages'],
        properties: {
          results: { type: 'array', items: { $ref: '#/components/schemas/MovieListItem' } },
          page: { type: 'integer', example: 1 },
          total_pages: { type: 'integer', example: 500 },
        },
      },
      ReviewRequest: {
        type: 'object',
        required: ['description', 'grade'],
        properties: {
          description: { type: 'string', example: 'A memorable film with a great ending.' },
          grade: { type: 'integer', minimum: 1, maximum: 5, example: 4 },
        },
      },
    },
  },
  paths: {
    '/api/search': {
      get: {
        tags: ['Search'],
        summary: 'Search movies',
        parameters: [
          { $ref: '#/components/parameters/Query' },
          { $ref: '#/components/parameters/Genre' },
          { $ref: '#/components/parameters/Year' },
          { $ref: '#/components/parameters/Page' },
        ],
        responses: {
          200: { description: 'Movie search results' },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
    },
    '/api/movie': {
      get: {
        tags: ['Movies'],
        summary: 'Get movie details from TMDB',
        parameters: [
          { name: 'mediatype', in: 'query', required: true, schema: { type: 'string', enum: ['movie', 'tv'] }, example: 'movie' },
          { name: 'movieid', in: 'query', required: true, schema: { type: 'integer' }, example: 550 },
        ],
        responses: {
          200: { description: 'Media details returned by TMDB.' },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
    },
    '/api/movie/now-playing': {
      get: {
        tags: ['Movies'],
        summary: 'Get now-playing movies',
        parameters: [{ $ref: '#/components/parameters/Page' }],
        responses: {
          200: {
            description: 'Now-playing movie results. Ratings are returned on TMDB\'s 0-10 scale.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/MovieListResponse' } } },
          },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
    },
    '/api/movie/top-rated': {
      get: {
        tags: ['Movies'],
        summary: 'Get top-rated movies',
        parameters: [{ $ref: '#/components/parameters/Page' }],
        responses: {
          200: {
            description: 'Top-rated movie results. Ratings are returned on TMDB\'s 0-10 scale.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/MovieListResponse' } } },
          },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
    },
    '/api/movie/reviews/{mediaType}/{mediaId}': {
      get: {
        tags: ['Movies'],
        summary: 'Get reviews for a movie or TV series',
        parameters: [
          { $ref: '#/components/parameters/MediaType' },
          { name: 'mediaId', in: 'path', required: true, schema: { type: 'integer' }, example: 550 },
        ],
        responses: { 200: { description: 'Reviews, including reviewer usernames.' } },
      },
      post: {
        tags: ['Movies'],
        security: [{ bearerAuth: [] }],
        summary: 'Create a review for a movie or TV series',
        parameters: [
          { $ref: '#/components/parameters/MediaType' },
          { name: 'mediaId', in: 'path', required: true, schema: { type: 'integer' }, example: 550 },
        ],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ReviewRequest' } } } },
        responses: {
          201: { description: 'Review created.' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/movie/reviews/{mediaType}/{mediaId}/{userId}': {
      get: {
        tags: ['Movies'],
        security: [{ bearerAuth: [] }],
        summary: 'Get a user\'s review for a movie or TV series',
        parameters: [
          { $ref: '#/components/parameters/MediaType' },
          { name: 'mediaId', in: 'path', required: true, schema: { type: 'integer' }, example: 550 },
          { name: 'userId', in: 'path', required: true, schema: { type: 'integer' }, example: 1 },
        ],
        responses: {
          201: { description: 'User review returned.' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/movie/review/{reviewId}': {
      put: {
        tags: ['Movies'],
        security: [{ bearerAuth: [] }],
        summary: 'Update a review',
        parameters: [{ $ref: '#/components/parameters/ReviewId' }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ReviewRequest' } } } },
        responses: {
          201: { description: 'Review updated.' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/movie/review/delete/{reviewId}': {
      delete: {
        tags: ['Movies'],
        security: [{ bearerAuth: [] }],
        summary: 'Delete a review',
        parameters: [{ $ref: '#/components/parameters/ReviewId' }],
        responses: {
          201: { description: 'Review deleted.' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/user/signup': {
      post: {
        tags: ['Users'],
        summary: 'Create an account',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/SignupRequest' } } } },
        responses: { 201: { description: 'Account created' }, 400: { $ref: '#/components/responses/BadRequest' } },
      },
    },
    '/api/user/login': {
      post: {
        tags: ['Users'],
        summary: 'Log in and receive a JWT',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } } },
        responses: { 200: { description: 'Login successful' }, 401: { $ref: '#/components/responses/Unauthorized' } },
      },
    },
    '/api/user/delete': {
      delete: {
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        summary: 'Delete the authenticated account',
        responses: { 200: { description: 'Account deleted' }, 401: { $ref: '#/components/responses/Unauthorized' } },
      },
    },
    '/api/user/data': {
      get: {
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        summary: 'Get the authenticated user profile',
        responses: { 200: { description: 'User profile' }, 401: { $ref: '#/components/responses/Unauthorized' } },
      },
    },
    '/api/user/data/update': {
      put: {
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        summary: 'Update the authenticated user profile',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { username: { type: 'string' }, email: { type: 'string', format: 'email' } } } } } },
        responses: { 200: { description: 'Profile updated' }, 401: { $ref: '#/components/responses/Unauthorized' } },
      },
    },
    '/api/user/myFavorites': {
      get: {
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        summary: 'Get favorites for the authenticated user',
        responses: {
          200: { description: 'Favorites returned' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/user/favorites/{username}': {
      get: {
        tags: ['Users'],
        summary: 'Get favorites by username',
        parameters: [
          { name: 'username', in: 'path', required: true, schema: { type: 'string' }, example: 'moviefan' },
        ],
        responses: {
          200: { description: 'Favorites returned' },
          400: { $ref: '#/components/responses/BadRequest' },
        },
      },
    },
    '/api/movie/myfavorites/{mediaType}/{movieId}': {
      get: {
        tags: ['Movies'],
        security: [{ bearerAuth: [] }],
        summary: 'Check whether a movie or TV series is a favorite',
        parameters: [
          { $ref: '#/components/parameters/MediaType' },
          { $ref: '#/components/parameters/MovieId' },
        ],
        responses: {
          200: { description: 'Favorite status returned' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        tags: ['Movies'],
        security: [{ bearerAuth: [] }],
        summary: 'Add a movie or TV series to favorites',
        parameters: [
          { $ref: '#/components/parameters/MediaType' },
          { $ref: '#/components/parameters/MovieId' },
        ],
        responses: {
          200: { description: 'Favorite added' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
      delete: {
        tags: ['Movies'],
        security: [{ bearerAuth: [] }],
        summary: 'Remove a movie or TV series from favorites',
        parameters: [
          { $ref: '#/components/parameters/MediaType' },
          { $ref: '#/components/parameters/MovieId' },
        ],
        responses: {
          200: { description: 'Favorite removed' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { description: 'Favorite not found' },
        },
      },
    },
    '/api/group': {
      get: {
        tags: ['Groups'],
        summary: 'Get all groups',
        responses: { 200: { description: 'Groups returned' } },
      },
      post: {
        tags: ['Groups'],
        security: [{ bearerAuth: [] }],
        summary: 'Create a group',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/GroupRequest' } } } },
        responses: { 201: { description: 'Group created' }, 401: { $ref: '#/components/responses/Unauthorized' } },
      },
    },
    '/api/group/{groupId}': {
      delete: {
        tags: ['Groups'],
        security: [{ bearerAuth: [] }],
        summary: 'Delete a group owned by the authenticated user',
        parameters: [{ name: 'groupId', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Group deleted' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { description: 'Group not found or user is not the owner' },
        },
      },
    },
  },
};

openapiDocument.components.parameters = {
  Query: { name: 'query', in: 'query', schema: { type: 'string' }, description: 'Movie title search text' },
  Genre: { name: 'genre', in: 'query', schema: { type: 'integer' } },
  Year: { name: 'year', in: 'query', schema: { type: 'integer' } },
  Page: { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 } },
  MediaType: { name: 'mediaType', in: 'path', required: true, schema: { type: 'string', enum: ['movie', 'tv'] }, example: 'movie' },
  MovieId: { name: 'movieId', in: 'path', required: true, schema: { type: 'integer' }, example: 550 },
  ReviewId: { name: 'reviewId', in: 'path', required: true, schema: { type: 'integer' }, example: 12 },
};

openapiDocument.components.responses = {
  BadRequest: { description: 'Invalid request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
  Unauthorized: { description: 'Authentication required or token invalid', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
  ServerError: { description: 'Internal server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
};

export default openapiDocument;
