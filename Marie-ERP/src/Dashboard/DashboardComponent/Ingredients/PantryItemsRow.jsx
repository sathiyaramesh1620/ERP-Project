import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

const PantryItemsRow = (props) => {
  useEffect(() => {
    setData({ ...data, isChecked: props.isSelectAll });
  }, [props.isSelectAll]);

  useEffect(() => {
    setData({
      isChecked: props.data.isChecked,
      ingredient: props.data.ingredient,
      //subtype: props.data.subtype,
      //purchase_cycle: props.data.purchase_cycle,
      ingredientId : props.data.ingredientId,
      measurement: props.data.measurement,
      measurements: props.measurement
})
    // console.log(measurement)
  }, [])
  const [data, setData] = useState({});
  
  //console.log(data.measurements, 'AASSA');

  useEffect(() => {
    props._setIngredientsData(props.index, data);
  }, [data]);

  const handleChange = (_key, _value) => {
    setData((prev) => {
      return { ...prev, [_key]: _value };
    });
  };
 
  //console.log(props.measurement, 'Aash')
  const style = {
    background: "#14213d3d",
  };

  const handleIngredientCheck = (index, isChecked) => {
    setIngredientsData((prevData) => {
      const newData = [...prevData];
      newData[index].isChecked = isChecked;
      return newData;
    });
  };

  const handleMeasurementsChange = (index, value) => {
    setIngredientsData((prevData) => {
      const newData = [...prevData];
      newData[index].measurement = value;
      return newData;
    });
  };
   
  //console.log(props.data.measurement)
  //let measure = props.data.measurement
  //console.log(measure, 'Aaaaaaa')
  
  return (
    <tr className="border" onClick={() => handleChange("isChecked", !data.isChecked)}>
      <td
        className=" d-flex justify-content-center align-content-center"
        style={props.data.isChecked ? style : null}>
        <Form.Check
          className="p-1"
          value={props.data.isChecked}
          checked={props.data.isChecked}
          onChange={(e) => handleChange("isChecked", e.target.checked)}
        />
        <div className="p-1">{props.index + 1}</div>
      </td>
      <td style={props.data.isChecked ? style : null}>
        {props.data.ingredient}
      </td>
      <td style={props.data.isChecked ? style : null}>
        <select
          className="p-1 border-0 bg-transparent rounded-2 w-100"
          value = {props.data.measurement}
          onChange={(e) => handleChange("measurement", e.target.value ? e.target.value : 'kg')}>
            {data.measurements?.map((data, i) => (
                <option key={i} value={data.measurement}>{data.measurement}</option>
              ))}
        </select>
      </td> 
{/*       
      {data.subtype && data.subtype !== "-" && ` - ${data.subtype}`}
      <td style={props.data.isChecked ? style : null}>{props.data.subtype}</td>
      <td style={props.data.isChecked ? style : null}>
        <select
          className="p-1 border-0 bg-transparent rounded-2 w-75"
          value={props.data.purchase_cycle}
          onChange={(e) => handleChange("purchase_cycle", e.target.value)}>
          {props.purchase_cycle?.map((data, i) => {
            return (
              <option key={i} value={data.purchase_type}>
                {" "}
                {data.purchase_type}
              </option>
            );
          })}
        </select>
      </td> */}
      
    </tr>
  );
};

export default PantryItemsRow;
