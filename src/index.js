import { GraphQLServer } from "graphql-yoga"

const usersDemo = [
  {
    id: "1",
    name: "Cat1",
    email: "cat1@cat.com",
    age: 12
  },
  {
    id: "23123",
    name: "Dog",
    email: "dog@dog.com"
  },
  {
    id: "555",
    name: "Cat555",
    email: "cat555@cat.com",
    age: 100
  }
]

// Type defs (schema)
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts: [Post!]!
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
    users: (parent, args, ctx, info) => {
      if (args.query) {
        return usersDemo.filter(user => {
          return user.name.toLowerCase().includes(args.query.toLowerCase())
        })
      } else {
        return usersDemo
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
