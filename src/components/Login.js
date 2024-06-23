// components/Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import './Login.css';
import logo from '../images/logo_+Saude.png';

const Login = ({ onLogin }) => {
    const [matricula, setMatricula] = useState('');
    const [password, setPassword] = useState('');
    const [emailForReset, setEmailForReset] = useState('');
    const [error, setError] = useState('');
    const [isError, setIsError] = useState(false);
    const [showResetPassword, setShowResetPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (matricula === '' || password === '') {
            setError('Todos os campos são obrigatórios');
            setIsError(true);
            return;
        }

        try {
            const funcionariosRef = collection(db, 'funcionarios');
            const q = query(funcionariosRef, where('matricula', '==', matricula), where('senha', '==', password));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const user = querySnapshot.docs[0].data();
                onLogin(user);
                localStorage.setItem('user', JSON.stringify(user));
                navigate('/home/home-page');
            } else {
                setError('Usuário ou senha incorretos');
                setIsError(true);
            }
        } catch (error) {
            setError('Erro ao autenticar. Por favor, tente novamente mais tarde.');
            console.error('Erro ao autenticar:', error);
        }
    };

    const handleForgotPassword = async () => {
        if (emailForReset === '') {
            setError('Por favor, insira seu endereço de email');
            setIsError(true);
            return;
        }

        try {
            await sendPasswordResetEmail(auth, emailForReset);
            alert('Um email de redefinição de senha foi enviado para o seu endereço de email.');
            setShowResetPassword(false);
        } catch (error) {
            setError('Ocorreu um erro ao enviar o email de redefinição de senha. Por favor, tente novamente mais tarde.');
            console.error('Erro ao enviar email de redefinição de senha:', error);
        }
    };

    const handleInputChange = (e) => {
        setError('');
        setIsError(false);
        if (e.target.name === 'matricula') {
            setMatricula(e.target.value);
        } else if (e.target.name === 'password') {
            setPassword(e.target.value);
        } else if (e.target.name === 'emailForReset') {
            setEmailForReset(e.target.value);
        }
    };

    return (
        <div className="login-container">
            <img src={logo} alt="Logo da sua clínica" className="login-clinic-logo" />
            <h2>Login</h2>
            <input
                type="text"
                name="matricula"
                placeholder="Matrícula"
                value={matricula}
                onChange={handleInputChange}
                style={{ border: isError && matricula === '' ? '2px solid red' : '' }}
            />
            <input
                type="password"
                name="password"
                placeholder="Senha"
                value={password}
                onChange={handleInputChange}
                style={{ border: isError && password === '' ? '2px solid red' : '' }}
            />
            {error && <p className="login-error-message">{error}</p>}
            <div className="login-buttons-container">
                <button onClick={handleLogin}>Logar</button>
            </div>
            <p className="login-forgot-password" onClick={() => setShowResetPassword(true)}>Esqueceu sua senha?</p>
            {showResetPassword && (
                <div className="login-reset-password-container">
                    <h3>Redefinir Senha</h3>
                    <input
                        type="email"
                        name="emailForReset"
                        placeholder="Email"
                        value={emailForReset}
                        onChange={handleInputChange}
                        style={{ border: isError && emailForReset === '' ? '2px solid red' : '' }}
                    />
                    <button onClick={handleForgotPassword}>Enviar Email</button>
                </div>
            )}
        </div>
    );
};

export default Login;










