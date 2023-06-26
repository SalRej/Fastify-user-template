interface IUser {
  name: string
  password: string
  email: string
  id: string
  confirmPassword: string
}

export default IUser

export interface ITokenHeader {
  authorization: string
  email?: string
}
