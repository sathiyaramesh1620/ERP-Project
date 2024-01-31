import { useState } from "react";
import { Col } from "react-bootstrap";

export default function TableCategory({ value }) {
  const [select, setSelect] = useState(false);
  return (
    <Col className="px-3" md={3}>
      <button
        onClick={() => setSelect((pre) => !pre)}
        variant="light"
        id="butto"
        className="px-5 py-5 w-100 text-black justify-content-center"
        style={{ backgroundColor: `${select ? "#FCA311" : "white"}` }}>
        <span>{value}</span>
      </button>
    </Col>
  );
}
