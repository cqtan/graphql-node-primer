import "@babel/polyfill/noConflict"
import "cross-fetch/polyfill"
import seedDatabase, { userOne, postOne, postTwo } from "./utils/seedDatabase"
import getClient from "./utils/getClient"
import prisma from "../src/prisma"
import {
  getPosts,
  getMyPosts,
  updatePost,
  createPost,
  deletePost
} from "./utils/operation"

const client = getClient()

beforeEach(seedDatabase)

it("should expose published posts only", async () => {
  const response = await client.query({ query: getPosts })

  expect(response.data.posts.length).toBe(1)
  expect(response.data.posts[0].published).toBe(true)
})

it("should expose all posts of authorized user", async () => {
  const client = getClient(userOne.jwt)

  const testPost = await prisma.mutation.createPost({
    data: {
      title: "TestPost3",
      body: "TestPost3 Body",
      published: false,
      author: {
        connect: {
          id: userOne.user.id
        }
      }
    }
  })

  const { data } = await client.query({ query: getMyPosts })

  expect(data.myPosts.length).toBe(3)
  expect(data.myPosts[2].title).toBe(testPost.title)
})

it("should be able to update post", async () => {
  const client = getClient(userOne.jwt)
  const variables = {
    id: postOne.post.id,
    data: {
      published: false
    }
  }

  const { data } = await client.mutate({ mutation: updatePost, variables })
  const exists = await prisma.exists.Post({
    id: postOne.post.id,
    published: false
  })

  expect(data.updatePost.published).toBe(false)
  expect(exists).toBe(true)
})

it("should be able to create a post", async () => {
  const client = getClient(userOne.jwt)
  const variables = {
    data: {
      title: "TestPost3",
      body: "TestPost3 Body",
      published: false
    }
  }

  const { data } = await client.mutate({ mutation: createPost, variables })
  const exists = await prisma.exists.Post({ id: data.createPost.id })

  expect(exists).toBe(true)
})

it("should be able to delete a post", async () => {
  const client = getClient(userOne.jwt)
  const variables = {
    id: postTwo.post.id
  }

  await client.mutate({ mutation: deletePost, variables })
  const exists = await prisma.exists.Post({ id: postTwo.post.id })

  expect(exists).toBe(false)
})
