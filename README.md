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
### 4. Tesztesetek
   - A miután importáltuk a `.json` fájlt a postman-be, a megjelenő HTTP kérések rendezve lesznek (GET,POST, PUT, DELETE) , a már előre megírt tesztadatokkal mind normál és hibás bemenetre. Abban az esetben, ha egyedi adatot akarnánk megadni akkor a "body" fülnél a ``.json`` paramétereinek átírásával ezt megtehetjük (kivétel ahol `id`-t vár a program, ott a `params` fülnél változtathatjuk meg azt).
     - A **GET** adatokat tud kiolvasni
     - A **POST** adatokat tud írni
     - A **PUT** adatokat tud felülírni/frissíteni
     - A **DELETE** adott adatokat tud törölni.
   - A felhasználónak vannak alapműveletei mint például **Login**,**Signup**, de ami érdekesebb az a **TOPICS**, **PHRASE**, **plainDefinition** műveletek.
     - **TOPICS**: A program lehetővé teszi a felhasználók számára, hogy létrehozzanak témákat („**_topic_**”), amelyekhez opcionálisan hozzárendelhetnek definíciókat vagy leírást. A témákon belül újabb témákat és kifejezéseket („**_phrase_**”) lehet létrehozni.
     - **PHRASE**: A kifejezések létrehozásakor két részre bomlik a „phrase”. Az egységeket a backend fogja kezeli. Ezek az egységek a „definition” és „**_plainDefinition_**”, ahol a „definition” tárolja a fogalom konkrét definícióját, amíg a „**_plainDefinition_**” a konyhanyelvi megfogalmazást. A kifejezéseket szerkesztésére is van lehetőség. Mivel két részből adódik össze és az egyik a már pontos tankönyvi definíció, ezért csak a „**_plainDefinition_**” -t lehet szerkeszteni. Erre két opció áll van: a meglévő felülírása, vagy új létrehozása. Új létrehozása esetén a rendszer hozzáfűzi az új változatot az aktuális listához, és az új változat lesz az aktív.
   - Javasolt elsőnek egy-két új felhasználót létrehozni, hogy tudjuk a felhasználói műveleteket tesztelni. A Postman collection-ben egyes kéréseknek van lenyitható példatára, itt találhatóak például a hibás adatokkal való kérések és különböző tesztek.
     - felhasználó létrehozása - név: `POST Signup` url: http://localhost:8080/auth/signup
     - felhasználó bejelentkeztetése - név: `POST Login` url: http://localhost:8080/auth/login
     - felhasználó token érvényessége - név: `GET Veryfy token` url: http://localhost:8080/user/veryfyToken
     - Topic létrehozása (parent) - név: `POST create Topic by user` url: http://localhost:8080/topic
     - Topic létrehozása (child) - név: `POST create Topic to Topic` url: http://localhost:8080/topic/:id
     - Update Topic - név: `PUT update Topic` url: http://localhost:8080/topic/:id
     - Topic kiolvasása - név: `GET topic by ID` url: http://localhost:8080/topic/:id
     - Phrase létrehozása - név: `POST create Phrase` url: http://localhost:8080/phrases/:id
     - Phrase kiolvasása - név: `GET Phrase` url: http://localhost:8080/phrases/:id
     - Update Phrase - név: `PUT update Phrase` url: http://localhost:8080/phrases/:id
     - plainDefinition létrehozása - név: `POST create plainDef to Phrase` url: http://localhost:8080/plainDefinition/:id
   - A Group műveleteknél alkalmazok token validálást, így annyiban változik a helyzet, hogy az Authorization fülnél kiválasztjuk a Bearer Token lehetőséget, majd a token helyére beillesztjük a bejelentkezett felhasználó valid tokenjét. Abban az esetben ha nem találjuk ezt a tokent, akkor jelentkezzünk be a kívánt adatokkal egy login kéréssel - ez vissza fogja adni a teljes bejelentkezett felhasználót, és az aktív tokenjét is. Ezt a tokent másoljuk ki és illesszük be a Bearer Token-hez. Ezután már tudunk kéréseket végrehajtani, mert bevittük az aktív token értékét.
     - create Group - név: `Csoport létrehozása` url: http://localhost:8080/groups/create - aktív token és body: name paramétereket vár
     - delete Group - név: `Csoport törlése` url: http://localhost:8080/groups/:id - aktív token és params: id paramétereket vár
     - Join Group - név: `Csoporthoz csatlakozás` url: http://localhost:8080/groups/join - aktív token és body: id paramétereket vár
     - Get Group - név: `Összes csoport` url: http://localhost:8080/groups/ 
     - Get Group by ID - név: `csoport by Id` url: http://localhost:8080/groups/:id - params: id vár paraméternek