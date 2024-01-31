import React from 'react'
import Accordion from 'react-bootstrap/Accordion';

const CheckboxOptions = ({name, descript}) => {
    return (
        <>
            <Accordion flush>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>{name}</Accordion.Header>
                    <Accordion.Body>
                    <p className="text-body-secondary" style={{fontSize:'14px'}}>
                        {descript}
                    </p>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </>
     )
}

export default CheckboxOptions