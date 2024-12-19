import Papa from "papaparse";
import { User } from "../types/User"; // User 타입 가져오기

const USERS_CSV_PATH = "./data/users.csv";

export const checkUniqueId = async (id: string): Promise<boolean> => {
  const response = await fetch(USERS_CSV_PATH);
  const csvText = await response.text();
  const users = Papa.parse(csvText, { header: true }).data;

  return !users.some((user: any) => user.id === id);
};

export const hashPassword = (password: string): string => {
  // Replace with your password hashing logic
  return btoa(password); // Simple Base64 encoding for example
};

export const login = async (id: string, password: string): Promise<boolean> => {
  const response = await fetch(USERS_CSV_PATH);
  const csvText = await response.text();
  const users = Papa.parse(csvText, { header: true }).data;

  const hashedPassword = hashPassword(password);
  return users.some(
    (user: any) => user.id === id && user.password === hashedPassword
  );
};

// 회원가입 함수
export const signup = async (newUser: User): Promise<boolean> => {
  const isUnique = await checkUniqueId(newUser.id);
  if (!isUnique) return false;

  const response = await fetch(USERS_CSV_PATH);
  const csvText = await response.text();
  const users = Papa.parse(csvText, { header: true }).data;

  users.push(newUser);
  const updatedCSV = Papa.unparse(users);
  // saveCSV(updatedCSV); // 로컬 저장 로직 필요
  return true;
};
