import React, { useState } from 'react'
import './Card.css'
import pin from '../assets/images/pin.png'
import Modal from './Modal'

const Card = ({ item, dealerId, openModal }) => {

  console.log(openModal)

  return (
    <div className='card' onClick={() => openModal}>
      <div className='card-left'>
        <img src={pin} alt="pin" />
      </div>
      <div className='card-right'>
        <h3>{item.title}</h3>
        <p>{item.address}</p>
        <span>
          {
            item.services.map((service) => (
              service + ' • '
            ))
          }
        </span>
      </div>


    </div>
  )
}

export default Card