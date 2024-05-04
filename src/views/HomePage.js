import React from 'react';
import logo from '../images/cat_logo.png';
import '../styles/HomePage.css';

const HomePage = () => {
  const title = "MissNotes";
  return (
    <>
      <img src={logo} alt="Logo" className='image-logo'/>
      <h1 className='home-title'>{title}</h1>
      <p className='home-body'>Welcome to {title}</p>
    </>
  );
};

export default HomePage;
