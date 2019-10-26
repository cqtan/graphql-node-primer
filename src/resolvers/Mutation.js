import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import getUserId from "../utils/getUserId"

const Mutation = {
  createUser: async (parent, args, { prisma }, info) => {
    const emailTaken = await prisma.exists.User({ email: args.data.email })
    if (emailTaken) throw new Error("Email taken!")

    if (args.data.password.length < 8)
      throw new Error("Password must be 8 characters or long")

    const password = await bcrypt.hash(args.data.password, 10)

    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password
      }
    })

    return {
      user,
      token: jwt.sign({ userId: user.id }, "secret")
    }
  },
  login: async (parent, args, { prisma }, info) => {
    const user = await prisma.query.user({
      where: {
        email: args.data.email
      }
    })

    if (!user) throw new Error("No user found!")

    const isMatch = await bcrypt.compare(args.data.password, user.password)

    if (!isMatch) throw new Error("Unable to login")

    return {
      user,
      token: jwt.sign({ userId: user.id }, "secret")
    }
  },
  deleteUser: async (parent, args, { prisma, request }, info) => {
    const userId = getUserId(request)

    return prisma.mutation.deleteUser({ where: { id: userId } }, info)
  },
  updateUser: async (parent, args, { prisma, request }, info) => {
    const userId = getUserId(request)

    return prisma.mutation.updateUser(
      {
        where: {
          id: userId
        },
        data: args.data
      },
      info
    )
  },
  createPost: async (parent, args, { prisma, request, pubsub }, info) => {
    const userExists = await prisma.exists.User({ id: args.data.author })

    if (!userExists) throw new Error("User not found")

    const userId = getUserId(request)

    return prisma.mutation.createPost(
      {
        data: {
          title: args.data.title,
          body: args.data.body,
          published: args.data.published,
          author: {
            connect: {
              id: userId
            }
          }
        }
      },
      info
    )
  },
  deletePost: async (parent, args, { prisma, request, pubsub }, info) => {
    const userId = getUserId(request)

    const postExists = await prisma.exists.Post({
      id: args.id,
      author: { id: userId }
    })

    if (!postExists) throw new Error("Unable to delete Post")

    return prisma.mutation.deletePost(
      {
        where: {
          id: args.id
        }
      },
      info
    )
  },
  updatePost: async (parent, args, { prisma, request, pubsub }, info) => {
    const userId = getUserId(request)

    const postExists = await prisma.exists.Post({
      id: args.id,
      author: { id: userId }
    })

    const isPublished = await prisma.exists.Post({
      id: args.id,
      published: true
    })

    if (!postExists) throw new Error("Unable to update Post")

    if (isPublished && args.data.published === false) {
      await prisma.mutation.deleteManyComments({
        where: {
          post: { id: args.id }
        }
      })
    }

    return prisma.mutation.updatePost(
      {
        where: {
          id: args.id
        },
        data: args.data
      },
      info
    )
  },
  createComment: async (parent, args, { prisma, request, pubsub }, info) => {
    const userId = getUserId(request)
    const postExists = await prisma.exists.Post({
      id: args.data.post,
      published: true
    })

    if (!postExists) throw new Error("Unable to find Post")

    return prisma.mutation.createComment(
      {
        data: {
          text: args.data.text,
          author: {
            connect: {
              id: userId
            }
          },
          post: {
            connect: {
              id: args.data.post
            }
          }
        }
      },
      info
    )
  },
  deleteComment: async (parent, args, { prisma, request, pubsub }, info) => {
    const userId = getUserId(request)

    const commentExists = await prisma.exists.Comment({
      id: args.id,
      author: { id: userId }
    })

    if (!commentExists) throw new Error("Unable to delete Comment")

    return prisma.mutation.deleteComment(
      {
        where: {
          id: args.id
        }
      },
      info
    )
  },
  updateComment: async (parent, args, { prisma, request, pubsub }, info) => {
    const userId = getUserId(request)

    const commentExists = await prisma.exists.Comment({
      id: args.id,
      author: { id: userId }
    })

    if (!commentExists) throw new Error("Unable to update Comment")

    return prisma.mutation.updateComment(
      {
        where: {
          id: args.id
        },
        data: args.data
      },
      info
    )
  }
}

export { Mutation as default }
