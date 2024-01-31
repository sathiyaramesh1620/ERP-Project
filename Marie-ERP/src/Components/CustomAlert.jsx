import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faTimes } from '@fortawesome/free-solid-svg-icons';

const CustomAlert = (props) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, props.duration || 5000); // Default duration is 5 seconds, but you can customize it using the `duration` prop.
    return () => clearTimeout(timer);
  }, [props.duration]);

  return (
    <AnimatePresence>
      {show &&  <motion.div
        initial={{ x: 100 }}
        animate={{ x: 0 }}
        exit={{opacity: 0}}
        className="position-fixed top-0 end-0 m-4" style={{ zIndex: 9999 }}
      >
        <Alert variant="warning" style={{ background: "red", color: "white", borderRadius: 10 }}>
          <div className="d-flex justify-content-between align-items-center">
            <div className='d-flex justify-content-center align-items-center'>
              <FontAwesomeIcon icon={faExclamationTriangle} size='xl' />
            </div>
            <div className='d-flex justify-content-center align-items-center'>
              <p className="mt-3 mx-3">{props.message}</p>
            </div>
            <Button variant="link" onClick={() => setShow(false)}>
              <FontAwesomeIcon icon={faTimes} style={{ fontSize: '1.5rem', color: 'white' }} />
            </Button>
          </div>
        </Alert>
      </motion.div> }
    </AnimatePresence>

  );
};

export default CustomAlert;
