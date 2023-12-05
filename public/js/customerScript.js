import helperFunctions from "./helperFunctions.mjs";

let currentPage = 1;
let noProducts = 5;
let hasMoreProducts, hasPreviousProducts;
const PaginationElements = {
    noProductsSelect: pagination_div.querySelector('#noProductsSelect'),
    prevBtn: pagination_div.querySelector('#previousBtn'),
    nextBtn: pagination_div.querySelector('#nextBtn'),
}
PaginationElements.prevBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (hasPreviousProducts) {
        currentPage--;
        refresh();
    }
});
PaginationElements.nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (hasMoreProducts) {
        currentPage++;
        refresh();
    }
});
PaginationElements.noProductsSelect.addEventListener('change', () => {
    noProducts = Number(PaginationElements.noProductsSelect.value);
    currentPage = 1;
    refresh();
})

function showOutput(products) {
    productPlaceholder.innerHTML = "";
    products.forEach((ele) => {
        const htmlText = `
        <div class="col-md-4 col-lg-3 mb-4">
        <div class="card">
            <div class="card-header bg-warning text-center">
                <h2> ${ele.productName}</h2>
            </div>
            <img src="/images/${ele.imageUrl}.jpg" alt="" class="card-img-top">
            <div class="card-body">
                <h4 class="card-text text-center"> &#8377;${ele.productPrice}</h4>
                <div class="text-center m-2">
                <button class="btn btn-outline-success m-2 add-btn" id="${ele._id}">Add</button>
                <button class="btn btn-warning m-2 details-btn" id="${ele._id}">Details</button>
                </div>
            </div>
        </div>
    </div>
        `;
        productPlaceholder.innerHTML += htmlText;
    })
}

productPlaceholder.addEventListener('click',(e)=>{
    if (e.target && e.target.classList.contains("add-btn")) onAddtoCart(e);
    if (e.target && e.target.classList.contains("details-btn")) onDetails(e);
})
productModal.addEventListener('click',(e)=>{
    if (e.target && e.target.classList.contains("add-btn")) onAddtoCart(e); 
})
async function onAddtoCart(e){
    try {
        e.preventDefault();
        const productId = e.target.id
        const response = await axios.post(`customer/add-to-cart/${productId}`);
        alert(response.data.message); 
        $('#productModal').modal('hide');  
        
    } catch (error) {
        alert(error.response.data.message); 
    }
}
async function onDetails(e) {
    try {
        e.preventDefault();
        const productId = e.target.id
        const response = await axios.get(`customer/get-product/${productId}`)
        const { _id, productName, productQuantity, productPrice, productDescription, imageUrl } = response.data.product;
        modalPlaceholder.innerHTML = `
    <div class="modal-header d-flex justify-content-center">
        <h5 class="modal-title" id="productModalLabel">${productName}</h5>
    </div>
    <div class="modal-body row">
      <div class="col-12 col-md-6">
        <img src="/images/${imageUrl}.jpg" class="img-fluid" >
      </div>
      <div class="col-12 col-md-6 d-flex align-items-center justify-content-center ">
        ${productDescription}
      </div>
        <div class="text-center row">
          <h4 class="text-center lead text-info">No of Products in stock = ${productQuantity}</h4>
          <h3 class=" text-center fw-bold "> &#8377;${productPrice}</h3>
        </div>

    </div>
    <div class="modal-footer d-flex justify-content-center">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-outline-success add-btn" id ="${_id}">Add to Cart</button>
    </div>`
        $('#productModal').modal('show');
    } catch (error) {
        alert(error.response.data.message);
    }
}



async function refresh() {
    try {
        const response = await axios(`customer/get-products?pageNo=${currentPage}&noProducts=${noProducts}`);
        const { newHasMoreProducts, newHasPreviousProducts, products } = response.data;
        hasMoreProducts = newHasMoreProducts;
        hasPreviousProducts = newHasPreviousProducts;
        helperFunctions.updatePageNumber(hasMoreProducts, hasPreviousProducts);
        showOutput(products);
    } catch (error) {
        alert(error.response.data.message);
        window.location = '/';
    }
}

refresh();