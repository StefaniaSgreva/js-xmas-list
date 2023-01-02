"use strict";

/*------------------------------------
    OPERAZIONI PRELIMINARI
------------------------------------*/

//prepariamo una chiave per lo storage
const STORAGE_KEY = '__bool-xmas-list__';

//Raccogliamo tutti gli elementi di interessa dall html

const totalSlot = document.querySelector('.total-slot');
const giftListEl = document.querySelector('.gifts-list');

const form = document.querySelector('#gift-form');
const nameField = document.querySelector('#name-field');
const priceField = document.querySelector('#price-field');
const descriptionField = document.querySelector('#description-field');

//Preppariamo la lista dei regali
let gifts = [];

//! Controlla subito se c'erano elementi salvati nello storage
const prevList = localStorage.getItem(STORAGE_KEY);
if(prevList){
    //1. utilizziamo la lista precedente al posto di quella vuota
    gifts = JSON.parse(prevList);
    //2. ricalcola il totale 
    calculateTotal();
    //3. renderizza la lista
    renderList();
}
/*------------------------------------
    EVENTI DINAMICI
------------------------------------*/

//Intercettiamo l'invio del form

form.addEventListener('submit', function(event){
    //1. blocchiamo il ricaricamento della pagina del browser
    event.preventDefault();
    //2. raccogliere i dati dai campi
    const name = nameField.value.trim();
    const price = priceField.value.trim();
    const description = descriptionField.value.trim();

    //3. aggiungere un regalo alla lista
    addGift(name, price, description);
    //4. ripulire i campi di input
    form.reset();

    //5. riportare il focus (il cursore) sul primo campo
    nameField.focus();
});

/*------------------------------------
    FUNZIONI
------------------------------------*/
// Funzione per aggiungere un regalo alla lista

function addGift(name, price, description){
    //1. creare un nuovo oggetto che rappresenta il regalo
    const newGift = {
        name,
        price: Number(price),
        description
    };

    //2.aggiungere l'oggetto alla lista
    gifts.push(newGift);
    console.log(gifts);

    //!AGGIORNARE IL LOCAL STORAGE
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gifts));

    //3.calcorare il totale
    calculateTotal();
    //4. renderizziamo la lista dei regali
    renderList();
}

// Funzione per calcolare il totale
function calculateTotal(){
    //1. mi preparo a calcolare
    let total = 0;

    //2. per ogni regalo
    for(let i = 0; i < gifts.length; i++){
        //3. Aggiungiamo il prezzo totale
        total += gifts[i].price;
    }

    //4. stampare in pagina il totale
    totalSlot.innerText = formatAmount(total);
}

// Funzione per formattare una cifra
function formatAmount(amount){
    return amount.toFixed(2) + '€';
}

// Funzione per renderizzare la lista dei regali
function renderList(){
    //1. svuotare vecchio contenuto
    giftListEl.innerHTML = '';
    //2.per tuttti i regali
    for(let i = 0; i < gifts.length; i++){
        //3.creo il codice per un singolo elemento della lista
        const giftElement = createListElement(i);
        //4.aggancialo alla lista nella pagina
        giftListEl.innerHTML += giftElement;
        //5. Rendo cliccabili i bottoni
        setDeleteButtons();
    }
}

// Funzione per creare un elemento della lista
function createListElement(i){
    //Recupera il regalo
    const gift = gifts[i];

    //restitiuisci il codice html di un regalo nella lista
    return `
    <li class="gift">
        <div class="gift-info">
            <h3>${gift.name}</h3>
            <p>${gift.description}</p>
        </div>
        <strong class="gift-price">${formatAmount(gift.price)}</strong>
        <button class="gift-btn" data-index="${i}">❌</button>
    </li>
    `;
}

//Funzione per attivare i bottoni di cancellazione
function setDeleteButtons(){
    //1. recupera tutti i bottoni dei regali
    const deleteBtns = document.querySelectorAll('.gift-btn');
    //2. per ognuno dei bottoni
    for(let i = 0; i < deleteBtns.length; i++){
        //3. recuperiamo il singolo bottone ad ogni giro
        const button = deleteBtns[i];
        //4. aggiungo l'event listener
        button.addEventListener('click', function(){
            //5. individua l'index corrispondente
            const index = button.dataset.index;
            //6. rimuove dalla lista il regalo corrispondente
            removeGift(index);
        });
    }
}

//Funzione per rimuovere un regalo dalla lista
function removeGift(index){
    //1. rimuove il regalo dalla lista
    gifts.splice(index, 1);
    console.log(gifts);

     //!AGGIORNARE IL LOCAL STORAGE
     localStorage.setItem(STORAGE_KEY, JSON.stringify(gifts));

    //2. ricalcola il totale
    calculateTotal();
    //3. ri-renderizzare la lista
    renderList();
}