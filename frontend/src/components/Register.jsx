import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [role,setRole]=useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    const res = await fetch("http://localhost:5000/api/register",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({name,email,password,role})
    });

    if(res.ok){
      navigate("/login");
    }
  };

  return (
    <div className="page-center">
      <div className="card">
        <h2>Register</h2>

        <input placeholder="Name" onChange={(e)=>setName(e.target.value)} />
        <input placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} />

        <select onChange={(e)=>setRole(e.target.value)}>
          <option>Select Role</option>
          <option>Senior</option>
          <option>Junior</option>
        </select>

        <button className="btn" onClick={handleRegister}>Register</button>

        <Link to="/login" className="link">Already have account?</Link>
      </div>
    </div>
  );
}

export default Register;