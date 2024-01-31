import React, { useState, useContext, useEffect } from 'react'
import { Row, Col, Table, Form } from 'react-bootstrap'
import './LabourSetup.css'
import axios from 'axios';
import { UserContext } from "../../../Context/UserContext";
import { useNavigate } from 'react-router-dom';

function LabourSetup() {
 
  const navigate = useNavigate()

  const { user, commonApi } = useContext(UserContext);
  const [show, setShow] = useState(true)
  const [data, setFormData] = useState({
      leave: {
        1: '',
        2: '',
        3: '',
        4: '',
      },
      carry_forward: '',
      traceable : {
        permit : '',
        bonus : '',
        epf : '',
        socso : '',
        eis : '',
        medical : '',
        insurance : '',
        others : '',
      },
      data : {
        1 : {permit : '', bonus : '', epf : '', socso : '', eis : '', medical : '', insurance : '', others : ''},
        2 : {permit : '', bonus : '', epf : '', socso : '', eis : '', medical : '', insurance : '', others : ''},
        3 : {permit : '', bonus : '', epf : '', socso : '', eis : '', medical : '', insurance : '', others : ''},
        4 : {permit : '', bonus : '', epf : '', socso : '', eis : '', medical : '', insurance : '', others : ''},
      },
      total_labour_count : ''
  },  );

  const [loading, setLoading] = useState(false)
 
  const handleNestedInputChange = (key, nestedKey, value) => {
  
      setFormData((prevFormData) => ({
        ...prevFormData,
        data: {
          ...prevFormData.data,
          [key]: {
            ...prevFormData.data[key],
            [nestedKey]: value,
          },
        },
      }));
    
  };

  const handleCarry = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      carry_forward: value ? 'Yes' : 'No', // Update the carry_forward value based on checkbox state
    }));
  };

  const handleTraceChange = (key, value) => {
    if(value>= 0){
    setFormData((prevFormData) => ({
      ...prevFormData,
      traceable: {
        ...prevFormData.traceable,
        [key]: value,
      },
    }));
  }}

  const handleInputChange = (key, value) => {
    if(value>= 0){
    setFormData((prevFormData) => ({
      ...prevFormData,
      leave: {
        ...prevFormData.leave,
        [key]: value,
      },
    }));
  }};

 
  
  const colors = {
    tablesub : '#ccd4eb',
    entry : '#e8eaf4'
  }

  function handleSubmit(){
   
    console.log({
      userId : user.userId ? user.userId : 3,
      data, 
    });
  
   axios.post('/Marie-ERP/api/storeSetup', {
      userId : user.userId ? user.userId : 3, 
      data
    })
    .then(response => {
      console.log(response, 'storeSetup')
      if(response.status === 200){
      navigate('/dashboard/labour/')
      fetchData()
    }
    })
    .catch(error => {console.log(error , 'storeSetup')})
  }
 

 const handleTotalChange = (value) => {
  setFormData((prevData) => ({
    ...prevData,
    total_labour_count: value, // Update the carry_forward value based on checkbox state
  }));
 } 

  // useEffect(() => {
  //   const fetchData = async () => {
  //     axios.post('/Marie-ERP/api/fetchSetup', {userId : user.userId ? user.userId : 5})
  //     .then(response => {
  //       console.log(response.data.data.leave)
  //       setFormData({leave : 1 : response.data.data.leave[0].annual_leave})
  //     })
  //     .catch(error => console.log(error))
  //   }
  //   fetchData()
  // }, [])

 
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await axios.post('/Marie-ERP/api/fetchSetup', { userId: user.userId ? user.userId : 5 });
        const fetchedData = response.data.data;
        console.log(response);
        const updatedFormData = {
          ...data,
          leave: {
            1: fetchedData.leave.find(item => item.foreigner === 'Yes' && item.fulltime === 'Yes')?.annual_leave || '',
            2: fetchedData.leave.find(item => item.foreigner === 'Yes' && item.fulltime === 'No')?.annual_leave || '',
            3: fetchedData.leave.find(item => item.foreigner === 'No' && item.fulltime === 'Yes')?.annual_leave || '',
            4: fetchedData.leave.find(item => item.foreigner === 'No' && item.fulltime === 'No')?.annual_leave || '',
          },
          carry_forward: fetchedData.leave[0]?.carry_forward === 'Yes' ? 'Yes' : 'No',
          total_labour_count: fetchedData.leave[0]?.total_labour_count || '',

          traceable: {
            permit: fetchedData.traceable[0]?.traceable.permit || '',
            bonus: fetchedData.traceable[0]?.traceable.bonus || '',
            epf: fetchedData.traceable[0]?.traceable.epf || '',
            socso: fetchedData.traceable[0]?.traceable.socso || '',
            eis: fetchedData.traceable[0]?.traceable.eis || '',
            medical: fetchedData.traceable[0]?.traceable.medical || '',
            insurance: fetchedData.traceable[0]?.traceable.insurance || '',
            others: fetchedData.traceable[0]?.traceable.others || '',
          },

          data : {
            1 : {permit : fetchedData.traceable[0]?.data.traceable.permit === 'Yes' ? 'Yes' : 'No', bonus : fetchedData.traceable[0]?.data.traceable.bonus === 'Yes' ? 'Yes' : 'No', epf : fetchedData.traceable[0]?.data.traceable.epf === 'Yes' ? 'Yes' : 'No', socso : fetchedData.traceable[0]?.data.traceable.socso === 'Yes' ? 'Yes' : 'No', eis : fetchedData.traceable[0]?.data.traceable.eis === 'Yes' ? 'Yes' : 'No', medical : fetchedData.traceable[0]?.data.traceable.medical === 'Yes' ? 'Yes' : 'No', insurance : fetchedData.traceable[0]?.data.traceable.insurance === 'Yes' ? 'Yes' : 'No', others : fetchedData.traceable[0]?.data.traceable.others === 'Yes' ? 'Yes' : 'No'},
            2 : {permit : fetchedData.traceable[1]?.data.traceable.permit === 'Yes' ? 'Yes' : 'No', bonus : fetchedData.traceable[1]?.data.traceable.bonus === 'Yes' ? 'Yes' : 'No', epf : fetchedData.traceable[1]?.data.traceable.epf === 'Yes' ? 'Yes' : 'No', socso : fetchedData.traceable[1]?.data.traceable.socso === 'Yes' ? 'Yes' : 'No', eis : fetchedData.traceable[1]?.data.traceable.eis === 'Yes' ? 'Yes' : 'No', medical : fetchedData.traceable[1]?.data.traceable.medical === 'Yes' ? 'Yes' : 'No', insurance : fetchedData.traceable[1]?.data.traceable.insurance === 'Yes' ? 'Yes' : 'No', others : fetchedData.traceable[1]?.data.traceable.others === 'Yes' ? 'Yes' : 'No'},
            3 : {permit : fetchedData.traceable[2]?.data.traceable.permit === 'Yes' ? 'Yes' : 'No', bonus : fetchedData.traceable[2]?.data.traceable.bonus === 'Yes' ? 'Yes' : 'No', epf : fetchedData.traceable[2]?.data.traceable.epf === 'Yes' ? 'Yes' : 'No', socso : fetchedData.traceable[2]?.data.traceable.socso === 'Yes' ? 'Yes' : 'No', eis : fetchedData.traceable[2]?.data.traceable.eis === 'Yes' ? 'Yes' : 'No', medical : fetchedData.traceable[2]?.data.traceable.medical === 'Yes' ? 'Yes' : 'No', insurance : fetchedData.traceable[2]?.data.traceable.insurance === 'Yes' ? 'Yes' : 'No', others : fetchedData.traceable[2]?.data.traceable.others === 'Yes' ? 'Yes' : 'No'},
            4 : {permit : fetchedData.traceable[3]?.data.traceable.permit === 'Yes' ? 'Yes' : 'No', bonus : fetchedData.traceable[3]?.data.traceable.bonus === 'Yes' ? 'Yes' : 'No', epf : fetchedData.traceable[3]?.data.traceable.epf === 'Yes' ? 'Yes' : 'No', socso : fetchedData.traceable[3]?.data.traceable.socso === 'Yes' ? 'Yes' : 'No', eis : fetchedData.traceable[3]?.data.traceable.eis === 'Yes' ? 'Yes' : 'No', medical : fetchedData.traceable[3]?.data.traceable.medical === 'Yes' ? 'Yes' : 'No', insurance : fetchedData.traceable[3]?.data.traceable.insurance === 'Yes' ? 'Yes' : 'No', others : fetchedData.traceable[3]?.data.traceable.others === 'Yes' ? 'Yes' : 'No'},
          },
        };
  
        setFormData(updatedFormData);
        setLoading(false)
      } catch (error) {
        console.log(error);
        setLoading(false)
      }
    };
  
   
  
  useEffect(() => {
    fetchData()
  }, [])


  return (
    <>
    <div><p className='fs-3'>Setup</p></div>
    <p>Enter basic information about your labour pool.</p>

    <div>
    <button className={`btn rounded-0 border border-black  ${show ? 'text-white' : 'text-black' }`} style={{backgroundColor : show ? '#002060' : 'white'}} onClick={() => setShow(true)}>Leave Policy</button>
    <button className={`btn rounded-0 border border-black ${show ? 'text-black' : 'text-white' }`} style={{backgroundColor : show ? 'white' : '#002060'}} onClick={() => setShow(false)}>Expenditure</button>
    </div>

    {loading ? (
      <div className='d-flex align-content-center justify-content-center'>
    <p className=''>Loading...</p>
    </div>) : (
      <>
    {show ? (
      <>
    <Row className='mt-4'>
      <Col>
      <Form.Group>
        <Form.Label>Total labour count</Form.Label>
      <Form.Control type='number' placeholder='Enter total employee count' value={data.total_labour_count} className='w-50' onChange={(e) => handleTotalChange(e.target.value)}/>
      </Form.Group>
     </Col>
      <Col className='d-flex justify-content-end'>
      {/* <button className='btn fs-2'><i class="fa-regular fa-pen-to-square"></i></button> */}
      <button className='btn fs-2' onClick={handleSubmit}><i class="fa-regular fa-floppy-disk"></i></button>
      </Col>
    </Row>

    <Row>
      <Col>
      <Table bordered className='text-center'>
        <thead style={{fontSize : '18px', backgroundColor : '#4472c4', color : 'white'}} >
          <th rowSpan={2} className='py-4 border '>Leave</th>
          <th colSpan={2} className='py-4 border '>Foreigners</th>
          <th colSpan={2} className='py-4 border '>Locals</th>
          <th rowSpan={2} className='py-2 border '>Carry forward balance days?</th>
        </thead>      
        <tbody className='tableBody'>
          <tr>
            <td className='' style={{backgroundColor : '#4472c4'}}></td>
            <th style={{backgroundColor : colors.tablesub}}>Full Time</th>
            <th style={{backgroundColor : colors.tablesub}}>Part Time</th>
            <th style={{backgroundColor : colors.tablesub}}>Full Time</th>
            <th style={{backgroundColor : colors.tablesub}}>Part Time</th>
            <td style={{backgroundColor : '#4472c4'}}></td>
          </tr>

          <tr className=''>
            <td style={{backgroundColor : colors.entry, width : '15%'}} className='fs-5 pt-3'>Annual</td>
            <td style={{backgroundColor : colors.entry}}>
            <Form.Control
            type='number'
            placeholder='days'
            value={data.leave[1]}
            onChange={(e) => handleInputChange(1, e.target.value)}
          />
              </td>
            <td style={{backgroundColor : colors.entry}}><Form.Control type='number' placeholder='days' value={data.leave[2]}
            onChange={(e) => handleInputChange(2, e.target.value)} /></td>
            <td style={{backgroundColor : colors.entry}}><Form.Control type='number' placeholder='days' value={data.leave[3]}
            onChange={(e) => handleInputChange(3, e.target.value)}/></td>
            <td style={{backgroundColor : colors.entry}}><Form.Control type='number' placeholder='days' value={data.leave[4]}
            onChange={(e) => handleInputChange(4, e.target.value)}/></td>
            <td style={{backgroundColor : colors.entry}}> <Form.Check
            className='fs-3 pt-2'
            type='checkbox'
            checked={data.carry_forward === 'Yes'}
            onChange={(e) => handleCarry(e.target.checked)}
          /></td>
          </tr>
          
        </tbody>
        </Table>

        <div className='text-end'>
        <button className='btn rounded-0 text-white px-4 mt-4 fs-5' style={{backgroundColor : '#002060'}} onClick={() => setShow(false)}>Next <i class="fa-solid fa-chevron-right"></i></button></div>
      </Col>
    </Row></>
    
    ) : (
    
    <>

    <Row>
    <Col></Col>
      <Col className='d-flex justify-content-end'>
      {/* <button className='btn fs-2'><i class="fa-regular fa-pen-to-square"></i></button> */}
      <button className='btn fs-2' onClick={handleSubmit}><i class="fa-regular fa-floppy-disk"></i></button>
      </Col>
    </Row>
    
    
    <Table bordered className='text-center shadow '>
      <thead style={{fontSize : '18px', backgroundColor : '#4472c4', color : 'white'}} >
        <th className='py-2 border'>Labour related costs</th>
        <th className='py-2 border'>{`${commonApi.currency} per month`}</th>
        <th className='py-2 border' colSpan={2}>Foreigners</th>
        <th className='py-2 border' colSpan={2}>Locals</th>
      </thead>

      <tbody>
        <tr>
          <td style={{backgroundColor : '#4472c4'}} className='border-0'></td>
          <td style={{backgroundColor : '#4472c4'}} className='border-0'></td>
          <th style={{backgroundColor : colors.tablesub}}>Full Time</th>
          <th style={{backgroundColor : colors.tablesub}}>Part Time</th>
          <th style={{backgroundColor : colors.tablesub}}>Full Time</th>
          <th style={{backgroundColor : colors.tablesub}}>Part Time</th>
        </tr>

        <tr >
          <th style={{backgroundColor : colors.entry}} className='pt-4 border-white border'>Permits</th>
          <td style={{backgroundColor : colors.entry}} className='border-white boxPad border'><Form.Control className='inputBox' type='number' value={data.traceable['permit']} onChange={(e) => handleTraceChange('permit', e.target.value)}/></td>
          <td style={{backgroundColor : colors.entry}} className='fs-3 pt-3 border-white border'><Form.Check checked={data.data[1].permit === 'Yes'} onChange={(e) => handleNestedInputChange(1, 'permit', e.target.checked ? 'Yes': 'No')}/></td>
          <td style={{backgroundColor : colors.entry}} className='fs-3 pt-3 border-white border'><Form.Check checked={data.data[2].permit === 'Yes'} onChange={(e) => handleNestedInputChange(2, 'permit', e.target.checked ? 'Yes': 'No')}/></td>
          <td style={{backgroundColor : colors.entry}} className='fs-3 pt-3 border-white border'><Form.Check checked={data.data[3].permit === 'Yes'} onChange={(e) => handleNestedInputChange(3, 'permit', e.target.checked ? 'Yes': 'No')}/></td>
          <td style={{backgroundColor : colors.entry}} className='fs-3 pt-3 border-white border'><Form.Check checked={data.data[4].permit === 'Yes'} onChange={(e) => handleNestedInputChange(4, 'permit', e.target.checked ? 'Yes': 'No')}/></td>
        </tr>

        <tr>
          <th style={{backgroundColor : colors.entry}} className='pt-4 border-white border'>Bonus</th>
          <td style={{backgroundColor : colors.entry}} className='border-white boxPad border'><Form.Control className='inputBox' type='number'value={data.traceable['bonus']} onChange={(e) => handleTraceChange('bonus', e.target.value)}/></td>
          <td style={{backgroundColor : colors.entry}} className='fs-3 pt-3 border-white border' ><Form.Check checked={data.data[1].bonus === 'Yes'} onChange={(e) => handleNestedInputChange(1, 'bonus', e.target.checked ? 'Yes': 'No')}/></td>
          <td style={{backgroundColor : colors.entry}} className='fs-3 pt-3 border-white border' ><Form.Check checked={data.data[2].bonus === 'Yes'} onChange={(e) => handleNestedInputChange(2, 'bonus', e.target.checked ? 'Yes': 'No')}/></td>
          <td style={{backgroundColor : colors.entry}} className='fs-3 pt-3 border-white border' ><Form.Check checked={data.data[3].bonus === 'Yes'} onChange={(e) => handleNestedInputChange(3, 'bonus', e.target.checked ? 'Yes': 'No')}/></td>
          <td style={{backgroundColor : colors.entry}} className='fs-3 pt-3 border-white border' ><Form.Check checked={data.data[4].bonus === 'Yes'} onChange={(e) => handleNestedInputChange(4, 'bonus', e.target.checked ? 'Yes': 'No')}/></td>
        </tr>

        <tr>
          <th style={{backgroundColor : colors.entry}} className='pt-4 border-white border'>EPF - Employer</th>
          <td style={{backgroundColor : colors.entry}} className='border-white boxPad border'><Form.Control className='inputBox' type='number' value={data.traceable['epf']} onChange={(e) => handleTraceChange('epf', e.target.value)}/></td>
          <td style={{backgroundColor : colors.entry}} className='fs-3 pt-3 border-white border' ><Form.Check checked={data.data[1].epf === 'Yes'}  onChange={(e) => handleNestedInputChange(1, 'epf', e.target.checked ? 'Yes': 'No')}/></td>
          <td style={{backgroundColor : colors.entry}} className='fs-3 pt-3 border-white border' ><Form.Check checked={data.data[2].epf === 'Yes'}  onChange={(e) => handleNestedInputChange(2, 'epf', e.target.checked ? 'Yes': 'No')}/></td>
          <td style={{backgroundColor : colors.entry}} className='fs-3 pt-3 border-white border' ><Form.Check checked={data.data[3].epf === 'Yes'}  onChange={(e) => handleNestedInputChange(3, 'epf', e.target.checked ? 'Yes': 'No')}/></td>
          <td style={{backgroundColor : colors.entry}} className='fs-3 pt-3 border-white border' ><Form.Check checked={data.data[4].epf === 'Yes'}  onChange={(e) => handleNestedInputChange(4, 'epf', e.target.checked ? 'Yes': 'No')}/></td>
        </tr>

        <tr>
          <th style={{backgroundColor : colors.entry}} className='pt-4 border-white border'>SOCSO - Employer</th>
          <td style={{backgroundColor : colors.entry}} className='border-white boxPad border'><Form.Control className='inputBox' type='number' value={data.traceable['socso']} onChange={(e) => handleTraceChange('socso', e.target.value)}/></td>
          <td style={{backgroundColor : colors.entry}} className='fs-3 pt-3 border-white border' ><Form.Check checked={data.data[1].socso === 'Yes'} onChange={(e) => handleNestedInputChange(1, 'socso', e.target.checked ? 'Yes': 'No')}/></td>
          <td style={{backgroundColor : colors.entry}} className='fs-3 pt-3 border-white border' ><Form.Check checked={data.data[2].socso === 'Yes'} onChange={(e) => handleNestedInputChange(2, 'socso', e.target.checked ? 'Yes': 'No')}/></td>
          <td style={{backgroundColor : colors.entry}} className='fs-3 pt-3 border-white border' ><Form.Check checked={data.data[3].socso === 'Yes'} onChange={(e) => handleNestedInputChange(3, 'socso', e.target.checked ? 'Yes': 'No')}/></td>
          <td style={{backgroundColor : colors.entry}} className='fs-3 pt-3 border-white border' ><Form.Check checked={data.data[4].socso === 'Yes'} onChange={(e) => handleNestedInputChange(4, 'socso', e.target.checked ? 'Yes': 'No')}/></td>
        </tr>

        <tr>
          <th style={{backgroundColor : colors.entry}} className='pt-4 border-white border'>EIS - Employer</th>
          <td style={{backgroundColor : colors.entry}} className='border-white boxPad border'><Form.Control className='inputBox' type='number' value={data.traceable['eis']} onChange={(e) => handleTraceChange('eis', e.target.value)}/></td>
          <td style={{backgroundColor : colors.entry}} className='fs-3 pt-3 border-white border' ><Form.Check checked={data.data[1].eis === 'Yes'} onChange={(e) => handleNestedInputChange(1, 'eis', e.target.checked ? 'Yes': 'No')}/></td>
          <td style={{backgroundColor : colors.entry}} className='fs-3 pt-3 border-white border' ><Form.Check checked={data.data[2].eis === 'Yes'} onChange={(e) => handleNestedInputChange(2, 'eis', e.target.checked ? 'Yes': 'No')}/></td>
          <td style={{backgroundColor : colors.entry}} className='fs-3 pt-3 border-white border' ><Form.Check checked={data.data[3].eis === 'Yes'} onChange={(e) => handleNestedInputChange(3, 'eis', e.target.checked ? 'Yes': 'No')}/></td>
          <td style={{backgroundColor : colors.entry}} className='fs-3 pt-3 border-white border' ><Form.Check checked={data.data[4].eis === 'Yes'} onChange={(e) => handleNestedInputChange(4, 'eis', e.target.checked ? 'Yes': 'No')}/></td>
        </tr>

        <tr>
          <th style={{backgroundColor : colors.entry}} className='pt-4 border-white border'>Medical</th>
          <td style={{backgroundColor : colors.entry}} className='border-white boxPad border'><Form.Control className='inputBox' type='number' value={data.traceable['medical']} onChange={(e) => handleTraceChange('medical', e.target.value)}/></td>
          <td style={{backgroundColor : colors.entry}} className='fs-3 pt-3 border-white border' ><Form.Check checked={data.data[1].medical === 'Yes'} onChange={(e) => handleNestedInputChange(1, 'medical', e.target.checked ? 'Yes': 'No')}/></td>
          <td style={{backgroundColor : colors.entry}} className='fs-3 pt-3 border-white border' ><Form.Check checked={data.data[2].medical === 'Yes'} onChange={(e) => handleNestedInputChange(2, 'medical', e.target.checked ? 'Yes': 'No')}/></td>
          <td style={{backgroundColor : colors.entry}} className='fs-3 pt-3 border-white border' ><Form.Check checked={data.data[3].medical === 'Yes'} onChange={(e) => handleNestedInputChange(3, 'medical', e.target.checked ? 'Yes': 'No')}/></td>
          <td style={{backgroundColor : colors.entry}} className='fs-3 pt-3 border-white border' ><Form.Check checked={data.data[4].medical === 'Yes'} onChange={(e) => handleNestedInputChange(4, 'medical', e.target.checked ? 'Yes': 'No')}/></td>
        </tr>

        <tr>
          <th style={{backgroundColor : colors.entry}} className='pt-4 border-white border'>Insurance</th>
          <td style={{backgroundColor : colors.entry}} className='border-white boxPad border'><Form.Control className='inputBox' type='number' value={data.traceable['insurance']} onChange={(e) => handleTraceChange('insurance', e.target.value)}/></td>
          <td style={{backgroundColor : colors.entry}} className='fs-3 pt-3 border-white border' ><Form.Check checked={data.data[1].insurance === 'Yes'} onChange={(e) => handleNestedInputChange(1, 'insurance', e.target.checked ? 'Yes': 'No')}/></td>
          <td style={{backgroundColor : colors.entry}} className='fs-3 pt-3 border-white border' ><Form.Check checked={data.data[2].insurance === 'Yes'} onChange={(e) => handleNestedInputChange(2, 'insurance', e.target.checked ? 'Yes': 'No')}/></td>
          <td style={{backgroundColor : colors.entry}} className='fs-3 pt-3 border-white border' ><Form.Check checked={data.data[3].insurance === 'Yes'} onChange={(e) => handleNestedInputChange(3, 'insurance', e.target.checked ? 'Yes': 'No')}/></td>
          <td style={{backgroundColor : colors.entry}} className='fs-3 pt-3 border-white border' ><Form.Check checked={data.data[4].insurance === 'Yes'} onChange={(e) => handleNestedInputChange(4, 'insurance', e.target.checked ? 'Yes': 'No')}/></td>
        </tr>

        <tr>
          <th style={{backgroundColor : colors.entry}} className='pt-4 border-white border'>Others</th>
          <td style={{backgroundColor : colors.entry}} className='border-white boxPad border'><Form.Control className='inputBox' type='number' value={data.traceable['others']} onChange={(e) => handleTraceChange('others', e.target.value)}/></td>
          <td style={{backgroundColor : colors.entry}} className='fs-3 pt-3 border-white border' ><Form.Check checked={data.data[1].others === 'Yes'} onChange={(e) => handleNestedInputChange(1, 'others', e.target.checked ? 'Yes': 'No')}/></td>
          <td style={{backgroundColor : colors.entry}} className='fs-3 pt-3 border-white border' ><Form.Check checked={data.data[2].others === 'Yes'} onChange={(e) => handleNestedInputChange(2, 'others', e.target.checked ? 'Yes': 'No')}/></td>
          <td style={{backgroundColor : colors.entry}} className='fs-3 pt-3 border-white border' ><Form.Check checked={data.data[3].others === 'Yes'} onChange={(e) => handleNestedInputChange(3, 'others', e.target.checked ? 'Yes': 'No')}/></td>
          <td style={{backgroundColor : colors.entry}} className='fs-3 pt-3 border-white border' ><Form.Check checked={data.data[4].others === 'Yes'} onChange={(e) => handleNestedInputChange(4, 'others', e.target.checked ? 'Yes': 'No')}/></td>
        </tr>
      </tbody>
    </Table>

    <div className='pb-5'></div>
    </>
    )} </>)}
    </>
  )
}

export default LabourSetup