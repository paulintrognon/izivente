module default {
  type User {
    required email: str {
      constraint exclusive;
    };
    
    required passwordHash: str;
    
    multi refreshTokens: UserRefreshToken;
  }

  type UserRefreshToken {
    required refreshToken: str;
    required expiryDate: datetime;
  }
}
