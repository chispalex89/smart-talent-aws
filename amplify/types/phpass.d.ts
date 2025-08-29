module 'phpass' {
  export class PasswordHash {
    constructor(iterations: number, portable: boolean);
    public CheckPassword(plain: string, hash: string): boolean;
  }
}
