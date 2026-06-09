"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ProgressBar } from "@/components/ProgressBar";
import { QuestionCard } from "@/components/QuestionCard";
import { getQuiz } from "@/lib/storage";

type Answer = {
  termId: string;
  isCorrect: boolean;
  points: number;
  streakAfterAnswer: number;
  streakBonus: number;
};

const POINTS_PER_CORRECT_ANSWER = 10;
const STREAK_BONUS_POINTS = 5;
const STREAK_BONUS_START = 3;

export function QuizPlayer() {
  const searchParams = useSearchParams();
  const quizId = searchParams.get("quizId") || "";
  const quiz = useMemo(() => getQuiz(quizId), [quizId]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  if (!quiz) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-lift">
        <h1 className="text-3xl font-black text-ink">Quiz niet gevonden</h1>
        <p className="mt-3 font-semibold text-slate-700">
          Kies een opgeslagen quiz om te spelen.
        </p>
        <Link
          className="mt-5 inline-flex min-h-12 items-center rounded-lg bg-ocean px-6 font-black text-white"
          href="/"
        >
          Terug naar home
        </Link>
      </section>
    );
  }

  const activeQuiz = quiz;
  const correctAnswers = answers.filter((answer) => answer.isCorrect).length;
  const totalScore = answers.reduce((score, answer) => score + answer.points, 0);
  const currentStreak = getCurrentStreak(answers);
  const bestStreak = answers.reduce(
    (best, answer) => Math.max(best, answer.streakAfterAnswer),
    0,
  );
  const wrongTermIds = answers
    .filter((answer) => !answer.isCorrect)
    .map((answer) => answer.termId);
  const wrongTerms = activeQuiz.terms.filter((item) =>
    wrongTermIds.includes(item.id),
  );
  const percentage =
    activeQuiz.questions.length === 0
      ? 0
      : Math.round((correctAnswers / activeQuiz.questions.length) * 100);
  const badge = getEndBadge(percentage, bestStreak);

  if (isFinished) {
    return (
      <section className="grid gap-6">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-lift">
          <p className="mb-2 text-sm font-black uppercase tracking-normal text-ocean">
            Klaar
          </p>
          <h1 className="text-4xl font-black leading-tight text-ink">
            Je score is {totalScore} punten
          </h1>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-teal-50 p-4">
              <p className="text-sm font-black text-slate-600">Goed</p>
              <p className="mt-1 text-3xl font-black text-ocean">
                {correctAnswers}/{activeQuiz.questions.length}
              </p>
            </div>
            <div className="rounded-lg bg-amber-50 p-4">
              <p className="text-sm font-black text-slate-600">Percentage</p>
              <p className="mt-1 text-3xl font-black text-ink">{percentage}%</p>
            </div>
            <div className="rounded-lg bg-green-50 p-4">
              <p className="text-sm font-black text-slate-600">Beste streak</p>
              <p className="mt-1 text-3xl font-black text-meadow">
                {bestStreak}
              </p>
            </div>
          </div>
          <div className="mt-5 rounded-lg border border-honey bg-amber-50 p-4">
            <p className="text-sm font-black uppercase tracking-normal text-slate-600">
              Eindbadge
            </p>
            <p className="mt-1 text-2xl font-black text-ink">{badge.title}</p>
            <p className="mt-1 font-bold leading-7 text-slate-700">
              {badge.description}
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-lift">
          <h2 className="text-2xl font-black text-ink">
            Fout beantwoorde begrippen
          </h2>
          {wrongTerms.length === 0 ? (
            <p className="mt-3 rounded-lg bg-green-50 p-4 font-black text-green-900">
              Alles goed beantwoord.
            </p>
          ) : (
            <div className="mt-4 grid gap-3">
              {wrongTerms.map((term) => (
                <div
                  className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                  key={term.id}
                >
                  <p className="font-black text-ink">{term.term}</p>
                  <p className="mt-1 font-semibold leading-7 text-slate-700">
                    {term.definition}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            className="min-h-12 rounded-lg bg-ocean px-6 font-black text-white"
            onClick={() => {
              setCurrentIndex(0);
              setSelectedIndex(null);
              setAnswers([]);
              setIsFinished(false);
            }}
            type="button"
          >
            Speel opnieuw
          </button>
          <Link
            className="inline-flex min-h-12 items-center rounded-lg border border-slate-300 bg-white px-6 font-black text-ink"
            href="/"
          >
            Terug naar home
          </Link>
        </div>
      </section>
    );
  }

  const question = activeQuiz.questions[currentIndex];
  const term = activeQuiz.terms.find((item) => item.id === question.termId);

  if (!question || !term) {
    return (
      <section className="rounded-lg border border-red-200 bg-red-50 p-6">
        <h1 className="text-2xl font-black text-red-900">
          Deze quiz is incompleet.
        </h1>
        <p className="mt-2 font-bold text-red-900">
          Maak de quiz opnieuw vanuit de originele docentinput.
        </p>
      </section>
    );
  }

  function handleAnswer(answerIndex: number) {
    if (selectedIndex !== null || !question) {
      return;
    }

    setSelectedIndex(answerIndex);
    setAnswers((currentAnswers) => [
      ...currentAnswers,
      createAnswer({
        answerIndex,
        correctIndex: question.correctIndex,
        termId: question.termId,
        previousAnswers: currentAnswers,
      }),
    ]);
  }

  function handleNext() {
    if (selectedIndex === null) {
      return;
    }

    const isLastQuestion = currentIndex === activeQuiz.questions.length - 1;
    if (!isLastQuestion) {
      setCurrentIndex((index) => index + 1);
      setSelectedIndex(null);
      return;
    }

    setIsFinished(true);
  }

  return (
    <section className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mb-2 text-sm font-black uppercase tracking-normal text-ocean">
            Quiz spelen
          </p>
          <h1 className="text-4xl font-black leading-tight text-ink">
            {activeQuiz.title}
          </h1>
          <p className="mt-2 font-bold text-slate-600">
            {activeQuiz.subject} - {activeQuiz.level}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-center font-black text-ink">
            <p className="text-xs uppercase tracking-normal text-slate-500">
              Punten
            </p>
            <p className="text-xl">{totalScore}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-center font-black text-ink">
            <p className="text-xs uppercase tracking-normal text-slate-500">
              Goed
            </p>
            <p className="text-xl">
              {correctAnswers}/{answers.length}
            </p>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-center font-black text-ink">
            <p className="text-xs uppercase tracking-normal text-slate-500">
              Streak
            </p>
            <p className="text-xl">{currentStreak}</p>
          </div>
        </div>
      </div>

      <ProgressBar current={currentIndex + 1} total={activeQuiz.questions.length} />

      <QuestionCard
        latestAnswer={answers[answers.length - 1] ?? null}
        onAnswer={handleAnswer}
        pointsPerCorrectAnswer={POINTS_PER_CORRECT_ANSWER}
        question={question}
        selectedIndex={selectedIndex}
        streakBonusStart={STREAK_BONUS_START}
        term={term}
      />

      <div className="flex justify-end">
        <button
          className="min-h-12 rounded-lg bg-ocean px-6 text-base font-black text-white transition disabled:bg-slate-300"
          disabled={selectedIndex === null}
          onClick={handleNext}
          type="button"
        >
          {currentIndex === activeQuiz.questions.length - 1
            ? "Bekijk score"
            : "Volgende vraag"}
        </button>
      </div>
    </section>
  );
}

function createAnswer({
  answerIndex,
  correctIndex,
  termId,
  previousAnswers,
}: {
  answerIndex: number;
  correctIndex: number;
  termId: string;
  previousAnswers: Answer[];
}): Answer {
  const isCorrect = answerIndex === correctIndex;
  const streakAfterAnswer = isCorrect ? getCurrentStreak(previousAnswers) + 1 : 0;
  const streakBonus =
    isCorrect && streakAfterAnswer >= STREAK_BONUS_START
      ? STREAK_BONUS_POINTS
      : 0;

  return {
    termId,
    isCorrect,
    points: isCorrect ? POINTS_PER_CORRECT_ANSWER + streakBonus : 0,
    streakAfterAnswer,
    streakBonus,
  };
}

function getCurrentStreak(answers: Answer[]) {
  let streak = 0;

  for (let index = answers.length - 1; index >= 0; index -= 1) {
    if (!answers[index].isCorrect) {
      break;
    }

    streak += 1;
  }

  return streak;
}

function getEndBadge(percentage: number, bestStreak: number) {
  if (percentage === 100) {
    return {
      title: "Begrippenkampioen",
      description: "Alles goed. Je kent deze begrippen stevig.",
    };
  }

  if (percentage >= 80 && bestStreak >= STREAK_BONUS_START) {
    return {
      title: "Streak-specialist",
      description: "Je hield een sterke reeks vast en scoorde hoog.",
    };
  }

  if (percentage >= 65) {
    return {
      title: "Sterke begrippenbouwer",
      description: "Je hebt de meeste koppelingen goed herkend.",
    };
  }

  return {
    title: "Doorzetter",
    description: "Nog even oefenen en je score groeit snel door.",
  };
}
