import React from "react";
import {
  Grid,
  Typography,
  Button,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Footer = () => {
  const sections = [
    {
      title: "Company",
      items: ["About", "Blog", "Press", "Investors"],
    },
    {
      title: "Solutions",
      items: ["Marketing", "Analytics", "Commerce", "Insights"],
    },
    {
      title: "Documentation",
      items: ["Guides", "API Status"],
    },
    {
      title: "Legal",
      items: ["Claim", "Privacy", "Terms"],
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#0d0d0d",
        color: "white",
        width: "100%",
        mt: 8,
        pt: 5,
        pb: 3,
      }}
    >
      {/* ==== Desktop / Tablet Footer ==== */}
      <Grid
        container
        spacing={2}
        sx={{
          display: { xs: "none", sm: "grid" },
          gridTemplateColumns: {
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          maxWidth: "1200px",
          mx: "auto",
          px: 3,
          mb: 4,
        }}
      >
        {sections.map((section, idx) => (
          <Box key={idx}>
            <Typography
              variant="h6"
              sx={{
                fontSize: "1rem",
                fontWeight: 700,
                mb: 2,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {section.title}
            </Typography>
            {section.items.map((item, i) => (
              <Button
                key={i}
                disableRipple
                sx={{
                  color: "rgba(255,255,255,0.75)",
                  display: "block",
                  textTransform: "none",
                  justifyContent: "flex-start",
                  p: 0,
                  mb: 1,
                  fontSize: "0.95rem",
                  "&:hover": { color: "#fff" },
                }}
              >
                {item}
              </Button>
            ))}
          </Box>
        ))}
      </Grid>

      {/* ==== Mobile Footer (Accordion style) ==== */}
      <Box
        sx={{
          display: { xs: "block", sm: "none" },
          px: 2,
          mb: 3,
        }}
      >
        {sections.map((section, idx) => (
          <Accordion
            key={idx}
            sx={{
              background: "transparent",
              color: "white",
              boxShadow: "none",
              borderBottom: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
              sx={{ p: 0 }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, fontSize: "0.95rem" }}
              >
                {section.title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pl: 1 }}>
              {section.items.map((item, i) => (
                <Typography
                  key={i}
                  sx={{
                    color: "rgba(255,255,255,0.75)",
                    fontSize: "0.9rem",
                    mb: 1,
                  }}
                >
                  {item}
                </Typography>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* ==== Divider ==== */}
      <Box
        sx={{
          borderTop: "1px solid rgba(255,255,255,0.15)",
          width: "90%",
          mx: "auto",
          my: 3,
        }}
      />

      {/* ==== Bottom Info ==== */}
      <Box
        sx={{
          textAlign: "center",
          maxWidth: "1200px",
          mx: "auto",
          px: 2,
        }}
      >
        <Typography
          variant="body2"
          sx={{ color: "rgba(255,255,255,0.85)", mb: 0.5 }}
        >
          © 2025 <strong>HKL SONS ESTD 1902</strong>. All rights reserved.
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "rgba(255,255,255,0.8)", mb: 0.5 }}
        >
          Made with ❤️ by Me.
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "rgba(255,255,255,0.8)" }}
        >
          Icons by{" "}
          <Link
            href="https://www.freepik.com"
            color="inherit"
            underline="always"
            target="_blank"
            rel="noopener noreferrer"
          >
            Freepik
          </Link>{" "}
          from{" "}
          <Link
            href="https://www.flaticon.com/"
            color="inherit"
            underline="always"
            target="_blank"
            rel="noopener noreferrer"
          >
            Flaticon
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
