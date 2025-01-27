import React, { useState } from 'react';
import './Gift.css'; // Importa el archivo de estilos
import initialGiftImage from './images/gift.gif';  // Imagen del regalo inicial
import openedGiftImage from './images/opened-gift.gif';  // Imagen del regalo después de hacer clic

function Gift({ onClick }) {
    // Estado para gestionar el cambio de GIF
    const [giftImage, setGiftImage] = useState(initialGiftImage);
    const [couponVisible, setCouponVisible] = useState(false);

    // Función que maneja el clic en el gif
    const handleClick = () => {
        // Cambiar el gif
        setGiftImage(openedGiftImage);

        console.log('Clic en el regalo');
        // Después de 2 segundos, mostrar el cupón
        setTimeout(() => {
            console.log('Mostrar cupón');
            setCouponVisible(true);
            // Ejecutar la función onClick que recibimos como props
            onClick();
        }, 1800);
    };

    return (
        <div className="gift-container" onClick={handleClick}>
            <img src={giftImage} alt="Regalo" className="gift" />
            {/* {couponVisible && (
                <div className="coupon">
                    <h1>¡Has desbloqueado un cupón de amistad!</h1>
                    <p>{coupon.text} 😊</p>
                </div>
            )} */}
        </div>
    );
}

export default Gift;
