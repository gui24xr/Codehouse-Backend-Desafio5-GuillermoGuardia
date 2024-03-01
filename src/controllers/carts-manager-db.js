import { CartModel } from "../models/cart.model.js"
import mongoose from "mongoose"

export class CartsManager{

    async createCart(){
        //Crea un carrito en nuestra BD. Saliendo todo OK retorna el carrito creado.
        try {
            const newCart = new CartModel({products:[]})
            await newCart.save()
            return newCart
        } catch (error) {
            console.log('Error al crear carrito.',error)
            throw error
        }
    }

    async getCartById(id){
    /*Esta funcionretorna el carrito pasado por parametro y Retorna un objeto asi:
    {success: true/false, message: '', cart: carrito solicitado/null}*/
        try {
            //Si no es un ID valido de mongo salgo con success false.
            if (!mongoose.Types.ObjectId.isValid(id)) {
                console.log(`El valor proporcionado (${id}) no es un ObjectId válido.`);
                return {
                    success: false, 
                    message: `El valor proporcionado (${id}) no es un ObjectId válido.`, 
                    cart: null
                    }
            }
            //Busco el carro por id.
            const searchedCart = await CartModel.findById(id)
            //Si no obtengo resultado salgo.
            if (!searchedCart){
                console.log(`No se encuentra un carrito con id ${id}.`)
                return {
                    success: false, 
                    message: `No existe un carrito con el valor proporcionado (${id}).`, 
                    cart: null
                }
            }
            //Si obtengo resultado favorable devuelvo mi objeto con success,mensaje y carro.
            return {
                success: true, 
                message: `Operacion realizada con exito...`, 
                cart:searchedCart
            }
        } catch (error) {
            console.error('Error al obtener carrito por id.', error);
            return { 
                success: false, 
                message: 'Error al obtener carrito por id.', error, 
                cart: null 
            }
        }
    }

    
async addProductInCart(cartId,productId,quantity){
     /*Esta funcion agrega el  product Id pasado por parametro al carrito pasado por parametro y Retorna un objeto asi:
    {success: true/false, message: '', cart: carrito actualizado/null}*/
    
    //En este caso tmb deberiamos ver que productId es valido ya que estamos con mongo
    //Busco el carrito donde voy a agregar el producto y la cantidad.
    try{
        const response = await this.getCartById(cartId)
        //Si no encontro el carrito o hubo un error salimos mostrando el mensaje correspondiente.
        if (!response.success){
            console.log(`El cartId proporcionado (${cartId}) no existe o no es un ObjectId válido.`);
            return {
                success: false, 
                message: response.message, //Enviamos el mensaje que nos dio getCartById
                cart: null
                }
        }
        else{
            //Si se encontro el carrito vamos a proceder a agregar el nuevo producto y/o actualizar la cantidad.
            //Trabajo con el carrito encontrado.
            const searchedCart = response.cart //Trabajo con searchedCart por comodidad
            const existProductInCart = searchedCart.products.some(item => item.product.toString() == productId )
            //Find devuelve undefined si no encuentra elemento que cumpla condicion o sea no existe el producto.
            //Find devuelve la primer coinciddencia


            if (existProductInCart){
               
                console.log('ya hay un producto con ese ID hay que aumwentar cantidad...')
                //existProductInCart.quantity += quantity
                //busco la posicion del array a modificar
                const position = searchedCart.products.findIndex(item => item.product.toString() == productId )
                searchedCart.products[position].quantity +=1
            }
            else{
              //Agrego el producto si no exciste en el carro
               searchedCart.products.push({product:productId,quantity:quantity} )
            } 

            //Actualizo en la BD
            searchedCart.markModified("products")
            await searchedCart.save()
           //AHora retorno xq salio todo OK          
            return {
                success: true, 
                message: 'Se agrego producto...', //Enviamos el mensaje que nos dio getCartById
                cart: searchedCart
                }
            }
        }
        catch(error){
            console.error('Error al obtener carrito por id.', error);
            return { 
                success: false, 
                message: 'Error al obtener carrito por id (Desde add).', error, 
                cart: null 
            }
        }
    }
}
