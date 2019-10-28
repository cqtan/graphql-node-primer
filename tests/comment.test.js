import "@babel/polyfill/noConflict"
import "cross-fetch/polyfill"
import seedDatabase, {
  userOne,
  userTwo,
  commentTwo
} from "./utils/seedDatabase"
import getClient from "./utils/getClient"
import prisma from "../src/prisma"
import { deleteComment } from "./utils/operation"

beforeEach(seedDatabase)

it("should delete own comment", async () => {
  const client = getClient(userOne.jwt)
  const variables = {
    id: commentTwo.comment.id
  }

  const { data } = await client.mutate({ mutation: deleteComment, variables })
  const exists = await prisma.exists.Comment({ id: data.deleteComment.id })

  expect(exists).toBe(false)
  expect(data.deleteComment.text).toBe(commentTwo.comment.text)
})

it("should not delete user's comment", async () => {
  const client = getClient(userTwo.jwt)
  const variables = {
    id: commentTwo.comment.id
  }

  await expect(
    client.mutate({ mutation: deleteComment, variables })
  ).rejects.toThrow()
})
