# studefine - backend

## Telepítés és futtatás
### 1. Előfeltételek:
   - ***Node.js*** legyen telepítve a gépen, ezt a node.js oldaláról megtehetjük: [Download Node.Js](https://nodejs.org/en/download)
   - ***NPM*** (Node Package Manager): A Node.Js telepítésével együtt, ez is telepítésre kerül.
   - ***PostgreSQL***-t is telepítenünk kell ugyan is a backend lokális psql adatbázisra csatlakozik:[PostgreSql Download](https://www.postgresql.org/download/). Az adatbázis telepítésénél minden maradjon alapértelmezett értéken, felhasználó/admin létrehozásánál csak jelszót adjunk meg neki ami `asdf`. Fontos, hogy a megadott legyen a jelszó mivel a backend ezzel a jelszóval állítja fel az adatbázis kapcsolatot (Más felhasználói adatok megadása esetén a `secret.env` fájlban meg kell változtatni az adatokat).
   - ***POSTMAN*** a könnyű és látványos tesztelés érdekében kerüljön telepítésre. [POSTMAN Download](https://www.postman.com/downloads/)
### 2. Szerver indítása
   - A projekt telepítése után bontsuk ki a tömörített fájlt (ha szükséges), majd a projekt mappában egy terminált nyitva telepítsük a projekt függőségeit `npm install` paranccsal, majd `npm start`-al elindíthatjuk a szervert ami a megadott porton fog hallgatni.
       - *__Megjegyzés__: Győződjünk meg, hogy a port ne legyen foglalt amire hallgat a szerver (`8080`), különben az alkalmazás hibát dobhat.* 
       - *__Megjegyzés__: A program a biztonság miatt a `secret.env` fájlból olvassa ki az adatokat az adatbázishoz való csatlakozáshoz (username,port,database,ip,TOKEN). A jelenlegi Git mappába ez a fájl csak azért van jelen, hogy a tesztelés egyészerűbb legyen - publikus projekteknél ilyet __nem__ teszünk mivel egyszerűen hozzáférhetnek ezáltal az adatainkhoz*
   - Ha a szerver sikeresen elindult akkor a konzolban értesítést kapunk erről.
### 3. Tesztelés  Postman-el és Pgadmin4-el
   - A tesztelés látványossága érdekében **Postman**-t és **Pgadmin4**-et fogunk használni
   - A Postman lehetővé teszi az API végpontok tesztelését és dokumentálását. Segítségével könnyedén tudunk HTTP kéréseket küldeni amire vizuálisan válaszokat is fogunk kapni.
   - A Pgadmin4 a postgreSql letöltésével együtt szintén telepítésre kerül. Ez az adatbázis vizuális elleőrzésére fog szolgálni, hogy lássuk ha elmentünk egy adatot akkor az adatbázisba ez, hogy jelenik meg.
     1. Első lépésként amint lefutott a program és megkaptuk a visszajelző üzeneteket a táblák létrehozásáról, indítsuk el a Pgadmin4-et ami kérni fogja az adatbázishoz tartozó felhasználói adatokat (`asdf` jelszó a többi az alapértelmezett adatok szerint ha kéri a program)
     2. A Pgadmin kezelőfelületén kattintsunk a `Servers` ikonra(ha kéri a jelszót akkor adjuk meg), majd `> Databases > postgres > Schemas > Tables` fülre rákattintva az összes táblát megtalálhatjuk amit létrehozott a program. Ezek megekintését a kiválasztott táblára jobb klikkel rányomva a `View/Edit Data > All Rows` fülnél a táblában lévő összes adatot megtekinthetjük.
   - Amint látjuk az adatbázisunkat, utána már küldhetjük az adatokat Postman-el a backend-nek
     1. Fontos, hogy a felhasználó be legyen jelentkezve POSTMAN-be és ezáltal az összes funkcióját tudja hassználni.
     2. A Git mappában található egy `studefinde.postman_collection.json` fájl ami teszt adatokat tartalmaz a programhoz (ez egy postman collection).
     3. A Postman-be belépve importáljuk ezt a fájlt, ezután meg fog jelenni a collection-ben található összes HTTP kérés amivel már tudunk tesztelni.