

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


router.get('/api/carts/:cid',(req,res)=>{
    //Esta ruta devuelve un carrito
    
   const {cid} = req.params
    //Pido el carro al manager y como se que devuelve undefined si no lo encuentra.
    if (cartsManager.existCart(cid)){
        const products = cartsManager.getProducsFromCart(cid)
        res.json({'Carro ID':cid,'Lista de productos':products})
    }
    else{
        res.send(`No existe el carro id ${cid}`)
    }

    try {
        
    } catch (error) {
        
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
    /*
    Me pide agregar el producto de pid al cart de cartId
    */
    try{
        const {cid:cartId,pid:productId} = req.params
        //Obtengo el productos.
        //const productToAdd = await productManager.getProductById(productId)
        //Agrego el producto en cantidad 1
        await cartsManager.addProductInCart(cartId,productId,1)
        
        res.send('taca')
    }
    catch{
        console.log('Error al ingresar el producto carrito !.', error)
        res.status(500).json({error: 'Error del servidor'})
    }
})

