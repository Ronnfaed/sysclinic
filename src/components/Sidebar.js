// src/components/Sidebar.js

import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserPlus, FaCalendarAlt, FaStethoscope, FaHistory, FaUserMd, FaUser } from 'react-icons/fa';
import './Sidebar.css';
import logo from '../images/logo_+Saude.png';

const Sidebar = ({ isOpen, toggleSidebar, tipoFuncionario }) => {
    const getDisabledClass = (route) => {
        if (tipoFuncionario === 'admin') {
            return ''; // Admin pode acessar tudo
        }

        const atendenteRoutes = ['/home/cadastro-pacientes', '/home/agendamento-consultas', '/home/calendario-consultas'];
        const medicoRoutes = ['/home/calendario-consultas', '/home/consulta-medica', '/home/historico-paciente'];

        if (tipoFuncionario === 'atendente' && !atendenteRoutes.includes(route)) {
            return 'disabled';
        }
        if (tipoFuncionario === 'medico' && !medicoRoutes.includes(route)) {
            return 'disabled';
        }
        return '';
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <button onClick={toggleSidebar} className="sidebar-toggle-button">
                <img src={logo} alt="Logo" className="sidebar-logo" />
            </button>
            <ul>
                <li className={getDisabledClass('/home/cadastro-pacientes')}>
                    <Link to="/home/cadastro-pacientes">
                        <FaUserPlus className="sidebar-icon" />
                        {isOpen && <span>Cadastro de Pacientes</span>}
                    </Link>
                </li>
                <hr className="sidebar-divider"></hr>
                <li className={getDisabledClass('/home/agendamento-consultas')}>
                    <Link to="/home/agendamento-consultas">
                        <FaCalendarAlt className="sidebar-icon" />
                        {isOpen && <span>Agendamento de Consultas</span>}
                    </Link>
                </li>
                <hr className="sidebar-divider"></hr>
                <li className={getDisabledClass('/home/calendario-consultas')}>
                    <Link to="/home/calendario-consultas">
                        <FaCalendarAlt className="sidebar-icon" />
                        {isOpen && <span>Calendário de Consultas</span>}
                    </Link>
                </li>
                <hr className="sidebar-divider"></hr>
                <li className={getDisabledClass('/home/consulta-medica')}>
                    <Link to="/home/consulta-medica">
                        <FaStethoscope className="sidebar-icon" />
                        {isOpen && <span>Consulta Médica</span>}
                    </Link>
                </li>
                <hr className="sidebar-divider"></hr>
                <li className={getDisabledClass('/home/historico-paciente')}>
                    <Link to="/home/historico-paciente">
                        <FaHistory className="sidebar-icon" />
                        {isOpen && <span>Histórico do Paciente</span>}
                    </Link>
                </li>
                <hr className="sidebar-divider"></hr>
                <li className={getDisabledClass('/home/cadastro-usuarios')}>
                    <Link to="/home/cadastro-usuarios">
                        <FaUserMd className="sidebar-icon" />
                        {isOpen && <span>Cadastro de Atendentes ou Médicos</span>}
                    </Link>
                </li>
                <hr className="sidebar-divider"></hr>
                <li className={getDisabledClass('/home/gerenciamento-usuarios')}>
                    <Link to="/home/gerenciamento-usuarios">
                        <FaUser className="sidebar-icon" />
                        {isOpen && <span>Gerenciamento de Usuários</span>}
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;






