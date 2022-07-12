//variables para el DOM
const main = document.getElementById('items');



function ProductDetail(i) {
    location.href=`src/views/productDetail.html?id=${i}`;  
}

function showProducts() {
    main.innerHTML = '';
    products.forEach(product => {
        const productsHTML = document.createElement('div');
        productsHTML.innerHTML = `
            <div class="col">
                <div id="${product.id}" class="card card-products h-100 text-center">
                    <img onclick="ProductDetail(${product.id})" src="src/multimedia/img/productos/${product.imagen}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${product.nombre}</h5>
                        <p class="card-price">${formatter.format(product.precio)} c/u </p>
                        <button onclick="shoppingCart(${product.id})" href="#" class="btn btn-card">Añadir al carrito</button>
                    </div>
                </div>
            </div> 
            `
        main.appendChild(productsHTML);
    })
}

$(document).ready(showProducts)


