// HomePage.jsx
import heart from '../assets/heart.png'
import React from 'react';
import './HomePage.css';

const HomePage = () => {
    return (
        <div className="homepage-container">
            <div className="welcome-text">
                <h1>Bem-Vindo!</h1>
                <p>Navegue entre as páginas e funcionalidades através da barra de navegação lateral.</p>
            </div>
            <div className="image-container">
                <img src={heart} alt="Imagem de boas-vindas" />
            </div>
        </div>
    );
};

export default HomePage;
