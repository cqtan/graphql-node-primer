import "@babel/polyfill/noConflict"
import "cross-fetch/polyfill"
import prisma from "../src/prisma"
import seedDatabase, { userOne } from "./utils/seedDatabase"
import getClient from "./utils/getClient"
import { createUser, getUsers, login, getProfile } from "./utils/operation"

const client = getClient()
beforeEach(seedDatabase)

test("Should create a new user", async () => {
  const variables = {
    data: {
      name: "Gunther",
      email: "gunther@test.com",
      password: "asdf1234"
    }
  }

  const response = await client.mutate({
    mutation: createUser,
    variables
  })

  const exists = await prisma.exists.User({
    id: response.data.createUser.user.id
  })
  expect(exists).toBe(true)
})

it("should expose public author profiles", async () => {
  const response = await client.query({ query: getUsers })

  expect(response.data.users.length).toBe(1)
  expect(response.data.users[0].email).toBe(null)
})

it("should not login with bad credentials", async () => {
  const variables = {
    data: { email: "rando@test.com", password: "12345678" }
  }

  await expect(client.mutate({ mutation: login, variables })).rejects.toThrow()
})

it("should not create a user with a password less than 8 characters long", async () => {
  const variables = {
    data: { name: "Croco", email: "croco@test.com", password: "12345" }
  }

  await expect(
    client.mutate({ mutation: createUser, variables })
  ).rejects.toThrow()
})

it("should fetch user profile", async () => {
  const client = getClient(userOne.jwt)

  const { data } = await client.query({ query: getProfile })

  expect(data.me.id).toBe(userOne.user.id)
  expect(data.me.name).toBe(userOne.user.name)
  expect(data.me.email).toBe(userOne.user.email)
})
