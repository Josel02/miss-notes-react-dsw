import React from 'react';
import Layout from '../layouts/Layout';

const HomePage = () => {
  const title = "MissNotes"; 
  return (
    <Layout>
      <h1>{title}</h1>
      <p>Welcome to {title}</p>
    </Layout>
  );
};

export default HomePage;
