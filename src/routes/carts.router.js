

import express from 'express'
//import { cartsManager } from '../controllers/carts-manager.js'
//Importo la instancia que maneja productos que esta activa ya.
//import { productManager } from './products.router.js'
import { ProductManager } from '../controllers/product-manager-db.js'
import { CartsManager } from '../controllers/carts-manager-db.js'
//Manejo de los recursos de mi servidor
//const PATHFILECARTS = './src/models/carrito.json'
//const myCartsManager = new cartsManager(PATHFILECARTS)
const productManager = new ProductManager()
const cartsManager = new CartsManager()
//Creo mi instancia de objeto Router
export const router = express.Router()


router.get('/api/carts/:cid',async (req,res)=>{
    //Esta ruta devuelve un carrito
    const {cid} = req.params
    try {
        const response = await cartsManager.getCartById(cid)
        if (response.success){
        console.log('Require cart', response)
        res.json({cartId: response.cart._id, products: response.cart.products})
       }
       else{
        res.send(response.message)
       }
    } catch (error) {
        console.log(`Error al obtener carrito id ${cid}!.`, error)
        res.status(500).json({error: 'Error del servidor'})
    }
})

router.post('/api/carts',async (req,res)=>{
    //Esta ruta simplemente crea un carrito.
    try{
        const newCart = await cartsManager.createCart()
        res.json(newCart)
        }
    catch(error){
        console.log('Error al crear carrito !.', error)
        res.status(500).json({error: 'Error del servidor'})
    }

  
})


router.post('/api/carts/:cid/products/:pid',async(req,res)=>{
    
    const {cid:cartId,pid:productId} = req.params
    console.log('Desde postman: ',req.params)
       
    try{
        const response = await cartsManager.addProductInCart(cartId,productId,1)
        if (response.success){
            console.log(response.success)
            res.json({cartId: response.cart._id, products: response.cart.products})
        }
        else{
            res.send(response.message)
        }
       
    }
    catch{
        console.log('Error al ingresar el producto carrito !.', error)
        res.status(500).json({error: 'Error del servidor'})
    }
    
})

