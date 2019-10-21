import { Prisma } from "prisma-binding"

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: "http://localhost:4466"
})

// Queries
// prisma.query.users(null, "{ id name posts { id title }  }").then(data => {
//   console.log("data: ", JSON.stringify(data, undefined, 2))
// })

// prisma.query
//   .comments(null, "{ id text author { id name } post {id title} }")
//   .then(data => {
//     console.log("data: ", JSON.stringify(data, undefined, 2))
//   })

const createPostForUser = async (authorId, data) => {
  const post = await prisma.mutation.createPost(
    {
      data: {
        ...data,
        author: {
          connect: {
            id: authorId
          }
        }
      }
    },
    "{ id title body published }"
  )

  const user = await prisma.query.user(
    {
      where: {
        id: authorId
      }
    },
    "{ id name email posts { id title published } }"
  )

  return user
}

// createPostForUser("ck206zutu01cl07984na3risa", {
//   title: "Making it Async",
//   body: "And not forgetting to Await it",
//   published: true
// }).then(user => {
//   console.log("READ User data: ", JSON.stringify(user, undefined, 2))
// })

// Mutation Post CREATE
// prisma.mutation
//   .createPost(
//     {
//       data: {
//         title: "Something different",
//         body: "Body of something different",
//         published: true,
//         author: {
//           connect: {
//             id: "ck206zutu01cl07984na3risa"
//           }
//         }
//       }
//     },
//     "{ id title body published }"
//   )
//   .then(data => {
//     console.log("data: ", data)
//     return prisma.query.users(null, "{ id name posts { id title }  }")
//   })
//   .then(data => {
//     console.log("data: ", JSON.stringify(data, undefined, 2))
//   })

const updatePostForUser = async (postId, data) => {
  try {
    const post = await prisma.mutation.updatePost(
      {
        where: {
          id: postId
        },
        data: { ...data }
      },
      "{ author { id } }"
    )

    const user = await prisma.query.user(
      {
        where: {
          id: post.author.id
        }
      },
      "{ id name email posts { id title body published } }"
    )

    return user
  } catch (err) {
    console.log("error: ", err)
  }
}

updatePostForUser("ck20avy79020a0798brru8f2i", {
  title: "THE NEWEST TITLE1",
  body: "THE NEWEST BODY, YO!"
}).then(user =>
  console.log("READ User data: ", JSON.stringify(user, undefined, 2))
)

// Mutation Post UPDATE
// prisma.mutation
//   .updatePost(
//     {
//       data: {
//         published: false,
//         body: "Update the body because inappropriate"
//       },
//       where: {
//         id: "ck20avy79020a0798brru8f2i"
//       }
//     },
//     "{ id title body published }"
//   )
//   .then(data => {
//     console.log("UPDATE data: ", data)
//     return prisma.query.posts(
//       null,
//       "{ id title body published author { id name } }"
//     )
//   })
//   .then(data => {
//     console.log("READ data: ", data)
//   })
