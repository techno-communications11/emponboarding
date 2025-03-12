import React, { useState } from "react";
import {
  Button,
  Alert,
  Spinner,
  Card,
  Modal,
} from "react-bootstrap";
import { FaCloudUploadAlt, FaFileUpload } from "react-icons/fa";
import { motion } from "framer-motion"; // Import motion from framer-motion
import "bootstrap/dist/css/bootstrap.min.css";
import WeeklySchedule from "./WeeklySchedule";

function Schedule() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadSuccess(false);
  };

  // Handle file upload
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
    <div className="container-fluid py-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* Custom CSS for Modern Styling */}
      <style>
        {`
          .upload-card {
            border: none;
            border-radius: 16px;
          
            background: #fff;
          
            max-width: 500px;
            margin: 0 auto;
          }
         
          .header-text {
            color: #2d3748;
            font-weight: 700;
            font-size: 1.75rem;
          }
          .upload-area {
            border: 2px dashed #dfe6e9;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            background: #fbfdff;
            transition: border-color 0.3s ease;
            cursor: pointer;
          }
          .upload-area:hover {
            border-color: #007bff;
          }
          .upload-area.active {
            border-color: #007bff;
            background: #e6f0ff;
          }
          .btn-modern {
            background: linear-gradient(90deg, #007bff, #0056b3);
            border: none;
            border-radius: 25px;
            padding: 10px 20px;
            font-weight: 600;
            color: white;
            box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
          }
          .btn-modern:hover {
            background: linear-gradient(90deg, #0056b3, #003d82);
            box-shadow: 0 6px 15px rgba(0, 123, 255, 0.4);
          }
          .btn-modern:disabled {
            background: #b0bec5;
            box-shadow: none;
          }
          .alert-modern {
            border-radius: 8px;
            font-size: 0.9rem;
            padding: 10px 15px;
          }
          .file-name {
            color: #6b7280;
            font-size: 0.9rem;
          }
          @media (max-width: 576px) {
            .upload-card {
              width: 90%;
            }
            .header-text {
              font-size: 1.5rem;
            }
            .upload-area {
              padding: 15px;
            }
          }
        `}
      </style>

      <div>
        {/* Upload Button with Motion */}
        <div
        >
          <Button
            variant="primary"
            className=" w-100 mb-4"
            onClick={() => setShowModal(true)}
          >
            <FaCloudUploadAlt className="me-2" /> Upload Schedule
          </Button>
        </div>

        {/* Modal for File Upload */}
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          centered
          
        >
      
          <Modal.Body>
            <Card className="upload-card p-4">
              <Card.Body>
                <h2 className="header-text text-center mb-4">
                  <FaCloudUploadAlt className="me-2" style={{ color: "#007bff" }} size={32} />
                  Upload Schedule
                </h2>

                {/* File Input */}
                <div
                  className={`upload-area mb-4 ${file ? "active" : ""}`}
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  <input
                    type="file"
                    className="d-none"
                    id="fileInput"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                  <FaFileUpload size={30} style={{ color: "#007bff" }} />
                  <p className="mt-2 mb-0 fw-bold" style={{ color: "#2d3748" }}>
                    {file ? "File Selected" : "Click to Browse"}
                  </p>
                  {file && <small className="file-name">Selected: {file.name}</small>}
                </div>

                {/* Upload File Button with Motion */}
                <div
                >
                  <Button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className="w-100 btn-modern"
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
                </div>

                {/* Success Message */}
                {uploadSuccess && (
                  <motion.div
                   
                    className="mt-3"
                  >
                    <Alert variant="success" className="alert-modern text-center">
                      File uploaded successfully!
                    </Alert>
                  </motion.div>
                )}
              </Card.Body>
            </Card>
          </Modal.Body>
        </Modal>

        {/* Weekly Schedule */}
        <WeeklySchedule  className="card"/>
      </div>
    </div>
  );
}

export default Schedule;