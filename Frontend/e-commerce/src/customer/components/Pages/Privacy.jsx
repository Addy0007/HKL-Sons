import React from "react";
import { Container, Typography, Box } from "@mui/material";
import "./LegalPages.css";

const Privacy = () => {
  return (
    <div className="legal-page-container">
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box className="legal-paper" sx={{ p: { xs: 3, sm: 5, md: 8 } }}>
          <Typography
            className="legal-heading"
            sx={{ fontSize: { xs: "2rem", sm: "2.75rem", md: "3.5rem" }, mb: 2 }}
          >
            Privacy Policy
          </Typography>

          <Typography className="legal-date" sx={{ mb: 5 }}>
            Last Updated: February 15, 2026
          </Typography>

          <Typography className="legal-body legal-paragraph">
            At HKL Sons, we are committed to protecting your privacy and ensuring the security 
            of your personal information. This Privacy Policy explains how we collect, use, 
            and safeguard your data.
          </Typography>

          <div className="legal-divider" />

          <Typography className="legal-subheading" sx={{ fontSize: { xs: "1.4rem", md: "1.75rem" } }}>
            Information We Collect
          </Typography>

          <Typography className="legal-body legal-paragraph">
            We collect information that you provide directly to us, including:
          </Typography>

          <ul className="legal-list">
            <li className="legal-list-item">
              Name, email address, and contact information
            </li>
            <li className="legal-list-item">
              Shipping and billing addresses
            </li>
            <li className="legal-list-item">
              Payment information (processed securely through third-party payment processors)
            </li>
            <li className="legal-list-item">
              Order history and preferences
            </li>
          </ul>

          <Typography className="legal-subheading" sx={{ fontSize: { xs: "1.4rem", md: "1.75rem" } }}>
            How We Use Your Information
          </Typography>

          <Typography className="legal-body legal-paragraph">
            We use the information we collect to:
          </Typography>

          <ul className="legal-list">
            <li className="legal-list-item">
              Process and fulfill your orders
            </li>
            <li className="legal-list-item">
              Communicate with you about your orders and our services
            </li>
            <li className="legal-list-item">
              Improve our products and services
            </li>
            <li className="legal-list-item">
              Send you promotional materials (with your consent)
            </li>
          </ul>

          <Typography className="legal-subheading" sx={{ fontSize: { xs: "1.4rem", md: "1.75rem" } }}>
            Data Security
          </Typography>

          <Typography className="legal-body legal-paragraph">
            We implement appropriate technical and organizational measures to protect your 
            personal information against unauthorized access, alteration, disclosure, or destruction.
          </Typography>

          <Typography className="legal-subheading" sx={{ fontSize: { xs: "1.4rem", md: "1.75rem" } }}>
            Your Rights
          </Typography>

          <Typography className="legal-body legal-paragraph">
            You have the right to access, correct, or delete your personal information. 
            You may also opt out of marketing communications at any time.
          </Typography>

          <div className="legal-divider" />

          <Typography className="legal-subheading" sx={{ fontSize: { xs: "1.4rem", md: "1.75rem" } }}>
            Contact Us
          </Typography>

          <Typography className="legal-body legal-paragraph">
            If you have any questions about this Privacy Policy, please contact us at privacy@hklsons.com
          </Typography>
        </Box>
      </Container>
    </div>
  );
};

export default Privacy;