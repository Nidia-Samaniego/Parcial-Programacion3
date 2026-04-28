import { PRODUCTS, getCategories } from '../../../data/data';
import type { Product, CartItem } from '../../../types/product';
import type { ICategory } from '../../../types/categorias';
import '../../../style.css';


// --- 1. Referencias al DOM ---
const contenedorProductos = document.getElementById('contenedor-productos') as HTMLElement;
const inputBusqueda = document.getElementById('input-busqueda') as HTMLInputElement;
const listaCategorias = document.getElementById('lista-categorias') as HTMLElement;
const formBusqueda = document.getElementById('form-busqueda') as HTMLFormElement;

// --- 2. Función para renderizar Productos 
const renderProducts = (items: Product[]) => {
    if (!contenedorProductos) return;
    contenedorProductos.innerHTML = '';

    if (items.length === 0) {
        contenedorProductos.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No se encontraron productos que coincidan con tu búsqueda.</p>';
        return;
    }

    items.forEach(prod => {
        const article = document.createElement('article');
       
        article.innerHTML = `
            <img src="${prod.imagen}" alt="${prod.nombre}">
            <h3>${prod.nombre}</h3>
            <p>${prod.descripcion || 'Sin descripción disponible'}</p>
            <span class="precio-destacado">$${prod.precio.toLocaleString()}</span>
            <button class="btn-buscar" onclick="addToCart(${prod.id})">Agregar al carrito</button>
        `;
        contenedorProductos.appendChild(article);
    });
};

// --- 3. Función para renderizar Categorías 
const renderCategories = (categories: ICategory[]) => {
    if (!listaCategorias) return;
    listaCategorias.innerHTML = '';

    // Opción para mostrar "Todas"
    const liAll = document.createElement('li');
    liAll.innerHTML = `<button class="btn-category-filter" style="background: none; border: none; cursor: pointer; color: var(--color-primario); font-weight: bold; margin-bottom: 10px;">🍴 Todas</button>`;
    liAll.onclick = () => renderProducts(PRODUCTS);
    listaCategorias.appendChild(liAll);

    categories.forEach(cat => {
        const li = document.createElement('li');
        li.style.marginBottom = "8px";
        li.innerHTML = `<button class="btn-category-filter" style="background: none; border: none; cursor: pointer; text-align: left;">• ${cat.nombre}</button>`;
        
        li.onclick = () => {
            const filtrados = PRODUCTS.filter(p => 
                p.categorias.some(c => c.id === cat.id)
            );
            renderProducts(filtrados);
        };
        listaCategorias.appendChild(li);
    });
};

// --- 4. Lógica del Carrito con LocalStorage 
(window as any).addToCart = (id: number) => {
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) return;

    // Recuperar carrito actual o crear uno vacío
    const cartRaw = localStorage.getItem('cart');
    let cart: CartItem[] = cartRaw ? JSON.parse(cartRaw) : [];

    // Verificar si el producto ya existe 
    const existingIndex = cart.findIndex(item => item.id === id);

    if (existingIndex !== -1) {
        cart[existingIndex].cantidad += 1;
    } else {
        cart.push({ ...product, cantidad: 1 });
    }

    // Persistencia
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Feedback visual 
    alert(`¡${product.nombre} se agregó correctamente!`);
};

// --- 5. Eventos de Búsqueda 

if (inputBusqueda) {
    inputBusqueda.addEventListener('input', () => {
        // Se ejecuta cada vez que presionás una tecla
        const query = inputBusqueda.value.toLowerCase().trim();

        const filtered = PRODUCTS.filter(p => 
            p.nombre.toLowerCase().includes(query) || 
            p.descripcion.toLowerCase().includes(query) ||
            p.categorias.some(cat => cat.nombre.toLowerCase().includes(query))
        );

        renderProducts(filtered);
    });
}

// Evitar que el form recargue la página al dar enter
if (formBusqueda) {
    formBusqueda.addEventListener('submit', (e) => e.preventDefault());
}

// --- 6. Inicialización ---
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(PRODUCTS);
    renderCategories(getCategories());
});