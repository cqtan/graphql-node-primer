import { GraphQLServer } from "graphql-yoga"

// Type defs (schema)
const typeDefs = `
  type Query {
    me: User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }
`

// Resolvers (functions that can be performed on this schema)
const resolvers = {
  Query: {
    me: () => {
      return {
        id: "asdf1234",
        name: "CouchCat",
        email: "couch@cat.com"
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
