
import express  from "express";
import * as database from './database.js'
import exphbs from 'express-handlebars'
import multer from "multer";
import {Server} from 'socket.io'
import fs from 'fs'

// Importacion de rutas.
import {router as routerViews} from './routes/views.router.js'
import {router as routerTest} from './routes/testspages.router.js'
import {router as routerCarts } from './routes/carts.router.js'
import {router as routerProducts} from './routes/products.router.js'

import cors from "cors"
import bodyParser from 'body-parser'

//crecion de instancia de express.
const PUERTO = 8080
const app = express()

//Configuracion handlebars
//handlebars configuration.
app.engine("handlebars", exphbs.engine())
app.set("view engine", "handlebars")
app.set("views","./src/views")



//Configuracion carpeta public
app.use(express.static('./src/public'));

//Configuracion de multer para que guarde el archivo es images con el nombre que ya viene
//aunque previamante haremos que cuando se suba tenga un nombre unico pero esto es independite a multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destinationFolder = './src/public/img';
    // Verificar si la carpeta de destino existe, si no, crearla
    if (!fs.existsSync(destinationFolder)) {
      fs.mkdirSync(destinationFolder, { recursive: true });
    }
    cb(null, destinationFolder);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({storage})

//Middlewares
app.use(bodyParser.json());
app.use(express.json())
app.use(express.urlencoded({extended:true}))
//app.use(upload)


//Routes : le decimos a la app de express que debe usar las rutas de los router
app.use('/',routerViews)
app.use('/',routerTest)
app.use('/',routerCarts) 
app.use('/',routerProducts)

app.post('/upload', upload.single('file'), (req, res) => {
  const nombreArchivo = req.file.filename;
  console.log('Archivo subido con éxito. Nombre en el servidor:', nombreArchivo);
  // Respondemos con el nombre del archivo en el cuerpo de la respuesta
  res.status(200).json({ filename: nombreArchivo });
});


//Creo una referencia y pongo el server a escuchar en puerto 8080.
const httpServer = app.listen(PUERTO,()=>{
    console.log(`Escuchando en puerto ${PUERTO}`)
})

export const io = new Server(httpServer)
