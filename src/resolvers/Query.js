const Query = {
  users: (parent, args, { db, prisma }, info) => {
    const opArgs = {}

    if (args.query) {
      opArgs.where = {
        AND: [
          {
            name_contains: args.query
          },
          {
            email_contains: args.query
          }
        ]
      }
    }

    return prisma.query.users(opArgs, info)
    // if (args.query) {
    //   return db.users.filter(user => {
    //     return user.name.toLowerCase().includes(args.query.toLowerCase())
    //   })
    // } else {
    //   return db.users
    // }
  },
  posts(parent, args, { db, prisma }, info) {
    const opArgs = {}

    if (args.query) {
      opArgs.where = {
        OR: [
          {
            title_contains: args.query
          },
          {
            body_contains: args.query
          }
        ]
      }
    }

    return prisma.query.posts(opArgs, info)
    // if (!args.query) {
    //   return db.posts
    // }

    // return db.posts.filter(post => {
    //   const isTitleMatch = post.title
    //     .toLowerCase()
    //     .includes(args.query.toLowerCase())
    //   const isBodyMatch = post.body
    //     .toLowerCase()
    //     .includes(args.query.toLowerCase())
    //   return isTitleMatch || isBodyMatch
    // })
  },
  comments: (parent, args, { db, prisma }, info) => {
    return prisma.query.comments(null, info)
    // return db.comments
  },
  me: () => {
    return {
      id: "asdf1234",
      name: "CouchCat",
      email: "couch@cat.com"
    }
  },
  post: () => {
    return {
      id: "123",
      title: "Best title",
      body: "This is the content of the best post",
      published: true
    }
  }
}

export { Query as default }
