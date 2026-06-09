export type Term = {
  id: string;
  term: string;
  definition: string;
};

export type Question = {
  id: string;
  type: "definition-to-term" | "term-to-definition" | "true-false";
  termId: string;
  question: string;
  options: string[];
  correctIndex: number;
  feedback: string;
};

export type Quiz = {
  id: string;
  title: string;
  subject: string;
  level: string;
  terms: Term[];
  questions: Question[];
  createdAt: string;
};
