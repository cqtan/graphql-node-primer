import { GraphQLServer } from "graphql-yoga";

// Type defs (schema)
const typeDefs = `
  type Query {
    id: ID!
    name: String!
    age: Int!
    employed: Boolean!
    gpa: Float
  }
`;

// Resolvers (functions that can be performed on this schema)
const resolvers = {
  Query: {
    id: () => {
      return "asdf1234";
    },
    name: () => {
      return "CouchCat";
    },
    age: () => {
      return 42;
    },
    employed: () => {
      return true;
    },
    gpa: () => {
      return 3.21;
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  console.log("Server is running...");
});
