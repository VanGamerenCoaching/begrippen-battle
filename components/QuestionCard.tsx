import type { Question, Term } from "@/lib/types";

type QuestionCardProps = {
  question: Question;
  term: Term;
  selectedIndex: number | null;
  latestAnswer: {
    isCorrect: boolean;
    points: number;
    streakAfterAnswer: number;
    streakBonus: number;
  } | null;
  pointsPerCorrectAnswer: number;
  streakBonusStart: number;
  onAnswer: (index: number) => void;
};

export function QuestionCard({
  question,
  term,
  selectedIndex,
  latestAnswer,
  pointsPerCorrectAnswer,
  streakBonusStart,
  onAnswer,
}: QuestionCardProps) {
  const answered = selectedIndex !== null;
  const isCorrect = selectedIndex === question.correctIndex;
  const typeLabel = {
    "definition-to-term": "Definitie naar begrip",
    "term-to-definition": "Begrip naar definitie",
    "true-false": "Waar of niet waar",
  }[question.type];

  return (
    <section
      className={[
        "rounded-lg border bg-white p-5 shadow-lift transition sm:p-6",
        answered && isCorrect
          ? "border-green-300 ring-4 ring-green-100"
          : "border-slate-200",
        answered && !isCorrect ? "border-red-300 ring-4 ring-red-100" : "",
      ].join(" ")}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-black uppercase tracking-normal text-ocean">
          {typeLabel}
        </p>
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm font-black text-ink">
          +{pointsPerCorrectAnswer} bij goed
        </p>
      </div>
      <h1 className="text-2xl font-black leading-tight text-ink sm:text-3xl">
        {question.question}
      </h1>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {question.options.map((option, index) => {
          const showCorrect = answered && index === question.correctIndex;
          const showWrong = answered && index === selectedIndex && !isCorrect;

          return (
            <button
              className={[
                "min-h-16 rounded-lg border p-4 text-left text-base font-black transition",
                "disabled:cursor-not-allowed",
                showCorrect
                  ? "border-meadow bg-green-100 text-green-950 shadow-sm"
                  : "border-amber-200 bg-amber-50 text-ink hover:border-honey",
                showWrong ? "border-coral bg-red-100 text-red-950" : "",
              ].join(" ")}
              disabled={answered}
              key={`${option}-${index}`}
              onClick={() => onAnswer(index)}
              type="button"
            >
              {option}
            </button>
          );
        })}
      </div>

      {answered ? (
        <div
          className={[
            "mt-6 rounded-lg border p-4 text-base font-black",
            isCorrect
              ? "border-green-200 bg-green-50 text-green-900"
              : "border-red-200 bg-red-50 text-red-900",
          ].join(" ")}
          role="status"
        >
          <p>
            {isCorrect
              ? `Goed! ${term.term} betekent: ${term.definition}`
              : `Niet helemaal. ${term.term} betekent: ${term.definition}`}
          </p>
          {latestAnswer ? (
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              <span className="rounded-lg bg-white/70 px-3 py-2">
                Punten deze vraag: {latestAnswer.points}
              </span>
              {latestAnswer.streakBonus > 0 ? (
                <span className="rounded-lg bg-amber-100 px-3 py-2 text-amber-950">
                  Streakbonus: +{latestAnswer.streakBonus}
                </span>
              ) : null}
              {latestAnswer.isCorrect &&
              latestAnswer.streakAfterAnswer < streakBonusStart ? (
                <span className="rounded-lg bg-white/70 px-3 py-2">
                  Nog {streakBonusStart - latestAnswer.streakAfterAnswer} goed
                  voor bonus
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
