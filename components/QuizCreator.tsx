"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { TermInput } from "@/components/TermInput";
import { appPath } from "@/lib/paths";
import {
  generateQuestions,
  parseTerms,
  validateTerms,
} from "@/lib/quizGenerator";
import { saveQuiz } from "@/lib/storage";
import type { Quiz, Term } from "@/lib/types";

const emptyMeta = {
  title: "",
  subject: "",
  level: "",
};

const exampleInput = [
  "Fotosynthese | Proces waarbij een plant licht gebruikt om glucose te maken",
  "Celwand | Stevige laag rond een plantencel die bescherming geeft",
  "Glucose | Suiker die door planten wordt gemaakt als energiebron",
  "Bladgroenkorrel | Onderdeel van een plantencel waar fotosynthese plaatsvindt",
].join("\n");

export function QuizCreator() {
  const router = useRouter();
  const [meta, setMeta] = useState(emptyMeta);
  const [rawTerms, setRawTerms] = useState("");
  const [saveError, setSaveError] = useState("");
  const [savedQuiz, setSavedQuiz] = useState<Quiz | null>(null);

  const preview = useMemo((): { terms: Term[]; error: string } => {
    if (!rawTerms.trim()) {
      return { terms: [], error: "" };
    }

    try {
      const terms = parseTerms(rawTerms);
      const validation = validateTerms(terms);

      return {
        terms,
        error: validation.isValid ? "" : validation.errors[0],
      };
    } catch (parseError) {
      return {
        terms: [],
        error:
          parseError instanceof Error
            ? parseError.message
            : "De begrippenlijst kan niet worden gelezen.",
      };
    }
  }, [rawTerms]);
  const displayError = preview.error || saveError;

  function updateMeta(field: keyof typeof emptyMeta, value: string) {
    setMeta((current) => ({ ...current, [field]: value }));
  }

  function handleTermsChange(value: string) {
    setRawTerms(value);
    setSaveError("");
    setSavedQuiz(null);
  }

  function handleSave() {
    let terms;

    try {
      terms = parseTerms(rawTerms);
    } catch (parseError) {
      setSaveError(
        parseError instanceof Error
          ? parseError.message
          : "De begrippenlijst kan niet worden gelezen.",
      );
      setSavedQuiz(null);
      return;
    }

    const validation = validateTerms(terms);
    if (!validation.isValid) {
      setSaveError(validation.errors[0]);
      setSavedQuiz(null);
      return;
    }

    const quiz: Quiz = {
      id: createId("quiz"),
      title: meta.title.trim() || "Naamloze quiz",
      subject: meta.subject.trim() || "Algemeen",
      level: meta.level.trim() || "Niet ingesteld",
      terms,
      questions: generateQuestions(terms),
      createdAt: new Date().toISOString(),
    };

    saveQuiz(quiz);
    setSaveError("");
    setSavedQuiz(quiz);
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <p className="mb-3 text-sm font-black uppercase tracking-normal text-ocean">
          Quiz maken
        </p>
        <h1 className="text-4xl font-black leading-tight text-ink sm:text-5xl">
          Bouw een battle uit je eigen begrippenlijst.
        </h1>
        <p className="mt-4 text-lg font-semibold leading-8 text-slate-700">
          De app gebruikt alleen wat jij invult. Bij ontbrekende definities,
          dubbele begrippen of formatfouten stopt de validatie meteen.
        </p>

        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-lift">
          <h2 className="text-xl font-black text-ink">Inputformaat</h2>
          <ul className="mt-4 grid gap-3 text-sm font-bold leading-6 text-slate-700">
            <li>Een regel is altijd: Begrip | Definitie.</li>
            <li>Voor de streep staat het begrip.</li>
            <li>Na de streep staat de definitie van de docent.</li>
            <li>Minimaal vier begrippen met definities.</li>
          </ul>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-lift sm:p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="mb-2 block text-sm font-black text-slate-600">
              Titel
            </span>
            <input
              className="h-12 w-full rounded-lg border border-slate-300 px-3 font-bold text-ink focus:border-ocean"
              onChange={(event) => updateMeta("title", event.target.value)}
              placeholder="Bijv. Plantencellen"
              value={meta.title}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-black text-slate-600">
              Vak
            </span>
            <input
              className="h-12 w-full rounded-lg border border-slate-300 px-3 font-bold text-ink focus:border-ocean"
              onChange={(event) => updateMeta("subject", event.target.value)}
              placeholder="Biologie"
              value={meta.subject}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-black text-slate-600">
              Niveau
            </span>
            <input
              className="h-12 w-full rounded-lg border border-slate-300 px-3 font-bold text-ink focus:border-ocean"
              onChange={(event) => updateMeta("level", event.target.value)}
              placeholder="Klas 1"
              value={meta.level}
            />
          </label>
        </div>

        <div className="mt-5">
          <TermInput
            error={displayError}
            onChange={handleTermsChange}
            onClear={() => handleTermsChange("")}
            onUseExample={() => handleTermsChange(exampleInput)}
            value={rawTerms}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-black text-slate-600">
            Geparste begrippen: {preview.terms.length}
          </p>
          <button
            className="min-h-12 rounded-lg bg-ocean px-6 text-base font-black text-white transition hover:bg-teal-800"
            onClick={handleSave}
            type="button"
          >
            Quiz opslaan
          </button>
        </div>

        <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-black text-ink">Live preview</h2>
            <span className="rounded-lg bg-white px-3 py-2 text-sm font-black text-slate-600">
              {preview.terms.length} begrip(pen)
            </span>
          </div>
          {preview.terms.length === 0 ? (
            <p className="mt-3 font-bold text-slate-600">
              Vul begrippen in om de preview te zien.
            </p>
          ) : (
            <div className="mt-4 grid gap-3">
              {preview.terms.map((item) => (
                <div
                  className="grid gap-2 rounded-lg border border-slate-200 bg-white p-3 sm:grid-cols-[0.35fr_0.65fr]"
                  key={item.id}
                >
                  <p className="font-black text-ink">{item.term || "-"}</p>
                  <p className="font-semibold leading-6 text-slate-700">
                    {item.definition || "Geen definitie ingevuld"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {savedQuiz ? (
          <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4">
            <p className="font-black text-green-900">
              Quiz opgeslagen in localStorage.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <button
                className="min-h-11 rounded-lg bg-ocean px-5 font-black text-white"
                onClick={() =>
                  router.push(appPath(`/quiz-spelen?quizId=${encodeURIComponent(savedQuiz.id)}`))
                }
                type="button"
              >
                Speel deze quiz
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
