import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import AskQuestion from "./components/AskQuestion";
import ViewAnswers from "./components/ViewAnswers";
import Profile from "./components/Profile";
import MyNotes from "./components/MyNotes";
import UploadNotes from "./components/UploadNotes";

function App() {
  const [search, setSearch] = useState("");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard search={search} setSearch={setSearch} />} />
        <Route path="/ask" element={<AskQuestion search={search} setSearch={setSearch} />} />
        <Route path="/answers/:id" element={<ViewAnswers search={search} setSearch={setSearch} />} />
        <Route path="/profile" element={<Profile search={search} setSearch={setSearch} />} />
        <Route path="/notes" element={<MyNotes search={search} setSearch={setSearch} />} />
        <Route path="/upload" element={<UploadNotes search={search} setSearch={setSearch} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;