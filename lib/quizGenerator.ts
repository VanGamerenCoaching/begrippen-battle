import type { Question, Term } from "@/lib/types";

export const MISSING_DEFINITIONS_MESSAGE =
  "Voeg per begrip een definitie toe. Zonder AI kan de app geen betekenis raden.";

export type ValidationResult = {
  isValid: boolean;
  errors: string[];
};

export function parseTerms(input: string): Term[] {
  const lines = input
    .split(/\r?\n/)
    .map((line, index) => ({ line: line.trim(), lineNumber: index + 1 }))
    .filter(({ line }) => line.length > 0);

  if (lines.length > 0 && lines.every(({ line }) => !line.includes("|"))) {
    throw new Error(MISSING_DEFINITIONS_MESSAGE);
  }

  return lines.map(({ line, lineNumber }) => {
    const separatorIndex = line.indexOf("|");

    if (separatorIndex === -1) {
      throw new Error(
        `Regel ${lineNumber}: gebruik het formaat Begrip | Definitie.`,
      );
    }

    const term = line.slice(0, separatorIndex).trim();
    const definition = line.slice(separatorIndex + 1).trim();

    return {
      id: `term-${lineNumber}`,
      term,
      definition,
    };
  });
}

export function validateTerms(terms: Term[]): ValidationResult {
  const errors: string[] = [];
  const seenTerms = new Map<string, string>();
  let hasMissingDefinition = false;

  if (terms.length < 4) {
    errors.push("Voer minimaal 4 begrippen met definities in.");
  }

  terms.forEach((item, index) => {
    const lineLabel = `Begrip ${index + 1}`;
    const term = item.term.trim();
    const definition = item.definition.trim();

    if (!term) {
      errors.push(`${lineLabel}: het begrip ontbreekt.`);
    }

    if (!definition) {
      hasMissingDefinition = true;
    }

    const normalizedTerm = term.toLocaleLowerCase("nl-NL");
    if (normalizedTerm) {
      const firstOccurrence = seenTerms.get(normalizedTerm);

      if (firstOccurrence) {
        errors.push(
          `${lineLabel}: "${term}" staat dubbel in de lijst. Eerste keer: ${firstOccurrence}.`,
        );
      } else {
        seenTerms.set(normalizedTerm, lineLabel);
      }
    }
  });

  if (hasMissingDefinition) {
    errors.unshift(MISSING_DEFINITIONS_MESSAGE);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function generateQuestions(terms: Term[]): Question[] {
  const validation = validateTerms(terms);

  if (!validation.isValid) {
    throw new Error(validation.errors.join(" "));
  }

  return shuffleArray(
    terms.flatMap((term, index) => [
      createDefinitionToTermQuestion(term, terms),
      createTermToDefinitionQuestion(term, terms),
      createTrueFalseQuestion(term, terms, index),
    ]),
  );
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

function createDefinitionToTermQuestion(term: Term, terms: Term[]): Question {
  const wrongTerms = shuffleArray(
    terms
      .filter((candidate) => candidate.id !== term.id)
      .map((candidate) => candidate.term),
  ).slice(0, 3);
  const options = shuffleArray([term.term, ...wrongTerms]);
  const correctIndex = options.findIndex((option) => option === term.term);

  return {
    id: `definition-to-term-${term.id}`,
    type: "definition-to-term",
    termId: term.id,
    question: `Welk begrip hoort bij deze definitie? "${term.definition}"`,
    options,
    correctIndex,
    feedback: `${term.term} betekent: ${term.definition}`,
  };
}

function createTermToDefinitionQuestion(term: Term, terms: Term[]): Question {
  const wrongDefinitions = shuffleArray(
    terms
      .filter((candidate) => candidate.id !== term.id)
      .map((candidate) => candidate.definition),
  ).slice(0, 3);
  const options = shuffleArray([term.definition, ...wrongDefinitions]);
  const correctIndex = options.findIndex((option) => option === term.definition);

  return {
    id: `term-to-definition-${term.id}`,
    type: "term-to-definition",
    termId: term.id,
    question: `Welke definitie hoort bij dit begrip? "${term.term}"`,
    options,
    correctIndex,
    feedback: `${term.term} betekent: ${term.definition}`,
  };
}

function createTrueFalseQuestion(
  term: Term,
  terms: Term[],
  termIndex: number,
): Question {
  const shouldUseCorrectDefinition = termIndex % 2 === 0;
  const shownDefinition = shouldUseCorrectDefinition
    ? term.definition
    : terms[(termIndex + 1) % terms.length].definition;
  const correctAnswer = shouldUseCorrectDefinition ? "Waar" : "Niet waar";
  const options = shuffleArray(["Waar", "Niet waar"]);
  const correctIndex = options.findIndex((option) => option === correctAnswer);

  return {
    id: `true-false-${term.id}`,
    type: "true-false",
    termId: term.id,
    question: `Waar of niet waar: "${term.term} betekent ${shownDefinition}"`,
    options,
    correctIndex,
    feedback: `${term.term} betekent: ${term.definition}`,
  };
}
