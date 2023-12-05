const cartPageBtn = document.querySelector('#cart-page-list');
cartPageBtn.addEventListener('click', onCartPageBtnClick);
tableBody.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains("decrease-btn")) onDecreaseQuantity(e);
    if (e.target && e.target.classList.contains("increase-btn")) onIncreaseQuantity(e);
    if (e.target && e.target.classList.contains("remove-btn")) onDeleteFromCart(e);
})
checkoutBtn.addEventListener('click', onCheckOut)

function showShoppingCart(products) {
    let totalPrice = 0;
    tableBody.innerHTML = "";
    products.forEach((ele, index) => {
        totalPrice += Number(ele.productPrice) * Number(ele.quantity);
        const tr = document.createElement('tr');
        const text = `
        <td>${index + 1}</td>
        <td>${ele.productName}</td>
        <td>&#8377;${ele.productPrice}</td>
        <td class="d-flex justify-content-evenly">
            <button class="btn btn-sm btn-danger decrease-btn" id="${ele.id}">-</button>
            <span class="mx-2">${ele.quantity}</span>
            <button class="btn btn-sm btn-success increase-btn" id="${ele.id}">+</button>
        </td>
        <td class="text-center"><button class="btn btn-sm btn-warning remove-btn" id="${ele.id}">Remove</button></td>
        `;
        tr.innerHTML += text;
        tableBody.appendChild(tr);
    });
    totalPlaceholder.innerHTML = totalPrice.toFixed(2);
    const taxPrice = ((totalPrice * 2.5) / 100);
    taxPlaceholder.innerHTML = taxPrice.toFixed(2);
    grandTotalPlaceholder.innerHTML = (totalPrice + taxPrice).toFixed(2);
}

async function onCartPageBtnClick() {
    try {
        const response = await axios(`customer/get-cart`);
        showShoppingCart(response.data.products);
    } catch (error) {
        alert(error.response.data.message);
        window.location = '/';
    }
}

async function onDecreaseQuantity(e) {
    try {
        e.preventDefault();
        const productId = e.target.id;
        await axios.put(`customer/decrease-from-cart/${productId}`)
        const response = await axios(`customer/get-cart`);
        showShoppingCart(response.data.products);

    } catch (error) {
        console.log(error);
    }
}
async function onIncreaseQuantity(e) {
    try {
        e.preventDefault();
        const productId = e.target.id;
        await axios.put(`customer/increase-from-cart/${productId}`)
        const response = await axios(`customer/get-cart`);
        showShoppingCart(response.data.products);

    } catch (error) {
        console.log(error);
    }
}

async function onDeleteFromCart(e) {
    try {
        e.preventDefault();
        const productId = e.target.id;
        await axios.delete(`customer/delete-from-cart/${productId}`)
        const response = await axios(`customer/get-cart`);
        showShoppingCart(response.data.products);
    } catch (error) {

    }
}

async function onCheckOut(e) {
    try {
        e.preventDefault();
        const response = await axios.post('payment/create-order');
        const { key_id, orderid } = response.data;
        const { name, email, phoneNumber } = response.data.customer;
        var options = {
            "key": key_id,
            "order_id": orderid,
            "name":"Sell Here Pvt.Ltd",
            "description": "Test Transaction",
            "handler": async function (response) {
                const OrderStatus = await axios.put("payment/update-transaction", {
                    order_id: response.razorpay_order_id,
                    payment_id: response.razorpay_payment_id
                });
                alert(OrderStatus.data.message);
                const cart = await axios(`customer/get-cart`);
                showShoppingCart(cart.data.products);
            },
            "prefill": {
                "name": name,
                "email": email,
                "contact": phoneNumber
            },
            "notes": {
                "address": "Sell Here Pvt.ltd Corporate Office"
            },
        };
        var rzp1 = new Razorpay(options);
        rzp1.on('payment.failed', function (response) {
            console.log(response);
            alert('Something went wrong Transaction failed');

        });
        rzp1.open();
        e.preventDefault();

    } catch (error) {
        if (error.response && error.response.status === 403) {
            alert(error.response.data.message);

        } else {
            alert(error.response.data.message);
            window.location = '/';
        }
    }
}


