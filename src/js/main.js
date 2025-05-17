
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
function arrayElements(tarjetas, canvas) {
    canvas.innerHTML = '';
  
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
      precio.textContent = tarjeta.price + '€';
  
      const btnComprar = document.createElement('button');
      const inCart = shoppingBag.some((item) => item.title === tarjeta.title);
  
      btnComprar.textContent = inCart ? 'Eliminar' : 'Comprar';
      btnComprar.classList.add('btn-comprar');
      if (inCart) {
        btnComprar.classList.add('btn-en-carrito'); // nuevo estilo
      }
  
      btnComprar.setAttribute('data-title', tarjeta.title); // importante para manejar eventos
  
      div2.append(precio, btnComprar);
      div1.append(img, h3, div2);
      canvas.appendChild(div1);
    });
  }
  
  
//Función que pinta el carrito 
function paintCart() {
    cart.innerHTML = '';
    if (shoppingBag.length === 0) {
      cart.innerHTML = '<p>No tienes productos en el carrito</p>';
    } else {
      shoppingBag.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
  
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.title;
  
        const name = document.createElement('span');
        name.textContent = item.title;
        name.classList.add('item-name');
  
        const price = document.createElement('span');
        price.textContent = `${item.price}€`;
        price.classList.add('item-price');
  
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.classList.add('btn-delete');
        deleteBtn.setAttribute('data-index', index);
  
        cartItem.append(img, name, price, deleteBtn);
        cart.appendChild(cartItem);
      });
    }
  }
  
  
  //Función para añadir al carrito
  function addToBag(event) {
    const productDiv = event.target.closest('.producto');
    const title = productDiv.querySelector('h3').textContent;
    const price = parseFloat(productDiv.querySelector('p').textContent);
    const image = productDiv.querySelector('img').src;
  
    const exists = shoppingBag.some((item) => item.title === title);
  
    if (!exists) {
      const product = {
        title,
        price,
        image
      };
      shoppingBag.push(product);
      paintCart();
    } else {
      alert('Este producto ya está en el carrito.');
    }
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
fetch(url)
    .then((response) => response.json())
    .then((data) => {
    products = data;

    // Recuperar carrito guardado, si existe
    const savedCart = localStorage.getItem('shoppingBag');
    if (savedCart) {
        shoppingBag = JSON.parse(savedCart);
    }

    arrayElements(products, layout);
    paintCart(); // <- Muy importante para pintar el carrito al inicio
    })
    .catch((error) => {
    console.error('Error fetching data:', error);
    });


//Evento buscador
btnFind.addEventListener('click', handleClick);

//Evento añadir al carrito
layout.addEventListener("click", (event) => {
    if (event.target.classList.contains("btn-comprar")) {
      const title = event.target.getAttribute('data-title');
      const product = products.find((p) => p.title === title);
      const inCart = shoppingBag.some((item) => item.title === title);
  
      if (inCart) {
        // Eliminar del carrito
        shoppingBag = shoppingBag.filter((item) => item.title !== title);
      } else {
        // Agregar al carrito
        shoppingBag.push(product);
      }
      // Guardar cambios en localStorage
    localStorage.setItem('shoppingBag', JSON.stringify(shoppingBag));
  
      paintCart();
      arrayElements(products, layout); // Vuelve a pintar el canvas para actualizar botones
    }
  });
  
//Evento eliminar del carrito
cart.addEventListener('click', (event) => {
    if (event.target.classList.contains('btn-delete')) {
      const index = event.target.getAttribute('data-index');
      shoppingBag.splice(index, 1);

      // Actualiza el localStorage
    localStorage.setItem('shoppingBag', JSON.stringify(shoppingBag));

      paintCart();
      arrayElements(products, layout); // Actualizar botones en canvas
    }
  });