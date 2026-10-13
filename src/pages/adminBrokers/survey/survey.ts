export interface Survey {
  _id: string;
  brokerId: string;
  user_id: {
    _id: string;
    userName: string;
  };
  selectedServer?: string;
  question_1: number;
  question_2: number;
  question_3: number;
  question_4: number;
  comments?: string;
  createdAt?: string; // Timestamp generado por Mongoose
  updatedAt?: string; // Timestamp generado por Mongoose
}
