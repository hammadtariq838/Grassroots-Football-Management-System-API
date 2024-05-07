export type UserSignupRequest = {
  username: string,
  password: string,
  role: "admin" | "coach" | "player",
}

export type UserSigninRequest = {
  username: string,
  password: string,
}

