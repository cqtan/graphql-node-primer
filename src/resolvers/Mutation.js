import uuidv4 from "uuid/v4"

const Mutation = {
  createUser: async (parent, args, { prisma }, info) => {
    const emailTaken = await prisma.exists.User({ email: args.data.email })
    if (emailTaken) throw new Error("Email taken!")

    return prisma.mutation.createUser({ data: args.data }, info)

    // const emailTaken = db.users.some(user => user.email === args.data.email)
    // if (emailTaken) throw new Error("Email taken!")

    // const user = {
    //   id: uuidv4(),
    //   ...args.data
    // }

    // db.users.push(user)

    // return user
  },
  deleteUser: async (parent, args, { prisma }, info) => {
    const userExists = await prisma.exists.User({ id: args.id })

    if (!userExists) throw new Error("User not found")

    return prisma.mutation.deleteUser({ where: { id: args.id } }, info)

    // const userIndex = db.users.findIndex(user => user.id === args.id)

    // if (userIndex === -1) throw new Error("User not found")

    // const deletedUsers = db.users.splice(userIndex, 1)

    // db.posts = db.posts.filter(post => {
    //   const match = post.author === args.id

    //   if (match) {
    //     db.comments = db.comments.filter(comment => comment.post !== post.id)
    //   }

    //   return !match
    // })
    // db.comments = comments.filter(comment => comment.author !== args.id)

    // return deletedUsers[0]
  },
  updateUser: async (parent, args, { prisma }, info) => {
    return prisma.mutation.updateUser(
      {
        where: {
          id: args.id
        },
        data: args.data
      },
      info
    )

    // const { id, data } = args
    // const user = db.users.find(user => user.id === id)

    // if (!user) throw new Error("User not found")

    // if (typeof data.email === "string") {
    //   const emailTaken = db.users.some(user => user.email === data.email)

    //   if (emailTaken) throw new Error("Email taken")

    //   user.email = data.email
    // }

    // if (typeof data.name === "string") {
    //   user.name = data.name
    // }

    // if (typeof data.age === "undefined") {
    //   user.age = data.age
    // }

    // return user
  },
  createPost: async (parent, args, { prisma, pubsub }, info) => {
    const userExists = await prisma.exists.User({ id: args.data.author })

    if (!userExists) throw new Error("User not found")

    return prisma.mutation.createPost(
      {
        data: {
          title: args.data.title,
          body: args.data.body,
          published: args.data.published,
          author: {
            connect: {
              id: args.data.author
            }
          }
        }
      },
      info
    )

    // const userExists = db.users.some(user => user.id === args.data.author)

    // if (!userExists) throw new Error("User not found")

    // const post = {
    //   id: uuidv4(),
    //   ...args.data
    // }

    // db.posts.push(post)

    // if (args.data.published) {
    //   pubsub.publish("post", { post: { mutation: "CREATED", data: post } })
    // }

    // return post
  },
  deletePost: async (parent, args, { prisma, pubsub }, info) => {
    const postExists = await prisma.exists.Post({ id: args.id })

    if (!postExists) throw new Error("Post not found")

    return prisma.mutation.deletePost(
      {
        where: {
          id: args.id
        }
      },
      info
    )

    // const postIndex = db.posts.findIndex(post => post.id === args.id)

    // if (postIndex === -1) throw new Error("Post not found")

    // const [post] = db.posts.splice(postIndex, 1)

    // db.comments = db.comments.filter(comment => comment.post !== args.id)

    // if (post.published) {
    //   pubsub.publish("post", { post: { mutation: "DELETED", data: post } })
    // }

    // return post
  },
  updatePost: async (parent, args, { prisma, pubsub }, info) => {
    const postExists = await prisma.exists.Post({ id: args.id })

    if (!postExists) throw new Error("Post not found")

    return prisma.mutation.updatePost(
      {
        where: {
          id: args.id
        },
        data: args.data
      },
      info
    )

    // const { id, data } = args
    // const post = db.posts.find(post => post.id === id)
    // const originalPost = { ...post }

    // if (!post) throw new Error("Post not found")

    // if (typeof data.title === "string") {
    //   post.title = data.title
    // }

    // if (typeof data.body === "string") {
    //   post.body = data.body
    // }

    // if (typeof data.published === "boolean") {
    //   post.published = data.published

    //   if (originalPost.published && !post.published) {
    //     // deleted
    //     pubsub.publish("post", {
    //       post: { mutation: "DELETED", data: originalPost }
    //     })
    //   } else if (!originalPost.published && post.published) {
    //     // created
    //     pubsub.publish("post", { post: { mutation: "CREATED", data: post } })
    //   } else if (post.published) {
    //     // updated
    //     pubsub.publish("post", { post: { mutation: "UPDATED", data: post } })
    //   }
    // }

    // return post
  },
  createComment: async (parent, args, { prisma, pubsub }, info) => {
    return prisma.mutation.createComment(
      {
        data: {
          text: args.data.text,
          author: {
            connect: {
              id: args.data.author
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
    // const userExists = db.users.some(user => user.id === args.data.author)
    // const postExists = db.posts.some(post => post.id === args.data.post)
    // const postPublished = db.posts.some(post => post.published)

    // if (!userExists || !postExists) throw new Error("User not found")
    // if (!postExists) throw new Error("Post not found")
    // if (!postPublished) throw new Error("Post is not published")

    // const comment = {
    //   id: uuidv4(),
    //   ...args.data
    // }

    // db.comments.push(comment)
    // pubsub.publish(`comment ${args.data.post}`, {
    //   comment: { mutation: "CREATED", data: comment }
    // })

    // return comment
  },
  deleteComment: async (parent, args, { prisma, pubsub }, info) => {
    return prisma.mutation.deleteComment(
      {
        where: {
          id: args.id
        }
      },
      info
    )

    // const commentIndex = db.comments.findIndex(
    //   comment => comment.id === args.id
    // )

    // if (commentIndex === -1) throw new Error("Comment not found")

    // const [comment] = db.comments.splice(commentIndex, 1)

    // pubsub.publish(`comment ${comment.post}`, {
    //   comment: { mutation: "DELETED", data: comment }
    // })

    // return comment
  },
  updateComment: async (parent, args, { prisma, pubsub }, info) => {
    return prisma.mutation.updateComment(
      {
        where: {
          id: args.id
        },
        data: args.data
      },
      info
    )

    // const { id, data } = args
    // const comment = db.comments.find(comment => comment.id === id)

    // if (!comment) throw new Error("No Comment found")

    // if (typeof data.text === "string") {
    //   comment.text = data.text
    // }

    // pubsub.publish(`comment ${comment.post}`, {
    //   comment: { mutation: "UPDATED", data: comment }
    // })

    // return comment
  }
}

export { Mutation as default }
