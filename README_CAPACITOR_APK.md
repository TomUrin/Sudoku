# Sudoku MVP – Web versija + APK instrukcijos

Tai paprastas, bet pilnai žaidžiamas Sudoku MVP. Veikia naršyklėje, gali būti įkeltas į GitHub Pages.
Žemiau rasi instrukcijas, kaip iš šios web versijos pasidaryti **Android APK** su Capacitor.

## Greitas startas
1. Išarchyvuok zip.
2. Atidaryk `index.html` bet kurioje naršyklėje.
3. Žaisk. Klaviatūra 1–9, Alt+skaičius įrašo pastabą.

## Įkėlimas į GitHub Pages
1. Sukurk naują repo, pvz., `sudoku-mvp`.
2. Įkelk viską iš šio katalogo.
3. GitHub repo nustatymuose įjunk Pages ir parink `branch: main`, `folder: root`.
4. Po poros minučių turėsi gyvą nuorodą.

## Kaip pasidaryti APK su Capacitor
Reikia Node.js ir Android Studio.

```bash
# 1) Inicializuojam mažą web projektą
npm init -y
npm install @capacitor/core @capacitor/cli @capacitor/android serve

# 2) Inicializuojam Capacitor ir nurodom webDir
npx cap init sudoku-mvp lt.pspasaulis.sudoku --web-dir=.

# 3) Pridedam Android platformą
npx cap add android

# 4) Nukopijuok šiuos failus (index.html, styles.css, app.js) į projekto root, kaip dabar
# 5) Sinchronizuojam
npx cap sync

# 6) Atidarom Android Studio
npx cap open android
```

Android Studio viduje:
- Pasirink „Build APK“ arba „Run“ ant prijungto telefono.
- Sugeneruotą APK rasi `app/build/outputs/apk/` kataloge.

## Kurti Release APK
Android Studio: Build meniu, pasirink „Generate Signed Bundle / APK“, susikurk keystore, sukurk release APK.

## Failai
- `index.html` – UI karkasas
- `styles.css` – stilius
- `app.js` – sudoku logika, generavimas, užuominos, tikrinimas

Sėkmės testuojant. Jei norėsi „Euro Quest“ kelionės režimo, galima pridėti papildomą meta sluoksnį.
