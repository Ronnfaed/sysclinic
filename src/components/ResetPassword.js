// ResetPassword.js
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { confirmPasswordReset } from 'firebase/auth';
import './ResetPassword.css';

const ResetPassword = () => {
    const [matricula, setMatricula] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const oobCode = searchParams.get('oobCode'); // Obtém o código de redefinição de senha da URL

    const handleResetPassword = async () => {
        if (matricula === '' || newPassword === '' || !oobCode) {
            setError('Todos os campos são obrigatórios');
            return;
        }

        try {
            // Verifica o código de redefinição de senha
            await confirmPasswordReset(auth, oobCode, newPassword);

            // Atualiza a senha no Firestore
            const funcionariosRef = collection(db, 'funcionarios');
            const q = query(funcionariosRef, where('matricula', '==', matricula));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                querySnapshot.forEach(async (docSnapshot) => {
                    const docRef = doc(db, 'funcionarios', docSnapshot.id);
                    await updateDoc(docRef, {
                        senha: newPassword
                    });
                });
                alert('Senha atualizada com sucesso!');
                navigate('/login');
            } else {
                setError('Matrícula não encontrada');
            }
        } catch (error) {
            setError('Erro ao atualizar a senha. Por favor, tente novamente mais tarde.');
            console.error('Erro ao atualizar a senha:', error);
        }
    };

    return (
        <div className="reset-password-container">
            <h2>Redefinir Senha</h2>
            <input
                type="text"
                name="matricula"
                placeholder="Matrícula"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                style={{ border: error && matricula === '' ? '2px solid red' : '' }}
            />
            <input
                type="password"
                name="newPassword"
                placeholder="Nova Senha"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ border: error && newPassword === '' ? '2px solid red' : '' }}
            />
            {error && <p className="reset-password-error-message">{error}</p>}
            <button onClick={handleResetPassword}>Atualizar Senha</button>
        </div>
    );
};

export default ResetPassword;


