import React, { useEffect, useState } from 'react';
import Gift from './Gift';
import './App.css';

function App() {
    const [coupon, setCoupon] = useState(null);
    const [unlockedCoupons, setUnlockedCoupons] = useState([]);

    useEffect(() => {
        fetch('/api/coupon')
            .then((res) => res.json())
            .then((data) => setCoupon(data.coupon))
            .catch(() => setCoupon(null));
        
        fetch('/api/unlocked-coupons')
            .then((res) => res.json())
            .then((data) => setUnlockedCoupons(data.unlockedCoupons))
            .catch(() => setUnlockedCoupons([]));
    }, []);

    const unlockCoupon = () => {
        fetch('/api/unlock', { method: 'POST' })
            .then((res) => res.json())
            .then((data) => setCoupon(data.coupon))
            .catch(console.error);
    };

    const getUnlockedCoupons = () => {
        fetch('/api/unlocked-coupons')
            .then((res) => res.json())
            .then((data) => setUnlockedCoupons(data.unlockedCoupons))
            .catch(console.error);
    };

    return (
        <div className="App">
            {coupon ? (
                coupon.unlocked ? (
                    <div className="coupon">
                        <h1>¡Has desbloqueado un cupón de amistad!</h1>
                        <h2>{coupon.text} 😊</h2>
                        
                    </div>
                ) : (
                    <Gift onClick={unlockCoupon} />
                    
                )
            ) : (
                <p>No hay cupón disponible hoy.</p>
            )}
        </div>
    );
}

export default App;
