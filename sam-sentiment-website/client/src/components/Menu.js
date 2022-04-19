import { Breadcrumb } from "react-bootstrap";
// import { Link } from "react-router-dom";
import React from "react";

export default function Menu() {

  // const MenuItem = ({link, text, hidden}) => {
  //   let path = window.location.pathname;

  //   if (link === path) {
  //     return <li className="breadcrumb-item active">{text}</li>
  //   } else {
  //     return (hidden ? <></> : <li className="breadcrumb-item"><Link to={link}>{text}</Link></li>);
  //   }
  // };

  return (
    <Breadcrumb>
{/* 
      <MenuItem link="/Home" text="Home" />
      <MenuItem link="/Dashboard" text="Dashboard" />
      <MenuItem link="/Search" text="Search Stock" />
      <MenuItem link="/Detail" text="Stock Detail" hidden />
*/}
    </Breadcrumb>
  );
}
