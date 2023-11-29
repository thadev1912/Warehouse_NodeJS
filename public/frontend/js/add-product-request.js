document.addEventListener("DOMContentLoaded", function() {
    const productForm = document.getElementById('productForm'); 
    const productTable = document.getElementById('productTable').getElementsByTagName('tbody')[0];

    productForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const productName=productForm.querySelector("[name='product_name']").value;
        const productUnit=productForm.querySelector("[name='product_unit']").value;
        const productQuantity=productForm.querySelector("[name='product_quantity']").value;
        const finishDate=productForm.querySelector("[name='finish_date']").value;
        const specification=productForm.querySelector("[name='specification']").value;
        const requestDetail=productForm.querySelector("[name='request_detail']").value;

        const newRow = document.createElement('tr');
        newRow.innerHTML= `
            <td>${productTable.rows.length + 1}</td>
            <td>${productName}</td>
            <td>${productQuantity}</td>
            <td>${productUnit}</td>
            <td>${finishDate}</td>
            <td>${specification}</td>
            <td>${requestDetail}</td>
            <td><button class="btn btn-danger my-2 btn-icon-text delete-row">Xóa</button></td>
        `;
        productTable.appendChild(newRow);
        productForm.reset();

         newRow.querySelector(".delete-row").addEventListener("click", function (e) {
                e.preventDefault();
                newRow.remove();
            }); 
    });
});