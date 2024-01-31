import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EMAIL_VERIFICATION_LINK } from '../../API/Api';
import { Container } from 'react-bootstrap';
import { UserContext } from '../../Context/UserContext';
import loader from '/assets/loader.svg';

const EmailVerificationLink = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const [msg, setMsg] = useState('Verifying Email...');
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    axios
      .post(EMAIL_VERIFICATION_LINK, {
        userId: id,
      })
      .then((res) => {
        console.log(res);
        if (res.data.status === 200) {
          setMsg('Email Verified Successfully');
          setTimeout(() => {
            setUser({ ...user, ...res.data });
            nav('/dashboard');
          }, 2000);
        } else {
          setMsg('Email Verification Failed. \n Please try again later.');
          setTimeout(() => {
            nav('/');
          }, 3000);
        }
      })
      .catch((err) => {
        console.error(err);
        setMsg('Email Verification Failed. \n Please try again later.');
        setTimeout(() => {
          nav('/');
        }, 3000);
      });
  }, [id, nav, setUser, user]);

  return (
    <>
      <Container style={{ height: '100vh' }} className='d-flex justify-content-center align-items-center'>
        <div>
          <img src={loader} alt='loader' />
        </div>
        <div className='h1'>{msg.split('\n').map((line, index) => <p key={index}>{line}</p>)}</div>
      </Container>
    </>
  );
};

export default EmailVerificationLink;
