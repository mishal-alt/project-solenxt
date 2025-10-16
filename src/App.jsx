import Home from './page/Home'
import Men from './page/Men'
import Women from './page/Women'
import About from './page/About'
import Contact from './page/Contact'
import Premium from './page/Premium'
import Product from './page/Product'
import Cart from './page/Cart'
import Wishlist from './page/Wishlist'
import Login from './page/Login'
import Signin from './page/Signin'
import Navbar from './comp/Nav'
import Footer from './comp/Footer'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
function App() {

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/men' element={<Men />} />
          <Route path='/women' element={<Women />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/premium' element={<Premium />} />
          <Route path='/product' element={<Product />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/wishlist' element={<Wishlist />} />
          <Route path='/footer' element={<Footer />} />

        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
