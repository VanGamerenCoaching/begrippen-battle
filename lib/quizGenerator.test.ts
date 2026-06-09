import { describe, expect, it } from "vitest";
import {
  generateQuestions,
  MISSING_DEFINITIONS_MESSAGE,
  parseTerms,
  validateTerms,
} from "./quizGenerator";
import type { Question, Term } from "./types";

const validInput = [
  "Fotosynthese | Proces waarbij een plant licht gebruikt om glucose te maken",
  "Celwand | Stevige laag rond een plantencel",
  "Glucose | Suiker die planten als energiebron maken",
  "Bladgroenkorrel | Onderdeel van een plantencel waar fotosynthese plaatsvindt",
].join("\n");

describe("parseTerms", () => {
  it("parset geldige input naar begrippen met definities", () => {
    const terms = parseTerms(validInput);

    expect(terms).toHaveLength(4);
    expect(terms[0]).toEqual({
      id: "term-1",
      term: "Fotosynthese",
      definition: "Proces waarbij een plant licht gebruikt om glucose te maken",
    });
  });

  it("negeert lege regels", () => {
    const terms = parseTerms(`\n${validInput}\n\n`);

    expect(terms).toHaveLength(4);
  });

  it("geeft een foutmelding als een niet-lege regel geen | bevat", () => {
    expect(() =>
      parseTerms(
        [
          "Fotosynthese | Proces waarbij een plant licht gebruikt om glucose te maken",
          "Celwand",
          "Glucose | Suiker die planten als energiebron maken",
          "Bladgroenkorrel | Onderdeel van een plantencel waar fotosynthese plaatsvindt",
        ].join("\n"),
      ),
    ).toThrow("Regel 2: gebruik het formaat Begrip | Definitie.");
  });

  it("weigert losse begrippen zonder definities", () => {
    expect(() =>
      parseTerms(["Fotosynthese", "Celwand", "Glucose", "Bladgroenkorrel"].join("\n")),
    ).toThrow(MISSING_DEFINITIONS_MESSAGE);
  });
});

describe("validateTerms", () => {
  it("geeft een foutmelding bij minder dan 4 begrippen", () => {
    const terms = parseTerms(
      [
        "Fotosynthese | Proces waarbij een plant licht gebruikt om glucose te maken",
        "Celwand | Stevige laag rond een plantencel",
        "Glucose | Suiker die planten als energiebron maken",
      ].join("\n"),
    );

    const result = validateTerms(terms);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Voer minimaal 4 begrippen met definities in.");
  });

  it("herkent dubbele begrippen hoofdletterongevoelig", () => {
    const terms = parseTerms(
      [
        "Fotosynthese | Proces waarbij een plant licht gebruikt om glucose te maken",
        "Celwand | Stevige laag rond een plantencel",
        "fotosynthese | Dubbele term met andere definitie",
        "Bladgroenkorrel | Onderdeel van een plantencel waar fotosynthese plaatsvindt",
      ].join("\n"),
    );

    const result = validateTerms(terms);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      'Begrip 3: "fotosynthese" staat dubbel in de lijst. Eerste keer: Begrip 1.',
    );
  });
});

describe("generateQuestions", () => {
  it("maakt vier opties voor meerkeuzevragen", () => {
    const questions = generateQuestions(parseTerms(validInput));
    const multipleChoiceQuestions = questions.filter(
      (question) => question.type !== "true-false",
    );

    expect(multipleChoiceQuestions.length).toBeGreaterThan(0);
    multipleChoiceQuestions.forEach((question) => {
      expect(question.options).toHaveLength(4);
    });
  });

  it("maakt true-false vragen met waar/niet waar opties", () => {
    const questions = generateQuestions(parseTerms(validInput));
    const trueFalseQuestions = questions.filter(
      (question) => question.type === "true-false",
    );

    expect(trueFalseQuestions.length).toBeGreaterThan(0);
    trueFalseQuestions.forEach((question) => {
      expect(question.options).toHaveLength(2);
      expect(question.options.toSorted()).toEqual(["Niet waar", "Waar"]);
    });
  });

  it("laat correctIndex altijd naar het juiste antwoord wijzen", () => {
    const terms = parseTerms(validInput);
    const questions = generateQuestions(terms);

    questions.forEach((question) => {
      const term = findTerm(terms, question.termId);
      const selectedOption = question.options[question.correctIndex];

      expect(question.correctIndex).toBeGreaterThanOrEqual(0);
      expect(question.correctIndex).toBeLessThan(question.options.length);
      expect(selectedOption).toBe(expectedAnswer(question, term));
    });
  });
});

function findTerm(terms: Term[], termId: string) {
  const term = terms.find((item) => item.id === termId);

  if (!term) {
    throw new Error(`Testdata mist term met id ${termId}.`);
  }

  return term;
}

function expectedAnswer(question: Question, term: Term) {
  if (question.type === "definition-to-term") {
    return term.term;
  }

  if (question.type === "term-to-definition") {
    return term.definition;
  }

  return question.question.includes(term.definition) ? "Waar" : "Niet waar";
}
