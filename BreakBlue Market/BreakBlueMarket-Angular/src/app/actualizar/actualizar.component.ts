import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import Swal from 'sweetalert2'

import { Producto } from '../_modelos/productoModelo';
import { productoService } from '../_services/productoService';
import { imagenService } from '../_services/imagenService';

@Component({
  selector: 'app-actualizar',
  templateUrl: './actualizar.component.html',
  styleUrls: ['./actualizar.component.css']
})
export class ActualizarComponent implements OnInit {
  id: number | any = 0 ;  
  //Datos que pedimos para actualizar
  @Input() producto: Producto = {id: 0, nombre: '', marca: '', descripcion: '', precio: 0.00 ,unidadesDisponibles:0 , correo: 'hhdh@gmail.com', imagen: ''}

  correo : string | any;
  previsualizacion : string | any;
  agregarForm!: FormGroup;

  respuesta: any = [];
  error: any = [];


  constructor( private _router: Router, 
               private fb: FormBuilder,
               private productoService: productoService,
               private imagenService: imagenService,
               private rutaActiva : ActivatedRoute
               ) { 
    this.createForm();
  }

  ngOnInit(): void {
    this.id = this.rutaActiva.snapshot.paramMap.get('id');
    console.log(this.rutaActiva.snapshot.paramMap.get('id'));
    this.correo =this.rutaActiva.snapshot.paramMap.get('correo');
  }

  createForm() {
    this.agregarForm = this.fb.group({
      nuevoNombreProducto: ['', Validators.required],
      nuevoPrecioProducto: ['', Validators.required],
      nuevasUnidadesProducto: ['', Validators.required],
      nuevaDescripcionProducto: ['', Validators.required],
      nuevaImagenProducto: ['', Validators.required]
    });
  }


    // Subimos los datos a la BD
    actualizarProducto() {
      let nombre = this.producto.nombre;
      console.log(nombre)
      // console.log(this.producto)
      this.productoService.actualizarProducto(this.id, this.producto).subscribe(
        // Si no hay errores mandamos un mensaje de exito
        respuesta => {
          // Mandamos el mensaje de que el producto fue dado de alta
          console.log('Producto actualizado');
          this.productoService.obtenerProducto(nombre).subscribe(dato => {
            console.log(dato);
            this.imagenService.agregarImagenes(dato[0].id, this.previsualizacion).subscribe(dta => {
            })
          })
          console.log(this.producto);

          this.mensajeActualizar();

          
          
          
          // Rederigimos al vendedor a la página donde estan todos sus productos
          // this._router.navigate(["/homeVendedor"]);
        },
        // En caso contrario Mandamos un error
        error => {
          console.log('error');
          //Se manda el mensaje de error
          this.mensajeError();
          // Rederigimos al vendedor a la misma página
          this._router.navigate(['/homeVendedor',this.correo]);
  
        }
      )
    }

  mensajeActualizar(){
    Swal.fire({
      title: '¿Esás seguro/a?',
      text: "¡No podrás revertir los cambios!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Guardar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._router.navigate(['/homeVendedor',this.correo]);
        Swal.fire(
          '¡Producto actualizado!',
          'Acción realizada con éxito',
          'success'
        )
      } else if (result.dismiss == Swal.DismissReason.cancel){
        this._router.navigate(['/homeVendedor',this.correo])
      } 
    })
  }




  // Mensaje que se manda cuando ocurre un error al conectarse con el servidor
  mensajeError(){
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Ocurrio un error en el servidor',
      text: 'Por favor intente actualizar su producto de nuevo, sino intentarlo más tarde',
      showConfirmButton: true,
    })
  }

 // Función para subir una imagen
 onSelectFile(event : Event|any) : any{
  console.log(event)
  const archivoCapturado = event.target.files[0];
  this.extraerBase64(archivoCapturado).then( (imagen : any) => {
    this.previsualizacion = imagen.base;
    console.log(imagen);
  })
}

extraerBase64 = async ($event : any) => new Promise((resolve, reject) => {
  try{
    const reader = new FileReader();
    reader.readAsDataURL($event);
    reader.onload = () => {
      resolve({
        base : reader.result
      });
    };
    reader.onerror = error => {
      resolve({
        base : null
      });
    };
  }catch(e){
    reject ;
  }
})

  
}
