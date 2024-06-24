import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import './AlterarSenha.css'; // Importe o estilo do AlterarSenha.css

const AlterarSenha = () => {
    const [email, setEmail] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [feedbackType, setFeedbackType] = useState('');

    const handleSendEmail = async () => {
        try {
            await sendPasswordResetEmail(auth, email);
            setFeedbackMessage('Email de redefinição de senha enviado com sucesso.');
            setFeedbackType('success');
        } catch (error) {
            setFeedbackMessage('Erro ao enviar email de redefinição de senha.');
            setFeedbackType('error');
            console.error('Erro ao enviar email de redefinição de senha:', error);
        }
    };

    return (
        <div className="alterar-senha-container"> {/* Use a classe do AlterarSenha.css */}
                          <h2 className="historico-paciente-titulo1" style={{ marginTop: '-20px' }}>Alterar Senha</h2>
            <input
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button className="alterar-senha-save-btn" onClick={handleSendEmail}> {/* Use a classe do AlterarSenha.css */}
                Enviar e-mail
            </button>
            {feedbackMessage && (
                <div className={`alterar-senha-feedback-message ${feedbackType}`}> {/* Use a classe do AlterarSenha.css */}
                    {feedbackMessage}
                </div>
            )}
        </div>
    );
};

export default AlterarSenha;


