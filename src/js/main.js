'use strict';
//Constantes y variables
const layout= document.querySelector('.js-tarjetas');
const url = 'https://raw.githubusercontent.com/Adalab/resources/master/apis/products.json';
const inputFind = document.querySelector('.js-find-input');
const btnFind = document.querySelector('.js-find-btn');
const cart = document.querySelector('.js-carrito');

//Arrays
let products =[];
let shoppingBag = [];

//Función para pintar la web
function arrayElements(tarjetas,canvas){ 
    tarjetas.forEach((tarjeta) => {   
        const div1 = document.createElement('div');
        div1.classList.add('producto');
            
            const img = document.createElement('img');
            img.src = tarjeta.image;
            img.alt = tarjeta.title;
            img.classList.add('imagen');
        
            const h3 = document.createElement('h3');
            h3.textContent = tarjeta.title;
        
            const div2 = document.createElement('div');
            div2.classList.add('buy');
                const precio = document.createElement('p');
                precio.textContent = tarjeta.price +'€';
                const btnComprar = document.createElement('button');
                btnComprar.textContent = 'Comprar';
                btnComprar.classList.add('btn-comprar');

        div2.append(precio, btnComprar);
        div1.append(img,h3,div2);
        canvas.appendChild(div1);
    }

    )}
//Función que pinta el carrito 
function paintCart() {
    cart.innerHTML = '';
    if (shoppingBag.length === 0) {
        cart.innerHTML = '<p>No tienes productos en el carrito</p>';
    }else{arrayElements(shoppingBag,cart);}
    }

//Función manejadora del buscador
function handleClick(event) {
    layout.innerHTML = '';
    event.preventDefault();
    const inputValue = inputFind.value.toLowerCase().trim();
    const filteredProducts = products.filter((product) => {
        return product.title.toLowerCase().trim().includes(inputValue);
    });
    arrayElements(filteredProducts,layout);
}

//Fetch API
    fetch (url)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        products = data;
        arrayElements(products,layout);
    })
    .catch((error) => {
        console.error('Error fetching data:', error);
    });

//Evento buscador
btnFind.addEventListener('click', handleClick);
//Evento añadir al carrito
layout.addEventListener("click", (event) => {
    if (event.target.classList.contains("btn-comprar")) {
        addToBag(event);
    }
});
