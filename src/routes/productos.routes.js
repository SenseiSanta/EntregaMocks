/* ============= INICIO DE ROUTEO ============= */
import express from 'express';
const routerProductos = express.Router();
import { Contenedor } from '../container/Contenedor.js'

/* ============ Creacion de objeto ============ */
const caja = new Contenedor('DB/products.json');

/* ============= Routing y metodos ============= */
routerProductos.get('/', async (req, res) => {
    res.status(200).send(await caja.getAll());
})

routerProductos.get('/:id', async (req, res) => {
    const id = parseInt(req.params['id']);
    res.status(200).send(await caja.getById(id));
}) 

routerProductos.put('/:id', async (req, res) => {
    const id = parseInt(req.params['id']);
    let { producto, precio, img } = req.body;
    const actualizado = await caja.updateById(id, producto, precio, img)
    if (actualizado) {
        res.status(201).json({msg: 'Actualizado con exito', data: req.body});
    } else {
        res.status(400).json({error: 'No se actualizo nada: Producto no encontrado'})
    }
})

routerProductos.post('/', async (req, res) => {
    console.log(await caja.save(req.body)) 
    res.status(201).json({msg: 'Agregado', data: req.body})
})

routerProductos.delete('/:id', async (req, res) => {
    const id = parseInt(req.params['id']);
    const eliminado = await caja.deleteById(id)
    if (eliminado) {
        res.status(200).json({msg: 'Eliminado con exito'});
    } else {
        res.status(400).json({error: 'No se elimino nada: Producto no encontrado'})
    }
})

/* ============= Error de Routing ============= */
routerProductos.get('*', (req, res) => {
    res.status(404).json({ error : -2, descripcion: `ruta ${req.path} método ${req.method} no implementado`})
})
routerProductos.post('*', (req, res) => {
    res.status(404).json({ error : -2, descripcion: `ruta ${req.path} método ${req.method} no implementado`})
})
routerProductos.delete('*', (req, res) => {
    res.status(404).json({ error : -2, descripcion: `ruta ${req.path} método ${req.method} no implementado`})
})
routerProductos.put('*', (req, res) => {
    res.status(404).json({ error : -2, descripcion: `ruta ${req.path} método ${req.method} no implementado`})
})

/* =========== Exportacion de modulo =========== */
export default routerProductos;