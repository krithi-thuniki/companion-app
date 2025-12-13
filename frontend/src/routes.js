import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";

// ✅ Auth Pages
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import ForgotPassword from "./components/ForgotPassword";
import HomePage from "./components/HomePage";

// ✅ Academic Tools
import AcademicPage from "./components/Academic";              // ⭐ NEW MAIN PAGE
import SmartNotes from "./components/Academic/SmartNotes";
import AssignmentTracker from "./components/Academic/AssignmentTracker";
import PeerLearning from "./components/Academic/PeerLearning";
import ChatPage from "./components/Academic/PeerLearning/ChatPage";
import FAQs from "./components/Academic/FAQs";

// ✅ Productivity
import Pomodoro from "./components/Productivity/Pomodoro";
import DailyJournal from "./components/Productivity/DailyJournal";

// ✅ Finance & Lifestyle
import SharedExpenses from "./components/FinanceAndLifestyle/SharedExpenses";
import DietTracker from "./components/FinanceAndLifestyle/Diet/DietTracker";

// ✅ Career Growth Wrappers
import ResumeBuilder from "./components/CareerGrowth/ResumeBuilder";
import InternshipFinder from "./components/CareerGrowth/InternshipFinder";

// ✅ Career Growth Submodules (Resume Builder)
import ResumeForm from "./components/CareerGrowth/ResumeBuilder/ResumeForm";
import ResumePreview from "./components/CareerGrowth/ResumeBuilder/ResumePreview";
import DownloadPDF from "./components/CareerGrowth/ResumeBuilder/DownloadPDF";

// ✅ Career Growth Submodules (Internship Finder)
import InternshipSearch from "./components/CareerGrowth/InternshipFinder/InternshipSearch";
import InternshipList from "./components/CareerGrowth/InternshipFinder/InternshipList";
import InternshipDetails from "./components/CareerGrowth/InternshipFinder/InternshipDetails";
import SavedInternships from "./components/CareerGrowth/InternshipFinder/SavedInternships";
import ApplicationTracker from "./components/CareerGrowth/InternshipFinder/ApplicationTracker";
import Badges from "./components/CareerGrowth/InternshipFinder/Badges";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default route → Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth Pages */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Home */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />

        {/* ===========================
              ⭐ Academic Main Page
        ============================ */}
        <Route
          path="/academic"
          element={
            <PrivateRoute>
              <AcademicPage />
            </PrivateRoute>
          }
        />

        {/* ===========================
              Academic Subpages
        ============================ */}
        <Route
          path="/academic/smart-notes"
          element={
            <PrivateRoute>
              <SmartNotes />
            </PrivateRoute>
          }
        />

        <Route
          path="/academic/assignment-tracker"
          element={
            <PrivateRoute>
              <AssignmentTracker />
            </PrivateRoute>
          }
        />

        <Route
          path="/academic/peer-learning"
          element={
            <PrivateRoute>
              <PeerLearning />
            </PrivateRoute>
          }
        />

        <Route
          path="/peerlearning/chat/:groupId"
          element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/academic/faqs"
          element={
            <PrivateRoute>
              <FAQs />
            </PrivateRoute>
          }
        />

        {/* Productivity */}
        <Route
          path="/productivity/pomodoro"
          element={
            <PrivateRoute>
              <Pomodoro />
            </PrivateRoute>
          }
        />

        <Route
          path="/productivity/daily-journal"
          element={
            <PrivateRoute>
              <DailyJournal />
            </PrivateRoute>
          }
        />

        {/* Finance */}
        <Route
          path="/finance/shared-expenses"
          element={
            <PrivateRoute>
              <SharedExpenses />
            </PrivateRoute>
          }
        />

        <Route
          path="/finance/diet/*"
          element={
            <PrivateRoute>
              <DietTracker />
            </PrivateRoute>
          }
        />

        {/* Career Growth Wrappers */}
        <Route
          path="/career-growth/resume-builder"
          element={
            <PrivateRoute>
              <ResumeBuilder />
            </PrivateRoute>
          }
        />

        <Route
          path="/career-growth/internship-finder"
          element={
            <PrivateRoute>
              <InternshipFinder />
            </PrivateRoute>
          }
        />

        {/* Resume Builder Submodules */}
        <Route
          path="/career/resume-builder/form"
          element={
            <PrivateRoute>
              <ResumeForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/career/resume-builder/preview"
          element={
            <PrivateRoute>
              <ResumePreview />
            </PrivateRoute>
          }
        />

        <Route
          path="/career/resume-builder/download"
          element={
            <PrivateRoute>
              <DownloadPDF />
            </PrivateRoute>
          }
        />

        {/* Internship Finder Submodules */}
        <Route
          path="/career/internships/search"
          element={
            <PrivateRoute>
              <InternshipSearch />
            </PrivateRoute>
          }
        />

        <Route
          path="/career/internships/list"
          element={
            <PrivateRoute>
              <InternshipList />
            </PrivateRoute>
          }
        />

        <Route
          path="/career/internships/details/:id"
          element={
            <PrivateRoute>
              <InternshipDetails />
            </PrivateRoute>
          }
        />

        <Route
          path="/career/internships/saved"
          element={
            <PrivateRoute>
              <SavedInternships />
            </PrivateRoute>
          }
        />

        <Route
          path="/career/internships/tracker"
          element={
            <PrivateRoute>
              <ApplicationTracker />
            </PrivateRoute>
          }
        />

        <Route
          path="/career/internships/badges"
          element={
            <PrivateRoute>
              <Badges />
            </PrivateRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
