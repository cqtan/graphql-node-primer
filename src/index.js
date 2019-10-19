import { GraphQLServer } from "graphql-yoga"

// Type defs (schema)
const typeDefs = `
  type Query {
    greeting(name: String, position: String!): String!
    me: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
  }
`

// Resolvers (functions that can be performed on this schema)
const resolvers = {
  Query: {
    greeting: (parent, args, ctx, info) => {
      if (args.name && args.position) {
        return `Hello, ${args.name} you are ${args.position}`
      } else {
        return "Hoi! "
      }
    },
    me: () => {
      return {
        id: "asdf1234",
        name: "CouchCat",
        email: "couch@cat.com"
      }
    },
    post: () => {
      return {
        id: "123",
        title: "Best title",
        body: "This is the content of the best post",
        published: true
      }
    }
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers
})

server.start(() => {
  console.log("Server is running...")
})
