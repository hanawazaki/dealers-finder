import React from 'react'
import './Header.css'
import logoHeader from '../assets/images/Logo.png'
import Euro4 from '../assets/images/Euro4.png'
import Banner from '../assets/images/banner.png'

const Header = () => {
  return (
    <>
      <div className='head'>
        <img src={logoHeader} alt="logo" className='logohead' />
        <div className='head-right'>
          <img src={Euro4} alt="Euro4" />
          <a href='#'>ABOUT US</a>
          <a href='#'>EXPLORE CARS</a>
          <a href='#'>PROMO</a>
          <a href='#'>NEWS & EVENTS</a>
        </div>
      </div>
      <div className='banner'>
        <img src={Banner} alt="banner" className='bgbanner' />
      </div>
    </>
  )
}

export default Header