import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import AskQuestion from "./components/AskQuestion";
import ViewAnswers from "./components/ViewAnswers";
import UploadNotes from "./components/UploadNotes";
import "./App.css";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ask" element={<AskQuestion />} />
        <Route path="/answers/:id" element={<ViewAnswers />} />
        <Route path="/upload" element={<UploadNotes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;