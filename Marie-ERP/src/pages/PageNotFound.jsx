import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { motion } from 'framer-motion';

const PageNotFound = () => {

  const blinkAnimation = {
    hidden: { opacity: 0.9},
    visible: { opacity: 1 },
  };

  return (
    <div className='d-flex justify-content-center align-items-center py-5 mt-5'>
      <div className='text-center'>
      <motion.div
        initial='hidden'
        animate='visible'
        variants={blinkAnimation}
        transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
        className='text-danger mb-4'
      >
        <FontAwesomeIcon icon={faExclamationCircle} size='5x' />
      </motion.div>
        <h1 className='display-2 mb-4'>404 Page Not Found</h1>
        <p className='lead mb-4'>Oops! The page you are looking for could not be found.</p>
        <Button as={Link} to='/login' variant='primary'>
          Go to Login
        </Button>
      </div>
    </div>
  );
};

export default PageNotFound;
