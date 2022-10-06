/* ============= INICIO DE ROUTEO ============= */
import express from 'express';
const routerInitial = express.Router();

/* ============ Creacion de objeto ============ */
import { ContenedorSQLite } from '../container/ContenedorSQLite.js';
import { ContenedorFirebase } from "../container/ContenedorFirebase.js";
import { productoMock } from '../mocks/producto.mock.js';
const cajaMensajes = new ContenedorFirebase('mensajes');
const cajaProducto = new ContenedorSQLite('productos');
const cajaRandom = new productoMock();

/* ============= Routing y metodos ============= */
routerInitial.get('/', async (req, res) => {
    const DB_PRODUCTOS = await cajaProducto.listarAll()
    const DB_MENSAJES = await cajaMensajes.getAll()
    res.render('vista', {DB_PRODUCTOS, DB_MENSAJES})
})

routerInitial.get('/api/productos-test', async (req, res) => {
    let productos = cajaRandom.generarDatos()
    res.render('productos-test', {productos})
})

/* ============= Error de Routing ============= */
routerInitial.get('*', (req, res) => {
    res.status(404).json({ error : -2, descripcion: `ruta ${req.path} método ${req.method} no implementado`})
})
routerInitial.post('*', (req, res) => {
    res.status(404).json({ error : -2, descripcion: `ruta ${req.path} método ${req.method} no implementado`})
})
routerInitial.delete('*', (req, res) => {
    res.status(404).json({ error : -2, descripcion: `ruta ${req.path} método ${req.method} no implementado`})
})
routerInitial.put('*', (req, res) => {
    res.status(404).json({ error : -2, descripcion: `ruta ${req.path} método ${req.method} no implementado`})
})

/* =========== Exportacion de modulo =========== */
export default routerInitial;