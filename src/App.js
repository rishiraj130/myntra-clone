import React from 'react';
import { Routes, Route } from "react-router-dom";

import CatalogPage from './pages/CatalogPage';

const App = (props) => {
  return (
      <Routes>
          <Route path="/" element={<CatalogPage {...props}/>} />
     </Routes>
  );
}

export default App;
