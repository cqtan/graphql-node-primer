import jwt from "jsonwebtoken"

// requireAuth: To additionally allow signed users to view their unpublished posts
const getUserId = (request, requireAuth = true) => {
  const header = request.request
    ? request.request.headers.authorization
    : request.connection.context.Authorization

  if (header) {
    const token = header.replace("Bearer ", "")
    const decoded = jwt.verify(token, "secret")

    return decoded.userId
  }

  if (requireAuth) {
    throw new Error("Authentication is required")
  }

  return null
}

export { getUserId as default }
