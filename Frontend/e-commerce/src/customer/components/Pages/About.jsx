import React from "react";
import { Container, Typography, Box } from "@mui/material";
import "./LegalPages.css";

const About = () => {
  return (
    <div className="legal-page-container">
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box className="legal-paper" sx={{ p: { xs: 3, sm: 5, md: 8 } }}>
          <Typography
            className="legal-heading"
            sx={{ fontSize: { xs: "2rem", sm: "2.75rem", md: "3.5rem" }, mb: 3 }}
          >
            About Us
          </Typography>

          <Typography className="legal-date" sx={{ mb: 5 }}>
            Since 1902
          </Typography>

          <Typography className="legal-subheading" sx={{ fontSize: { xs: "1.4rem", md: "1.75rem" } }}>
            HKL SONS ESTD 1902
          </Typography>

          <Typography className="legal-body legal-paragraph">
            Welcome to HKL Sons, a legacy of excellence that began in 1902. For over a century, 
            we have been committed to providing our customers with premium quality products and 
            exceptional service.
          </Typography>

          <Typography className="legal-body legal-paragraph">
            Our journey started as a small family business, and through dedication, integrity, 
            and a passion for excellence, we have grown into a trusted name. Each generation 
            has brought new ideas while maintaining the core values that our founders established 
            more than 120 years ago.
          </Typography>

          <div className="legal-divider" />

          <Typography className="legal-subheading" sx={{ fontSize: { xs: "1.4rem", md: "1.75rem" } }}>
            Our Mission
          </Typography>

          <Typography className="legal-body legal-paragraph">
            To provide our customers with exceptional products that combine traditional 
            craftsmanship with modern innovation, while maintaining the highest standards 
            of quality and customer service.
          </Typography>

          <Typography className="legal-subheading" sx={{ fontSize: { xs: "1.4rem", md: "1.75rem" } }}>
            Our Values
          </Typography>

          <ul className="legal-list">
            <li className="legal-list-item">
              <strong>Quality:</strong> We never compromise on the quality of our products
            </li>
            <li className="legal-list-item">
              <strong>Integrity:</strong> We conduct business with honesty and transparency
            </li>
            <li className="legal-list-item">
              <strong>Customer First:</strong> Your satisfaction is our top priority
            </li>
            <li className="legal-list-item">
              <strong>Innovation:</strong> We continuously evolve while respecting our heritage
            </li>
          </ul>

          <div className="legal-divider" />

          <Typography className="legal-body" sx={{ mt: 4, fontStyle: "italic" }}>
            Thank you for being part of our journey. We look forward to serving you for many more generations to come.
          </Typography>
        </Box>
      </Container>
    </div>
  );
};

export default About;