import './AgendamentoConsultas.css'; // CSS da página
import React, { useEffect, useState } from 'react'; // Manipulação de estados lógicos
import { Formik, Form, Field, ErrorMessage } from 'formik'; // Formulários
import { db } from '../firebaseConfig'; // Firebase Sync
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";  // Firebase CRUD
import InputMask from 'react-input-mask';
import firebase from '../firebaseConfig';
import CadastroPacientes from './CadastroPacientes';

const AgendamentoConsultas = () => {

    // Métodos e funções para validar o CPF inserido
    const [cpf, setCpf] = useState(''); // Método que define o valor do CPF, baseado no Input do usuário.
    const [result, setResult] = useState(''); // Método que define e informa o resultado da verificação de cpf, se é válido ou inválido.
    const [userData, setUserData] = useState(null); // Dados do usuário buscados no Firebase
    const [loading, setLoading] = useState(true); // Estado de carregamento
    const [error, setError] = useState(null); // Estado de erro
    const [cpfNotFoundMessage, setCpfNotFoundMessage] = useState(''); // Mensagem de erro de CPF não encontrado
    const [cpfFound, setCpfFound] = useState ('');

    const handleInputChange = (e) => {
        setCpf(e.target.value);
    };

    const validateCPF = value => {
        const cpf = value.replace(/[^\d]+/g, '');
        if (cpf === '' || cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
        let add = 0;
        for (let i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);
        let rev = 11 - (add % 11);
        if (rev === 10 || rev === 11) rev = 0;
        if (rev !== parseInt(cpf.charAt(9))) return false;
        add = 0;
        for (let i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i);
        rev = 11 - (add % 11);
        if (rev === 10 || rev === 11) rev = 0;
        if (rev !== parseInt(cpf.charAt(10))) return false;
        return true;
    };

    // Função para buscar dados do usuário no Firebase
    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            setError(null);
            setCpfNotFoundMessage(''); // Resetar mensagem de erro de CPF não encontrado
            setCpfFound ('');
            try {
                const q = query(collection(db, "pacientes"), where("cpf", "==", cpf));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    setUserData(querySnapshot.docs[0].data());
                    setCpfFound('CPF encontrado nos nossos registros.')
                } else {
                    setUserData(null);
                {/* setCpfNotFoundMessage('CPF não encontrado.'); // Definir mensagem de erro de CPF não encontrado */}
                }
            } catch (error) {
                console.error("Error fetching document: ", error);
                setError("Error fetching document");
            } finally {
                setLoading(false);
            }
        };

        if (cpf.length === 14) { // Verificar CPF completo (com máscara)
            fetchUserData();
        }
    }, [cpf]);

    const handleChange = (e) => {
        const value = e.target.value;
        setCpf(value);
        if (value.length === 14) { // 14 caracteres inclui os pontos e o hífen da máscara
            setResult(validateCPF(value) ? 'CPF válido!' : 'CPF inválido!');
        } else {
            setResult('');
        }
    };

    // Formulário para marcar consulta - Etapa 2
    const [cpfConsulta, setCpfconsulta] = useState('');
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [data, setData] = useState('');
    const [hora, setHora] = useState('');
    const [motivo, setMotivo] = useState('');
    const [formaPagamento, setFormaPagamento] = useState('');
    const [especialidade, setEspecialidade] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        // Verificar se a data é válida
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0); // Zerar as horas, minutos, segundos e milissegundos para a comparação
        const dataConsulta = new Date(data);
        dataConsulta.setHours(0, 0, 0, 0);
    
        if (dataConsulta < hoje) {
            alert('A data da consulta só é válida se for para um dia futuro.');
            return;
        }
    
        // Verificar se já existem três consultas agendadas para o mesmo horário
        const consultaPorHorarioQuery = query(collection(db, "consultasAgendadas"), where("data", "==", data), where("hora", "==", hora));
        const consultaPorHorarioSnapshot = await getDocs(consultaPorHorarioQuery);
        if (consultaPorHorarioSnapshot.size >= 3) {
            alert('Todos os três médicos especialistas estão ocupados neste horário, escolha outro.');
            return;
        }
    
        // Verificar se já existe uma consulta da mesma especialidade para o mesmo horário
        const consultaPorEspecialidadeQuery = query(collection(db, "consultasAgendadas"), where("data", "==", data), where("hora", "==", hora), where("especialidade", "==", especialidade));
        const consultaPorEspecialidadeSnapshot = await getDocs(consultaPorEspecialidadeQuery);
        if (!consultaPorEspecialidadeSnapshot.empty) {
            alert(`Já existe uma consulta de ${especialidade} agendada para este horário.`);
            return;
        }
    
        // Se passou pelas verificações, proceder com o agendamento
        const consulta = {
            cpfConsulta: userData.cpf,
            nome: userData.nome,
            telefone: userData.celular,
            data,
            hora,
            motivo,
            especialidade,
            formaPagamento,
            confirmacao: false,
            preço: null,
        };
    
        try {
            await addDoc(collection(db, 'consultasAgendadas'), consulta);
            alert('Consulta agendada com sucesso!');
            // Limpar os campos do formulário
            setData('');
            setHora('');
            setMotivo('');
            setEspecialidade('');
            setFormaPagamento('');
        } catch (error) {
            console.error("Error adding document: ", error);
            alert('Erro ao agendar consulta');
        }
    };

    return (
        <div className="main">
            <div className="title">
                <h1>Agendamento de Consultas</h1>
                <h2>Localize o cliente através do CPF e verifique se os dados estão corretos.</h2>
            </div>

            <div className="idPaciente">
                <form className="form-group" style={{ width: "100%", alignItems: "center" }}>
                    <InputMask
                        name="cpf"
                        placeholder="CPF do Cliente"
                        type="text"
                        value={cpf}
                        onChange={handleChange}
                        mask="999.999.999-99"
                        required
                    />
                </form>
                {cpfNotFoundMessage && (
                    <p className="error-message">{cpfNotFoundMessage}</p>
                )}
                {cpfFound && (
                    <p style = {{color: "green", fontWeight: "bold"}}>{cpfFound}</p>
                )}
                {/*<p className={result === 'CPF válido!' ? 'valid' : 'invalid'}>{result}</p> -- Desativado para não confundir o cliente */}
            </div>

            {userData && (
                <Formik>
                    <Form>
                        <div className="form-body-container">
                            <h3 className="form-section-title">Dados pessoais</h3>
                            <div className="form-body">
                                <div className="form-group">
                                    <label>Nome civil</label>
                                    <Field type="text" name="nome" value={userData.nome || ''} readOnly disabled />
                                </div>
                                <div className="form-group">
                                    <label>Sexo</label>
                                    <Field name="sexo" value={userData.sexo || ''} readOnly disabled />
                                </div>
                                <div className="form-group">
                                    <label>Nome social</label>
                                    <Field type="text" name="nomeSocial" value={userData.nomeSocial || ''} readOnly disabled />
                                </div>
                                <div className="form-group">
                                    <label>Raça</label>
                                    <Field name="raca" value={userData.raca || ''} readOnly disabled />
                                </div>
                                <div className="form-group">
                                    <label>CPF</label>
                                    <Field name="cpf" value={userData.cpf || ''} readOnly disabled />
                                </div>
                                <div className="form-group">
                                    <label>Profissão</label>
                                    <Field type="text" name="profissao" value={userData.profissao || ''} readOnly disabled />
                                </div>
                            </div>
                        </div>
                        <div className="form-body-container">
                            <h3 className="form-section-title">Formas de contato</h3>
                            <div className="form-body">
                                <div className="form-group">
                                    <label>Email</label>
                                    <Field type="email" name="email" value={userData.email || ''} readOnly disabled />
                                </div>
                                <div className="form-group">
                                    <label>Celular</label>
                                    <Field name="celular" value={userData.celular || ''} readOnly disabled />
                                </div>
                            </div>
                        </div>
                    </Form>
                </Formik>
            )}

            <div className="title" style={{ marginTop: '50px' }}>
                <h2>Preencha o formulário abaixo e oficialize o agendamento clicando em confirmar</h2>
            </div>

            <div className="formConsulta">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Data</label>
                        <input
                            type="date"
                            name="data"
                            value={data}
                            onChange={(e) => setData(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Hora</label>
                        <select
                            type="time"
                            name="hora"
                            value={hora}
                            onChange={(e) => setHora(e.target.value)}
                            required
                        >
                            <option value="">Escolha um Horário</option>
                            <option value="8:30">8:30</option>
                            <option value="9:00">9:00</option>
                            <option value="9:30">9:30</option>
                            <option value="10:00">10:00</option>
                            <option value="10:30">10:30</option>
                            <option value="11:00">11:00</option>
                            <option value="11:30">11:30</option>
                            <option value="13:00">13:00</option>
                            <option value="13:30">13:30</option>
                            <option value="14:00">14:00</option>
                            <option value="14:30">14:30</option>
                            <option value="15:00">15:00</option>
                            <option value="15:30">15:30</option>
                            <option value="16:00">16:00</option>
                            <option value="16:30">16:30</option>
                            <option value="17:00">17:00</option>
                            <option value="17:30">17:30</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Motivo</label>
                        <textarea
                            name="motivo"
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label>Especialidade Desejada</label>
                        <select
                            name="especialidade"
                            value={especialidade}
                            onChange={(e) => setEspecialidade(e.target.value)}
                            required
                        >
                            <option value="">Selecione</option>
                            <option value="Clínico Geral">Clínico Geral</option>
                            <option value="Pediatra">Pediatra</option>
                            <option value="Cardiologia">Cardiologia</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Forma de Pagamento</label>
                        <select
                            name="formaPagamento"
                            value={formaPagamento}
                            onChange={(e) => setFormaPagamento(e.target.value)}
                            required
                        >
                            <option value="">Selecione</option>
                            <option value="Cartão de Crédito">Cartão de Crédito</option>
                            <option value="Cartão de Débito">Cartão de Débito</option>
                            <option value="PIX">PIX</option>
                            <option value="Dinheiro">Dinheiro</option>
                        </select>
                    </div>

                    <button type="submit" style={{ marginTop: '50px', width: '100%', textAlign: 'center' }}>Confirmar</button>

                </form>

            </div>
        </div>
    );
};

export default AgendamentoConsultas;
