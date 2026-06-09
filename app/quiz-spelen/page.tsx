import { Suspense } from "react";
import { QuizPlayer } from "@/components/QuizPlayer";

export default function QuizSpelenPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="font-bold">Quiz laden...</div>}>
        <QuizPlayer />
      </Suspense>
    </main>
  );
}
