import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';

const ActivationPage = () => {
    const { token } = useParams();
    const [status, setStatus] = useState('loading'); 
    const [message, setMessage] = useState('Processing your request...');

    useEffect(() => {
        const activateUser = async () => {
            try {
                setStatus('loading');
                setMessage('Processing your request...');

                const response = await apiClient.get(`/user-open/activateUser/${token}`);
                
                console.log('Activation response:', response.data);
                
                if (response.data && response.data.data) {
                    setMessage(response.data.data);
                    
                    // Check if message indicates actual success
                    const messageText = response.data.data.toLowerCase();
                    if (messageText.includes('activated successfully') || 
                        messageText.includes('activation successful') || 
                        messageText.includes('user is activated') ||
                        messageText.includes('account activated')) {
                        setStatus('success');
                    } else {
                        setStatus('error');
                    }
                } else {
                    setStatus('error');
                    setMessage('No response received');
                }

            } catch (error) {
                console.error('Activation error:', error);
                setStatus('error');
                
                // Show backend error message if available
                if (error.response?.data?.data) {
                    setMessage(error.response.data.data);
                } else if (error.response?.data?.message) {
                    setMessage(error.response.data.message);
                } else {
                    setMessage('Something went wrong. Please try again.');
                }
            }
        };

        if (token) {
            activateUser();
        } else {
            setStatus('error');
            setMessage('Invalid activation link.');
        }
    }, [token]); // Removed navigate from dependencies

    return (
        <div style={{
            backgroundColor: '#7966F1',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            fontFamily: 'Arial, sans-serif',
            padding: '20px'
        }}>
            <div style={{
                textAlign: 'center',
                maxWidth: '500px',
                padding: '40px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
                {/* Loading Spinner */}
                {status === 'loading' && (
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            border: '4px solid rgba(255, 255, 255, 0.3)',
                            borderTop: '4px solid white',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto'
                        }}></div>
                        <style jsx>{`
                            @keyframes spin {
                                0% { transform: rotate(0deg); }
                                100% { transform: rotate(360deg); }
                            }
                        `}</style>
                    </div>
                )}

                {/* Success Icon */}
                {status === 'success' && (
                    <div style={{
                        fontSize: '60px',
                        marginBottom: '20px',
                        color: '#4CAF50'
                    }}>
                        ✓
                    </div>
                )}

                {/* Error Icon */}
                {status === 'error' && (
                    <div style={{
                        fontSize: '60px',
                        marginBottom: '20px',
                        color: '#f44336'
                    }}>
                        ✕
                    </div>
                )}

                <h1 style={{
                    fontSize: '28px',
                    marginBottom: '20px',
                    fontWeight: 'bold'
                }}>
                    {status === 'loading' && 'Processing Request...'}
                    {status === 'success' && 'Request Processed'}
                    {status === 'error' && 'Request Failed'}
                </h1>

                <p style={{
                    fontSize: '18px',
                    marginBottom: '30px',
                    lineHeight: '1.5'
                }}>
                    {message}
                </p>
            </div>
        </div>
    );
};

export default ActivationPage;