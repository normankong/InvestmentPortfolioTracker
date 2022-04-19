/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import SearchBox from "./SearchBox";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";

import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.svg";

import "./Header.css";

export default function Header() {

  const navigate = useNavigate();

  const handleSearch = (symbol) => {
    navigate(`/Search`,   { state : {symbol} });
  };



  const DefaultImage = () => {
    return (
      <img
        alt=""
        src={logo}
        width="30"
        height="30"
        className="d-inline-block align-top"
      />
    );
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Navbar.Brand>
          <DefaultImage/> Investment
          Portfolio Tracker
        </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Nav
                className="me-auto my-2 my-lg-0"
                style={{ maxHeight: "100px" }}
                navbarScroll
              ></Nav>
              <SearchBox handleSearch={handleSearch} /> 
            </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
