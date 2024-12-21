interface User {
  username: string;
  password: string;
  email: string;
}

let users: User[] = []; // CSV에서 파싱된 사용자 데이터

// CSV 파일 로드 및 파싱
const loadUsers = async (): Promise<void> => {
  const response = await fetch("/data/users.csv");
  const csvText = await response.text();
  users = parseCSV(csvText);
};

// CSV 데이터 파싱 함수
const parseCSV = (data: string): User[] => {
  const lines = data.split("\n");
  const headers = lines[0].split(",").map((header) => header.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(",").map((value) => value.trim());
    return {
      username: values[0],
      password: values[1],
      email: values[2],
    } as User;
  });
};

// 로그인 함수
export const login = async (
  email: string,
  password: string
): Promise<{ success: boolean; username?: string }> => {
  if (users.length === 0) {
    await loadUsers(); // CSV 데이터 로드
  }

  const user = users.find((u) => u.email === email && u.password === password);
  if (user) {
    return { success: true, username: user.username };
  }
  return { success: false };
};
