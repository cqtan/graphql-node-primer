import "@babel/polyfill/noConflict"
import "cross-fetch/polyfill"
import { gql } from "apollo-boost"
import seedDatabase, { userOne, postOne, postTwo } from "./utils/seedDatabase"
import getClient from "./utils/getClient"
import prisma from "../src/prisma"

const client = getClient()

beforeEach(seedDatabase)

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

it("should expose all posts of authorized user", async () => {
  const client = getClient(userOne.jwt)
  const getMyPosts = gql`
    query {
      myPosts {
        id
        title
        body
        published
      }
    }
  `

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
  const updatePost = gql`
    mutation {
      updatePost(
        id: "${postOne.post.id}",
        data: {
          published: false
        }
      ){
        id
        title
        body
        published
      }
    }
  `

  const { data } = await client.mutate({ mutation: updatePost })
  const exists = await prisma.exists.Post({
    id: postOne.post.id,
    published: false
  })

  expect(data.updatePost.published).toBe(false)
  expect(exists).toBe(true)
})

it("should be able to create a post", async () => {
  const client = getClient(userOne.jwt)
  const createPost = gql`
    mutation {
      createPost(
        data: { title: "TestPost3", body: "TestPost3 Body", published: false }
      ) {
        id
        title
        body
        published
      }
    }
  `

  const { data } = await client.mutate({ mutation: createPost })
  const exists = await prisma.exists.Post({ id: data.createPost.id })

  expect(exists).toBe(true)
})

it("should be able to delete a post", async () => {
  const client = getClient(userOne.jwt)
  const deletePost = gql`
    mutation {
      deletePost(id: "${postTwo.post.id}"){
        id
        title
        body
        published
      } 
    }
  `

  await client.mutate({ mutation: deletePost })
  const exists = await prisma.exists.Post({ id: postTwo.post.id })

  expect(exists).toBe(false)
})
