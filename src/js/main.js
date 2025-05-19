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

      const quantity = document.createElement('p');
      quantity.textContent = 'Cantidad: ';
      const quantityInput = document.createElement('input');
      quantityInput.type = 'number';
      quantityInput.value = 1;
      quantityInput.min = 1;
      quantityInput.classList.add('js-quantity-input');
      quantityInput.setAttribute('data-id', tarjeta.id);
      quantity.appendChild(quantityInput);
      div2.appendChild(quantity);
  
      const precio = document.createElement('p');
      precio.textContent = tarjeta.price + ' €';
  
      const btnComprar = document.createElement('button');
      // Se usa el some porque solo devuelve true o false y para, sin necesidad de seguir recorriendo el array
      const inCart = shoppingBag.some((item) => item.title === tarjeta.title);
  
      btnComprar.textContent = inCart ? 'Eliminar' : 'Comprar';
      btnComprar.classList.add('btn-comprar');
      if (inCart) {
        btnComprar.classList.add('btn-en-carrito'); // nuevo estilo botón eliminar
      }
  
      btnComprar.setAttribute('data-id', tarjeta.id); // importante para manejar eventos
  
      div2.append(precio, btnComprar);
      div1.append(img, h3, div2);
      canvas.appendChild(div1);
    });
  }
  
  
//Función que pinta el carrito 
function paintCart() {
  const cartContainer = document.querySelector('.js-carrito');
  cartContainer.innerHTML = ''; // Limpia el contenido del carrito

  if (shoppingBag.length === 0) {
    cartContainer.innerHTML = '<p>El carrito está vacío 🛒</p>';
  } else {
    shoppingBag.forEach((item, i) => {
      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');
      //multiplicador de cantidad de productos x el precio de cada uno
      cartItem.innerHTML = `
        <div class="cart-item-details">
        <img src="${item.image}" alt="${item.title}" class="cart-item-image" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px; margin-right: 10px;">
        <p>${item.title}</p></div>
        <div class="cart-item-quantity"> 
        <input type="number" value="${item.quantity}" id="${item.id}" min="1" class="js-cart-quantity cart-quantity"></input>
        <p class="item-price">${item.price * item.quantity} €</p>
        <button class="btn-delete" id="${i}" style="font-size: 18px; font-weight: bold; background: none; border: none; cursor: pointer;">✖</button></div>
      `;
      cartContainer.appendChild(cartItem);
    });

    const totalValue = document.createElement('p');
    totalValue.classList.add('js-total-value', 'total-value');
    const total = shoppingBag.reduce((acc, item) => acc + item.price * item.quantity, 0);
    totalValue.textContent = `Total: ${total} €`;
    cartContainer.appendChild(totalValue); // Añadir el total al carrito
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
      const productID = parseInt(event.target.getAttribute('data-id'));
      const product = products.find((p) => p.id === productID);
      const inCart = shoppingBag.some((item) => item.id === productID);
  
      if (inCart) {
        // Eliminar del carrito
        shoppingBag = shoppingBag.filter((item) => item.id !== productID);
      } else {
        // Agregar al carrito
        // Cantidad inicial al añadir un producto
        product.quantity = event.target.parentElement.querySelector('.js-quantity-input').value;
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
    const i = event.target.getAttribute('id');
    shoppingBag.splice(i, 1);

    // Actualiza el localStorage
  localStorage.setItem('shoppingBag', JSON.stringify(shoppingBag));

    paintCart();
    arrayElements(products, layout); // Actualizar botones en canvas
  }
});

//Evento para cambiar la cantidad de productos en el carrito
cart.addEventListener('change', (event) => {
  if (event.target.classList.contains('cart-quantity')) {
    const productID = parseInt(event.target.getAttribute('id'));
    //Cambiar la cantidad del producto en el carrito
    const newQuantity = parseInt(event.target.value);
    const product = shoppingBag.find((item) => item.id === productID);
    if (product) {
      product.quantity = newQuantity;
    }
    // Actualiza el localStorage
    localStorage.setItem('shoppingBag', JSON.stringify(shoppingBag));

    paintCart();
    arrayElements(products, layout); // Actualizar botones en canvas
  }
});

  //Evento para vaciar el carrito

document.querySelector('.btn-vaciar-carrito').addEventListener('click', () => {
  shoppingBag = []; // Vacía el carrito
  localStorage.removeItem('shoppingBag'); // Elimina el carrito del almacenamiento local
  paintCart(); // Vuelve a pintar el carrito vacío
  arrayElements(products, layout); // Actualiza la vista de productos
});

