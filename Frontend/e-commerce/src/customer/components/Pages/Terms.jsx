import React from "react";
import { Container, Typography, Box } from "@mui/material";
import "./LegalPages.css";

const Terms = () => {
  return (
    <div className="legal-page-container">
      <Container maxWidth="lg" sx={{ py: { xs: 5, sm: 7, md: 10 } }}>
        <Box className="legal-paper" sx={{ p: { xs: 2.5, sm: 4, md: 7 } }}>

          <Typography
            className="legal-heading"
            sx={{ fontSize: { xs: "1.9rem", sm: "2.6rem", md: "3.4rem" }, mb: 1.5 }}
          >
            Terms &amp; Conditions
          </Typography>

          <Typography className="legal-date" sx={{ mb: 4 }}>
            Last Updated: February 15, 2026
          </Typography>

          <Typography className="legal-body legal-paragraph">
            By accessing and using HklandSons, you agree to the following terms and conditions.
            Please read them carefully before using our platform.
          </Typography>

          <div className="legal-divider" />

          <Typography className="legal-subheading" sx={{ fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.75rem" } }}>
            1. Product Condition Transparency
          </Typography>

          <Typography className="legal-body legal-paragraph">
            Thrifted products are pre-owned. Buyers acknowledge that minor wear is part of
            sustainable reuse unless otherwise specified.
          </Typography>

          <Typography className="legal-subheading" sx={{ fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.75rem" } }}>
            2. Pricing
          </Typography>

          <Typography className="legal-body legal-paragraph">
            Prices may vary based on condition, rarity, or availability — especially for
            one-of-a-kind thrift items.
          </Typography>

          <Typography className="legal-subheading" sx={{ fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.75rem" } }}>
            3. Order Acceptance
          </Typography>

          <Typography className="legal-body legal-paragraph">
            We reserve the right to cancel orders due to:
          </Typography>

          <ul className="legal-list">
            <li className="legal-list-item">Pricing errors</li>
            <li className="legal-list-item">Stock unavailability</li>
            <li className="legal-list-item">Suspected fraudulent activity</li>
          </ul>

          <Typography className="legal-subheading" sx={{ fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.75rem" } }}>
            4. Intellectual Property
          </Typography>

          <Typography className="legal-body legal-paragraph">
            All website content, branding, logos, and materials belong to HklandSons and
            may not be used without prior written permission.
          </Typography>

          <Typography className="legal-subheading" sx={{ fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.75rem" } }}>
            5. Limitation of Liability
          </Typography>

          <Typography className="legal-body legal-paragraph">
            HklandSons is not liable for:
          </Typography>

          <ul className="legal-list">
            <li className="legal-list-item">Minor wear inherent in thrift products</li>
            <li className="legal-list-item">Courier delays</li>
            <li className="legal-list-item">Indirect or incidental damages</li>
          </ul>

          <Typography className="legal-subheading" sx={{ fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.75rem" } }}>
            6. Governing Law
          </Typography>

          <Typography className="legal-body legal-paragraph">
            These terms are governed under the laws of <strong>India</strong>.
          </Typography>

          <div className="legal-divider" />

          <Typography className="legal-body legal-paragraph">
            For any questions regarding these Terms &amp; Conditions, reach us at{" "}
            <strong>support-hklandsons@gmail.com</strong>
          </Typography>

        </Box>
      </Container>
    </div>
  );
};

export default Terms;