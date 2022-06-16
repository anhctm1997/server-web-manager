import dotenv from "dotenv";
dotenv.config();
export const key = {
  jwt: process.env.PRIVATE_KEY,
  uri: process.env.DB_URI,
  jwtRefresh: process.env.REFRESH_KEY,
  expTime: (time: number) => {
    return {
      expiresIn: time * 60,
    };
  },
};
