import React from "react";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";

// ✅ Auth Pages
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import ForgotPassword from "./components/ForgotPassword";
import HomePage from "./components/HomePage";

// ✅ Academic Tools
import AcademicPage from "./components/Academic";   
import SmartNotes from "./components/Academic/SmartNotes";
import AssignmentTracker from "./components/Academic/AssignmentTracker";
import PeerLearning from "./components/Academic/PeerLearning";
import ChatPage from "./components/Academic/PeerLearning/ChatPage";
import FAQs from "./components/Academic/FAQs";

// ✅ Productivity
import Pomodoro from "./components/Productivity/Pomodoro";
import DailyJournal from "./components/Productivity/DailyJournal";
import ProductivityHome from "./components/Productivity/Home";

// ✅ Finance & Lifestyle

import FinanceHome from "./components/FinanceAndLifestyle";
import DietTracker from "./components/FinanceAndLifestyle/Diet/DietTracker";
import Expenses from "./components/FinanceAndLifestyle/SharedExpenses";
import FinanceLanding from "./components/FinanceAndLifestyle/Landing";


// ✅ Career Growth Wrappers

import CareerGrowth from "./components/CareerGrowth";

// ✅ Career Growth Submodules (Resume Builder)


// ✅ Career Growth Submodules (Internship Finder)
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
          <Route path="/" element={<HomePage />} />
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
  path="/productivity"
  element={
    <PrivateRoute>
      <ProductivityHome />
    </PrivateRoute>
  }
/>

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
       {/* ===========================
    Finance & Lifestyle
=========================== */}
<Route
  path="/finance"
  element={
    <PrivateRoute>
      <FinanceHome />
    </PrivateRoute>
  }
>
    <Route index element={<FinanceLanding />} />

  <Route path="diet/*" element={<DietTracker />} />
  <Route path="expenses" element={<Expenses />} />
</Route>

<Route
  path="/career/*"
  element={
    <PrivateRoute>
      <CareerGrowth />
    </PrivateRoute>
  }
/>

    
     
        {/* Internship Finder Submodules */}
       
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
