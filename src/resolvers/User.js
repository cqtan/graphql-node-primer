import getUserId from "../utils/getUsedId"

const User = {
  // * These overrides the relationships already provided by Prisma
  // * Later to be used for authentication though!
  // posts: (parent, args, { db }, info) => {
  //   return db.posts.filter(post => {
  //     return post.author === parent.id
  //   })
  // },
  // comments: (parent, args, { db }, info) => {
  //   return db.comments.filter(comment => {
  //     return comment.author === parent.id
  //   })
  // }
  posts: {
    fragment: "fragment userId on User { id }",
    resolve(parent, args, { prisma }, info) {
      return prisma.query.posts({
        where: { published: true, author: { id: parent.id } }
      })
    }
  },
  email: {
    fragment: "fragment userId on User { id }",
    resolve(parent, args, { request }, info) {
      const userId = getUserId(request, false)

      if (userId && userId === parent.id) {
        return parent.email
      } else {
        return null
      }
    }
  }
}

export { User as default }
