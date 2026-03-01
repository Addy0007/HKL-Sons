import React from "react";
import { Container, Typography, Box } from "@mui/material";
import "./LegalPages.css";

const Privacy = () => {
  return (
    <div className="legal-page-container">
      <Container maxWidth="lg" sx={{ py: { xs: 5, sm: 7, md: 10 } }}>
        <Box className="legal-paper" sx={{ p: { xs: 2.5, sm: 4, md: 7 } }}>

          <Typography
            className="legal-heading"
            sx={{ fontSize: { xs: "1.9rem", sm: "2.6rem", md: "3.4rem" }, mb: 1.5 }}
          >
            Privacy Policy
          </Typography>

          <Typography className="legal-date" sx={{ mb: 4 }}>
            Last Updated: February 15, 2026
          </Typography>

          <Typography className="legal-body legal-paragraph">
            Your privacy matters to us. HklandSons respects your personal information and is
            committed to protecting it.
          </Typography>

          <div className="legal-divider" />

          <Typography className="legal-subheading" sx={{ fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.75rem" } }}>
            Information We Collect
          </Typography>

          <ul className="legal-list">
            <li className="legal-list-item">Name</li>
            <li className="legal-list-item">Contact number</li>
            <li className="legal-list-item">Email address</li>
            <li className="legal-list-item">Shipping &amp; billing address</li>
            <li className="legal-list-item">
              Payment details (processed securely via third-party payment gateways)
            </li>
          </ul>

          <Typography className="legal-subheading" sx={{ fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.75rem" } }}>
            How We Use Your Information
          </Typography>

          <ul className="legal-list">
            <li className="legal-list-item">To process and deliver orders</li>
            <li className="legal-list-item">To improve our services</li>
            <li className="legal-list-item">To send order updates and offers (if subscribed)</li>
            <li className="legal-list-item">To prevent fraud and ensure security</li>
          </ul>

          <Typography className="legal-subheading" sx={{ fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.75rem" } }}>
            Data Protection
          </Typography>

          <Typography className="legal-body legal-paragraph">
            We do not sell or rent your personal data. All transactions are processed through
            secure payment gateways.
          </Typography>

          <Typography className="legal-body legal-paragraph">
            By using our website, you agree to our privacy practices.
          </Typography>

          <div className="legal-divider" />

          <Typography className="legal-subheading" sx={{ fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.75rem" } }}>
            Contact
          </Typography>

          <Box className="legal-contact-box">
            <div className="legal-contact-item">
              <span className="legal-contact-label">Email</span>
              <span>support-hklandsons@gmail.com</span>
            </div>
          </Box>

        </Box>
      </Container>
    </div>
  );
};

export default Privacy;