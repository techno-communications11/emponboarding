import React, { useState } from 'react';

function UploadDocument({email}) {
     console.log(email,'sent email');
   
    const [file, setFile] = useState(null);
    const allowedFileTypes = ["application/pdf", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (!selectedFile) return;
        if (allowedFileTypes.includes(selectedFile.type)) {
            setFile(selectedFile);
        } else {
            alert("Please upload a valid file (PDF, XLS, XLSX).");
            setFile(null);
        }
    };

    const handleUpload = () => {
        if (!email.trim()) {
            alert("Please enter an email.");
            return;
        }
        if (!file) {
            alert("Please select a file before uploading.");
            return;
        }

        const formData = new FormData();
        formData.append("email", email);
        formData.append("file", file);

        fetch(`${process.env.REACT_APP_BASE_URL}/uploadfiles`, {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then((result,error) => {
            console.log("Success:", result);
            if (result && result.message) {
                alert(result.message);
            } else if(result &&result.error){
                alert(result.error);   
            }
            
        })
        .catch(error => {
            console.error("Error:", error);
            alert("File upload failed. Please try again.");
        });
    };

    return (
        <div>
            <h2 className="text-center p-2" style={{ color: "#E01074", fontWeight: "bolder" }}>
                Upload Document
            </h2>
            <input 
                type="email"
                className="form-control my-2 shadow-none" 
                placeholder={email}
                // onChange={(e) => setUserEmail(e.target.value)} 
                value={email}
            />
            <input 
                type="file"
                className="w-100 form-control my-2 shadow-none"
                onChange={handleFileChange}
            />
            <button 
                className="mt-2 btn btn-primary w-100 my-3" 
                onClick={handleUpload}
            >
                Upload
            </button>
        </div>
    );
}

export default UploadDocument;