const orderPageBtn = document.querySelector('#order-history-list');
orderPageBtn.addEventListener('click', onOrderPageBtnClick);
function showOtrderHistory(orders) {
    let html = "";

    orders.forEach((order, index) => {
        const { id,date } = order;
        const options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        };
        const formattedDate = new Date(date).toLocaleString("en-US", options);

        let htmlstart = `<div class="card my-3 ">
        <div class="m-2"><h5>Order No #${index+1}</h5></div>
        <div class="card-header text-center bg-white">
            <div class="ms-0 ms-md-2">
                <h5>Order Id #${id}</h5>
            </div>
            <div class="me-0 me-md-5 text-nowrap">
                Date & Time: ${formattedDate}
            </div>
        </div>
        <div class="card-body">
        <table class="table">
            <thead >
                <tr>
                    <th class="col-1">#</th>
                    <th class="col-5">Item Name</th>
                    <th class="col-4">Price</th>
                    <th>Quantity</th>
                </tr>
            </thead>
            <tbody >
        `;
        let htmlMiddle = "";
        let totalPrice = 0;
        order.Products.forEach((product, index) => {
            const { productName,productPrice,quantity  } = product;
            totalPrice += productPrice * quantity
            htmlMiddle += `<tr>
            <td>${index + 1}</td>
            <td>${productName}</td>
            <td>&#8377;${productPrice}</td>
            <td>${quantity}</td>
        </tr>
            `
        })
        let totalTax = ((totalPrice * 2.5) / 100).toFixed(2);
        let netAmount = (Number(totalPrice) + Number(totalTax))
        let htmlEnd = `</tbody >
        </table>
        <div class="mt-2 d-flex justify-content-center " >
          <ul class="list-unstyled">
            <li><b>Total Amount:</b>&nbsp;&nbsp;&#8377; ${totalPrice}</li>
            <li><b>Tax(2.5%):</b>&nbsp;&nbsp;&#8377; ${totalTax}</li>
            <li><b>Net Amount:</b>&nbsp;&nbsp;&#8377; ${netAmount}</li>

          </ul>

      </div>
    </div>
</div>
        `
        html += htmlstart + htmlMiddle + htmlEnd

    })
    Orderplaceholder.innerHTML = html;
}

async function onOrderPageBtnClick(e) {
    try {
        const response = await axios.get('customer/get-orders');
        showOtrderHistory(response.data.orders);
    } catch (error) {
        console.log(error);
    }
}