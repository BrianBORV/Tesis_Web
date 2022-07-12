const urlParams = new URLSearchParams(window.location.search);
const pgProductDetail = document.getElementById('containerProductDetail');
const idProduct = urlParams.get("id");
const containerProductDetail = document.getElementById('containerProductDetail');
//console.log(urlParams.get("id"));

window.onload = function showProductDetail() {
    const result = products.find(product => product.id == idProduct);
    console.log(result);
    containerProductDetail.innerHTML = '';
    const productHTML = document.createElement('div');
    productHTML.innerHTML = `
    <div class="card card-productDetail mb-3 text-center" style="max-width: 1000px">
        <div class="row g-0">
          <div class="col-md-7">
            <img
              src="../multimedia/img/productos/${result.imagen}"
              class="img-fluid rounded-start img-card"
              alt="..."
            />
          </div>
          <div class="col-md-5">
            <div class="card-body">
                <h5 class="card-title">${result.nombre}</h5>
                <p class="card-price">${formatter.format(result.precio)} c/u </p>
                <p class="card-text">${result.descripcion}</p>
                <button class="btn btn-card" onclick="shoppingCart(${result.id})" >Añadir al carrito</button>
            </div>
          </div>
        </div>
      </div>

    `
    containerProductDetail.appendChild(productHTML);
}