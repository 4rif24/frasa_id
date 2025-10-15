import React, { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useUser from "../../../../hooks/useUser";

const CheckoutPayment = ({ price, cartItems, itemId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { currentUser, isLoading } = useUser();
  const [clientSecret, setClientSecret] = useState('');
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  if (price <= 0 || !price) {
    return <Navigate to="/dashboard/my-selected" replace />;
  }

  useEffect(() => {
    axiosSecure.post('/create-payment-intent', { price: price })
      .then(res => {
        setClientSecret(res.data.clientSecret);
      })
      .catch(err => {
        setMessage("Gagal membuat sesi pembayaran");
      });
  }, [price, axiosSecure]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setProcessing(true);
    
    if (!stripe || !elements) {
      setMessage("Sistem pembayaran belum siap");
      setProcessing(false);
      return;
    }
    
    const card = elements.getElement(CardElement);
    if (!card) {
      setMessage("Form kartu tidak ditemukan");
      setProcessing(false);
      return;
    }

    try {
      // Create payment method
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card,
      });
      
      if (paymentMethodError) {
        setMessage(paymentMethodError.message);
        setProcessing(false);
        return;
      }

      // Confirm card payment
      const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (confirmError) {
        setMessage(confirmError.message);
        setProcessing(false);
        return;
      }
      
      if (paymentIntent.status === "succeeded") {
        const paymentData = {
          transactionId: paymentIntent.id,
          paymentMethod: paymentIntent.payment_method_types[0],
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
          paymentStatus: paymentIntent.status,
          userName: currentUser?.name,
          userEmail: currentUser?.email,
          classesId: cartItems && cartItems.length > 0 ? cartItems : [itemId],
          date: new Date()
        };

        // Tentukan config berdasarkan jenis pembayaran
        const config = cartItems && cartItems.length > 0 
          ? {} 
          : { params: { classId: itemId } };
        
        const response = await axiosSecure.post('/payment-info', paymentData, config);
        
        if (response.data.success) {
          setSucceeded('Pembayaran berhasil! Mengarahkan ke kelas...');
          setTimeout(() => {
            navigate('/dashboard/enrolled-class');
          }, 2000);
        } else {
          setMessage('Pembayaran gagal, silakan coba lagi');
        }
      }
    } catch (err) {
      setMessage('Error: ' + (err.response?.data?.error || err.message));
    } finally {
      setProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        <p>Memuat informasi pembayaran...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Pembayaran Kelas
        </h1>
        <p className="text-lg text-secondary font-semibold mt-2">
          Rp{(price * 15000).toLocaleString('id-ID')}
        </p>
        <p className="text-gray-600 mt-2">
          {cartItems && cartItems.length > 1 
            ? `Untuk ${cartItems.length} kelas` 
            : 'Untuk 1 kelas'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border rounded-lg p-3">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
              hidePostalCode: true,
            }}
          />
        </div>

        <button
          type="submit"
          disabled={processing || !stripe || !clientSecret}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {processing ? "Memproses..." : "Bayar Sekarang"}
        </button>

        {message && (
          <div className="p-3 bg-red-100 text-red-700 rounded-lg">
            {message}
          </div>
        )}
        
        {succeeded && (
          <div className="p-3 bg-green-100 text-green-700 rounded-lg">
            {succeeded}
          </div>
        )}

        {!clientSecret && (
          <div className="p-3 bg-yellow-100 text-yellow-700 rounded-lg">
            Menyiapkan pembayaran...
          </div>
        )}

        <div className="text-xs text-gray-500 text-center">
          Pembayaran diproses secara aman melalui Stripe
        </div>
      </form>
    </div>
  );
};

export default CheckoutPayment;