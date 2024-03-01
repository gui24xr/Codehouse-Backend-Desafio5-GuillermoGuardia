import express  from "express";
import { configHandlebars } from "./config/handlebars-config.js"
import { initSocket } from "./config/socket-config.js"
import { initDataBaseConnection } from "./database.js"

// Importacion de rutas.
import {router as routerViews} from './routes/views.router.js'
import {router as routerTest} from './routes/testspages.router.js'
import {router as routerCarts } from './routes/carts.router.js'
import {router as routerProducts} from './routes/products.router.js'

//crecion de instancia de express.
const PUERTO = 8080
export const app = express()
//Pongo a funcionar la conexion a la BD.
initDataBaseConnection()
//Ejecuto la funcion de configuracion de handlebars.
configHandlebars()


//Configuracion carpeta public
app.use(express.static('./src/public'));



//Middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))
//app.use(upload)


//Routes : le decimos a la app de express que debe usar las rutas de los router
app.use('/',routerViews)
app.use('/',routerTest)
app.use('/',routerCarts) 
app.use('/',routerProducts)


//Creo una referencia y pongo el server a escuchar en puerto 8080.
const httpServer = app.listen(PUERTO,()=>{
    console.log(`Escuchando en puerto ${PUERTO}`)
})

//Configuracion e inicio de websockets.
initSocket(httpServer)


//Conexion por sockets.
//export const io = new Server(httpServer)
