// src/components/Layout/Layout.jsx
import React from 'react';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import MainContent from '../MainContent/MainContent';
import './Layout.css';

const Layout = ({ currentPage, children }) => {
  return (
    <div className="layout">
      {/* HEADER */}
      <div className="header">
        <Header currentPage={currentPage} />
      </div>

      {/* SIDEBAR */}
      <div className="sidebar">
        <Sidebar />
      </div>

      {/* ZONE DE CONTENU PRINCIPAL */}
      <MainContent>
        {children}
      </MainContent>
    </div>
  );
};

export default Layout;
