/*=================== MODULOS ===================*/
import express from 'express';
import exphbs from 'express-handlebars';
import path from 'path';
import morgan from 'morgan';
import util from 'util'
import { ContenedorSQLite } from './src/container/ContenedorSQLite.js';
import { ContenedorFirebase } from "./src/container/ContenedorFirebase.js";
import { productoMock } from './src/mocks/producto.mock.js';
import { Server as HttpServer } from 'http';
import { Server as IOServer }  from 'socket.io';


/*=== Instancia de Server, contenedor y rutas ===*/
const app = express();
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
const cajaMensajes = new ContenedorFirebase('mensajes');
const cajaProducto = new ContenedorSQLite('productos');
import routerProductos from './src/routes/productos.routes.js';
import routerInitial from './src/routes/initial.routes.js'
import routerProductosTest from './src/routes/productosTest.routes.js'



/*================= Middlewears =================*/
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(express.static('./public'))


/*============= Motor de plantillas =============*/
app.engine('hbs', exphbs.engine({
    defaulyLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: 'hbs'
}))
app.set('views', path.join('views'))
app.set('view engine', 'hbs')


/*==================== Rutas ====================*/
app.use('/', routerInitial)
app.use('/api/productos', routerProductos);
app.use('/api/productos-test', routerProductosTest);
app.use('*', (req, res) => {
    res.send({error: 'Producto no encontrado'})
})

/*================== Servidor ==================*/
const PORT = 8080;
const server = httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${server.address().port}`)
})
server.on('error', error => console.log(`Error en el servidor: ${error}`))


io.on('connection', async (socket)=>{
    const DB_MENSAJES = await listarMensajesNormalizados()
    const DB_PRODUCTOS = await cajaProducto.listarAll()
    console.log(`Nuevo cliente conectado -> ID: ${socket.id}`)
    io.sockets.emit('from-server-message', DB_MENSAJES)
    io.sockets.emit('from-server-product', DB_PRODUCTOS)
    
    socket.on('from-client-message', async mensaje => {
        await cajaMensajes.save(mensaje)
        const MENSAJES = await cajaMensajes.getAll()
        io.sockets.emit('from-server-message', {MENSAJES})
    })

    //socket.emit('mensajes', await listarMensajesNormalizados())

    socket.on('from-client-product', async product => {
        await cajaProducto.insertar(product)
        const PRODUCTOS = await cajaProducto.listarAll()
        io.sockets.emit('from-server-product', PRODUCTOS)
    })
})

/*=============== Normalizacion de datos ===============*/
import { normalize, schema } from 'normalizr';

const schemaAuthors = new schema.Entity('authors', {}, {idAttribute: 'email'})
const schemaMensaje = new schema.Entity('post', {author: schemaAuthors})
const schemaMensajes = new schema.Entity('posts', {mensajes: [schemaMensaje]}, {idAttribute: 'id'})

const normalizarMensajes = (mensajesConId) => normalize(mensajesConId, schemaMensajes)

async function listarMensajesNormalizados () {
    const mensajes = await cajaMensajes.getAll()
    console.log(mensajes)
    console.log(`Los mensajes sin normalizar: ${JSON.stringify(mensajes).length}`) 
    const normalizados = normalizarMensajes ({id: 'mensajes', mensajes})
    console.log(`Los mensajes normalizados: ${JSON.stringify(normalizados).length}`) 
    print(normalizados)
    return normalizados
}

function print(obj) {
    console.log(util.inspect(obj, false, 12, true))
}