import exphbs from 'express-handlebars'
import { app } from "../app.js";



function configHandlebars(){

    //Configuracion handlebars
    app.engine("handlebars", exphbs.engine())
    app.set("view engine", "handlebars")
    app.set("views","./src/views")
}

export {configHandlebars}