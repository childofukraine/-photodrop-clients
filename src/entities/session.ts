export default class Session {
  constructor(
    public sessionId: string,
    public clientId: string,
    public refreshToken: string,
    public expiresIn: Date
  ) {}
}
