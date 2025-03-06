import React, { useState } from "react";
import { Button, Alert, Spinner } from "react-bootstrap";
import { FaCloudUploadAlt, FaFileUpload } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

function Schedule() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadSuccess(false);
  };

  // Handle file upload (simulating the file upload here)
  const handleUpload = async () => {
    if (!file) {
      console.log("No file selected");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      setUploading(true);
  
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/upload-schedule`, {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Upload failed");
      }
  
      console.log("File uploaded successfully");
      setUploadSuccess(true);
      setFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };
  

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg" style={{ width: "450px" }}>
        <div className="card-body p-5">
          <h2 className="card-title text-center mb-4">
            <FaCloudUploadAlt className="me-2 text-primary" size={40} />
            Upload Schedule
          </h2>

          {/* File Input */}
          <div className="mb-4">
            <div className="input-group w-100 "  >
              <input
              
                type="file"
                className="form-control d-none"
                onChange={handleFileChange}
                disabled={uploading}
                id="fileInput"
              />
              <label 
              style={{cursor:'pointer',color:'#E10174'}}
                className="input-group-text p-5 w-100 fw-bolder  fs-1" 
                htmlFor="fileInput"
              >
                <FaFileUpload className="me-2   fs-1" />
                Browse
              </label>
            </div>
            {file && (
              <small className="text-muted ms-2">
                Selected: {file.name}
              </small>
            )}
          </div>

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-100 mb-3"
            variant="primary"
          >
            {uploading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Uploading...
              </>
            ) : (
              "Upload File"
            )}
          </Button>

          {/* Success Message */}
          {uploadSuccess && (
            <Alert variant="success" className="text-center">
              File uploaded successfully!
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}

export default Schedule;