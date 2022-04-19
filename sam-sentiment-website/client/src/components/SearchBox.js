/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

export default function SearchBox({ handleSearch }) {
  const [symbol, setSymbol] = useState("");

  return (
    <Form className="d-flex">
      <FormControl
        type="search"
        placeholder="Symbol"
        className="me-2"
        aria-label="Symbol"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSearch(symbol);
          }
        }}
      />
      <Button
        variant="primary"
        onClick={() => {
          handleSearch(symbol);
        }}
      >
        Search
      </Button>
    </Form>
  );
}
