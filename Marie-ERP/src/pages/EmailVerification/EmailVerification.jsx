import React, { useContext, useState, useEffect } from 'react';
import { EMAIL_VERIFICATION } from '../../API/Api';
import axios from 'axios';
import { UserContext } from '../../Context/UserContext';
import { Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const EmailVerification = () => {
  const [verificationStatus, setVerificationStatus] = useState('Verify your Email');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(UserContext);
  const navigate = useNavigate(); // Using useNavigate hook for navigation

  useEffect(() => {
    if (user.verificationStatus === "1") {
      setVerificationStatus('Already verified');
      setTimeout(() => {
        navigate('/dashboard'); // Redirect to dashboard after 2 seconds
      }, 2000);
    }
  }, [user.verificationStatus, navigate]);

  function handleVerification() {
    setIsLoading(true);
    axios
      .post(EMAIL_VERIFICATION, {
        email: user.clientMail,
        userId: user.userId,
        restaurantName: user.restaurantName,
      })
      .then((res) => {
        console.log(res);
        if (res.data.status === 200) {
          setVerificationStatus('Check your inbox for a verification email. Follow the instructions to complete the verification process.');
        } else {
          setVerificationStatus('Failed to send verification email. Please try again later.');
        }
      })
      .catch((err) => {
        console.error(err);
        setVerificationStatus('Failed to send verification email. Check your internet and try again later.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100">
      <i className="fas fa-envelope fa-3x mb-3"></i>
      <p className="mb-2">{user.clientMail}</p>
      {user.verificationStatus === "1" ? (
        <Alert variant="success" className="mb-3 w-75 text-center">
          Already verified. Redirecting to dashboard...
        </Alert>
      ) : (
        <>
          <Button
            onClick={handleVerification}
            variant='warning'
            className='text-light mb-3'
            disabled={isLoading}
          >
            {isLoading ? <Spinner animation="border" size="sm" /> : 
              (verificationStatus === 'Verify your Email' ? 'Send Verification Email' : 'Resend Verification Email')}
          </Button>
          {verificationStatus !== 'Verify your Email' && (
            <Alert variant={verificationStatus.includes('Failed') ? 'danger' : 'success'} className='mb-3 w-50 text-center'>
              {verificationStatus}
            </Alert>
          )}
        </>
      )}
      <div className='w-50 text-center'>
        <h5>Why Verify Your Email?</h5>
        <p className='text-secondary'>
          Verifying your email ensures account security and allows you to recover your account if you forget your password.
          It also helps us communicate important updates and reset your account in case of suspicious activities.
        </p>
      </div>
    </div>
  );
};

export default EmailVerification;
