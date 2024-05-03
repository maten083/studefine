# studefine - backend

### Telepítés és futtatás
1. Előfeltételek:
   - ***Node.js*** legyen telepítve a gépen, ezt a node.js oldaláról megtehetjük: [Download Node.Js](https://nodejs.org/en/download)
   - ***NPM*** (Node Package Manager): A Node.Js telepítésével együtt, ez is telepítésre kerül.
   - ***PostgreSQL***-t is telepítenünk kell ugyan is a backend lokális psql adatbázisra csatlakozik:[PostgreSql Download](https://www.postgresql.org/download/). Az adatbázis telepítésénél minden maradjon alapértelmezett értéken, felhasználó létrehozásánál csak jelszót adjunk meg neki ami `asdf`. A backend ezzel a jelszóval állítja fel az adatbázis kapcsolatot.
   - ***POSTMAN*** a könnyű és látványos tesztelés érdekében kerüljön telepítésre. [POSTMAN Download](https://www.postman.com/downloads/)
2. Szerver indítása
   - A projekt telepítése után bontsuk ki a tömörített fájlt (ha szükséges), majd a projekt mappában egy terminált nyitva telepítsük a projekt függőségeit `npm install` paranccsal, majd `npm start`-al elindíthatjuk a szervert ami a megadott porton fog hallgatni.
     - *__Megjegyzés__: A program a biztonság miatt a `secret.env` fájlból olvassa ki az adatokat az adatbázishoz való csatlakozáshoz (username,port,database,ip,TOKEN). A jelenlegi Git mappába ez a fájl csak azért van jelen, hogy a tesztelés egyészerűbb legyen - publikus projekteknél ilyet __nem__ teszünk mivel egyszerűen hozzáférhetnek ezáltal az adatainkhoz*
   - Ha a szerver sikeresen elindult akkor a konzolban értesítést kapunk erről.