import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "../Navbar";
import CareerHome from "./CareerHome";

import ResumeBuilder from "./ResumeBuilder";
import InternshipFinder from "./InternshipFinder";
import ResumeForm from "./ResumeBuilder/ResumeForm";
import ResumePreview from "./ResumeBuilder/ResumePreview";
import DownloadPDF from "./ResumeBuilder/DownloadPDF";

const CareerGrowth = () => {
  return (
    <>
      {/* Navbar for all /career pages */}
      <Navbar />

      <Routes>
        {/* ✅ DEFAULT → /career */}
        <Route index element={<CareerHome />} />

        {/* Resume Builder */}
        <Route path="resume-builder" element={<ResumeBuilder />} />
        <Route path="resume-builder/form" element={<ResumeForm />} />
        <Route path="resume-builder/preview" element={<ResumePreview />} />
        <Route path="resume-builder/download" element={<DownloadPDF />} />

        {/* Internship Finder */}
        <Route path="internships/*" element={<InternshipFinder />} />
      </Routes>
    </>
  );
};

export default CareerGrowth;
