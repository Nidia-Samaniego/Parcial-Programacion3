import type { CartItem } from '../../../types/product';
import '../../../style.css';

// obtenemos los elementos del HTML donde se mostraran los productos
const cartList = document.getElementById('cart-list');
const totalPriceElement = document.getElementById('total-price');

const renderCart = () => {
    const cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');

    if (!cartList || !totalPriceElement) return;

    if (cart.length === 0) {
        cartList.innerHTML = '<p style="text-align:center;">El carrito está vacío.</p>';
        totalPriceElement.innerText = '0';
        return;
    }

    let total = 0;
    cartList.innerHTML = '';

    cart.forEach((item) => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;

        const li = document.createElement('li');
        li.className = "cart-item"; 
        li.style.display = "flex";
        li.style.justifyContent = "space-between";
        li.style.alignItems = "center";
        li.style.marginBottom = "15px";
        li.style.padding = "10px";
        li.style.borderBottom = "1px solid #eee";

        li.innerHTML = `
            <div style="flex: 1;">
                <strong>${item.nombre}</strong><br>
                <small>$${item.precio.toLocaleString()} c/u</small>
            </div>
            
            <div style="display: flex; align-items: center; gap: 10px; flex: 1; justify-content: center;">
                <button class="btn-buscar" style="padding: 5px 12px; height: auto;" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span style="font-weight: bold; min-width: 20px; text-align: center;">${item.cantidad}</span>
                <button class="btn-buscar" style="padding: 5px 10px; height: auto;" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>

            <div style="flex: 1; text-align: right;">
                <strong>$${subtotal.toLocaleString()}</strong>
            </div>
        `;
        cartList.appendChild(li);
    });

    totalPriceElement.innerText = total.toLocaleString();
};

// Función global para manejar las cantidades, busca el producto en el carrito usando su ID 
(window as any).updateQuantity = (id: number, change: number) => {
    let cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
    const productIndex = cart.findIndex(item => item.id === id);

    if (productIndex !== -1) {
        cart[productIndex].cantidad += change;

        // Si la cantidad es menor a 1, eliminamos el producto
        if (cart[productIndex].cantidad <= 0) {
            cart.splice(productIndex, 1);
        }
// guardamos nuevo estado del carrito en localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart(); 
    }
};

document.addEventListener('DOMContentLoaded', renderCart);