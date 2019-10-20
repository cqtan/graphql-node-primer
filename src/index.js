import { GraphQLServer } from "graphql-yoga"
import uuidv4 from "uuid/v4"

const users = [
  {
    id: "1",
    name: "Andrew",
    email: "andrew@example.com",
    age: 27
  },
  {
    id: "2",
    name: "Sarah",
    email: "sarah@example.com"
  },
  {
    id: "3",
    name: "Mike",
    email: "mike@example.com"
  }
]

const posts = [
  {
    id: "10",
    title: "GraphQL 101",
    body: "This is how to use GraphQL...",
    published: true,
    author: "1"
  },
  {
    id: "11",
    title: "GraphQL 201",
    body: "This is an advanced GraphQL post...",
    published: false,
    author: "1"
  },
  {
    id: "12",
    title: "Programming Music",
    body: "",
    published: false,
    author: "2"
  }
]

const comments = [
  {
    id: "20",
    text: "You push it..",
    author: "3",
    post: "10"
  },
  {
    id: "21",
    text: "Push and you push it and you...",
    author: "3",
    post: "11"
  },
  {
    id: "22",
    text: "CROSS OVER!!!",
    author: "2",
    post: "11"
  },
  {
    id: "23",
    text: "It don't mean a thing if it ain't got that .....",
    author: "1",
    post: "10"
  }
]

// Type defs (schema)
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments(query: String): [Comment!]!
    me: User!
    post: Post!
  }

  type Mutation {
    createUser(name: String!, email: String!, age: Int): User!
    createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
    createComment(text: String!, author: ID!, post: ID!): Comment!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }
`

// Resolvers (functions that can be performed on this schema)
const resolvers = {
  Query: {
    users: (parent, args, ctx, info) => {
      if (args.query) {
        return users.filter(user => {
          return user.name.toLowerCase().includes(args.query.toLowerCase())
        })
      } else {
        return users
      }
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts
      }

      return posts.filter(post => {
        const isTitleMatch = post.title
          .toLowerCase()
          .includes(args.query.toLowerCase())
        const isBodyMatch = post.body
          .toLowerCase()
          .includes(args.query.toLowerCase())
        return isTitleMatch || isBodyMatch
      })
    },
    comments: (parent, args, ctx, info) => {
      return comments
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
  },
  Mutation: {
    createUser: (parent, args, ctx, info) => {
      const emailTaken = users.some(user => user.email === args.email)
      if (emailTaken) throw new Error("Email taken!")

      const user = {
        id: uuidv4(),
        name: args.name,
        email: args.email,
        age: args.age
      }

      users.push(user)

      return user
    },
    createPost: (parent, args, ctx, info) => {
      const userExists = users.some(user => user.id === args.author)

      if (!userExists) throw new Error("User not found")

      const post = {
        id: uuidv4(),
        title: args.title,
        body: args.body,
        published: args.published,
        author: args.author
      }

      posts.push(post)

      return post
    },
    createComment: (parent, args, ctx, info) => {
      const userExists = users.some(user => user.id === args.author)
      const postExists = posts.some(post => post.id === args.post)
      const postPublished = posts.some(post => post.published)

      if (!userExists || !postExists) throw new Error("User not found")
      if (!postExists) throw new Error("Post not found")
      if (!postPublished) throw new Error("Post is not published")

      const comment = {
        id: uuidv4(),
        text: args.text,
        author: args.author,
        post: args.post
      }

      return comment
    }
  },
  Post: {
    author: (parent, args, ctx, info) => {
      return users.find(user => {
        return user.id === parent.author
      })
    },
    comments: (parent, args, ctx, info) => {
      return comments.filter(comment => {
        return comment.post === parent.id
      })
    }
  },
  User: {
    posts: (parent, args, ctx, info) => {
      return posts.filter(post => {
        return post.author === parent.id
      })
    },
    comments: (parent, args, ctx, info) => {
      return comments.filter(comment => {
        return comment.author === parent.id
      })
    }
  },
  Comment: {
    author: (parent, args, ctx, info) => {
      return users.find(user => {
        return user.id === parent.author
      })
    },
    post: (parent, args, ctx, info) => {
      return posts.find(post => {
        return post.id === parent.post
      })
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
