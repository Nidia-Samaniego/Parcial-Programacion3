import type { ICategory } from "./categorias";
export interface Product {
    id: number;
    nombre: string;
    precio: number;
    imagen: string;
    descripcion: string;
    stock: number;
    createdAt: string;
    eliminado: boolean;
    disponible: boolean;
    categorias: ICategory[];
}

export interface CartItem extends Product {
    cantidad: number;
}