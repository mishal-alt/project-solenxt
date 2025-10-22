import Home from './page/Home'
import About from './page/About'
import Contact from './page/Contact'
import Product from './page/Product'
import Cart from './page/Cart'
import Wishlist from './page/Wishlist'
import Login from './page/Login'
import Signin from './page/Signin'
import Navbar from './comp/Nav'
import Payment from './page/Payment'
import Scrolltop from './comp/Scrolltop'
import Footer from './comp/Footer'
import Singleproduct from './page/Singlepro'
import Order from './page/Order'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
function App() {

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Scrolltop />
        <Routes>
          <Route path='/' element={<Home />} />

          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/product' element={<Product />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/wishlist' element={<Wishlist />} />
          <Route path='/footer' element={<Footer />} />
          <Route path="/product/:id" element={<Singleproduct />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/order" element={<Order />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
