# Sagantaa Barsiisota Baaroo Tumsaa — Qajeelfama

## 1. Firebase (kuusaa daataa) ijaaruu
1. https://console.firebase.google.com deemi, project haaraa uumi (bilisa).
2. Project keessatti **Build > Firestore Database > Create database** filadhu, "Start in test mode" filadhu.
3. **Project settings (gear icon) > Your apps > </> (Web)** filadhu, app maqaa kamiyyuu moggaasi.
4. `firebaseConfig` siif kennamu (apiKey, authDomain, projectId, fi kkf) gara `src/firebase.js` keessatti guuti (iddoo "YOUR_API_KEY" fi kkf jiru bakka buusi).

## 2. Maqaa fayyadamaa fi iyyuu (login) ijaaruu
`.env.example` jedhu gara `.env` jedhuutti maxxansi (rename godhi), ergasii iyyuu haaraa keessatti barreessi:

```
VITE_ADMIN_USERNAME=admin
VITE_ADMIN_PASSWORD=iyyuu_bulchaa_haaraa
VITE_TEACHER_USERNAME=teacher
VITE_TEACHER_PASSWORD=iyyuu_barsiisaa_haaraa
```

`.env` GitHub irratti hin banamu (`.gitignore` keessa jira) — kanaafuu nageenyaan jira. Yoo Vercel/Netlify irratti deploy gootan, iyyuu kana **Environment Variables** jalatti maxxansuu qabdu (gadi kaayi).

## 3. Lokaalitti yaaluu (test)
```
npm install
npm run dev
```
Ergasii link isa terminal irratti mul'atu (fkn. http://localhost:5173) browser keessatti bani.

## 4. Deploy gochuu (interneetii irratti kaayuu)
### Filannoo 1: Vercel (salphaa)
1. https://vercel.com irratti account uumi (GitHub kee waliin gali).
2. Project kana (foolder `site`) GitHub repository haaraatti upload godhi.
3. Vercel irratti "New Project" jedhu filadhu, repository kee filadhu.
4. **Environment Variables** jalatti `VITE_ADMIN_USERNAME`, `VITE_ADMIN_PASSWORD`, `VITE_TEACHER_USERNAME`, `VITE_TEACHER_PASSWORD` galchi.
5. "Deploy" tuqi — link haaraa siif kennama.

### Filannoo 2: Netlify
Waan Vercel wajjin walfakkaatu — https://netlify.com irratti "Add new site" > "Import from Git".

## 5. Erga deploy gochuu booda jijjiiruu
- Koodii kee gara GitHub repository keetti erguu (`git push`) qofa gaha — Vercel/Netlify ofumaan haaromsa (auto-deploy).
- Foolder `src` keessatti `App.jsx` (design, barruu, gahee) fi `firebase.js` (kuusaa daataa) jijjiiruu dandeessa.
- Jijjiirraa erga goone booda lokaalitti `npm run dev` tiin ilaali, ergasii `git push` godhi.

## 6. Nageenya daataa (offline)
App kun kuusaa lokaalii (offline cache) qaba — yoo intarneetiin adda cite, jijjiiramni hin badu; lokaalitti qabama, yeroo intarneetiin deebi'u ofumaan gara serverii erga. Mallattoon gubbaa "offline / syncing" kan mul'atu kanaaf ragaa dha.

## 7. Gahee lamaan (Admin fi Barsiisaa)
- **Admin**: sagantaa uumuu, barsiisota/kutaalee/barnoota gulaaluu ni danda'a.
- **Barsiisaa**: sagantaa ilaaluu qofa (gulaaluu hin danda'u).
Tokkoon tokkoon isaanii maqaa fayyadamaa fi iyyuu addaa qabu (gubbaa keessatti ibsame).
