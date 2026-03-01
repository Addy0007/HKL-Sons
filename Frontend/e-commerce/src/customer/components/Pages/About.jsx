import React from "react";
import { Container, Typography, Box } from "@mui/material";
import "./LegalPages.css";

const About = () => {
  return (
    <div className="legal-page-container">
      <Container maxWidth="lg" sx={{ py: { xs: 5, sm: 7, md: 10 } }}>
        <Box className="legal-paper" sx={{ p: { xs: 2.5, sm: 4, md: 7 } }}>

          <Typography
            className="legal-heading"
            sx={{ fontSize: { xs: "1.9rem", sm: "2.6rem", md: "3.4rem" }, mb: 1.5 }}
          >
            About Us
          </Typography>

          <Typography className="legal-date" sx={{ mb: 4 }}>
            Founded in 1902 · Building trust since day one
          </Typography>

          <Typography className="legal-subheading" sx={{ fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.75rem" } }}>
            Founded in 1902. Built on Trust. Continuing a Legacy.
          </Typography>

          <Typography className="legal-body legal-paragraph">
            HklandSons began its journey in 1902 when our great grandfather opened a small radio shop
            with a simple vision — to bring quality products and honest service to the community.
          </Typography>

          <Typography className="legal-body legal-paragraph">
            At a time when radio was revolutionizing communication, he believed in innovation,
            reliability, and customer relationships. That foundation of trust became the
            cornerstone of our family business.
          </Typography>

          <Typography className="legal-body legal-paragraph">
            More than a century later, we proudly carry forward that legacy.
          </Typography>

          <div className="legal-divider" />

          <Typography className="legal-subheading" sx={{ fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.75rem" } }}>
            Who We Are Today
          </Typography>

          <Typography className="legal-body legal-paragraph">
            Today, HklandSons has evolved into a modern online hypermarket, offering a wide range
            of quality products across multiple categories. While the marketplace has changed, our
            values remain the same:
          </Typography>

          <ul className="legal-list">
            <li className="legal-list-item">✔️ Integrity in every transaction</li>
            <li className="legal-list-item">✔️ Quality you can rely on</li>
            <li className="legal-list-item">✔️ Fair pricing</li>
            <li className="legal-list-item">✔️ Customer-first service</li>
          </ul>

          <Typography className="legal-body legal-paragraph" sx={{ mt: 2 }}>
            We blend tradition with technology — honoring our roots while embracing the future
            of online retail.
          </Typography>

          <div className="legal-divider" />

          <Typography
            className="legal-body"
            sx={{
              mt: 1,
              fontStyle: "italic",
              fontSize: { xs: "1rem", md: "1.15rem" },
              color: "var(--col-gold) !important",
              fontFamily: "var(--font-heading) !important",
              fontWeight: "500 !important",
              letterSpacing: "0.01em",
            }}
          >
            HklandSons — Serving Generations Since 1902.
          </Typography>

        </Box>
      </Container>
    </div>
  );
};

export default About;