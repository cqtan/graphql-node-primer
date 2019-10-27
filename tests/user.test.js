import "@babel/polyfill/noConflict"
import "cross-fetch/polyfill"
import { gql } from "apollo-boost"
import prisma from "../src/prisma"
import seedDatabase, { userOne } from "./utils/seedDatabase"
import getClient from "./utils/getClient"

const client = getClient()
beforeEach(seedDatabase)

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

it("should fetch user profile", async () => {
  const client = getClient(userOne.jwt)
  const getProfile = gql`
    query {
      me {
        id
        name
        email
      }
    }
  `
  const { data } = await client.query({ query: getProfile })

  expect(data.me.id).toBe(userOne.user.id)
  expect(data.me.name).toBe(userOne.user.name)
  expect(data.me.email).toBe(userOne.user.email)
})
