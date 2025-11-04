import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Truck, CreditCard, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import { BASE_URL } from "../services/api";

function Singleproduct() {
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate(); 
  const [product, setProduct] = useState(null); 
  const [loading, setLoading] = useState(true); 

  //  user and cart states
  const [currentUser, setCurrentUser] = useState(
    () => JSON.parse(localStorage.getItem("currentUser"))
  );
  const [cart, setCart] = useState(currentUser?.cart || []); 

  // size 
  const [selectedSize, setSelectedSize] = useState(null); 

  const updateUserData = async (updatedData) => {
    if (!currentUser) return; 
    try {
      await fetch(`${BASE_URL}/users/${currentUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData), 
      });
    } catch (error) {
      console.error("Error updating user in DB:", error);
    }
  };

  
  const addToCart = async (product) => {
    if (!currentUser) { 
      toast.error("Please login first to add products to cart!"); 
      navigate("/login"); 
      return;
    }

    if (!selectedSize) { 
      toast.error("Please select a size before adding to cart!");
      return;
    }

    
    const isAlreadyInCart = cart.some(
      (item) => item.id === product.id && item.size === selectedSize
    );
    if (isAlreadyInCart) {
      toast.info(`Size ${selectedSize} already in your cart!`);
      return;
    }

    const updatedCart = [...cart, { ...product, quantity: 1, size: selectedSize }];
    setCart(updatedCart); 

    const updatedUser = { ...currentUser, cart: updatedCart };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser)); 
    setCurrentUser(updatedUser);

    await updateUserData({ cart: updatedCart }); 

    toast.success(`Added size ${selectedSize} to cart!`);
  };

 
  useEffect(() => {
    setLoading(true); 

    fetch(`${BASE_URL}/products/${id}`) 
      .then((res) => {
        if (!res.ok) {
          throw new Error('Product not found or server error'); 
        }
        return res.json(); 
      })
      .then((data) => {
        setProduct(data); 
        setLoading(false); 
      })
      .catch((error) => {
        console.error('Error fetching product:', error);
        setProduct(null); 
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
    <div className="container mx-auto p-8 bg-black text-amber-50 mt-23">
      <div className="container mx-auto px-8">
        <h1 className="text-4xl font-extrabold mb-8">{product.name}</h1>

        <div className="flex flex-col md:flex-row gap-10">

          <div className="md:w-1/2">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto object-cover rounded-xl shadow-lg"
            />
          </div>

     
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

            
            <div className="flex gap-3 flex-wrap mt-10">
              {['7', '8', '9', '10', '11'].map((size) => (
                <div
                  key={size}
                  onClick={() => setSelectedSize(size)} 
                  className={`w-10 h-10 flex items-center justify-center border rounded-md cursor-pointer transition ${
                    selectedSize === size
                      ? 'bg-cyan-600 border-cyan-500 text-white scale-105' 
                      : 'bg-transparent border-gray-600 text-white hover:border-cyan-500' 
                  }`}
                >
                  {size}
                </div>
              ))}
            </div>

            
            {cart.some((item) => item.id === product.id && item.size === selectedSize) ? (
              <button
                onClick={() => navigate("/cart")}
                className="w-full bg-green-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-green-700 transition mt-8"
              >
                Go to Cart
              </button>
            ) : (
              <button
                onClick={() => addToCart(product)}
                className="w-full bg-cyan-500 text-white py-3 rounded-xl text-lg font-semibold hover:bg-cyan-600 transition mt-8"
              >
                Add to Cart
              </button>
            )}

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
