# Begrippen Battle

Offline onderwijsquiz voor begrippen en definities.

## Projectregels

- Geen AI-integratie.
- Geen OpenAI API.
- Geen externe backend.
- Geen database.
- Opslag gebeurt met `localStorage`.
- Quizvragen worden alleen gemaakt uit docentinput.

## Lokaal starten

```powershell
npm install
npm run dev
```

Open daarna `http://127.0.0.1:3000`.

## Controleren

```powershell
npm run test
npm run typecheck
npm run build
```

## Publiceren via GitHub Pages

Deze repo bevat `.github/workflows/pages.yml`. Zet GitHub Pages in de repo op
`GitHub Actions` en push naar de `main` branch. De workflow bouwt de statische
Next-export en publiceert de map `out`.
