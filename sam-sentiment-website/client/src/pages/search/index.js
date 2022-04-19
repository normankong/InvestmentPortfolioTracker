/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from "react";
import { Table, Container } from "react-bootstrap";
import { Form, FormControl, Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { InfoCircle } from "react-bootstrap-icons";

import apiHelper from "../../api/apiHelper";
import Menu from "../../components/Menu";

export default function Search() {

  const location = useLocation();
  const [search, setSearch] = useState("");
  const [symbol, setSymbol] = useState("");
  const [timeoutId, setTimeoutId] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (timeoutId != null) {
      console.log(`Clear Timeout ${timeoutId}`);
      clearTimeout(timeoutId);
    }

    if (symbol !== "") {
      let timeout = setTimeout(() => {
        fetchData(symbol);
      }, 250);
      console.log(`Creating Timeout ${timeout} for symbol ${symbol}`);
      setTimeoutId(timeout);
    }
  };

  useEffect(() => {
    let tmpSymbol = location?.state?.symbol;
    if (tmpSymbol) {
      setSymbol(tmpSymbol);
    }
  }, [location]);

  useEffect(() => {
    handleSearch();
  }, [symbol]);

  const showDetail = (symbol) => {
    navigate(`/Detail`, { state: { symbol } });
  };

  async function fetchData(tmpCode) {
    console.log("Searching for " + tmpCode);
    const searchResult = await apiHelper.searchSymbol(tmpCode);
    setSearch(searchResult);
  }
  return (
    <>
      <Container>
        <Menu />

        <Form className="d-flex">
          <FormControl
            type="search"
            placeholder="Symbol"
            className="me-2"
            aria-label="Symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            onKeyPress={(e) => {
              e.key === "Enter" && e.preventDefault();
            }}
          />
        </Form>

        <hr />
        {(!symbol || symbol === "") && <>Please input stock symbol</>}
        {symbol && search && (
          <>
            <h3>Search result for {symbol}</h3>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Symbol</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {search.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.symbol}</td>
                    <td>
                      <Button onClick={() => showDetail(item.symbol)} variant="warning" size="sm" aria-label="Show Detail"  >
                        <InfoCircle className="button" />
                      </Button>{' '}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
        
      </Container>
    </>
  );
}
