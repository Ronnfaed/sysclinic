import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import './HistoricoPaciente.css';
import InputMask from 'react-input-mask';
import { differenceInYears } from 'date-fns'; // Importando a função para calcular a diferença em anos

const HistoricoPaciente = () => {
  const [cpf, setCpf] = useState('');
  const [dados, setDados] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const handleChange = (e) => {
    setCpf(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const q = query(collection(db, "consultasMedicas"), where("cpf", "==", cpf));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => doc.data());

      // Classificando os dados de forma decrescente com base na dataConsulta
      const sortedDocs = docs.sort((a, b) => new Date(b.dataConsulta) - new Date(a.dataConsulta));

      setDados(sortedDocs);
      setTotalPages(sortedDocs.length);
      if (sortedDocs.length === 0) {
        setFeedbackMessage({ type: 'error', text: "Nenhum histórico encontrado para o CPF fornecido." });
      } else {
        setFeedbackMessage({ type: 'success', text: "Histórico encontrado com sucesso." });
        setCurrentPage(1); // Reset to the first page
      }
    } catch (error) {
      console.error("Erro ao buscar histórico: ", error);
      setFeedbackMessage({ type: 'error', text: "Erro ao buscar histórico" });
    }
  };

  // Função para calcular a idade com base na data de nascimento
  const calcularIdade = (dataNascimento, dataConsulta) => {
    const idade = differenceInYears(new Date(dataConsulta), new Date(dataNascimento));
    return idade;
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const renderDados = () => {
    if (dados.length === 0) {
      return <p>Nenhum histórico encontrado.</p>;
    }

    const dado = dados[currentPage - 1];

    return (
      <div className="historico-item form-body-container">
        <h3><strong>Informações básicas do paciente</strong></h3>
        <p><strong>CPF</strong>: {dado.cpf}</p>
        <p><strong>Nome do paciente</strong>: {dado.nome}</p>
        <p><strong>Idade</strong>: {dado.idade} anos</p>
        <p><strong>Altura</strong>: {dado.altura}</p>
        <p><strong>Peso</strong>: {dado.peso}</p>
        <p><strong>Sexo</strong>: {dado.sexo}</p>
        <h3><strong>Informações do Médico</strong></h3>
        <p><strong>CRM</strong>: {dado.crmMedico}</p>
        <p><strong>Nome do Médico</strong>: {dado.nomeMedico}</p>
        <p><strong>Especialidade</strong>: {dado.especialidade}</p>
        <h3><strong>Anamnese</strong></h3>
        <p><strong>Queixa</strong>: {dado.queixa}</p>
        <p><strong>Doenças</strong>: {dado.doencas}</p>
        <p><strong>Histórico Familiar</strong>: {dado.historicoFamiliar}</p>
        <p><strong>Medicamentos</strong>: {dado.medicamentos}</p>
        <p><strong>Bebe</strong>: {dado.bebe}</p>
        <p><strong>Atividade Física</strong>: {dado.atividadeFisica}</p>
        <p><strong>Sente dores no peito</strong>? {dado.doresPeito}</p>
        <p><strong>Já sofreu desmaio</strong>? {dado.desmaio}</p>
        <p><strong>Está com a vacinação em dia</strong>? {dado.vacinacao}</p>
        <p><strong>Sofre de alguma alergia aguda</strong>? {dado.alergia}</p>
        <p><strong>Obersvações adicionais</strong>: {dado.observacoes}</p>
        <p><strong>Conclusão</strong>: {dado.conclusao}</p>
        <p><strong>Receituário</strong>: {dado.receituario}</p>
        <p><strong>Data da consulta: {dado.dataConsulta}</strong></p>
      </div>
    );
  };

  return (
    <div className="container">
      <form className="historico-paciente-form" onSubmit={handleSubmit}>
        <h2 className="tituloh1">Histórico do Paciente</h2>
        <div className="form-body">
          <div className="form-group full-width">
            <label>CPF</label>
            <InputMask 
              mask="999.999.999-99" 
              name="cpf" 
              placeholder="Digite o CPF" 
              value={cpf} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="btn-container">
            <button type="submit" className="btn" style={{ width: "100%", height: "100%" }}>Buscar Histórico</button>
          </div>
        </div>
      </form>
      {feedbackMessage && (
        <div className={`feedback-message ${feedbackMessage.type}`}>
          {feedbackMessage.text}
        </div>
      )}
      <div className="historico-paciente-dados">
        {renderDados()}
        {dados.length > 0 && (
          <div className="pagination">
            <button 
              onClick={handlePreviousPage} 
              disabled={currentPage === 1} 
              className="pagination-btn"
            >
              Anterior
            </button>
            <span>Página {currentPage} de {totalPages}</span>
            <button 
              onClick={handleNextPage} 
              disabled={currentPage === totalPages} 
              className="pagination-btn"
            >
              Próxima
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoricoPaciente;
