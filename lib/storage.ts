import type { Quiz } from "@/lib/types";

const QUIZZES_KEY = "begrippen-battle:quizzes";

export function getQuizzes(): Quiz[] {
  return readList<Quiz>(QUIZZES_KEY);
}

export function getQuiz(quizId: string): Quiz | null {
  return getQuizzes().find((quiz) => quiz.id === quizId) || null;
}

export function saveQuiz(quiz: Quiz) {
  const quizzes = getQuizzes();
  const nextQuizzes = [quiz, ...quizzes.filter((item) => item.id !== quiz.id)];
  writeList(QUIZZES_KEY, nextQuizzes);
}

function readList<T>(key: string): T[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeList<T>(key: string, value: T[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}
