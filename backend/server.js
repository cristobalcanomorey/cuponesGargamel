const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs')
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
    console.log(coupons[today]);
    console.log(today);
    if (!coupons[today]) {
        return res.json({ message: 'No hay cupón para hoy' });
    }
    res.json({ coupon: coupons[today] });
});

app.get('/api/unlocked-coupons', (req, res) => {
    const filteredCoupons = Object.values(coupons).filter(coupon => coupon.unlocked);
    console.log(filteredCoupons.length);
    if (!filteredCoupons.length){
        return res.json({ unlockedCoupons: filteredCoupons });
    }
    res.json({ unlockedCoupons: filteredCoupons });
});

// Endpoint para desbloquear el cupón (simula persistencia en archivo)
app.post('/api/unlock', (req, res) => {
    const today = dayjs().format() // Fecha actual
    coupons[today] = {
        ...coupons[today],
        unlocked: true, //Poner a true para simular desbloqueo
    };
    fs.writeFileSync(couponsPath, JSON.stringify(coupons, null, 2));
    res.json({ message: 'Cupón desbloqueado', coupon: coupons[today] });
});

// app.post('/api/activate-coupon', (req, res) => {
//     const { date } = req.body;
    
//     if (coupons[date]) {
//         coupons[date].activated = true;

//         // Guardar en el JSON (si lo estás usando como archivo)
//         fs.writeFileSync('./coupons.json', JSON.stringify(coupons, null, 2));

//         res.json({ message: "Cupón activado con éxito" });
//     } else {
//         res.status(404).json({ message: "Cupón no encontrado" });
//     }
// });

app.post('/api/activate-coupon', (req, res) => {
    const { date, password } = req.body;
    const correctPassword = process.env.COUPON_PASSWORD || "rECURSOSHUMANOS1!"; // Se guarda en variable de entorno
    console.log("Contraseña ingresada:", password);
    console.log("Contraseña correcta:", correctPassword);
    if (password !== correctPassword) {
        return res.status(403).json({ message: "Contraseña incorrecta" });
    }
console.log(coupons[date]);
    if (!coupons[date]) {
        return res.status(404).json({ message: "Cupón no encontrado" });
    }
    

    // Guardar en el JSON (si lo estás usando como archivo)
    fs.writeFileSync('./coupons.json', JSON.stringify(coupons, null, 2));
    coupons[date].activated = true;
    res.json({ message: "Cupón activado correctamente", coupon: coupons[date] });
});



// Servir frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
