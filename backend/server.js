const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Simulamos la base de datos con un archivo JSON
const couponsPath = path.join(__dirname, 'data', 'coupons.json');
let coupons = require('./data/coupons.json');

// Endpoint para obtener el cupón del día
app.get('/api/coupon', (req, res) => {
    const today = new Date().toISOString().split('T')[0]; // Fecha actual
    if (!coupons[today]) {
        return res.status(404).json({ message: 'No hay cupón para hoy' });
    }
    res.json({ coupon: coupons[today] });
});

app.get('/api/unlocked-coupons', (req, res) => {
    const filteredCoupons = Object.values(coupons).filter(coupon => coupon.unlocked);
    res.json({ unlockedCoupons: filteredCoupons });
});

// Endpoint para desbloquear el cupón (simula persistencia en archivo)
app.post('/api/unlock', (req, res) => {
    const today = new Date().toISOString().split('T')[0]; // Fecha actual
    coupons[today] = {
        ...coupons[today],
        unlocked: true, //Poner a true para simular desbloqueo
    };
    fs.writeFileSync(couponsPath, JSON.stringify(coupons, null, 2));
    res.json({ message: 'Cupón desbloqueado', coupon: coupons[today] });
});

// Servir frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
