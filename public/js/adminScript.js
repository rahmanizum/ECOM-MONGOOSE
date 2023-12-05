import helperFunctions from "./helperFunctions.mjs";

let currentPage = 1;
let noProducts = 5;
let hasMoreProducts, hasPreviousProducts;

//DOM ELEMENTS

const productFormElements = {
    productName: addproduct_form.querySelector('input[name="Name"]'),
    productQuantity: addproduct_form.querySelector('input[name="Quantity"]'),
    productPrice: addproduct_form.querySelector('input[name="Price"]'),
    description: addproduct_form.querySelector('textarea[name="Description"]'),
    id: addproduct_form.querySelector('input[name="id"]'),
    imageUrl: addproduct_form.querySelector('input[name="imageUrl"]'),
    submit_btn: addproduct_form.querySelector('input[type="submit"]'),
    alert1: document.querySelector('#addproductalert1'),
    alert2: document.querySelector('#addproductalert2'),
}

const PaginationElements = {
    noProductsSelect: pagination_div.querySelector('#noProductsSelect'),
    prevBtn: pagination_div.querySelector('#previousBtn'),
    nextBtn: pagination_div.querySelector('#nextBtn'),
}
//ENEVT LISTNERS
productPlaceholder.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains("edit-btn")) onEditProduct(e);
    if (e.target && e.target.classList.contains("delete-btn")) onDeleteProduct(e);
})
productFormElements.submit_btn.addEventListener('click', onAddproduct);

function showOutput(products) {
    productPlaceholder.innerHTML = "";
    products.forEach((ele) => {
        const htmlText = `
        <div class="col-md-4 col-lg-3 mb-4">
        <div class="card">
            <div class="card-header bg-warning text-center">
                <h2> ${ele.productName}</h2>
            </div>
            <img src="/images/${ele.imageUrl}.jpg" alt="" class="card-img-top ">
            <div class="card-body">
                <h4 class="card-text text-center"> &#8377;${ele.productPrice}</h4>
                <div class="text-center m-2" id="buttons">
                <button class="btn btn-outline-success m-2 edit-btn" id="${ele._id}">Edit</button>
                <button class="btn btn-outline-danger m-2 delete-btn" id="${ele._id}">Delete</button>
                </div>
            </div>
        </div>
    </div>
        `;
        productPlaceholder.innerHTML += htmlText;
    })
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

async function onEditProduct(e) {
    try {
        e.preventDefault();
        const productId = e.target.id
        const response = await axios.get(`admin/edit/${productId}`)
        const { _id, productName, productQuantity, productPrice, productDescription, imageUrl } = response.data.product
        productFormElements.productName.value = productName
        productFormElements.productQuantity.value = productQuantity
        productFormElements.productPrice.value = productPrice
        productFormElements.description.value = productDescription
        productFormElements.id.value = _id,
            productFormElements.imageUrl.value = imageUrl
        $('#formHead').text('Update Your Product');
        $('#formSubmit').val('update Product');
        $('#formClose').hide();
        $('#addproduct-modal').modal('show');
    } catch (error) {

    }
}
async function onDeleteProduct(e) {
    try {
        e.preventDefault();
        const productId = e.target.id
        await axios.delete(`admin/delete/${productId}`)
        alert('Product successfully deleted')
        refresh();
    } catch (error) {
        alert(error.response.data.message);
    }
}

async function onAddproduct(e) {
    try {
        if (addproduct_form.checkValidity()) {
            e.preventDefault();
            const productId = productFormElements.id.value;
            const data = {
                productName: productFormElements.productName.value,
                productQuantity: productFormElements.productQuantity.value,
                productPrice: productFormElements.productPrice.value,
                productDescription: productFormElements.description.value,
                imageUrl: productFormElements.imageUrl.value || Math.floor(Math.random() * 10)
            }
            if (productId) {
                const response = await axios.put(`admin/update-product/${productId}`, data)
                addproduct_form.reset();
                helperFunctions.alertFunction(productFormElements.alert2);
                setTimeout(() => {
                    $('#addproduct-modal').modal('hide');
                    productFormElements.id.value = '',
                        productFormElements.imageUrl.value = ''
                    $('#formHead').text('Add Your Product');
                    $('#formSubmit').val('Add Product');
                    $('#formClose').show();
                    refresh();
                }, 1500)

            } else {
                const response = await axios.post('admin/add-product', data)
                addproduct_form.reset();
                helperFunctions.alertFunction(productFormElements.alert1);
                setTimeout(() => {
                    $('#addproduct-modal').modal('hide');
                    refresh();
                }, 1500)
            }


        }
    } catch (error) {
        alert(error.response.data.message);
    }
}

async function refresh() {
    try {
        const response = await axios(`admin/get-products?pageNo=${currentPage}&noProducts=${noProducts}`);
        const { newHasMoreProducts, newHasPreviousProducts, products } = response.data;
        hasMoreProducts = newHasMoreProducts;
        hasPreviousProducts = newHasPreviousProducts;
        helperFunctions.updatePageNumber(hasMoreProducts, hasPreviousProducts);
        showOutput(products)
    } catch (error) {
        alert(error.response.data.message);
        window.location = '/';
    }
}

window.onload = refresh;






