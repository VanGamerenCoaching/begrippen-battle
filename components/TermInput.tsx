type TermInputProps = {
  value: string;
  onChange: (value: string) => void;
  error: string;
  onClear: () => void;
  onUseExample: () => void;
};

export function TermInput({
  value,
  onChange,
  error,
  onClear,
  onUseExample,
}: TermInputProps) {
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <label
            className="block text-sm font-black uppercase tracking-normal text-slate-600"
            htmlFor="terms"
          >
            Begrippen en definities
          </label>
          <p className="mt-2 max-w-xl text-sm font-bold leading-6 text-slate-600">
            Zet elk begrip op een nieuwe regel. Gebruik precies dit formaat:
            <span className="ml-1 rounded bg-slate-100 px-2 py-1 font-black text-ink">
              Begrip | Definitie
            </span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className="min-h-10 rounded-lg border border-slate-300 bg-white px-4 text-sm font-black text-ink hover:border-ocean"
            onClick={onUseExample}
            type="button"
          >
            Voorbeeldinput
          </button>
          <button
            className="min-h-10 rounded-lg border border-slate-300 bg-white px-4 text-sm font-black text-ink hover:border-coral"
            onClick={onClear}
            type="button"
          >
            Input wissen
          </button>
        </div>
      </div>
      <textarea
        className="min-h-72 w-full resize-y rounded-lg border border-slate-300 bg-white p-4 text-base leading-7 text-ink shadow-sm transition placeholder:text-slate-400 focus:border-ocean"
        id="terms"
        onChange={(event) => onChange(event.target.value)}
        placeholder={"Begrip | Definitie\nBegrip | Definitie\nBegrip | Definitie\nBegrip | Definitie"}
        spellCheck={false}
        value={value}
      />
      <div className="mt-3 min-h-7 text-sm font-black text-coral" role="alert">
        {error}
      </div>
    </div>
  );
}
