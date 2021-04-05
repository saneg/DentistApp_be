# DentistApp_be

**DentistApp_be** rappresenta la parte backend dell'applicazione web **DentistApp**, la quale è in grado di poter gestire gli appuntamenti giornalieri e l'anagrafica dei pazienti, da parte del personale medico di uno studio dentistico, ma anche, da parte del privato cittadino, di avere un riepilogo dei propri appuntamenti presso la struttura sanitaria.

L'applicazione backend è realizzata tramite il framework **Express**, utilizzando **Typescript** come linguaggio di programmazione, e **DynamoDB** come database NoSQL per la persistenza dei dati. Per lo sviluppo dei test è stata utilizzata la libreria **Jest**.


## Classi


*DentistApp_be* si compone di tre classi principali: 

- **Paziente**: rappresenta un paziente dello studio dentistico;

- **Sanitario**: rappresenta un lavoratore dello studio dentistico. Per esso sarà possibile specificare il ruolo ricoperto all'interno della struttura (*Dentista*, *Igienista*, *Assistente*);

- **Appuntamento**: rappresenta un appuntamento tra paziente e sanitario che si svolgerà all'interno dello studio. Il paziente potrà prenotare gli appuntamenti solo con i medici della struttura (ovvero coloro con ruolo *Dentista* o *Igienista*). L'appuntamento potrà essere per una visita specialistica, una pulizia dentale oppure per una otturazione (espressi tramite la classe enum *TipologiaPrestazione*). L'appuntamento, infine, avrà anche uno stato che potrà essere *Attivo* oppure *Eseguito*.


## Endpoint


L'applicazione *DentistApp_be* espone vari endpoint che potranno essere usati dal frontend di *DentistApp* per mostrare le varie informazioni agli utenti finali. Questi, divisi in quattro classi *Controller*, sono:


### pazienteController


- **/new/paziente** (POST): permette la creazione di un nuovo paziente a partire dalle informazioni passate dal frontend;

- **/get/paziente/:id** (GET): permette il recupero dal database delle informazioni del paziente avente come id quello passato come parametro nella URL;

- **/get/all/pazienti** (GET): permette il recupero dal database delle informazioni di tutti i pazienti salvati;

- **/update/paziente/:id** (POST): permette di aggiornare le informazioni del paziente con id pari al parametro *:id* nella URL con i dati provenienti dal frontend;

- **/delete/paziente/:id** (POST): permette di cancellare dal database le informazioni del paziente avente id pari al parametro *:id*.


### sanitarioController


- **/new/sanitario** (POST): permette la creazione di un nuovo sanitario a partire dalle informazioni passate dal frontend (le informazioni sul ruolo del sanitario saranno specificate attraverso la GUI di *DentistApp*);

- **/get/sanitario/:id** (GET): permette il recupero dal database delle informazioni del sanitario avente come id quello passato come parametro nella URL;

- **/get/all/medici** (GET): permette il recupero dal database delle informazioni di tutti quei sanitari aventi come ruolo *Dentista* oppure *Igienista*;

- **/update/sanitario/:id** (POST): permette di aggiornare le informazioni del sanitario con id pari ad *:id* nella URL con i dati provenienti dal frontend;

- **/delete/sanitario:id** (POST): permette di cancellare dal database le informazioni del sanitario avente id pari al parametro *:id*.


### appuntamentoController


- **/new/appuntamento** (POST): permette la creazione di un nuovo appuntamento a partire dalle informazioni passate dal frontend. L'ora di fine dell'appuntamento è stabilita in base alle informazioni sull'ora di inizio dell'appuntamento e la tipologia della prenotazione (*Vista*, *Pulizia* oppure *Otturazione*). Inoltre, per la creazione dell'appuntamento, viene verificato che non ci siano altri appuntamenti prenotati incidenti nello stesso range di ore di quest'ultimo. Se viene creato un nuovo appuntamento, l'oggetto creato viene ritornato al frontend, altrimenti viene generato un errore;

- **/get/appuntamenti/:idPaziente** (GET): permette il recupero dal database di tutti gli appuntamenti attivi fissati per il paziente aventi id pari al parametro *:idPaziente*;

- **/get/all/appuntamenti/:timestamp** (GET): permette il recupero dal database di tutti quelli eventi che si verificheranno nel giorno la cui mezzanotte ha come timestamp quello indicato come parametro *:timestamp* nella URL;

- **/update/appuntamento/:id** (POST): permette di aggiornare l'appuntamento avente come id quello pari al parametro *:id* nella URL;

- **/delete/appuntamenti/:id** (POST): permette di cancellare dal database l'appuntamento avente id pari al parametro *:id* nella URL;

- **/close/appuntamento/:id** (POST): permette di aggiornare lo stato da *Attivo* a *Eseguito* dell'appuntamento avente come id quello pari al parametro *:id* nella URL.


### logInController


- **/login/paziente** (GET): permette la verifica dello *username* (la email di registrazione) e della *password* di un utente per poter accedere alla parte riservata ai pazienti dell'applicazione *DentistApp*;

- **/login/sanitario** (GET): permette la verifica dello *username* e della *password* di un utente per poter accedere alla parte riservata ai sanitari dell'applicazione *DentistApp*.


## Mockup descrittivo frontend DentistApp


Per quanto riguarda un primo mockup per la parte frontend di *DentistApp*, possiamo pensare una applicazione web essenzialmente costituita in questo modo:


### Login Page


La pagina di login sarà la prima pagina che sarà visualizzata dall'utente quando vorrà accedere a *DentistApp*. Essa presenterà il logo dell'applicazione e due pulsanti per il login: uno dedicato ai pazienti dello studio dentistico, l'altro invece per i sanitari. Una volta che l'utente avrà cliccato su uno dei due ed inserito le credenziali corrette (la propria email di registrazione e la password), egli accederà alla parte dell'applicazione indicata dal pulsante di login selezionato.


### Parte riservata ai sanitari


#### Pagina degli appuntamenti


Una volta avuto accesso come sanitario a *DentistApp*, all'utente apparirà la pagina degli appuntamenti del giorno. Questi saranno disposti in una lista tabellare dove ad ogni riga corrisponde un appuntamento. All'interno della riga saranno visualizzate le informazioni dell'ora di inizio dell'appuntamento e quella di fine, la tipologia della prenotazione e il paziente coinvolto nell'appuntamento. Ci saranno dei pulsanti che consentiranno l'apertura di alcune modali per il riepilogo o la modifica dell'appuntamento. Sopra la lista troverà spazio un selettore della data attraverso il quale il sanitario potrà cambiare la data di visualizzazione degli appuntamenti. All'interno di tale pagina sarà presente anche un bottone per la creazione di un nuovo appuntamento. L'utente non potrà scegliere l'orario di fine appuntamento che sarà determinato in base alla tipologia di prenotazione scelta dall'applicazione.


#### Anagrafica pazienti


Alla pagina dell'anagrafica dei pazienti si potrà accedere attraverso un apposito pulsante posto in una navbar laterale presente in ciascuna delle pagine componenti la parte riservata ai sanitari di *DentistApp*. Questa pagina presenterà, pertanto, tutti i pazienti della struttura sanitaria in una lista tabellare. Ciascuna riga corrisponderà ad un paziente ed in essa saranno visualizzare le informazioni standard del paziente (nome, cognome, email) insieme ad alcuni pulsanti per la visualizzazione di un riepilogo del paziente. Nella stessa pagina sarà presente un pulsante per la creazione di un nuovo paziente della struttura sanitaria.


#### Pagina profilo sanitario


Pagina a cui si accede dalla navbar laterale. Presenta le informazioni di registrazione del sanitario loggato a *DentistApp*. Sarà presente anche un pulsante che consentirà di accedere alla modifica di tali informazioni del sanitario.


#### Pagina per la creazione di un nuovo sanitario


Cliccando sull'apposito pulsante nella navbar laterale, si potrà accedere a questa pagina. Permetterà la creazione di un nuovo sanitario che avrà come informazioni quelle inserite nei vari campi presenti in questa pagina.


### Parte riservata ai pazienti


#### Pagina degli appuntamenti


Loggandosi, invece, come paziente a *DentistApp*, la prima pagina che apparirà all'utente è sempre quella degli appuntamenti. Di questi saranno visualizzati solo quelli riguardanti il paziente loggato all'applicazione. Gli appuntamenti saranno visualizzati in una lista tabellare dove ad ogni riga corrisponde un appuntamento. Anche in questo caso, in ogni riga, ci saranno dei pulsanti che consentiranno di accedere ad un riepilogo dell'appuntamento o ad una modale di modifica delle informazioni dello stesso. Nella pagina, ci sarà anche un pulsante che consentirà all'utente di prenotare un appuntamento con un medico della struttura sanitaria. Anche in questo caso l'utente non potrà scegliere l'orario di fine appuntamento che sarà determinato dall'applicazione in base alla tipologia di prenotazione scelta. 


#### Pagina profilo paziente


Attraverso la navbar laterale, si potrà accedere alla pagina personale del paziente. In essa troveranno spazio tutte le principali informazioni del paziente. Nella pagina sarà presente un pulsante che consentirà all'utente la modifica di tali informazioni.

