export class User {
    constructor(
      public clientId: string,
      public phone: string,
      public selfieId?: string| null,
      public email?: string| null,
      public fullName?: string| null,
    ) {}
  }