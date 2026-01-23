import React from "react";
import ClinicNavbar from "../components/ClinicNavbar";

function ClinicMainLayout({ children }) {
  return (
    <div>
      <ClinicNavbar />
      <main>{children}</main>
    </div>
  );
}

export default ClinicMainLayout;
