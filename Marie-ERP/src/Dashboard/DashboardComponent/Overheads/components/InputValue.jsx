import { useContext } from "react";
import { OverheadsContext } from "../OverHeadsContext";
import { Form } from "react-bootstrap";

export default function InputValue({ data, index }) {
  const { state, dispatcher } = useContext(OverheadsContext);
  console.log(state);
  return (
    <tr className="text-end Process-builder-table">
      <td>
        <p
          className=""
          style={{
            fontSize: "0.8rem",
          }}>
          {data}
        </p>
      </td>
      <td className="ps-1 pe-3">:</td>
      <td className="col-3">
        <Form.Control
          type="number"
          value={state.data[index]?.processBuilderRelationship[data]}
          onChange={(e) =>
            dispatcher({
              type: "ProcessBuilder",
              payload: {
                key: data,
                index,
                value: e.target.value,
              },
            })
          }
        />
        {/* <input
            className="mx-1"
            type="number"
            value={value[data]}
            onChange={(e) => handleChange(e)}
            style={{
              maxWidth: "50px",
            }}
          /> */}
      </td>
      <td className="text-start">
        <strong>%</strong>
      </td>
    </tr>
  );
}
