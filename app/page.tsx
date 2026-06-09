"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { appPath } from "@/lib/paths";
import { getQuizzes } from "@/lib/storage";
import type { Quiz } from "@/lib/types";

const features = [
  "Docentinput als enige bron",
  "Automatische quizvragen",
  "Directe feedback",
  "Opslag in localStorage",
];

export default function HomePage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    setQuizzes(getQuizzes());
  }, []);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-12 pt-8 sm:px-6 lg:px-8">
      <section className="grid min-h-[360px] items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-black uppercase tracking-normal text-ocean">
            Basisversie
          </p>
          <h1 className="text-5xl font-black leading-[0.98] text-ink sm:text-6xl lg:text-7xl">
            Begrippen Battle
          </h1>
          <p className="mt-6 max-w-xl text-lg font-semibold leading-8 text-slate-700">
            Maak van begrippen en definities een speelse quiz voor leerlingen,
            zonder AI, backend, database of externe service.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-ocean px-6 text-base font-black text-white shadow-lift transition hover:bg-teal-800"
              href={appPath("/quiz-maken")}
            >
              Quiz maken
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-lift">
          <div className="grid gap-3">
            {features.map((feature, index) => (
              <div
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4"
                key={feature}
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-honey text-lg font-black text-ink">
                  {index + 1}
                </span>
                <span className="text-base font-black text-ink">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-lift">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-2 text-sm font-black uppercase tracking-normal text-ocean">
              localStorage
            </p>
            <h2 className="text-2xl font-black text-ink">
              Opgeslagen quizzen
            </h2>
          </div>
          <Link
            className="inline-flex min-h-11 items-center rounded-lg bg-ocean px-5 font-black text-white"
            href={appPath("/quiz-maken")}
          >
            Nieuwe quiz
          </Link>
        </div>

        {quizzes.length === 0 ? (
          <p className="mt-4 rounded-lg bg-slate-50 p-4 font-bold text-slate-700">
            Nog geen quiz opgeslagen. Maak eerst een quiz met minimaal vier
            begrippen en definities.
          </p>
        ) : (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {quizzes.map((quiz) => (
              <article
                className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                key={quiz.id}
              >
                <h3 className="text-xl font-black text-ink">{quiz.title}</h3>
                <p className="mt-1 font-bold text-slate-600">
                  {quiz.subject} - {quiz.level}
                </p>
                <p className="mt-2 text-sm font-black text-ocean">
                  {quiz.terms.length} begrippen - {quiz.questions.length} vragen
                </p>
                <Link
                  className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-ocean px-5 font-black text-white"
                  href={appPath(`/quiz-spelen?quizId=${encodeURIComponent(quiz.id)}`)}
                >
                  Speel quiz
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
