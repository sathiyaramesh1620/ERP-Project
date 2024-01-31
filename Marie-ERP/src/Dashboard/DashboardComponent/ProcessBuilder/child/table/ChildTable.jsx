import React from 'react'
import { Row, Col } from 'react-bootstrap';
import styles from "./ChildTable.module.css"

export default function ChildTable({ activityCode, name }) {

  return (
    <>
      <Row className="mt-5">
        <Col lg={8} style={{ padding: "0" }}>
          <table className={`${styles.tableBody}`}>
            <thead>
              <tr>
                <th className={`${styles.tableHead}`}>Activity code</th>
                <th className={`${styles.tableHead}`}>{activityCode}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  style={{ border: "none" }}
                  className={`${styles.tableData}`}>
                  Name
                </td>
                <td
                  style={{ border: "none" }}
                  className={`${styles.tableData}`}>
                  {name}
                </td>
              </tr>
            </tbody>
          </table>
        </Col>
      </Row>
    </>
  );
}
