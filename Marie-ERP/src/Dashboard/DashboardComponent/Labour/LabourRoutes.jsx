import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';


import Labour from '../Labour/Labour';
import LabourSetup from '../Labour/LabourSetup';
import LabourApply from '../Labour/LabourApply';
import LabourRecords from '../Labour/LabourRecords';
import LabourSummary from '../Labour/LabourSummary';

function LabourRoutes() {
    return (
      <Routes>
        <Route path="/" element={<Labour />}>
          <Route index element={<LabourSummary />} />
          <Route path="setup" element={<LabourSetup />} />
          <Route path="apply" element={<LabourApply />} />
          <Route path="records" element={<LabourRecords />} />
        </Route>
      </Routes>
    );
  }

  export default LabourRoutes