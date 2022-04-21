import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Search from "./pages/search";
import Detail from "./pages/detail";

import React from "react";

import "./App.css";

function App() {
  return (
    <>
      <Header />
      <div className="body">
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="/Search" element={<Search />} />
          <Route path="/Detail" element={<Detail />} />
          <Route path="*" element={<h1>Sorry 404</h1>} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
