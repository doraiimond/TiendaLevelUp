// Tests PUROS de Jasmine para la lógica del carrito
// Sin React, sin JSX, solo JavaScript puro

// Mock de localStorage
const createLocalStorageMock = () => {
    let store = {};
    return {
        getItem: function(key) {
            return store[key] || null;
        },
        setItem: function(key, value) {
            store[key] = value.toString();
        },
        removeItem: function(key) {
            delete store[key];
        },
        clear: function() {
            store = {};
        }
    };
};

const calcularTotal = function(carrito) {
    return carrito.reduce(function(total, producto) {
        const precio = Number(producto.precio) || 0;
        const cantidad = Number(producto.cantidad) || 1;
        return total + precio * cantidad;
    }, 0);
};

const agregarAlCarrito = function(carrito, producto) {
    const productoExistente = carrito.find(function(item) {
        return item.id === producto.id;
    });
    
    if (productoExistente) {
        return carrito.map(function(item) {
            return item.id === producto.id
                ? Object.assign({}, item, { cantidad: (item.cantidad || 1) + 1 })
                : item;
        });
    } else {
        return carrito.concat([Object.assign({}, producto, { cantidad: 1 })]);
    }
};

const actualizarCantidad = function(carrito, index, nuevaCantidad) {
    if (index < 0 || index >= carrito.length) return carrito;
    if (nuevaCantidad < 1) return carrito;

    return carrito.map(function(item, i) {
        return i === index ? Object.assign({}, item, { cantidad: nuevaCantidad }) : item;
    });
};

const eliminarDelCarrito = function(carrito, index) {
    if (index < 0 || index >= carrito.length) return carrito;

    return carrito.filter(function(_, i) {
        return i !== index;
    });
};

// TESTS CON JASMINE
describe('Lógica del Carrito de Compras', function() {
    
    let localStorageMock;
    
    beforeEach(function() {
        localStorageMock = createLocalStorageMock();
        if (typeof window !== 'undefined') {
            window.localStorage = localStorageMock;
        }
    });
    
    afterEach(function() {
        if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.clear();
        }
    });

    // === TESTS COMpletos ===

    it('Debe calcular correctamente el total con un solo producto', function () {
        const carrito = [{ precio: 10000, cantidad: 2 }];
        expect(calcularTotal(carrito)).toBe(20000);
    });

    it('Debe calcular correctamente el total con múltiples productos', function () {
        const carrito = [
            { precio: 5000, cantidad: 1 },
            { precio: 2000, cantidad: 3 }
        ];
        expect(calcularTotal(carrito)).toBe(11000);
    });

    it('Debe agregar un nuevo producto al carrito', function () {
        const carrito = [];
        const resultado = agregarAlCarrito(carrito, { id: '1', precio: 1000 });
        expect(resultado.length).toBe(1);
        expect(resultado[0].cantidad).toBe(1);
    });

    it('Debe aumentar la cantidad si se agrega un producto existente', function () {
        const carrito = [{ id: '1', precio: 1000, cantidad: 1 }];
        const resultado = agregarAlCarrito(carrito, { id: '1', precio: 1000 });
        expect(resultado[0].cantidad).toBe(2);
    });

    it('Debe actualizar la cantidad de un producto', function () {
        const carrito = [{ id: '1', cantidad: 1 }];
        const resultado = actualizarCantidad(carrito, 0, 5);
        expect(resultado[0].cantidad).toBe(5);
    });

    it('Debe eliminar un producto por índice', function () {
        const carrito = [{ id: '1' }, { id: '2' }];
        const resultado = eliminarDelCarrito(carrito, 0);
        expect(resultado.length).toBe(1);
        expect(resultado[0].id).toBe('2');
    });

});
