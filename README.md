## Details

The stack integrates PostgreSQL, Hasura, Apollo and Express in order to provide basic auth, tracking and user finding functionality.

The aplication uses docker and composes the database, Hasura and app services.

## Services

- **GQL** - exposes custom logic to the Hasura GraphQL implementation

  - User tracking - a simple implementation for inserting a new user location tracking using a PostGIS geometry value
  - Finding users by radius and location - implementation of finding users that have been at least once (most recent) in a certain area defined by a point and a radius which uses PostGIS dwithin function

- **Auth** - uses Express and a regular REST API for providing registration and authetication. It is kept separate and doesn't use GraphQL in order to better emulate how an actual auth serivce would look like.

- **Hasura** - directly connects to the database and integrates multiple services

  - Database - the basic Hasura functionality that exposes a GrapQL API for our databse
  - GQL - integrated using the remote graphql schema and points to the GQL service GraphQL endpoint

- **Database** - PostgreSQL 15 along with the PostGIS extension in order to make it easier to work with corrdinates and different operations involving coordinates. Using Prisma as an ORM for the Auth and GQL services.

## Setup

- Create `.env` file based on `.env.example`
- `npm install`
- `npm run build`
- `docker-compose up`
- `npx prisma migrate dev`
