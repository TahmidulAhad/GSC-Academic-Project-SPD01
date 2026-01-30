import React from "react";
import { Link } from "react-router-dom";

const logo = "/logo01.png";
const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center">
      <img src={logo} alt="logo01" className="h-20 w-30" />
    </Link>
  );
};

export default Logo;
