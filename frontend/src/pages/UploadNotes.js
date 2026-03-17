import { useState } from "react";

function UploadNotes() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleUpload = async () => {
    if (!file || !title) {
      alert("Fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("uploadedBy", user.name);

    try {
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      alert("Uploaded successfully");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-center">
      <div className="card">
        <h2>Upload Notes</h2>

        <input
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button onClick={handleUpload}>Upload</button>
      </div>
    </div>
  );
}

export default UploadNotes;