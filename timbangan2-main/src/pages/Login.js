import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './user.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setErrorMessage('Harap isi semua field');
            setTimeout(() => {
                setErrorMessage('');
            }, 1000);
            return;
        }
        try {
            const response = await axios.post('http://localhost:3002/login', { email, password });
            if (response.data.success) {
                // Menggunakan navigate untuk pindah ke halaman dashboard setelah login berhasil
                navigate('/homepage');  // Ganti dengan rute yang sesuai
            } else {
                setErrorMessage(response.data.message);
                setTimeout(() => {
                    setErrorMessage('');
                }, 3000);
            }
        } catch (error) {
            console.error('Error: ', error);
            setErrorMessage("Terjadi kesalahan, coba lagi nanti");
            setTimeout(() => {
                setErrorMessage('');
            }, 3000);
        }
    }

    return (
        <div className='login'>
            <div className='login-card' style={{
                margin: 'auto'
            }}>
                <div className='login-desc'>
                    <div className='login-header'
                        style={{ display: 'flex', alignItems: 'center', marginBottom: '10%', paddingTop: "5%", justifyContent: "center" }}>
                        <h1
                            style={{ color: "var(--primary-color)", fontSize: "120%", fontWeight: "bold" }}>
                            LOGIN
                        </h1>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className='login-form' style={{ display: "flex", flexDirection: 'column', alignItems: 'center' }}>
                            <div className='login-email'>
                                <input type='email' placeholder="Email" value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{ border: '1px solid lightgrey', borderRadius: '10px', fontSize: '14px', padding: '10px' }} />
                            </div>
                            <div className='login-password'>
                                <input type='password' placeholder="Password" value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{ border: '1px solid lightgrey', borderRadius: '10px', fontSize: '14px', padding: '10px' }} />
                            </div>
                        </div>
                        <button type='submit' style={{ marginTop: "5%", fontWeight: '600', backgroundColor: 'lightblue' }}>Login</button>
                    </form>

                </div>

            </div>
            {errorMessage && (
                <div className="modal" style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    width: '50%'
                }}>
                    <div className="modal-content-error">
                        <div style={{ backgroundColor: 'red', color: 'white', padding: '10px' }}>
                            {errorMessage}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Login;
