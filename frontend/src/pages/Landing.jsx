import React, { useEffect } from "react";
import Layout from "../components/Layout";
import logo from "../images/logo_CMB.png";

import "../styles/landing.css"; // We'll move all CSS here

const Landing = () => {

  useEffect(() => {
    /* Typing Effect */
    const texts = ["Detect Phishing.", "Analyze Risk.", "Scan URLs.", "Protect Data."];
    let textIndex = 0, charIndex = 0, deleting = false;
    const typedText = document.getElementById("typedText");

    function typeEffect() {
      const current = texts[textIndex];
      if (!deleting) {
        typedText.textContent = current.substring(0, charIndex++);
        if (charIndex > current.length) { deleting = true; setTimeout(typeEffect, 1500); return; }
      } else {
        typedText.textContent = current.substring(0, charIndex--);
        if (charIndex < 0) { deleting = false; textIndex = (textIndex + 1) % texts.length; }
      }
      setTimeout(typeEffect, deleting ? 50 : 100);
    }

    typeEffect();

    /* 3D Card Follow Logic */
    const cards = document.querySelectorAll('.service-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        let rect = card.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        let centerX = rect.width / 2;
        let centerY = rect.height / 2;
        let rotateX = (y - centerY) / 10;
        let rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
      });
    });

  }, []);

  return (
    <Layout>
      {/* Glow Backgrounds */}
      <div className="glow" style={{top: "10%", right: "-5%"}}></div>
      <div className="glow" style={{bottom: "10%", left: "-5%", background: "radial-gradient(circle, rgba(0, 209, 255, 0.1) 0%, transparent 70%)"}}></div>

      <section className="hero">
        <div className="hero-content">
          <span style={{color:"#00d1ff", fontWeight:700, letterSpacing:"2px", textTransform:"uppercase", fontSize:"12px"}}>Next-Gen Defense</span>
          <h1>
            Unbreakable Security.<br/>
            <span className="typed-text" id="typedText"></span>
          </h1>
          <p>
            CyberMan centralizes protection against phishing, unsafe permissions, and 
            compliance risks using our proprietary glass-shield architecture.
          </p>
          <button className="register" style={{border:"none", padding:"18px 45px", fontSize:"16px", cursor:"pointer",borderRadius:"25px"}}>Initialize Protection</button>
        </div>

        <div className="mascot-box">
          <div className="mascot-orb">
            <img src={logo} alt="Mascot" height="200vw" />
          </div>
        </div>
      </section>

      <section className="services">
  <h2>CyberMan <span>Core Services</span></h2>

  <div className="slider-track">

    {/* 1. Email Phishing Detection */}
    <div className="service-card">
      <img src="https://img.icons8.com/fluency/96/email-open.png" alt="Email Phishing" />
      <h3>Email Phishing Detection</h3>
      <p>
        Paste email sender and content to instantly classify phishing risk using
        AI-driven semantic and behavioral analysis.
      </p>
    </div>

    {/* 2. Encrypted Vault */}
    <div className="service-card">
      <img src="https://img.icons8.com/fluency/96/lock.png" alt="Encrypted Vault" />
      <h3>Encrypted Vault</h3>
      <p>
        Secure digital vault for credentials, documents, and evidence using
        industry-grade encryption and zero-trust access control.
      </p>
    </div>

    {/* 3. Fraud Report Generator */}
    <div className="service-card">
      <img src="https://img.icons8.com/fluency/96/document.png" alt="Fraud Report" />
      <h3>Fraud Report Generator</h3>
      <p>
        Auto-generates structured cyber fraud reports and guides users step-by-step
        to file complaints on the official Cyber Crime portal.
      </p>
    </div>

    {/* 4. URL Scanner */}
    <div className="service-card">
      <img src="https://img.icons8.com/fluency/96/domain.png" alt="URL Scanner" />
      <h3>URL Risk Scanner</h3>
      <p>
        Scans URLs for phishing, malware, redirects, and reputation threats
        before users interact with them.
      </p>
    </div>

   

  </div>
</section>

    </Layout>
  );
};

export default Landing;
