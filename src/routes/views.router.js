import express from 'express'
//importo la instancia ya creada.
//import { productManager } from './products.router.js'
import { ProductManager } from '../controllers/product-manager-db.js'

import { io } from '../app.js'
export const router = express.Router()
import { promises as fsPromises } from 'fs';

const productManager = new ProductManager()


router.get('/', async (req,res)=>{
    try{
        const products = await productManager.getProducts()
        //Mapeo para poder renderizar en handlebars
        const mappedProducts = products.map(item => ({
            id: item.id, 
            title: item.title,
            description: item.description,
            price: item.price,
            img: item.img,
            code: item.code,
            category: item.category,
            stock: item.stock,
            status: item.status,
            thumbnails: item.thumbnails
        }))

        res.render('home',{productsList:mappedProducts})
    }
    catch(error){
        console.log(error)
        res.status(500).render('error', { errorMessage: 'Error interno del servidor' });
    }
})
 

//En esta funcion no hay problema con el mapeo de handlebars xq trabaja por dom
router.get('/realtimeproducts',(req,res)=>{

    //Me conecto------------------------------------
    io.on("connection", async (socket)=>{
        //Envio los productos
        //Con este evento envio la lista de productos.
        socket.emit('eventProducts',await productManager.getProducts())

        //Cuando escuche el evento addProduct 
        socket.on('addProduct',async(productObject,fileNamePathInServer)=>{
            //Guardo el producto y uso el objeto con informacion que me devuelve addProduct 
            //Solo activo el evento 'eventProducts si salio todo OK'
            const responseAddProduct = await productManager.addProduct(productObject) //agrega pruducto
            //Ahora le mando al cliente 2 mensajes. EL mensaje del resultado y la lista de productos.
            if (responseAddProduct.success){
                socket.emit('resultAddMessage',responseAddProduct.message)
                //Falta subir la imagen a public  y eso sera escuchar un evento enviado desde realtimeproducts con la imagen cargada y nuevo nombre
                socket.emit('eventProducts',await productManager.getProducts()) //manda lista
            }
            else{ //Si no se agrego el producto solo el mensaje y borro el archivo en mi server local.
                socket.emit('resultAddMessage',responseAddProduct.message)
                await fsPromises.unlink(process.cwd() + '/src/public/'  + fileNamePathInServer);
                //No hago eventProducts para no hacer solicitud innecesaria ya que el catalogo no cambio.
            }
        })

        //Cuando escuche deleteProducts.
        socket.on('deleteProduct',async(data)=>{
            //console.log('Id que llego: ',data)
            //Borra el producto de la BD pero si borramos el producto tmb necesito borrar su imagen de mi server
            const responseDeleteProduct = await productManager.deleteProduct(data) 
            if (responseDeleteProduct.success){
                //Si salio todo OK borro el archivo envio mensaje al cliente y luego le envio la nueva lista de productos
                await fsPromises.unlink(process.cwd() + '/src/public/'  + responseDeleteProduct.imgpath);
                socket.emit('resultDeleteMessage',responseDeleteProduct.message)
                socket.emit('eventProducts',await productManager.getProducts()) //manda lista
            }
            else{
                //Pero si algo fallo, o sea no se borro el producto porque no se encontro emito mensahe tambien.
                socket.emit('resultDeleteMessage',responseDeleteProduct.message)
            }


          

        })

     


    })

    
    res.render("realTimeProducts")
})

