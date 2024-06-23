// src/pages/Home.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CadastroPacientes from './CadastroPacientes';
import AgendamentoConsultas from './AgendamentoConsultas';
import CalendarioConsultas from './CalendarioConsultas';
import ConsultaMedica from './ConsultaMedica';
import HistoricoPaciente from './HistoricoPaciente';
import CadastroUsuarios from './CadastroUsuarios';
import GerenciamentoUsuarios from './GerenciamentoUsuarios';
import HomePage from './components/HomePage'
import './Home.css';

const Home = ({ tipoFuncionario }) => {
  const renderRoutes = () => {
    switch (tipoFuncionario) {
      case 'admin':
        return (
          <Routes>
            <Route path="home/cadastro-pacientes" element={<CadastroPacientes />} />
            <Route path="agendamento-consultas" element={<AgendamentoConsultas />} />
            <Route path="calendario-consultas" element={<CalendarioConsultas />} />
            <Route path="consulta-medica" element={<ConsultaMedica />} />
            <Route path="historico-paciente" element={<HistoricoPaciente />} />
            <Route path="cadastro-usuarios" element={<CadastroUsuarios />} />
            <Route path="gerenciamento-usuarios" element={<GerenciamentoUsuarios />} />
            <Route path="home-page" element={<HomePage />} />
          </Routes>
        );
      case 'atendente':
        return (
          <Routes>
            <Route path="cadastro-pacientes" element={<CadastroPacientes />} />
            <Route path="agendamento-consultas" element={<AgendamentoConsultas />} />
            <Route path="calendario-consultas" element={<CalendarioConsultas />} />
            <Route path="home-page" element={<HomePage />} />
          </Routes>
        );
      case 'medico':
        return (
          <Routes>
            <Route path="calendario-consultas" element={<CalendarioConsultas />} />
            <Route path="consulta-medica" element={<ConsultaMedica />} />
            <Route path="historico-paciente" element={<HistoricoPaciente />} />
            <Route path="home-page" element={<HomePage />} />
          </Routes>
        );
      default:
        console.log("Tipo de funcionário não reconhecido no Home: ", tipoFuncionario);
        return <div>Tipo de funcionário não reconhecido no Home.</div>;
    }
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Bem-vindo ao Sistema de Clínica</h1>
      {renderRoutes()}
    </div>
  );
};

export default Home;
