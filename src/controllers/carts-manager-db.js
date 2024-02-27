import { CartModel } from "../models/cart.model.js"

export class CartsManager{

    async createCart(){
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
        try {
            const searchedCart = await CartModel.findById(id)
            if (!searchedCart){
                console.log(`No se encuentra un carrito con id ${id}.`)
                return
            }
            return searchedCart
        } catch (error) {
            console.log('Error al obtener carrito por id.',error)
            throw error
        }
    }

    async addProductInCart(cartId,productId, quantity){
        try{//Obtengo el carrito de ID
            const searchedCart = await this.getCartById(productId)
            //Existe en este carro el producto que quiero agregar? //fin devuelve el array ncontrado
            const existProductInCart = searchedCart.products.find(item => item.product.toString() == productId )

            if (existProductInCart){
                //Si existe aumento la cantidad
                existProductInCart.quantity += quantity
            }
            else{
                searchedCart.products.push({product:productId,quantity:quantity })
            }

            //marco como modificado
            searchedCart.markModified("products")
            await searchedCart.save()
            return searchedCart


        }catch (error) {
            console.log('Error al agregar productos al carrito..',error)
            throw error
        }
    }
}