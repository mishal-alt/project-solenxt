import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Truck, CreditCard, RefreshCw } from 'lucide-react';

function Singleproduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // 🎯 CORRECTED: Fetch only the specific product using its ID in the URL
    fetch(`http://localhost:3000/products/${id}`)
      .then((res) => {
        // json-server returns a 404 for not found, but a successful fetch with an empty body
        // is also common if the resource doesn't exist. Checking the response status is robust.
        if (!res.ok) {
          throw new Error('Product not found or server error');
        }
        return res.json();
      })
      .then((data) => {
        // The server (json-server) now returns the single product directly
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching product:', error);
        setProduct(null); // Explicitly set product to null on fetch error or 404
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="text-center py-10">Loading product details...</div>;
  }

  if (!product) {
    return <div className="text-center py-10 text-red-600">Product not found.</div>;
  }

  return (
    <div className="container mx-auto p-8 bg-black text-amber-50 mt-23 ">
      <div className="container mx-auto px-8">
        <h1 className="text-4xl font-extrabold mb-8">{product.name}</h1>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Product Image */}
          <div className="md:w-1/2">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto object-cover rounded-xl shadow-lg"
            />
          </div>

          {/* Product Info */}
          <div className="md:w-1/2 space-y-4 mt-10">
            <p className="text-3xl font-bold text-white">₹{product.price}</p>
            <p className="text-lg text-gray-300">{product.discription}</p>

            <p
              className={
                product.stoke > 0 ? 'text-green-500' : 'text-red-600 font-bold'
              }
            >
              {product.stoke > 0
                ? `In Stock (${product.stoke} left)`
                : 'Out of Stock'}
            </p>

            {/* Shoe sizes */}
            <div className="flex gap-3 flex-wrap mt-10">
              {['7', '8', '9', '10', '11'].map((size) => (
                <div
                  key={size}
                  className={`w-10 h-10 flex items-center justify-center border rounded-md text-white cursor-pointer transition ${size === '9'
                      ? 'bg-cyan-600 border-cyan-500 text-white'
                      : 'bg-transparent border-gray-600 hover:border-cyan-500'
                    }`}
                >
                  {size}
                </div>
              ))}
            </div>

            {/* Add to Cart Button */}
            <button className="w-full bg-cyan-500 text-white py-3 rounded-xl text-lg font-semibold hover:bg-cyan-600 transition mt-8">
              Add to Cart
            </button>

            {/* Icons Section */}
            <div className="flex justify-around mt-12 text-sm text-gray-300">
              <div className="flex flex-col items-center space-y-1">
                <Truck className="w-6 h-6 text-cyan-500" />
                <p>Fast & Free Delivery</p>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <CreditCard className="w-6 h-6 text-cyan-500" />
                <p>Secure Payments</p>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <RefreshCw className="w-6 h-6 text-cyan-500" />
                <p>30-Day Returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Singleproduct;
