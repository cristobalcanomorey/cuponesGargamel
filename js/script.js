

window.addEventListener('load', function () {
    // Cupones (en formato texto plano, que luego ciframos)
    const coupons = [
        "Vale por un abrazo",
        "Vale por un café juntos",
        "Vale por una llamada",
        "Vale por una tarde de juegos",
        "Vale por una cena sorpresa",
        // ... más cupones
    ];
    
    // Ciframos los cupones en Base64
    const encryptedCoupons = coupons.map(coupon => btoa(coupon)); // btoa() convierte a Base64

    // Detectamos la fecha actual
    const today = new Date().getDate();
    // Elementos del DOM
    const giftBox = document.getElementById('gift-box');
    const couponSection = document.getElementById('coupon-section');
    const couponDiv = document.getElementById('coupon');
    const unlockedCouponsDiv = document.getElementById('unlocked-coupons');

    // Controla los cupones desbloqueados
    let unlockedCoupons = JSON.parse(localStorage.getItem('unlockedCoupons')) || [];

    // Función para descifrar el cupón
    function decryptCoupon(encryptedCoupon) {
    return atob(encryptedCoupon); // atob() convierte de Base64 a texto plano
    }

    // Muestra la animación del regalo y desbloquea el cupón
    giftBox.addEventListener('click', () => {
    giftBox.classList.remove('gift-closed');
    giftBox.classList.add('gift-open');
    setTimeout(() => {
        couponSection.style.display = 'block';
        const encryptedCoupon = encryptedCoupons[today - 1]; // Cupón cifrado del día
        const decryptedCoupon = decryptCoupon(encryptedCoupon); // Descifra el cupón
        couponDiv.innerText = decryptedCoupon;
        if (!unlockedCoupons.includes(decryptedCoupon)) {
        unlockedCoupons.push(decryptedCoupon);
        localStorage.setItem('unlockedCoupons', JSON.stringify(unlockedCoupons));
        renderUnlockedCoupons();
        }
    }, 1000); // Espera para la animación
    });

    // Renderiza los cupones desbloqueados
    function renderUnlockedCoupons() {
    unlockedCouponsDiv.innerHTML = '';
    unlockedCoupons.forEach((coupon, index) => {
        const couponElement = document.createElement('div');
        couponElement.className = 'coupon';
        couponElement.innerText = coupon;
        couponElement.addEventListener('click', () => {
        if (!couponElement.classList.contains('used')) {
            alert(`Cupón activado: ${coupon}`);
            couponElement.classList.add('used');
        }
        });
        unlockedCouponsDiv.appendChild(couponElement);
    });
    }

    // Carga inicial
    renderUnlockedCoupons();

})


  