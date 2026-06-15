import bcrypt from "bcryptjs";

export const hashValue = async (password: string) => {
  return await bcrypt.hash(password, 10);
}

export const compareValue = async (data: {
  password: string;
  hash: string
}) => {
  return await bcrypt.compare(data.password, data.hash);
}
