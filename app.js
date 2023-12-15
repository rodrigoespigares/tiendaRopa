window.onload = () => {
  const { createApp } = Vue
      
    createApp({
        data() {
            return {
                /**Declaro las variables iniciales*/
                showPrincipal:true,
                showCatalogo:false,
                showDetalle:false,
                showCarrito:false,
                check:false,
                productos:[],
                idSeleccionado:1,
                categorias:[],
                selectCategoria:"",
                detalle:[],
                carrito:[],
                cantidad : 1,
                rate: "--rating: 0",
                orden: "",
                isCarrito:false,
                isPedido:false,
                isLoading : false,
            }
        },
        methods:{
            /**
             * Función para mostrar el catálogo de productos
             */
            verCatalogo(categoria = null){
                this.orden="";
                if(categoria != null){
                    this.selectCategoria = categoria;
                }
                this.cargaProductos();
                this.check = false;
                this.showPrincipal = false;
                this.showCatalogo = true;
                this.showDetalle = false;
                this.showCarrito = false;
            },
            /**
             * Función para ver un producto en concreto
             */
            verDetalle(id){
                this.idSeleccionado = id,
                this.cargaDetalle();
                this.check = false,
                this.showPrincipal = false,
                this.showCatalogo = false,
                this.showDetalle = true,
                this.showCarrito = false
            },
            /**
             * Función para mostrar el carrito con los productos 
             * que se van a comprar
             */
            verCarrito(){
                this.check = false;
                this.showPrincipal = false;
                this.showCatalogo = false;
                this.showDetalle = false;
                this.showCarrito = true;
                if (this.carrito.length >0){
                    this.isCarrito = true;
                }else{
                    this.isCarrito = false;
                }
            },
            /**
             * Función para cargar los productos
             */
            cargaProductos(){
                this.isLoading = true
                let url;
                /** Comprobara si hay una categoria seleccionada o no */
                if(this.selectCategoria == ""){
                    url = "https://fakestoreapi.com/products";
                }else{
                    url = "https://fakestoreapi.com/products/category/"+this.selectCategoria;
                }
                fetch(url)
                    .then(response => {
                        
                        if (!response.ok) {
                            throw new Error('Error en la petición AJAX');
                        }
                        return response.json();
                    })
                    .then(data => {
                        this.productos = (data);
                        this.isLoading = false
                    })
                    .catch(error => {
                        console.error('Error al hacer la petición AJAX:', error);
                    });
            },
            /**
             * Función para cargar las categorias de productos
             */
            cargaCategorias(){
                this.isLoading = true
                fetch('https://fakestoreapi.com/products/categories')
                    .then(
                    res=>{
                        
                        if (!res.ok) {
                            throw new Error('Error en la petición AJAX');
                        }
                        
                        return res.json()})
                    .then(data=>{
                        this.categorias= (data);
                        this.isLoading = false
                    })
                    .catch(error =>{
                        console.error('Error al hacer la petición AJAX:', error);
                    })
            },
            /**
             * Función para cargar los detalles de un producto
             */
            cargaDetalle(){
                this.isLoading = true
                let url= "https://fakestoreapi.com/products/"+this.idSeleccionado;
                fetch(url)
                .then(
                  res=>{

                    if (!res.ok) {
                        throw new Error('Error en la petición AJAX');
                    }
                    
                    return res.json()})
                .then(data=>{
                    this.detalle= (data);
                    this.rate = "--rating: "+this.detalle.rating.rate;
                    this.isLoading = false
                })
                .catch(error =>{
                    console.error('Error al hacer la petición AJAX:', error);
                })                
            },
            /**
             * Función para añadir un producto al carrito
             */
            addCarrito(producto){
                if(this.cantidad>0){
                    let isProducto = false
                    let index = -1;
                    index = this.carrito.findIndex((element) => {
                        if(!isProducto){
                            if(element.product.id == producto.id){
                                isProducto = true;
                                return true;
                            }
                        }
                    })
                    if (isProducto) {
                        let cantidad = this.carrito[index].cantidad
                        cantidad += this.cantidad;
                        this.carrito[index].cantidad = cantidad;
                        this.carrito[index].total = this.carrito[index].product.price  * this.carrito[index].cantidad;
                    }else{
                        this.carrito.push({product:producto, cantidad:this.cantidad, total:producto.price*this.cantidad});
                    }
                    this.cantidad = 1; 
                    localStorage.setItem("carrito",JSON.stringify(this.carrito));
                }
            },
            /**
             * Función para aumentar la cantidad de un producto
             */
            addProduct(product){
                product.cantidad++;
                product.total = product.product.price * product.cantidad;
                localStorage.setItem("carrito",JSON.stringify(this.carrito));
            },
            /**
             * Función para restar la cantidad de un producto
             */
            substractProduct(producto){
                if(producto.cantidad > 1){
                    producto.cantidad--;
                    producto.total = producto.product.price * producto.cantidad;
                }else{
                    let index = -1;
                    let isProducto = false;
                    this.carrito.forEach(element => {
                        if(!isProducto){
                            if (element.product.id == producto.product.id) {
                                isProducto = true;
                            }
                            index++;
                        }
                    });
                    this.carrito = this.carrito.toSpliced(index,1)
                }
                this.verCarrito();
                localStorage.setItem("carrito",JSON.stringify(this.carrito));
            },
            /**
             * Función para eliminar un producto
             */
            remove(producto){
                producto.cantidad = 0
                this.substractProduct(producto);
            },
            /**
             * Función para volver al inicio
             */
            volverInicio(){
                this.showPrincipal=true;
                this.showCatalogo=false;
                this.showDetalle=false;
                this.showCarrito=false;
                this.check=false;
                this.carrito=[];
                this.orden= "";
                this.isCarrito=false;
                this.isPedido=false;
                localStorage.setItem("carrito",JSON.stringify(this.carrito));
            },
            /**
             * Función para hacer el pedido
             */
            finalizarPedido(){
                this.isPedido = true;
                setTimeout(this.volverInicio,3000)
            }
        },
        mounted() {
            this.cargaCategorias();
            carritoEnNavegador = localStorage.getItem("carrito");
            if(carritoEnNavegador){
                this.carrito = JSON.parse(carritoEnNavegador);
            }
        },
        computed:{
            carritoContados(){
                return this.carrito.length
            },
            total(){
                let total= 0;
                this.carrito.forEach(element=>total+=element.total)
                return total;
            },
            ordena(){
                if(this.orden != ""){
                    paraOrdenar = this.productos;
                    switch (this.orden) {
                        case "nombre__a-z":
                            aux = paraOrdenar.sort((a,b)=>{
                                if(a.title < b.title){
                                    return -1;
                                }
                                if(a.title>b.title){
                                    return 1;
                                }
                                return 0;
                            });
                            break;
                        case "nombre__z-a":
                            aux = paraOrdenar.sort((a,b)=>{
                                if(a.title < b.title){
                                    return 1;
                                }
                                if(a.title>b.title){
                                    return -1;
                                }
                                return 0;
                            });
                            break;
                        case "precio__descendente":
                            aux = paraOrdenar.sort((a,b)=>{
                                if(a.price < b.price){
                                    return 1;
                                }
                                if(a.price>b.price){
                                    return -1;
                                }
                                return 0;
                            });
                            break;
                        case "precio__ascendente":
                            aux = paraOrdenar.sort((a,b)=>{
                                if(a.price < b.price){
                                    return -1;
                                }
                                if(a.price>b.price){
                                    return 1;
                                }
                                return 0;
                            });
                            break;
                        default:
                            aux = this.productos;
                    }
                   
                }else{
                    aux = this.productos;
                }
                return aux;
            },
        }
    }).mount('#app')
}