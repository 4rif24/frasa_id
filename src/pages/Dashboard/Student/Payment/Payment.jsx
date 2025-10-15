import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Navigate, useLocation } from 'react-router-dom';
import CheckoutPayment from './CheckoutPayment';

// Debug: Cek environment variable
console.log('Stripe API Key:', import.meta.env.VITE_STRIPE);

const stripeApiKey = import.meta.env.VITE_STRIPE;
const stripePromise = stripeApiKey ? loadStripe(stripeApiKey) : null;

const Payment = () => {
  const location = useLocation();
  const price = location?.state?.price;
  const itemId = location?.state?.itemId;
  const items = location?.state?.items;

  if (!price) {
    return <Navigate to="/dashboard/my-selected" replace />;
  }

  if (!stripePromise) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> Stripe payment gateway tidak terkonfigurasi dengan benar.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Elements stripe={stripePromise}>
          <CheckoutPayment 
            price={price} 
            cartItems={items} 
            itemId={itemId} 
          />
        </Elements>
      </div>
    </div>
  );
};

export default Payment;