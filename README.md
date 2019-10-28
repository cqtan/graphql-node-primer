# GraphQL (Prisma) with NodeJS

A small project covering the fundamentals of using GraphQL with NodeJS as an alternative to conventional REST API development. This repo mainly serves as a primer to GraphQL development on the backend and as reviewing material. The course that this is based on and the full description on which topics are covered can be found [here](https://www.udemy.com/course/graphql-bootcamp/).

## Main Tools and Services used

- [GraphQL Yoga](https://github.com/prisma-labs/graphql-yoga) (GQL-Server with minimal setup)
- [Prisma](https://github.com/prisma/prisma) (Speeds up GQL developement dramatically)
- [Prisma-Binding](https://github.com/prisma-labs/prisma-binding) (Convenient tools for working with Prisma)
- [Apollo Boost](https://github.com/apollographql/apollo-client/tree/master/packages/apollo-boost) (Quick start package on Apollo Client)
- [Docker](https://www.docker.com/) (Mainly because Prisma requires it)
- [Heroku](https://dashboard.heroku.com/apps) (Deployment and quick setup of Postgres - on free tier)
- [Prisma Cloud](https://www.prisma.io/cloud) (Manage Prisma Server Container deployments (works well with Heroku). Also provides alternative to pgAdmin)

# Notes

## Multiple Prisma Project

- You only need 1 Docker Container to run multiple Prisma Projects. In this case, we only need a single `docker-compose.yml`. Simply modify the new project’s `prisma.yml` to make the endpoint property point to a different service and stage names, e.g. service: reviews / stage: default
  - Endpoint: `http://localhost:4466/reviews/default`
  - If left out: it will collide with the default prisma project set automatically to `default/default`

## GQL Resolver Arguments (parent, args, context, info):

- `parent`: Object that contains the result of the query
- `args`: the arguments given using the query
- `context`: Any objects that were passed when creating the GraphQL Server (e.g. Prisma)
- `info`: The Scalar values that was requested from the Client as the return value
  When returning custom objects (e.g., data + auth tokens) we do not use `info`

## GQL Imports

- https://oss.prisma.io/content/graphql-import/overview
- A package that allows importing and exporting schema definitions
- Comes built-in in GQL-Yoga
- Syntax is just like ES6 import/export but prepended with a #-symbol
- Typically used when you want to import the type definitions of the generated typeDefs of Prisma in to your own type definitions (DRY). Used in `schema.graphql` file.

```graphql
# import UserOrderByInput, PostOrderByInput, CommentOrderByInput from "./generated/prisma.graphql"

type Query {
  users(
    query: String
    first: Int
    skip: Int
    after: String
    orderBy: UserOrderByInput
  ): [User!]!
  posts(
    query: String
    first: Int
    skip: Int
    after: String
    orderBy: PostOrderByInput
  ): [Post!]!
  ...
```

## Fragments

- GraphQL Fragments allow you to reuse parts of the queries
- Prisma-Binding builds on top this feature with `extractFragmentReplacements`, which goes through all your resolvers and applies any fragments defined, e.g. `resolvers/User.js`
- Results should now additionally include fields that the User requested as well as the fields you defined on the fragment, which makes it also possible to do checks on the parent argument

```graphql
const User = {
  ...
  email: {
    fragment: "fragment userIdFrag on User { id }",
    resolve(parent, args, { request }, info) {
      const userId = getUserId(request, false)

      if (userId && userId === parent.id) {
        return parent.email
      } else {
        return null
      }
    }
  }
}
```

- Usecase here: Client does not need to explicitly query the `id` field anymore. But since we restrict access to the `email` field to only the own Client, we use a fragment to provide the `id` field, which is then accessible on the `parent` object

## Prisma Troubleshooting

- If schemas are not visible on **pgAdmin**, then we need to recreate them
  - Run the following to delete schema created with prisma deploy

```shell
prisma delete -f
```

- When using different environments defined in a `.env` file use this:

```shell
prisma delete -e <path_to_env_file>
```

- If some projects/schemas do not show on **pgAdmin**, make sure the `schema: public`is not defined in the `docker-compose.yml` file. Also make sure to restart the docker container if you deployed Prisma with this field:

```shell
  docker-compose kill
  docker-compose down
  docker-compose up -d
```

# Abstract Summary (mostly for me)

## Configuration

- Setup DB of choice (here, using **PostgreSQL** provided by **Heroku**)
- Install Docker (Since **Prisma Server** requires it)
- Run the following to create a folder for a Prisma Project called `prisma`

```shell
prisma init prisma
```

- Modify file `docker-compose.yml` to add information for Prisma server to connect to DB
- Inside that folder run the followomg to generate schemas and test all connections

```shell
prisma deploy -e <path_to_env_file>
```

- Schemas should have been created on the DB. They should also be accessible on the provided GQL Playground
- Setup npm command to download the generated typeDefs of Prisma so that we may use/override them for our needs

```shell
  graphql get-schema --project prisma --dotenv config/dev.env
```

- Create folder structure for own:
  - Resolvers
  - Generated typeDefs of Prisma
  - Utils (if needed, e.g. authentication methods)

## Workflow

- Modify `prisma/datamodel.graphql` to quickly generate typeDefs and CRUD operations
- Deploy new prisma data model with `prisma deploy <flags>`
  - For determining where to deploy to (dev/prod) use the -e flag: `prisma deploy -e ../config/prod.env`
- Download the newly generated typeDefs with `npm run get-schema`
- Use these typeDefs in own resolvers to use them
- Use **Jest** with **Apollo Boost Client** for testing
