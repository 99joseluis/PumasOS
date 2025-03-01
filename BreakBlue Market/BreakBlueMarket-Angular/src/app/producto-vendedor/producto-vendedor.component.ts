import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import Swal from 'sweetalert2'
// Importando Modelos
import { Producto } from '../_modelos/productoModelo';
import { Imagen } from '../_modelos/imagenModelo';
import { Vendedor } from '../_modelos/vendedorModelo';
import { Comentario } from '../_modelos/comentarioModelo';
import { Calificacion } from '../_modelos/calificacionModelo';

//  Importando Servicios
import { productoService } from '../_services/productoService';
import { imagenService } from '../_services/imagenService';
import { vendedorService } from '../_services/vendedorService';
import { comentarioService } from '../_services/comentarioService';
import { calificacionService } from '../_services/calificacionService';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-producto-vendedor',
  templateUrl: './producto-vendedor.component.html',
  styleUrls: ['./producto-vendedor.component.css']
})
export class ProductoVendedorComponent implements OnInit {

  // Constantes de cada producto
  id :number|any = 0;
  nombre : string | any;
  correo : string | any;
  imagen : Observable<any> | undefined;
  nombreUsuario : string | any;
  productos : Producto[] = [];


  comentarios : Comentario[] = [];
  calificaciones : Calificacion[] = [];

  respuesta: any = [];
  error: any = [];

  constructor(
    private _router: Router,
    private productoService : productoService,
    private imagenService : imagenService,
    private vendedorService : vendedorService,
    private comentarioService : comentarioService,
    private calificacionService : calificacionService,
    private rutaActiva: ActivatedRoute) {}

  ngOnInit(){
    //  Asignamos el id y el nombre
    this.id = this.rutaActiva.snapshot.paramMap.get('id');
    this.nombre = this.rutaActiva.snapshot.paramMap.get('nombre');
    this.correo = this.rutaActiva.snapshot.paramMap.get('correo');

    // Buscamos el producto
    this.productoService.obtenerProducto(this.nombre).subscribe(data => {
      console.log(data)
      this.productos = data;
    });

    console.log(this.correo)
    // Buscamos el vendedor
    // this.vendedorService.obtenerVendedor(this.correo).subscribe(data2 => {
    //   this.vendedor = data2;
    // });

    // Buscamos las imagenes
    this.imagenService.obtenerImagenes(this.id).subscribe(data3 => {
      this.imagen = data3.imagen;
    });

    //  Buscamos los comentarios
    this.comentarioService.obtenerComentarios(this.id).subscribe(data4 => {
      this.comentarios = data4;
    })

    //  Obtenemos las calificaciones
    this.calificacionService.obtenerCalificaciones(this.id).subscribe(data5 => {
      this.calificaciones = data5;
    })
  }


  // Alerta que nos saldrá para confirmar la eliminación del producto
  mensajeBorrar(){
    Swal.fire({
      title: '¿Esás seguro/a?',
      text: "¡No podrás revertir los cambios!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Borrar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.eliminaProducto(this.id).subscribe(
          //Mandamos una alerta para confirmas los cambios
          respuesta => {
            console.log(respuesta);
          },
          //Si falla la conexión o hay un error, mandamos un mensaje
          error => {
            console.log('error');
            this.mensajeError();
            this._router.navigate(['/informacionVendedor',this.id,this.nombre,this.correo]);
          }
        )
        this._router.navigate(['/homeVendedor',this.correo]);
        Swal.fire(
          '¡Producto borrado!',
          'Acción realizada con éxito',
          'success'
        )
      } else if (result.dismiss == Swal.DismissReason.cancel){
        this._router.navigate(['/informacionVendedor',this.id,this.nombre,this.correo])
      }
    })
  }

  // Mensaje que se manda cuando ocurre un error al conectarse con el servidor
  mensajeError(){
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Ocurrio un error en el servidor',
      text: 'Por favor intente subir su producto de nuevo, sino intentarlo más tarde',
      showConfirmButton: true,
    })
  }

  mensajeCerrar(){
    Swal.fire({
      text: "¿Está seguro de querer cerrar la sesión?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar'
    }).then((result) => {
      if (result.isConfirmed) {
         this.vendedorService.cerrarSesionVendedor();
         console.log("verificacion");
         this._router.navigate(["/"]);
        Swal.fire(
          'Sesión Cerrada',
          'Acción realizada con éxito',
          'success'
        )
      } else if (result.dismiss == Swal.DismissReason.cancel){
         this._router.navigate(['/informacionVendedor',this.id,this.nombre,this.correo])
      }
    })
  }
}
