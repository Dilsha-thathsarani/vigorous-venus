import React, { useState } from "react";
import Dashboard from "./Dashboard";
import Sidebar from "./Sidebar";
import Layout from "@/components/layout";

const App: React.FC = () => {
  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
};

export default App;
