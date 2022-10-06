/* ============= INICIO DE ROUTEO ============= */
import express from 'express';
const routerProductosTest = express.Router();
import { productoMock } from '../mocks/producto.mock.js'

/* ============ Creacion de objeto ============ */
const caja = new productoMock();

/* ============= Routing y metodos ============= */
routerProductosTest.get('/', (req, res) => {
    let PRODUCTOS = caja.generarDatos()
    console.log(PRODUCTOS)
    res.render('productos-test')
})

/* ============= Error de Routing ============= */
routerProductosTest.get('*', (req, res) => {
    res.status(404).json({ error : -2, descripcion: `ruta ${req.path} método ${req.method} no implementado`})
})
routerProductosTest.post('*', (req, res) => {
    res.status(404).json({ error : -2, descripcion: `ruta ${req.path} método ${req.method} no implementado`})
})
routerProductosTest.delete('*', (req, res) => {
    res.status(404).json({ error : -2, descripcion: `ruta ${req.path} método ${req.method} no implementado`})
})
routerProductosTest.put('*', (req, res) => {
    res.status(404).json({ error : -2, descripcion: `ruta ${req.path} método ${req.method} no implementado`})
})

/* =========== Exportacion de modulo =========== */
export default routerProductosTest;