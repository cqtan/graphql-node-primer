import bcrypt from "bcryptjs"

const hashPassword = async password => {
  if (password.length < 8)
    throw new Error("Password must be 8 characters or long")

  return await bcrypt.hash(password, 10)
}

export { hashPassword as default }
