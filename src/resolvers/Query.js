const Query = {
  users: (parent, args, { db }, info) => {
    if (args.query) {
      return db.users.filter(user => {
        return user.name.toLowerCase().includes(args.query.toLowerCase())
      })
    } else {
      return db.users
    }
  },
  posts(parent, args, { db }, info) {
    if (!args.query) {
      return db.posts
    }

    return db.posts.filter(post => {
      const isTitleMatch = post.title
        .toLowerCase()
        .includes(args.query.toLowerCase())
      const isBodyMatch = post.body
        .toLowerCase()
        .includes(args.query.toLowerCase())
      return isTitleMatch || isBodyMatch
    })
  },
  comments: (parent, args, { db }, info) => {
    return db.comments
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
