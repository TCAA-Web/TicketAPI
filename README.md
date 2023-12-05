# TicketAPI

Ticket API er et api med brugerstyring og mulighed for at oprette, slette og ændre billetter som er bundet op til en bestemt bruger.
Dette API er lavet så du blot skal downloade det og sætte det op.

## Guide til installation

1. Start med at hente projektet ned. Herefter skal du navigere til roden og køre
   `npm install`

2. Opret en ny fil _.env_ i roden og indsæt følgende:
   Bemærk at _JWT_SECRET_ er en unik kode du selv skal lave - indtast blot 64 tal og bogstaver eller brug en online JWT Secret generator.
   _Husk at indsætte USER, PASSWORD og DB, som kommer fra din database_
   _Bruger du en anden DB end MySQL skal DIALECT også tilrettes_

```
PORT=8081
JWT_REFRESH_EXPIRATION=30000000
JWT_EXPIRATION=1400000
JWT_SECRET=4f1feeca525de4cdb064656007da3edac7895a87ff0ea865693300fb8b6e8f9c
HOST=localhost
USER=root
PASSWORD=DIT_ROOT_PASSWORD
DIALECT=mysql
DB=tickets
```

3. Åben dit foretrukne program til at styre din database og opret en ny database ved navn _tickets_

4. Nu skulle du kunne starte serveren ved at skrive i terminalen:
   `node server.js`

## Guide til API

Api´et har følgende _routes_

#### _USER MANAGEMENT_

```
    - /sign-up (params: _name_, _email_ _password_ )
    - /sign-in (params: _email_, _password_ )
    - /profile (params: "Authorization": "Bearer DIN TOKEN")
```

#### _TICKET MANAGEMENT - Er alle protected routes. Dvs. du skal være logget ind_

```
    - /create (params: _name_, _date_, _description_, _published_)
    - /update/:id (params: _name_, _date_, _description_, _published_)
    - /getAll (params: none)
    - /getOne/:id (params: none)
    - /deleteAll (params: none)
    - /delete/:id (params: none)
```
