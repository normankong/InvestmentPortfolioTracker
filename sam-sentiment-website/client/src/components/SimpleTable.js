/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState } from "react";
import {Table} from "react-bootstrap";

export default function SimpleTable({ list }) {
  return (
    <Table responsive striped bordered hover>
      <tbody>
        {list.map((item, index) => (
          <tr key={index}>
            <td>{item.key}</td>
            <td>{item.value}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
