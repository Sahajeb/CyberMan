import React, { useState } from "react";
import { jsPDF } from "jspdf";
import "../styles/generateReport.css";

const Report = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    fraudType: "",
    incidentDate: "",
    description: ""
  });

  const [reference, setReference] = useState("");
  const [evidence, setEvidence] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState("");
  const [pdfBlob, setPdfBlob] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle image upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setEvidence(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Validate form
  const validateForm = () => {
    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.fraudType.trim() ||
      !form.incidentDate ||
      !form.description.trim()
    ) {
      setError("All fields are required.");
      return false;
    }

    setError("");
    return true;
  };

  // Build PDF and return blob
  const buildPDF = () => {
    const doc = new jsPDF();
    const ref = "CYB-" + Date.now();
    setReference(ref);

    doc.setFont("times");
    doc.setFontSize(16);
    doc.text("CYBER CRIME COMPLAINT ", 105, 20, { align: "center" });

    doc.setFontSize(12);

    doc.text(`Reference No: ${ref}`, 20, 35);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 42);

    doc.text("Complainant Information:", 20, 55);
    doc.text("Name: " + form.name, 20, 65);
    doc.text("Email: " + form.email, 20, 75);
    doc.text("Phone: " + form.phone, 20, 85);

    doc.text("Incident Information:", 20, 100);
    doc.text("Offence Type: " + form.fraudType, 20, 110);
    doc.text("Incident Date: " + form.incidentDate, 20, 120);

    doc.text("Detailed Description:", 20, 135);
    const splitText = doc.splitTextToSize(form.description, 170);
    doc.text(splitText, 20, 145);

    if (evidence) {
      doc.addPage();
      doc.text("Supporting Evidence:", 20, 20);
      doc.addImage(evidence, "JPEG", 20, 30, 160, 90);
    }

    doc.addPage();
    doc.text("DECLARATION", 105, 30, { align: "center" });
    doc.text(
      "I hereby declare that the information furnished above",
      20,
      50
    );
    doc.text(
      "is true and correct to the best of my knowledge.",
      20,
      60
    );
    doc.text(
      "Signature of Complainant: ____________________",
      20,
      100
    );
    doc.text("Date: ____________________", 20, 115);

    return doc.output("blob");
  };

  // Button logic
  const handleGenerate = () => {
    if (generated) {
      // Download on second click
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Report_${reference}.pdf`;
      a.click();
      return;
    }

    if (!validateForm()) return;

    setLoading(true);

    setTimeout(() => {
      const blob = buildPDF();
      setPdfBlob(blob);
      setGenerated(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="report-page">
      <div className="report-card">
        <h1 className="report-title">Cyber Crime Report Generator</h1>

        <div className="form-grid">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
          />
          <input
            type="text"
            name="fraudType"
            placeholder="Fraud Type"
            onChange={handleChange}
          />
          <input
            type="date"
            name="incidentDate"
            onChange={handleChange}
          />
        </div>

        <textarea
          name="description"
          placeholder="Describe the incident in detail..."
          rows="5"
          onChange={handleChange}
        />

        <input type="file" accept="image/*" onChange={handleFileUpload} />

        {error && <div className="error-msg">{error}</div>}

        <button
          className={generated ? "download-btn" : "generate-btn"}
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading
            ? "Generating..."
            : generated
            ? "Download Report"
            : "Generate Report"}
        </button>

        {generated && (
          <div className="success-animation">
            ✔ Report Generated Successfully
            <div className="ref-no">Reference: {reference}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Report;