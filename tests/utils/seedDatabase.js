import prisma from "../../src/prisma"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const userOne = {
  input: {
    name: "Dog",
    email: "dog@test.com",
    password: bcrypt.hashSync("asdf1234")
  },
  user: undefined,
  jwt: undefined
}

const userTwo = {
  input: {
    name: "Cat",
    email: "cat@test.com",
    password: bcrypt.hashSync("asdf1234")
  },
  user: undefined,
  jwt: undefined
}

const postOne = {
  input: {
    title: "TestPost1",
    body: "TestPost1 Body",
    published: true
  },
  post: undefined
}

const postTwo = {
  input: {
    title: "TestPost2",
    body: "TestPost2 Body",
    published: false
  },
  post: undefined
}

const commentOne = {
  input: {
    text: "Comment1Text"
  },
  comment: undefined
}

const commentTwo = {
  input: {
    text: "Comment2Text"
  },
  comment: undefined
}

const seedDatabase = async () => {
  // Delete test data
  await prisma.mutation.deleteManyComments()
  await prisma.mutation.deleteManyPosts()
  await prisma.mutation.deleteManyUsers()

  // Create user one
  userOne.user = await prisma.mutation.createUser({
    data: userOne.input
  })
  userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET)

  // Create user two
  userTwo.user = await prisma.mutation.createUser({
    data: userTwo.input
  })
  userTwo.jwt = jwt.sign({ userId: userTwo.user.id }, process.env.JWT_SECRET)

  postOne.post = await prisma.mutation.createPost({
    data: {
      ...postOne.input,
      author: {
        connect: {
          id: userOne.user.id
        }
      }
    }
  })

  postTwo.post = await prisma.mutation.createPost({
    data: {
      ...postTwo.input,
      author: {
        connect: {
          id: userOne.user.id
        }
      }
    }
  })

  commentOne.comment = await prisma.mutation.createComment({
    data: {
      ...commentOne.input,
      author: {
        connect: {
          id: userTwo.user.id
        }
      },
      post: {
        connect: {
          id: postOne.post.id
        }
      }
    }
  })

  commentTwo.comment = await prisma.mutation.createComment({
    data: {
      ...commentTwo.input,
      author: {
        connect: {
          id: userOne.user.id
        }
      },
      post: {
        connect: {
          id: postOne.post.id
        }
      }
    }
  })
}

export {
  seedDatabase as default,
  userOne,
  userTwo,
  postOne,
  postTwo,
  commentOne,
  commentTwo
}
