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

// Subscription: (not supported in Apollo Boost)
// test('Should subscribe to comments for a post', async (done) => {
//   const variables = {
//       postId: postOne.post.id
//   }
//   client.subscribe({ query: subscribeToComments, variables }).subscribe({
//       next(response) {
//           expect(response.data.comment.mutation).toBe('DELETED')
//           done()
//       }
//   })

//   await prisma.mutation.deleteComment({ where: { id: commentOne.comment.id }})
// })

// test('Should subscribe to changes for published posts', async (done) => {
//   client.subscribe({ query: subscribeToPosts }).subscribe({
//       next(response) {
//           expect(response.data.post.mutation).toBe('DELETED')
//           done()
//       }
//   })

//   await prisma.mutation.deletePost({ where: { id: postOne.post.id } })
// })
