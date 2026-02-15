import React from "react";
import { Container, Typography, Box } from "@mui/material";
import "./LegalPages.css";

const Terms = () => {
  return (
    <div className="legal-page-container">
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box className="legal-paper" sx={{ p: { xs: 3, sm: 5, md: 8 } }}>
          <Typography
            className="legal-heading"
            sx={{ fontSize: { xs: "2rem", sm: "2.75rem", md: "3.5rem" }, mb: 2 }}
          >
            Terms and Conditions
          </Typography>

          <Typography className="legal-date" sx={{ mb: 5 }}>
            Last Updated: February 15, 2026
          </Typography>

          <Typography className="legal-body legal-paragraph">
            Welcome to HKL Sons. By accessing and using our website, you agree to be bound 
            by these Terms and Conditions.
          </Typography>

          <div className="legal-divider" />

          <Typography className="legal-subheading" sx={{ fontSize: { xs: "1.4rem", md: "1.75rem" } }}>
            1. Use of Website
          </Typography>

          <Typography className="legal-body legal-paragraph">
            You agree to use our website only for lawful purposes and in a way that does not 
            infringe the rights of, restrict, or inhibit anyone else's use of the website.
          </Typography>

          <Typography className="legal-subheading" sx={{ fontSize: { xs: "1.4rem", md: "1.75rem" } }}>
            2. Product Information
          </Typography>

          <Typography className="legal-body legal-paragraph">
            We strive to provide accurate product descriptions and pricing. However, we do not 
            warrant that product descriptions, pricing, or other content is accurate, complete, 
            reliable, current, or error-free.
          </Typography>

          <Typography className="legal-subheading" sx={{ fontSize: { xs: "1.4rem", md: "1.75rem" } }}>
            3. Orders and Payment
          </Typography>

          <Typography className="legal-body legal-paragraph">
            By placing an order, you are offering to purchase a product. All orders are subject 
            to acceptance and availability. We reserve the right to refuse any order.
          </Typography>

          <ul className="legal-list">
            <li className="legal-list-item">
              Payment must be received before your order is processed
            </li>
            <li className="legal-list-item">
              Prices are subject to change without notice
            </li>
            <li className="legal-list-item">
              We accept major credit cards and other payment methods as displayed at checkout
            </li>
          </ul>

          <Typography className="legal-subheading" sx={{ fontSize: { xs: "1.4rem", md: "1.75rem" } }}>
            4. Shipping and Delivery
          </Typography>

          <Typography className="legal-body legal-paragraph">
            We will make every effort to deliver your order within the timeframe specified. 
            However, delivery times are estimates and we are not liable for delays caused by 
            circumstances beyond our control.
          </Typography>

          <Typography className="legal-subheading" sx={{ fontSize: { xs: "1.4rem", md: "1.75rem" } }}>
            5. Returns and Refunds
          </Typography>

          <Typography className="legal-body legal-paragraph">
            Please refer to our Return Policy for information about returns and refunds. 
            Items must be returned in their original condition within the specified timeframe.
          </Typography>

          <Typography className="legal-subheading" sx={{ fontSize: { xs: "1.4rem", md: "1.75rem" } }}>
            6. Intellectual Property
          </Typography>

          <Typography className="legal-body legal-paragraph">
            All content on this website, including text, graphics, logos, and images, is the 
            property of HKL Sons and is protected by copyright laws.
          </Typography>

          <Typography className="legal-subheading" sx={{ fontSize: { xs: "1.4rem", md: "1.75rem" } }}>
            7. Limitation of Liability
          </Typography>

          <Typography className="legal-body legal-paragraph">
            HKL Sons shall not be liable for any indirect, incidental, special, or consequential 
            damages arising out of or in connection with the use of our website or products.
          </Typography>

          <Typography className="legal-subheading" sx={{ fontSize: { xs: "1.4rem", md: "1.75rem" } }}>
            8. Changes to Terms
          </Typography>

          <Typography className="legal-body legal-paragraph">
            We reserve the right to modify these Terms and Conditions at any time. Changes will 
            be effective immediately upon posting to the website.
          </Typography>

          <div className="legal-divider" />

          <Typography className="legal-subheading" sx={{ fontSize: { xs: "1.4rem", md: "1.75rem" } }}>
            Contact Information
          </Typography>

          <Typography className="legal-body legal-paragraph">
            If you have any questions about these Terms and Conditions, please contact us at 
            support@hklsons.com
          </Typography>
        </Box>
      </Container>
    </div>
  );
};

export default Terms;