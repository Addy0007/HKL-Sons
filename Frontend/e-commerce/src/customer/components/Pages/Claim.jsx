import React from "react";
import { Container, Typography, Box } from "@mui/material";
import "./LegalPages.css";

const Claim = () => {
  return (
    <div className="legal-page-container">
      <Container maxWidth="lg" sx={{ py: { xs: 5, sm: 7, md: 10 } }}>
        <Box className="legal-paper" sx={{ p: { xs: 2.5, sm: 4, md: 7 } }}>

          <Typography
            className="legal-heading"
            sx={{ fontSize: { xs: "1.9rem", sm: "2.6rem", md: "3.4rem" }, mb: 1.5 }}
          >
            Claim Policy
          </Typography>

          <Typography className="legal-date" sx={{ mb: 4 }}>
            Last Updated: February 15, 2026
          </Typography>

          <Typography className="legal-body legal-paragraph">
            At HklandSons, customer satisfaction is our priority. If you experience any issue
            with your order, we are here to help.
          </Typography>

          <div className="legal-divider" />

          <Typography className="legal-subheading" sx={{ fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.75rem" } }}>
            1. Damaged or Defective Products
          </Typography>

          <Typography className="legal-body legal-paragraph">
            If you receive a damaged, defective, or incorrect product, please follow these steps:
          </Typography>

          <ol className="legal-ordered-list">
            <li className="legal-ordered-item">Notify us within 48 hours of delivery</li>
            <li className="legal-ordered-item">Share clear photos or videos as proof</li>
            <li className="legal-ordered-item">Provide your order number</li>
          </ol>

          <Typography className="legal-body legal-paragraph">
            After verification, we will offer a replacement or provide a refund as per eligibility.
          </Typography>

          <Typography className="legal-subheading" sx={{ fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.75rem" } }}>
            2. Missing Items
          </Typography>

          <Typography className="legal-body legal-paragraph">
            If any item is missing from your order, contact us within 48 hours of delivery.
            Our team will investigate and resolve the issue promptly.
          </Typography>

          <Typography className="legal-subheading" sx={{ fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.75rem" } }}>
            3. Non-Eligible Claims
          </Typography>

          <Typography className="legal-body legal-paragraph">
            Claims may not be accepted in the following cases:
          </Typography>

          <ul className="legal-list">
            <li className="legal-list-item">The product has been used</li>
            <li className="legal-list-item">The request is made after the claim window</li>
            <li className="legal-list-item">The product was damaged due to misuse</li>
          </ul>

          <Typography className="legal-body legal-paragraph">
            We aim to process all valid claims within <strong>5–7 business days</strong>.
          </Typography>

          <div className="legal-divider" />

          <Typography className="legal-subheading" sx={{ fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.75rem" } }}>
            Contact Support
          </Typography>

          <Box className="legal-contact-box">
            <div className="legal-contact-item">
              <span className="legal-contact-label">Email</span>
              <span>support-hklandsons@gmail.com</span>
            </div>
            <div className="legal-contact-item">
              <span className="legal-contact-label">Phone</span>
              <span>+91-9557661587</span>
            </div>
            <div className="legal-contact-item">
              <span className="legal-contact-label">Hours</span>
              <span>Monday – Saturday, 10:00 AM – 7:00 PM IST</span>
            </div>
          </Box>

        </Box>
      </Container>
    </div>
  );
};

export default Claim;