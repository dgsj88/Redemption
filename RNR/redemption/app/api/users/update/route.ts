import getConnection from "../../../../lib/db";

interface UserUpdateRequest {
  id: number;
  email: string;
  password: string;
  name: string;
  role: string;
  credits: number;
  isActive: boolean;
  createdDate: string;
}

interface Request {
  json(): Promise<UserUpdateRequest>;
}

interface Response {
  status(code: number): this;
  json(data: unknown): void;
}

export async function PUT(req: Request, res: Response): Promise<void> {
  const connection = getConnection;
  const { id, email, password, name, role, credits, isActive, createdDate } =
    await req.json();
  await connection.query(
    "UPDATE user SET email = ?, password = ?, name = ?, role = ?, credits = ?, isActive = ?, createDate = ? WHERE id = ?",
    [email, password, name, role, credits, isActive, createdDate, id]
  );
  res
    .status(200)
    .json({ id, email, password, name, role, credits, isActive, createdDate });
}
