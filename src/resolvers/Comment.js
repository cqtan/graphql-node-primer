const Comment = {
  // * These overrides the relationships already provided by Prisma
  // * Later to be used for authentication though!
  // author: (parent, args, { db }, info) => {
  //   return db.users.find(user => {
  //     return user.id === parent.author
  //   })
  // },
  // post: (parent, args, { db }, info) => {
  //   return db.posts.find(post => {
  //     return post.id === parent.post
  //   })
  // }
}

export { Comment as default }
