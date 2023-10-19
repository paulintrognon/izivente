import { UserSession } from './UserSession.type'

export type RequestWithUserSession = Request & {
  user: UserSession
}
