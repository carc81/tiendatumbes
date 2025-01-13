// Carrito de productos
const cart = [];

// Al cargar la página
window.onload = function() {
    // Asegura que el modal esté oculto al cargar la página
    closeCart();
    // Actualizar el carrito al cargar la página
    updateCartUI(); 
    updateCartCounter(); // Inicializar el contador 
};

// Agregar un producto al carrito
// Esta parte está repetida, puedes eliminarla
function addToCart(productName, price, discount) {
    const existingProduct = cart.find(item => item.name === productName);
    const productCard = Array.from(document.querySelectorAll('.product-card'))
        .find(card => card.querySelector('h3').textContent === productName);
    const imageUrl = productCard.querySelector('img').src;

    if (existingProduct) {
        existingProduct.quantity += 1; // Incrementar cantidad si ya existe
    } else {
        cart.push({ name: productName, price, discount, image: imageUrl, quantity: 1 });
    }

    console.log(cart);  // Añadido para verificar que el carrito se está actualizando

    updateCartUI();
    updateCartCounter();  // Llamar para actualizar el contador
   // showMessage(`"${productName}" se ha añadido al carrito.`);
    console.log(cart);  // Verifica si los productos se agregan correctamente al carrito
}


// Mostrar mensaje de confirmación
function showMessage(message, isError = false) {
    const messageContainer = document.getElementById('message-container');
    messageContainer.textContent = message;
    messageContainer.style.opacity = '1';
    messageContainer.style.pointerEvents = 'auto';
    
    if (isError) {
        messageContainer.classList.add('error');
    } else {
        messageContainer.classList.remove('error');
    }

    setTimeout(() => {
        messageContainer.style.opacity = '0';
        messageContainer.style.pointerEvents = 'none';
    }, 3000);
}


// Eliminar un producto del carrito
// Eliminar un producto del carrito
function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1); // Eliminar producto
        updateCartUI();
        updateCartCounter();
    } else {
        console.error("Índice de producto inválido.");
    }
}

// Actualizar el contador del carrito
// Actualizar el contador del carrito
function updateCartCounter() {
    const cartButton = document.querySelector('.cart');
    let counter = document.querySelector('.cart-counter');

    if (!counter) {
        // Crear el círculo rojo si no existe
        counter = document.createElement('span');
        counter.className = 'cart-counter';
        cartButton.appendChild(counter);
    }

    // Calcular la cantidad total de productos en el carrito
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (totalItems > 0) {
        counter.textContent = totalItems; // Mostrar cantidad total
        counter.style.visibility = 'visible'; // Hacer visible el contador
        console.log('Contador visible con cantidad:', totalItems);
    } else {
        counter.style.visibility = 'hidden'; // Ocultar si no hay productos
        console.log('Contador oculto');
    }
}

// Función para generar la orden
function generateOrder() {
    if (cart.length === 0) {
        alert("El carrito está vacío.");
        return;  // Evitar continuar si el carrito está vacío
    }

    const orderDetails = cart
        .map(item => `${item.name} x${item.quantity} - S/ ${(item.price * item.quantity).toFixed(2)} (-${item.discount}%)`)
        .join('\n');
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
    const fullOrder = `${orderDetails}\n\nTotal a pagar: S/ ${total}`;

    const orderBlob = new Blob([fullOrder], { type: 'text/plain' });
    const orderUrl = URL.createObjectURL(orderBlob);

    const downloadLink = document.createElement('a');
    downloadLink.href = orderUrl;
    downloadLink.download = 'order_details.txt';
    downloadLink.click();
    
    // Confirmar que el pedido se ha generado
    showMessage('Tu orden ha sido generada correctamente. Puedes descargarla.');
}


// Función para abrir el modal
//function openCart() {
//    document.getElementById('cart-modal').style.display = 'flex';
//}


// Función para mostrar el modal solo si hay productos
function toggleCart() {
    const cartModal = document.getElementById('cart-modal');
    const overlay = document.getElementById('cart-modal-overlay');
    if (cart.length > 0) {
        cartModal.style.display = 'flex';  // Mostrar el modal
        overlay.style.display = 'block';   // Mostrar el fondo
    } else {
        cartModal.style.display = 'none';  // Ocultar el modal
        overlay.style.display = 'none';    // Ocultar el fondo
    }
}


// Función para cerrar el modal
// Función para cerrar el modal
function closeCart() {
    document.getElementById('cart-modal').style.display = 'none';  // Ocultar el modal
    document.getElementById('cart-modal-overlay').style.display = 'none';  // Ocultar el fondo
}

// Actualizar la interfaz del carrito
// Actualizar la interfaz del carrito
function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartButton = document.querySelector('.cart');
    cartItemsContainer.innerHTML = ''; // Limpiar contenido del carrito

    console.log(cart.length);  // Verificar si hay productos en el carrito

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>El carrito está vacío.</p>';
        const cartTotalContainer = document.querySelector('.cart-total');
        cartTotalContainer.textContent = 'Total: S/ 0.00';
        cartButton.setAttribute('disabled', 'true');
        closeCart(); // Asegurarse de que el modal se cierre si está vacío
        return;
    }

    cartButton.removeAttribute('disabled');
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';

        const productImage = document.createElement('img');
        productImage.src = item.image;
        productImage.alt = item.name;
        productImage.style.width = '50px';
        productImage.style.height = '50px';
        productImage.style.marginRight = '10px';

        const productDetails = document.createElement('div');
        productDetails.className = 'cart-item-details';
        productDetails.innerHTML = `
            <span class="name">${item.name}</span><br>
            <span class="price">Precio: S/ ${item.price.toFixed(2)}</span><br>
            <span class="quantity">Cantidad: ${item.quantity}</span>
        `;

        const removeButton = document.createElement('button');
        removeButton.className = 'remove-btn';
        removeButton.textContent = 'Eliminar';
        removeButton.onclick = () => removeFromCart(index);

        cartItem.appendChild(productImage);
        cartItem.appendChild(productDetails);
        cartItem.appendChild(removeButton);

        cartItemsContainer.appendChild(cartItem);
    });

    const cartTotalContainer = document.querySelector('.cart-total');
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotalContainer.textContent = `Total: S/ ${total.toFixed(2)}`;
}

/*Pra la pasarela de pago*/
function openPaymentModal() {
    const orderSummary = document.getElementById('order-summary');
    const totalPayment = document.getElementById('total-payment');

    // Limpiar contenido del resumen de la orden
    orderSummary.innerHTML = '';

    // Agregar productos del carrito al resumen
    cart.forEach(item => {
        const productRow = document.createElement('div');
        productRow.className = 'order-item';
        productRow.innerHTML = `
            <p><strong>${item.name}</strong> x${item.quantity} - S/ ${(item.price * item.quantity).toFixed(2)}</p>
        `;
        orderSummary.appendChild(productRow);
    });

    // Calcular el total
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
    totalPayment.textContent = `S/ ${total}`;

    // Mostrar el modal
    document.getElementById('payment-modal').style.display = 'flex';
}

function closePaymentModal() {
    document.getElementById('payment-modal').style.display = 'none';
}

// Función para imprimir la orden
function printOrder() {
    const orderContent = document.getElementById('order-summary').innerHTML;
    const total = document.getElementById('total-payment').textContent;

    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
        <html>
            <head>
                <title>Imprimir Orden</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h2 { text-align: center; }
                    .order-item { margin: 10px 0; }
                    .total { margin-top: 20px; font-weight: bold; }
                </style>
            </head>
            <body>
                <h2>Resumen de la Orden</h2>
                <div>${orderContent}</div>
                <p class="total">Total: ${total}</p>
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.onafterprint = () => printWindow.close();
}

const mercadoPago = new MercadoPago('TU_PUBLIC_KEY', { locale: 'es-AR' });

document.getElementById('pay-button').addEventListener('click', () => {
    // Crear preferencia en tu servidor
    fetch('/crear-preferencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart }),
    })
    .then(response => response.json())
    .then(preference => {
        // Abrir el checkout de Mercado Pago
        mercadoPago.checkout({
            preference: {
                id: preference.id
            }
        }).open();
    })
    .catch(error => console.error('Error al crear preferencia:', error));
});



