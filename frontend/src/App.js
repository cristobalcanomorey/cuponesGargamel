import React, { useEffect, useState } from 'react';
import Gift from './Gift';
import Cookies from "js-cookie"; // Necesitas instalar js-cookie con `npm install js-cookie`
import './App.css';

function App() {
    const [coupon, setCoupon] = useState(null); // Cupón de hoy
    const [unlockedCoupons, setUnlockedCoupons] = useState([]); // Lista de cupones desbloqueados
    const [showTodayCoupon, setShowTodayCoupon] = useState(false); // Indica si mostramos el cupón de hoy recién desbloqueado
    const [showCouponDetail, setShowCouponDetail] = useState(false);
    const [fichaCoupon, setFichaCoupon] = useState(null);

    // Cargar los datos iniciales
    useEffect(() => {
        // Obtener el cupón de hoy
        fetch('/api/coupon')
            .then((res) => res.json())
            .then((data) => setCoupon(data.coupon))
            .catch(() => setCoupon(data.message));

        // Obtener la lista de cupones desbloqueados
        fetch('/api/unlocked-coupons')
            .then((res) => res.json())
            .then((data) => setUnlockedCoupons(data.unlockedCoupons))
            .catch(() => setUnlockedCoupons([]));
    }, []);

    // Desbloquear el cupón de hoy
    const unlockCoupon = () => {
        fetch('/api/unlock', { method: 'POST' })
            .then((res) => res.json())
            .then((data) => {
                setCoupon(data.coupon);
                setShowTodayCoupon(true); // Mostrar el cupón desbloqueado

                // Guardar en cookies
                const updatedCoupons = [...getUnlockedCouponsFromCookies(), data.coupon];
                saveUnlockedCouponsToCookies(updatedCoupons);
                // Actualizar la lista de cupones desbloqueados
                fetch('/api/unlocked-coupons')
                    .then((res) => res.json())
                    .then((data) => setUnlockedCoupons(data.unlockedCoupons))
                    .catch(console.error);
            })
            .catch(console.error);
    };

    const toggleShowAllCoupons = () => {
        setShowTodayCoupon(false); // Volver a la vista de todos los cupones desbloqueados
    };

    const viewCouponDetail = (selectedCoupon) => {
        setFichaCoupon(selectedCoupon);
        setShowCouponDetail(true);
    }

    const activateCoupon = () => {
        const password = prompt("Introduce la contraseña para activar este cupón:");
        if (!password) return;
        let coup = null;
        if (fichaCoupon){
            coup = fichaCoupon;
        } else if (coupon){
            coup = coupon;
        }
    
        const phoneNumber = "34609512301"; 
        const message = `¡Hola! Quiero canjear el cupón: "${coup.text}".`;
        const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
        fetch('/api/activate-coupon', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date: coup.date, password }) 
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Contraseña incorrecta");
            }
            return res.json();
        })
        .then(data => {
            console.log(data.message);
            setFichaCoupon({ ...fichaCoupon, activated: true });
            window.open(whatsappLink, "_blank");
        })
        .catch(error => {
            alert(error.message);
        });
    };
    
    
    const saveUnlockedCouponsToCookies = (coupons) => {
        Cookies.set("unlockedCoupons", JSON.stringify(coupons), { expires: 30 }); // Guardar por 30 días
    };
    
    const getUnlockedCouponsFromCookies = () => {
        const stored = Cookies.get("unlockedCoupons");
        return stored ? JSON.parse(stored) : [];
    };

    return (
        <div className="App">
            {coupon && !coupon.unlocked ? (
                // Mostrar el regalo si el cupón de hoy no está desbloqueado
                <div class="unlock">
                    <h1>Cupones Gargamel</h1>
                    <h3>¡Tu regalo está listo!</h3>
                    <Gift onClick={unlockCoupon} />
                    <p>¡Toca el regalo para conseguir tu cupón!</p>
                </div>
            ) : showTodayCoupon ? (
                // Mostrar el cupón de hoy recién desbloqueado
                <div class="coupon">
                    <h1>Cupones Gargamel</h1>
                    <h3>¡Felicidades!</h3>
                    <p>Has desbloqueado un cupón de amistad! 😊</p>
                    <div class="flex o-hidden">
                        <img class="couponimg" src={process.env.PUBLIC_URL + coupon.image}/>
                        <div class="flex col w-auto">
                            <h3 class="m-auto">{coupon.text}</h3>
                            {/* <div class="m-auto ps-5">{coupon.description}</div> */}
                            {/* <button class="activar"></button> */}
                        </div>
                    </div>
                    {/* <h2>{coupon.text} </h2> */}
                    {/* {coupon.image && <img class="couponimg" src={process.env.PUBLIC_URL + coupon.image} alt={coupon.text} />} */}
                    <button onClick={toggleShowAllCoupons}>
                        De acuerdo
                    </button>
                </div>
            ) : showCouponDetail && fichaCoupon ? (
                <div class="coupon flex col ficha">
                    <img class="couponbannerimg" src={process.env.PUBLIC_URL + fichaCoupon.image}/>
                    <div>
                        <h3>{fichaCoupon.text}</h3>
                        <p>Este cupón es para ti:</p>
                        <p>{fichaCoupon.description}</p>
                        <p>{fichaCoupon.rules}</p>
                    </div>
                    <div class="flex">
                        <button onClick={fichaCoupon.activated ? () => {} : () => activateCoupon()} class={fichaCoupon.activated ? 'activado' : 'activar'}>{fichaCoupon.activated ? "Activado" : "Activar"}</button>
                        <div onClick={() => setShowCouponDetail(false)} class="volver"><i class="fa-solid fa-arrow-left"></i></div>
                    </div>
                </div>
            ) : (
                // Mostrar la lista de cupones desbloqueados
                <div class="unlocked-coupons">
                    <h1>Cupones desbloqueados:</h1>
                    {unlockedCoupons.length === 0 ? ( 
                        <p>No hay cupones desbloqueados.</p> 
                    ) : (
                        <ul>
                            {unlockedCoupons.map((coupon, index) => (
                                <li key={index}>
                                    <div class="flex o-hidden">
                                        <img onClick={() => viewCouponDetail(coupon)} class="couponimg" src={process.env.PUBLIC_URL + coupon.image}/>
                                        <div class="flex col w-auto">
                                            <h3 onClick={() => viewCouponDetail(coupon)} class="m-auto">{coupon.text}</h3>
                                            {/* <div class="m-auto ps-5">{coupon.description}</div> */}
                                            <button onClick={coupon.activated ? () => {} : () => activateCoupon()} class={coupon.activated ? 'activado' : 'activar'}>{coupon.activated ? "Activado" : "Activar"}</button>
                                        </div>
                                    </div>
                                                                    
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;
