const openapiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Movie App API',
    version: '1.0.0',
    description: 'API for movie and TV search, reviews, user accounts, favorites, and groups.',
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Local development server',
    },
  ],
  tags: [
    { name: 'Search', description: 'Movie and TV search endpoints' },
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
            required: ['groupName', 'groupDesc'],
            properties: {
              groupName: { type: 'string', example: 'Friday Movie Club' },
              groupDesc: { type: 'string', example: 'A group for reviewing new releases.' },
            },
          },
        },
      },
      GroupUpdateRequest: {
        type: 'object',
        required: ['group'],
        properties: {
          group: {
            type: 'object',
            required: ['group_name', 'description'],
            properties: {
              group_name: { type: 'string', example: 'Friday Movie Club' },
              description: { type: 'string', example: 'A group for reviewing new releases.' },
            },
          },
        },
      },
      Group: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          owner_id: { type: 'integer', example: 7 },
          group_name: { type: 'string', example: 'Friday Movie Club' },
          description: { type: 'string', example: 'A group for reviewing new releases.' },
          member_count: { type: 'integer', example: 4 },
        },
      },
      UserGroup: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          group_name: { type: 'string', example: 'Friday Movie Club' },
          description: { type: 'string', example: 'A group for reviewing new releases.' },
          owner_id: { type: 'integer', example: 7 },
          membership: { type: 'string', enum: ['member'], example: 'member' },
        },
      },
      GroupMember: {
        type: 'object',
        properties: {
          group_id: { type: 'integer', example: 1 },
          user_id: { type: 'integer', example: 7 },
          username: { type: 'string', example: 'moviefan' },
          status: { type: 'string', enum: ['pending', 'member'], example: 'member' },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
      GroupMembersResponse: {
        type: 'object',
        properties: {
          member_count: { type: 'integer', example: 4 },
          members: { type: 'array', items: { $ref: '#/components/schemas/GroupMember' } },
        },
      },
      GroupChatMessageRequest: {
        type: 'object',
        required: ['message'],
        properties: {
          message: { type: 'string', maxLength: 100, example: 'What should we watch next?' },
        },
      },
      FavoriteStatus: {
        type: 'object',
        required: ['isFavorite'],
        properties: {
          isFavorite: { type: 'boolean', example: true },
        },
      },
      UserFavorite: {
        type: 'object',
        required: ['movie_id', 'type'],
        properties: {
          movie_id: { type: 'integer', example: 550, description: 'TMDB movie or TV-series ID.' },
          type: { type: 'string', enum: ['movie', 'tv'], example: 'movie' },
        },
      },
      UserFavoriteMutationResponse: {
        type: 'object',
        required: ['id', 'movieid', 'mediaType'],
        properties: {
          id: { type: 'integer', example: 7, description: 'Authenticated user ID.' },
          movieid: { type: 'string', example: '550', description: 'TMDB movie or TV-series ID.' },
          mediaType: { type: 'string', enum: ['movie', 'tv'], example: 'movie' },
        },
      },
      GroupFavoriteItem: {
        type: 'object',
        required: ['movie_id', 'type'],
        properties: {
          movie_id: { type: 'integer', example: 550, description: 'TMDB movie or TV-series ID.' },
          type: { type: 'string', enum: ['movie', 'tv'], example: 'movie' },
        },
      },
      GroupFavoriteMutationResponse: {
        type: 'object',
        required: ['group_id', 'movie_id', 'type'],
        properties: {
          group_id: { type: 'integer', example: 1 },
          movie_id: { type: 'integer', example: 550, description: 'TMDB movie or TV-series ID.' },
          type: { type: 'string', enum: ['movie', 'tv'], example: 'movie' },
        },
      },
      SearchResponse: {
        type: 'object',
        required: ['results', 'hasMore', 'nextCursor'],
        properties: {
          results: {
            type: 'array',
            description: 'Up to 20 movie or TV results.',
            items: { type: 'object', additionalProperties: true },
          },
          hasMore: { type: 'boolean', example: true },
          nextCursor: { type: 'string', nullable: true, description: 'Opaque cursor to pass to the next search request.' },
        },
      },
      UserPage: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 7 },
          username: { type: 'string', example: 'moviefan' },
          created_at: { type: 'string', format: 'date-time' },
          review_count: { type: 'integer', example: 12 },
          review_average: { type: 'number', nullable: true, example: 4.2 },
        },
      },
      UserAccount: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 7 },
          username: { type: 'string', example: 'moviefan' },
          email: { type: 'string', format: 'email', example: 'user@example.com' },
        },
      },
      Review: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 12 },
          user_id: { type: 'integer', example: 7 },
          movie_id: { type: 'integer', example: 550 },
          type: { type: 'string', enum: ['movie', 'tv'], example: 'movie' },
          grade: { type: 'integer', minimum: 1, maximum: 5, example: 4 },
          description: { type: 'string', example: 'A memorable film with a great ending.' },
          created_at: { type: 'string', format: 'date-time' },
          username: { type: 'string', example: 'moviefan', description: 'Present in review-list responses.' },
        },
      },
      MessageResponse: {
        type: 'object',
        required: ['message'],
        properties: {
          message: { type: 'string', example: 'Operation completed successfully.' },
        },
      },
      CreatedReviewResponse: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'integer', example: 12 },
        },
      },
      GroupChatMessage: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          group_id: { type: 'integer', example: 1 },
          user_id: { type: 'integer', example: 7 },
          username: { type: 'string', example: 'moviefan' },
          message: { type: 'string', example: 'What should we watch next?' },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
      Error: {
        type: 'object',
        required: ['message'],
        properties: {
          message: { type: 'string' },
          status: { type: 'integer', description: 'Included by the Express error handler when available.' },
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
        summary: 'Search movies and TV series',
        parameters: [
          { $ref: '#/components/parameters/SearchType' },
          { $ref: '#/components/parameters/Query' },
          { $ref: '#/components/parameters/Genre' },
          { $ref: '#/components/parameters/Year' },
          { $ref: '#/components/parameters/Cursor' },
        ],
        responses: {
          200: {
            description: 'Up to 20 matching movies or TV series and a cursor for the next batch.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/SearchResponse' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
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
          200: {
            description: 'Media details returned by TMDB. The response shape depends on the requested media type.',
            content: { 'application/json': { schema: { type: 'object', additionalProperties: true } } },
          },
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
        responses: {
          200: {
            description: 'Reviews, including reviewer usernames.',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Review' } } } },
          },
          500: { $ref: '#/components/responses/ServerError' },
        },
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
          201: {
            description: 'Review created.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CreatedReviewResponse' } } },
          },
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
          201: {
            description: 'User review returned.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Review' } } },
          },
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
          200: {
            description: 'Review updated.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageResponse' } } },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { description: 'Review not found or authenticated user is not the owner' },
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
          201: {
            description: 'Review deleted.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageResponse' } } },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/user/signup': {
      post: {
        tags: ['Users'],
        summary: 'Create an account',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/SignupRequest' } } } },
        responses: {
          201: {
            description: 'Account created.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/UserAccount' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          409: { description: 'Username or email is already in use' },
        },
      },
    },
    '/api/user/login': {
      post: {
        tags: ['Users'],
        summary: 'Log in and receive a JWT',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } } },
        responses: {
          200: {
            description: 'Login successful. The JWT expires after one hour.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer', example: 7 },
                    username: { type: 'string', example: 'moviefan' },
                    token: { type: 'string', description: 'JWT bearer token.' },
                  },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/user/delete': {
      delete: {
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        summary: 'Delete the authenticated account',
        responses: {
          200: {
            description: 'Account deleted.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageResponse' } } },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/user/data': {
      get: {
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        summary: 'Get the authenticated user profile',
        responses: {
          200: {
            description: 'User profile returned.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/UserAccount' } } },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { description: 'User not found' },
        },
      },
    },
    '/api/user/data/update': {
      put: {
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        summary: 'Update the authenticated user profile',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { username: { type: 'string' }, email: { type: 'string', format: 'email' } } } } } },
        responses: {
          200: {
            description: 'Profile updated.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageResponse' } } },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { description: 'User not found' },
          409: { description: 'Username or email is already in use' },
        },
      },
    },
    '/api/user/myFavorites': {
      get: {
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        summary: 'Get the authenticated user’s favorites',
        description: 'Returns the favorited TMDB media IDs and their media types. Requires a valid JWT.',
        responses: {
          200: {
            description: 'Favorites returned.',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/UserFavorite' } } } },
          },
          400: { description: 'The user ID is missing or favorites could not be retrieved', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          401: { $ref: '#/components/responses/Unauthorized' },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
    },
    '/api/movie/myFavorites': {
      get: {
        tags: ['Movies'],
        security: [{ bearerAuth: [] }],
        summary: 'Get the authenticated user’s favorites (legacy route)',
        description: 'Alias of GET /api/user/myFavorites. Returns the favorited TMDB media IDs and their media types.',
        responses: {
          200: {
            description: 'Favorites returned.',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/UserFavorite' } } } },
          },
          400: { description: 'The user ID is missing or favorites could not be retrieved', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          401: { $ref: '#/components/responses/Unauthorized' },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
    },
    '/api/user/{username}/favorites': {
      get: {
        tags: ['Users'],
        summary: 'Get a user’s public favorites',
        description: 'Returns favorited TMDB media IDs and media types for the specified username. No authentication is required.',
        parameters: [
          { $ref: '#/components/parameters/Username' },
        ],
        responses: {
          200: {
            description: 'Public favorites returned. An empty array is returned when the user has no favorites.',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/UserFavorite' } } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
    },
    '/api/movie/myfavorites/{mediaType}/{movieId}': {
      get: {
        tags: ['Movies'],
        security: [{ bearerAuth: [] }],
        summary: 'Check whether a movie or TV series is a favorite',
        description: 'Checks the authenticated user’s favorites for a TMDB media ID.',
        parameters: [
          { $ref: '#/components/parameters/MediaType' },
          { $ref: '#/components/parameters/MovieId' },
        ],
        responses: {
          200: {
            description: 'Favorite status returned.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/FavoriteStatus' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
      post: {
        tags: ['Movies'],
        security: [{ bearerAuth: [] }],
        summary: 'Add a movie or TV series to favorites',
        description: 'Adds the specified TMDB media ID to the authenticated user’s favorites.',
        parameters: [
          { $ref: '#/components/parameters/MediaType' },
          { $ref: '#/components/parameters/MovieId' },
        ],
        responses: {
          200: {
            description: 'Favorite added.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/UserFavoriteMutationResponse' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
      delete: {
        tags: ['Movies'],
        security: [{ bearerAuth: [] }],
        summary: 'Remove a movie or TV series from favorites',
        description: 'Removes the specified TMDB media ID from the authenticated user’s favorites.',
        parameters: [
          { $ref: '#/components/parameters/MediaType' },
          { $ref: '#/components/parameters/MovieId' },
        ],
        responses: {
          200: {
            description: 'Favorite removed.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/UserFavoriteMutationResponse' } } },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { description: 'Favorite not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
    },
    '/api/user/{username}': {
      get: {
        tags: ['Users'],
        summary: 'Get a public user profile',
        parameters: [{ $ref: '#/components/parameters/Username' }],
        responses: {
          200: {
            description: 'Public profile summary.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/UserPage' } } },
          },
          404: { description: 'User not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/user/{user_id}/reviews': {
      get: {
        tags: ['Users'],
        summary: 'Get reviews written by a user',
        parameters: [
          { $ref: '#/components/parameters/UserIdSnakeCase' },
          { $ref: '#/components/parameters/Page' },
          { $ref: '#/components/parameters/Limit' },
        ],
        responses: {
          200: {
            description: 'The requested page of reviews.',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Review' } } } },
          },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
    },
    '/api/group': {
      get: {
        tags: ['Groups'],
        summary: 'Get all groups',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Groups and their approved member counts.',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Group' } } } },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        tags: ['Groups'],
        security: [{ bearerAuth: [] }],
        summary: 'Create a group',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/GroupRequest' } } } },
        responses: {
          201: {
            description: 'Group created and the owner added as a member.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Group' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/group/mine': {
      get: {
        tags: ['Groups'],
        security: [{ bearerAuth: [] }],
        summary: 'Get groups the authenticated user belongs to',
        responses: {
          200: {
            description: 'Groups the authenticated user is an approved member of.',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/UserGroup' } } } },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/group/{groupId}': {
      get: {
        tags: ['Groups'],
        security: [{ bearerAuth: [] }],
        summary: 'Get a group',
        parameters: [{ $ref: '#/components/parameters/GroupId' }],
        responses: {
          200: { description: 'Group details and approved member count.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Group' } } } },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { description: 'Group not found' },
        },
      },
      put: {
        tags: ['Groups'],
        security: [{ bearerAuth: [] }],
        summary: 'Update a group owned by the authenticated user',
        parameters: [{ $ref: '#/components/parameters/GroupId' }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/GroupUpdateRequest' } } } },
        responses: {
          200: {
            description: 'Group updated.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Group' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { description: 'Authenticated user does not own the group' },
          404: { description: 'Group not found' },
        },
      },
      delete: {
        tags: ['Groups'],
        security: [{ bearerAuth: [] }],
        summary: 'Delete a group owned by the authenticated user',
        parameters: [{ $ref: '#/components/parameters/GroupId' }],
        responses: {
          200: {
            description: 'Group deleted.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageResponse' } } },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          400: { $ref: '#/components/responses/BadRequest' },
          404: { description: 'Group not found or user is not the owner' },
        },
      },
    },
    '/api/group/{groupId}/members': {
      get: {
        tags: ['Groups'],
        security: [{ bearerAuth: [] }],
        summary: 'Get group members by membership status',
        parameters: [
          { $ref: '#/components/parameters/GroupId' },
          { $ref: '#/components/parameters/MemberStatus' },
          { $ref: '#/components/parameters/Page' },
          { $ref: '#/components/parameters/Limit' },
        ],
        responses: {
          200: { description: 'Members and total count for the requested status.', content: { 'application/json': { schema: { $ref: '#/components/schemas/GroupMembersResponse' } } } },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/group/{groupId}/members/{userId}': {
      get: {
        tags: ['Groups'],
        security: [{ bearerAuth: [] }],
        summary: 'Get a group membership record',
        parameters: [
          { $ref: '#/components/parameters/GroupId' },
          { $ref: '#/components/parameters/UserId' },
        ],
        responses: {
          200: { description: 'Membership record returned.', content: { 'application/json': { schema: { $ref: '#/components/schemas/GroupMember' } } } },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { description: 'Group member not found' },
        },
      },
      put: {
        tags: ['Groups'],
        security: [{ bearerAuth: [] }],
        summary: 'Approve a pending group member (owner only)',
        parameters: [
          { $ref: '#/components/parameters/GroupId' },
          { $ref: '#/components/parameters/UserId' },
        ],
        responses: {
          200: {
            description: 'Membership approved.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageResponse' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { description: 'Authenticated user does not own the group' },
          404: { description: 'Group or user not found' },
        },
      },
      delete: {
        tags: ['Groups'],
        security: [{ bearerAuth: [] }],
        summary: 'Remove a group member (owner only)',
        parameters: [
          { $ref: '#/components/parameters/GroupId' },
          { $ref: '#/components/parameters/UserId' },
        ],
        responses: {
          200: {
            description: 'Member removed.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageResponse' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { description: 'Authenticated user does not own the group' },
          404: { description: 'Group or user not found' },
        },
      },
    },
    '/api/group/{groupId}/join': {
      post: {
        tags: ['Groups'],
        security: [{ bearerAuth: [] }],
        summary: 'Request to join a group',
        parameters: [{ $ref: '#/components/parameters/GroupId' }],
        responses: {
          201: {
            description: 'Join request created with pending status.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/GroupMember' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { description: 'Group or user not found' },
        },
      },
    },
    '/api/group/{groupId}/leave': {
      delete: {
        tags: ['Groups'],
        security: [{ bearerAuth: [] }],
        summary: 'Leave a group',
        parameters: [{ $ref: '#/components/parameters/GroupId' }],
        responses: {
          200: {
            description: 'User left the group.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageResponse' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { description: 'Group membership not found' },
        },
      },
    },
    '/api/group/{groupId}/favorites': {
      get: {
        tags: ['Groups'],
        security: [{ bearerAuth: [] }],
        summary: 'Get favorites for a group',
        description: 'Returns the group’s favorited TMDB media IDs and media types. The authenticated user must have approved membership in the group.',
        parameters: [
          { $ref: '#/components/parameters/GroupId' },
        ],
        responses: {
          200: {
            description: 'Group favorites returned. An empty array is returned when there are no favorites.',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/GroupFavoriteItem' } } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { description: 'User is not an approved member of the group', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
    },
    '/api/group/{groupId}/chat': {
        get: {
          tags: ['Groups'],
          security: [{ bearerAuth: [] }],
          summary: 'Get the latest group chat messages',
          description: 'Only approved group members can read messages. Returns up to the latest 50 messages.',
          parameters: [{ $ref: '#/components/parameters/GroupId' }],
          responses: {
            200: { description: 'Chat messages returned.', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/GroupChatMessage' } } } } },
            400: { $ref: '#/components/responses/BadRequest' },
            401: { $ref: '#/components/responses/Unauthorized' },
            403: { description: 'User is not an approved member of this group' },
          },
        },
        post: {
          tags: ['Groups'],
          security: [{ bearerAuth: [] }],
          summary: 'Send a group chat message',
          description: 'Only approved group members can send messages. Messages are limited to 100 characters.',
          parameters: [{ $ref: '#/components/parameters/GroupId' }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/GroupChatMessageRequest' } } } },
          responses: {
            201: {
              description: 'Message created.',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/GroupChatMessage' } } },
            },
            400: { $ref: '#/components/responses/BadRequest' },
            401: { $ref: '#/components/responses/Unauthorized' },
            403: { description: 'User is not an approved member of this group' },
          },
        },
      },
    '/api/movie/{groupId}/groupfavorites/{mediaType}/{movieId}': {
      get: {
        tags: ['Groups'],
        security: [{ bearerAuth: [] }],
        summary: 'Check whether a movie or TV series is a group favorite',
        description: 'The authenticated user must have approved membership in the group.',
        parameters: [
          { name: 'groupId', in: 'path', required: true, schema: { type: 'integer', minimum: 1 } },
          { $ref: '#/components/parameters/MediaType' },
          { $ref: '#/components/parameters/MovieId' },
        ],
        responses: {
          200: {
            description: 'Group favorite status returned.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/FavoriteStatus' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { description: 'User is not an approved member of the group', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
      post: {
        tags: ['Groups'],
        security: [{ bearerAuth: [] }],
        summary: 'Add a movie or TV series to group favorites',
        description: 'Adds the specified TMDB media ID to the group’s favorites. The authenticated user must have approved membership in the group.',
        parameters: [
          { name: 'groupId', in: 'path', required: true, schema: { type: 'integer', minimum: 1 } },
          { $ref: '#/components/parameters/MediaType' },
          { $ref: '#/components/parameters/MovieId' },
        ],
        responses: {
          200: {
            description: 'Group favorite added.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/GroupFavoriteMutationResponse' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { description: 'User is not an approved member of the group', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
      delete: {
        tags: ['Groups'],
        security: [{ bearerAuth: [] }],
        summary: 'Remove a movie or TV series from group favorites',
        description: 'Removes the specified TMDB media ID from the group’s favorites. The authenticated user must have approved membership in the group.',
        parameters: [
          { name: 'groupId', in: 'path', required: true, schema: { type: 'integer', minimum: 1 } },
          { $ref: '#/components/parameters/MediaType' },
          { $ref: '#/components/parameters/MovieId' },
        ],
        responses: {
          200: {
            description: 'Group favorite removed.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/GroupFavoriteMutationResponse' } } },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { description: 'User is not an approved member of the group', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          404: { description: 'Group favorite not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          500: { $ref: '#/components/responses/ServerError' },
        },
      },
    },
  },
};

openapiDocument.components.parameters = {
  SearchType: { name: 'type', in: 'query', required: true, schema: { type: 'string', enum: ['all', 'movie', 'tv'] }, example: 'all' },
  Query: { name: 'query', in: 'query', schema: { type: 'string' }, description: 'Name/title search text. Required when type is all.' },
  Genre: { name: 'genre', in: 'query', schema: { type: 'integer' }, description: 'TMDB genre ID.' },
  Year: { name: 'year', in: 'query', schema: { type: 'integer', minimum: 1874 }, description: 'Release/first-air year.' },
  Cursor: { name: 'cursor', in: 'query', schema: { type: 'string' }, description: 'Opaque nextCursor value returned by a previous search response.' },
  Page: { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 } },
  Limit: { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1 }, description: 'Maximum number of records to return.' },
  MemberStatus: { name: 'status', in: 'query', required: true, schema: { type: 'string', enum: ['member', 'pending'] } },
  Username: { name: 'username', in: 'path', required: true, schema: { type: 'string' }, example: 'moviefan' },
  GroupId: { name: 'groupId', in: 'path', required: true, schema: { type: 'integer', minimum: 1 }, example: 1 },
  UserId: { name: 'userId', in: 'path', required: true, schema: { type: 'integer', minimum: 1 }, example: 7 },
  UserIdSnakeCase: { name: 'user_id', in: 'path', required: true, schema: { type: 'integer', minimum: 1 }, example: 7 },
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
