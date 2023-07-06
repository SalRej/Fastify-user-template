export const UserSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    email: { type: 'string' },
    id: { type: 'string' }
  }
}

export const AuthHeaderSchema = {
  type: 'object',
  properties: {
    authorization: { type: 'string' }
  }
}

export const createUserSchema = {
  schema: {
    body: {
      type: 'object',
      properties: {
        name: { type: 'string', minLength: 3, maxLength: 10 },
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 6 },
        confirmPassword: { type: 'string', minLength: 6 }
      },
      required: ['name', 'email', 'password']
    },
    response: {
      201: {
        type: 'object',
        properties: {
          user: UserSchema,
          token: { type: 'string' }
        }
      }
    }
  }
}

export const getUserSchema = {
  schema: {
    headers: AuthHeaderSchema,
    response: {
      200: UserSchema
    }
  }
}

export const loginUserSchema = {
  schema: {
    body: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 6 }
      },
      required: ['password', 'email']
    },
    response: {
      200: {
        type: 'object',
        properties: {
          user: UserSchema,
          token: { type: 'string' }
        }
      }
    }
  }
}
