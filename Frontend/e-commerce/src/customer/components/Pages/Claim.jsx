import React from "react";
import { Container, Typography, Box } from "@mui/material";
import "./LegalPages.css";

const Claim = () => {
  return (
    <div className="legal-page-container">
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box className="legal-paper" sx={{ p: { xs: 3, sm: 5, md: 8 } }}>
          <Typography
            className="legal-heading"
            sx={{ fontSize: { xs: "2rem", sm: "2.75rem", md: "3.5rem" }, mb: 2 }}
          >
            Claims and Returns
          </Typography>

          <Typography className="legal-date" sx={{ mb: 5 }}>
            Last Updated: February 15, 2026
          </Typography>

          <Typography className="legal-body legal-paragraph">
            At HKL Sons, your satisfaction is our priority. If you have received a damaged or 
            defective product, or if you need to make a claim, we are here to help.
          </Typography>

          <div className="legal-divider" />

          <Typography className="legal-subheading" sx={{ fontSize: { xs: "1.4rem", md: "1.75rem" } }}>
            Damaged or Defective Items
          </Typography>

          <Typography className="legal-body legal-paragraph">
            If you receive a damaged or defective item, please contact us within 48 hours of 
            delivery. We will arrange for a replacement or full refund at no additional cost to you.
          </Typography>

          <Typography className="legal-subheading" sx={{ fontSize: { xs: "1.4rem", md: "1.75rem" } }}>
            How to File a Claim
          </Typography>

          <Typography className="legal-body legal-paragraph">
            To file a claim, please follow these steps:
          </Typography>

          <ol className="legal-ordered-list">
            <li className="legal-ordered-item">
              Contact our customer service team at support@hklsons.com or call us at 1-800-HKL-SONS
            </li>
            <li className="legal-ordered-item">
              Provide your order number and a description of the issue
            </li>
            <li className="legal-ordered-item">
              Include photos of the damaged or defective item (if applicable)
            </li>
            <li className="legal-ordered-item">
              Our team will review your claim within 1-2 business days
            </li>
            <li className="legal-ordered-item">
              Once approved, we will process your replacement or refund
            </li>
          </ol>

          <Typography className="legal-subheading" sx={{ fontSize: { xs: "1.4rem", md: "1.75rem" } }}>
            Return Policy
          </Typography>

          <Typography className="legal-body legal-paragraph">
            We accept returns within 30 days of delivery for most items. The item must be in 
            its original condition, unused, and in its original packaging.
          </Typography>

          <ul className="legal-list">
            <li className="legal-list-item">
              <strong>Full Refund:</strong> Available for items returned within 14 days
            </li>
            <li className="legal-list-item">
              <strong>Store Credit:</strong> Available for items returned within 15-30 days
            </li>
            <li className="legal-list-item">
              <strong>Final Sale Items:</strong> Cannot be returned unless damaged or defective
            </li>
          </ul>

          <Typography className="legal-subheading" sx={{ fontSize: { xs: "1.4rem", md: "1.75rem" } }}>
            Shipping Damage Claims
          </Typography>

          <Typography className="legal-body legal-paragraph">
            If your package arrives damaged, please refuse the delivery or note the damage with 
            the delivery person. Contact us immediately so we can file a claim with the carrier 
            and arrange for a replacement.
          </Typography>

          <Typography className="legal-subheading" sx={{ fontSize: { xs: "1.4rem", md: "1.75rem" } }}>
            Lost Package Claims
          </Typography>

          <Typography className="legal-body legal-paragraph">
            If your package is marked as delivered but you did not receive it, please check with 
            neighbors or building management. If you still cannot locate your package, contact us 
            within 7 days and we will investigate with the carrier.
          </Typography>

          <div className="legal-divider" />

          <Typography className="legal-subheading" sx={{ fontSize: { xs: "1.4rem", md: "1.75rem" } }}>
            Contact Us
          </Typography>

          <Typography className="legal-body legal-paragraph">
            For any questions or concerns about claims and returns, please reach out:
          </Typography>

          <Box className="legal-contact-box">
            <div className="legal-contact-item">
              <span className="legal-contact-label">Email:</span>
              <span>support@hklsons.com</span>
            </div>
            <div className="legal-contact-item">
              <span className="legal-contact-label">Phone:</span>
              <span>1-800-HKL-SONS</span>
            </div>
            <div className="legal-contact-item">
              <span className="legal-contact-label">Hours:</span>
              <span>Monday - Friday, 9:00 AM - 6:00 PM EST</span>
            </div>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default Claim;