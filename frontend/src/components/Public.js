import React from 'react'
import { Link } from 'react-router-dom';

const Public = () => {
  return (
    <section className='public'>
        <header className='public-header'>
            <h1>Welcome to Notes Manager</h1>
        </header >
        <main className='public-main'>
            <p>Main content here...</p>
        </main>
        <footer className='public-footer'>
            <p>Footer contente here...</p>
        </footer>
    </section>
  )
}

export default Public