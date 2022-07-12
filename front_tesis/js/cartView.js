const containerTable = document.getElementById('body-table');
const containerTotal = document.getElementById('total-table');

window.onload = function showProductsTable() {
    var storage = JSON.parse(localStorage.getItem("productsInCart"))
    var total = calculateTotal();
    var i=0;
    //console.log(storage);
    containerTable.innerHTML = '';
    storage.forEach(item => {
        const tableHTML = document.createElement('tr');
        i=i+1;
        tableHTML.innerHTML = `
            <th scope="row">${i}</th>
            <td><img src="../multimedia/img/productos/${item.imagen}"  width="50" height="50"/></td>
            <td>${item.nombre}</td>
            <td>${formatter.format(item.precio)}</td>
            <td>
                <a onclick="deleteItem(${item.id})">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                    </svg>
                </a>
            </td>
        `; 
        containerTable.appendChild(tableHTML);
        })

        //mostrar el total 
        containerTotal.innerHTML = ''; 
        const totalHTML = document.createElement('tr');
        totalHTML.innerHTML = `
            <th></th>
            <th colspan="2">Total</th>
            <th colspan="2" >${formatter.format(total)}</th>
        `;
        containerTotal.appendChild(totalHTML); 
}