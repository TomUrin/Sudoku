# Sudoku MVP – GitHub paruoštas repo

Šis repo turi:
- **Web versiją** (`index.html`, `styles.css`, `app.js`) – galima paleisti per GitHub Pages.
- **Capacitor** nustatymus – kad pasidarytum Android APK lokaliai arba per CI.

## 1) Kaip įkelti į GitHub ir paleisti web
1. Susikurk naują repo GitHub, pvz. `sudoku-mvp`.
2. Nukopijuok visus šio katalogo failus ir atlik:
   ```bash
   git init
   git add .
   git commit -m "init sudoku mvp"
   git branch -M main
   git remote add origin <tavo-repo-URL>
   git push -u origin main
   ```
3. Repo nustatymuose įjunk **Pages**: Source → **Deploy from a branch**, Branch → **main** ir Folder → **/** (root).
4. Po kelių minučių turėsi gyvą nuorodą su žaidimu.

## 2) Kaip pasidaryti APK lokaliai
```bash
npm install
npm run cap:init       # vieną kartą
npm run cap:add:android
npm run cap:sync
npm run cap:open:android
```
Android Studio → Build → Build APK(s). APK rasite `android/app/build/outputs/apk/debug/`.

## 3) Kaip gauti APK per GitHub Actions (nebūtina)
Šiame repo yra workflow, kuris **pabandys** sugeneruoti `assembleDebug` APK kiekvienam commit į `main`.
- Rezultatas atsiras kaip **Actions** artefaktas.

> Pastaba: Android build CI'e naudoja atviro kodo Android SDK nustatymus. Jei kažkurią dieną Google ar Gradle pakeis reikalavimus, gali reikėti atnaujinti `actions` versijas ar `build-tools` numerius.

## 4) Naudojimas
- Pieštukas, Markeris, Trintukas, smart pastabos, daily challenge su atgaliniu laikmačiu, vibracija, rezultatų suvestinė, dalinimosi kortelė.
- Veikia tiek telefone, tiek kompiuteryje.

Sėkmės! Jei reikės, padėsiu su CI ar ikonų generavimu.
