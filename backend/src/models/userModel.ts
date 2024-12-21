import fs from "fs-extra";
import path from "path";

interface User {
  username: string;
  email: string;
  password: string;
}

const filePath = path.join(__dirname, "../../data/users.json");

export const getUsers = async (): Promise<User[]> => {
  try {
    const users = await fs.readJson(filePath);
    return users;
  } catch (error) {
    console.error("Error reading users.json:", error);
    throw new Error("Could not read user data");
  }
};

export const saveUsers = async (users: User[]): Promise<void> => {
  try {
    await fs.writeJson(filePath, users, { spaces: 2 });
  } catch (error) {
    console.error("Error writing to users.json:", error);
    throw new Error("Could not save user data");
  }
};
