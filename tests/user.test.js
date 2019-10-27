import "@babel/polyfill/noConflict"
import "cross-fetch/polyfill"
import ApolloBoost, { gql } from "apollo-boost"
import prisma from "../src/prisma"
import bcrypt from "bcryptjs"

const client = new ApolloBoost({
  uri: "http://localhost:4000"
})

beforeEach(async () => {
  await prisma.mutation.deleteManyPosts()
  await prisma.mutation.deleteManyUsers()
  const user = await prisma.mutation.createUser({
    data: {
      name: "Dog",
      email: "dog@test.com",
      password: bcrypt.hashSync("asdf1234")
    }
  })

  await prisma.mutation.createPost({
    data: {
      title: "TestPost1",
      body: "TestPost1 Body",
      published: true,
      author: {
        connect: {
          id: user.id
        }
      }
    }
  })

  await prisma.mutation.createPost({
    data: {
      title: "TestPost2",
      body: "TestPost2 Body",
      published: false,
      author: {
        connect: {
          id: user.id
        }
      }
    }
  })
})

test("Should create a new user", async () => {
  const createUser = gql`
    mutation {
      createUser(
        data: { name: "CouchCat", email: "cat@test.com", password: "asdf1234" }
      ) {
        token
        user {
          id
        }
      }
    }
  `

  const response = await client.mutate({
    mutation: createUser
  })

  const exists = await prisma.exists.User({
    id: response.data.createUser.user.id
  })
  expect(exists).toBe(true)
})

it("should expose public author profiles", async () => {
  const getUsers = gql`
    query {
      users {
        id
        name
        email
      }
    }
  `

  const response = await client.query({ query: getUsers })

  expect(response.data.users.length).toBe(1)
  expect(response.data.users[0].email).toBe(null)
})

it("should expose published posts only", async () => {
  const getPosts = gql`
    query {
      posts {
        title
        body
        published
      }
    }
  `

  const response = await client.query({ query: getPosts })

  expect(response.data.posts.length).toBe(1)
  expect(response.data.posts[0].published).toBe(true)
})

it("should not login with bad credentials", async () => {
  const login = gql`
    mutation {
      login(data: { email: "rando@test.com", password: "12345678" }) {
        token
      }
    }
  `
  await expect(client.mutate({ mutation: login })).rejects.toThrow()
})

it("should not create a user with a password less than 8 characters long", async () => {
  const createUser = gql`
    mutation {
      createUser(
        data: { name: "Croco", email: "croco@test.com", password: "12345" }
      ) {
        token
        user {
          id
        }
      }
    }
  `

  await expect(client.mutate({ mutation: createUser })).rejects.toThrow()
})
