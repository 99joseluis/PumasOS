import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders} from "@angular/common/http";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";

import { Producto } from "../_modelos/productoModelo";

@Injectable({ providedIn: 'root'})
export class productoService {

    // URL de la API 
    private useUrl = "http://127.0.0.1:5000";

    constructor(private http: HttpClient) { }

    headers = new HttpHeaders().set('Content-Type', 'application/json');

    // POST: agrega un nuevo producto
    agregarProducto(producto : Producto): Observable<Producto> {
        return this.http.post<Producto>(this.useUrl + "/altaProducto", producto);
    }

    obtenerProducto(nombre: String): Observable<Producto> {
        return this.http.get<Producto>(this.useUrl + "/producto/"+ nombre);
    }

    // DELETE: elimina un producto
    eliminaProducto(producto : Producto | number) {
        if(confirm("estas seguro de borrralo?")) {
            const id = typeof producto === 'number' ? producto : producto.id;
            const url = `${this.useUrl}/delete/${id}`;
            return this.http.delete(url);
        }
        return of({});
    }
}