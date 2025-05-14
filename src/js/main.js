'use strict';

const layout= document.querySelector('.js-tarjetas');
const url = 'https://raw.githubusercontent.com/Adalab/resources/master/apis/products.json';
const inputFind = document.querySelector('.js-find-input');
const btnFind = document.querySelector('.js-find-btn');

let products =[];

function arrayElements(tarjetas){ 
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

        div2.appendChild(precio);
        div2.appendChild(btnComprar);
        div1.appendChild(img);
        div1.appendChild(h3);
        div1.appendChild(div2);

        layout.appendChild(div1);
    }

    )}

function handleClick(event) {
    layout.innerHTML = '';
    event.preventDefault();
    const inputValue = inputFind.value.toLowerCase().trim();
    const filteredProducts = products.filter((product) => {
        return product.title.toLowerCase().trim().includes(inputValue);
    });
    arrayElements(filteredProducts);
}



    fetch (url)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        products = data;
        arrayElements(products);
    })
    .catch((error) => {
        console.error('Error fetching data:', error);
    });





    btnFind.addEventListener('click', handleClick);