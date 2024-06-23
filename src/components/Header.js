import React, { useState, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';
import './Header.css';
import userPlaceholder from '../assets/user-placeholder.png';
import { useNavigate } from 'react-router-dom';
import homeIcon from '../assets/home-white.png'

const Header = ({ toggleSidebar }) => {
    const [user, setUser] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loggedUser = JSON.parse(localStorage.getItem('user'));
        setUser(loggedUser);
    }, []);

    const handleLogout = () => {
        console.log("Logout iniciado");
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('tipoFuncionario');
        setUser(null); // Limpar o estado do usuário localmente
        navigate('/'); // Redirecionar para a página inicial
        console.log("Usuário redirecionado para /");
    };

    const handleNavigate = (path) => {
        navigate(path);
        setDropdownVisible(false); // Fechar o dropdown ao navegar
    };

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    return (
        <header className="header">
            <FaBars className="menu-icon" onClick={toggleSidebar} />
            <div className="user-info">
                <img src={homeIcon} alt="Ícone de casa" className="homeIcon" onClick={() => handleNavigate('home/home-page')}/>
                <img src={user ? user.profilePic : userPlaceholder} alt="Usuário" />
                <div className="user-dropdown">
                    <span onClick={toggleDropdown} className="user-name">{user ? user.nome : 'Usuário'}</span>
                    {dropdownVisible && (
                        <div className="dropdown-content">
                            <button onClick={() => handleNavigate('/dados-pessoais')}>Dados pessoais</button>
                            <button onClick={() => handleNavigate('/alterar-senha')}>Alterar senha</button>
                            <button onClick={handleLogout}>Sair</button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;



