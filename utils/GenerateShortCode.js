import { nanoid } from "nanoid";

export const generateShortCode = (length = 8) => {
  return nanoid(length);
}