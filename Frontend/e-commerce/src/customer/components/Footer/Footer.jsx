import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Container,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Footer = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Company",
      items: [
        { label: "About", path: "/about" },
      ],
    },
    {
      title: "Legal",
      items: [
        { label: "Claim", path: "/claim" },
        { label: "Privacy", path: "/privacy" },
        { label: "Terms", path: "/terms" },
      ],
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#0d0d0d",
        color: "white",
        width: "100%",
        mt: { xs: 6, sm: 8, md: 10 },
        pt: { xs: 4, sm: 5, md: 6 },
        pb: { xs: 3, sm: 3, md: 4 },
      }}
    >
      <Container maxWidth="lg">
        {/* ==== Desktop / Tablet Footer ==== */}
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            justifyContent: { sm: "flex-start", md: "flex-start", lg: "flex-start" },
            gap: { sm: 6, md: 8, lg: 12 },
            mb: { sm: 4, md: 5 },
            flexWrap: "wrap",
          }}
        >
          {sections.map((section, idx) => (
            <Box key={idx} sx={{ minWidth: { sm: "140px", md: "160px" } }}>
              <Typography
                variant="h6"
                sx={{
                  fontSize: { sm: "0.95rem", md: "1rem" },
                  fontWeight: 700,
                  mb: { sm: 1.5, md: 2 },
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  color: "#fff",
                }}
              >
                {section.title}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                {section.items.map((item, i) => (
                  <Button
                    key={i}
                    disableRipple
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      color: "rgba(255,255,255,0.7)",
                      display: "block",
                      textTransform: "none",
                      justifyContent: "flex-start",
                      p: 0.5,
                      fontSize: { sm: "0.875rem", md: "0.95rem" },
                      textAlign: "left",
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                      "&:hover": {
                        color: "#fff",
                        bgcolor: "transparent",
                        transform: "translateX(2px)",
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            </Box>
          ))}
        </Box>

        {/* ==== Mobile Footer (Accordion style) ==== */}
        <Box
          sx={{
            display: { xs: "block", sm: "none" },
            mb: 3,
          }}
        >
          {sections.map((section, idx) => (
            <Accordion
              key={idx}
              elevation={0}
              disableGutters
              sx={{
                background: "transparent",
                color: "white",
                "&:before": {
                  display: "none",
                },
                borderBottom: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "rgba(255,255,255,0.8)" }} />}
                sx={{
                  px: 0,
                  py: 1.5,
                  minHeight: "48px",
                  "&.Mui-expanded": {
                    minHeight: "48px",
                  },
                  "& .MuiAccordionSummary-content": {
                    my: 1,
                  },
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  {section.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 0, pb: 2 }}>
                {section.items.map((item, i) => (
                  <Button
                    key={i}
                    disableRipple
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      color: "rgba(255,255,255,0.7)",
                      display: "block",
                      textTransform: "none",
                      justifyContent: "flex-start",
                      p: 0.75,
                      mb: 0.5,
                      fontSize: "0.9rem",
                      width: "100%",
                      textAlign: "left",
                      cursor: "pointer",
                      "&:hover": {
                        color: "#fff",
                        bgcolor: "transparent",
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        {/* ==== Divider ==== */}
        <Box
          sx={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            width: "100%",
            my: { xs: 2.5, sm: 3, md: 4 },
          }}
        />

        {/* ==== Bottom Info ==== */}
        <Box
          sx={{
            textAlign: "center",
            px: { xs: 1, sm: 2 },
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255,255,255,0.85)",
              mb: 0.75,
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
              fontWeight: 500,
            }}
          >
            © 2025 <strong>HKL SONS ESTD 1902</strong>. All rights reserved.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255,255,255,0.75)",
              mb: 0.75,
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
            }}
          >
            Made with ❤️ by Me.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255,255,255,0.75)",
              fontSize: { xs: "0.75rem", sm: "0.8rem" },
              lineHeight: 1.6,
            }}
          >
            Icons by{" "}
            <Link
              href="https://www.freepik.com"
              color="inherit"
              underline="hover"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                fontWeight: 500,
                transition: "all 0.2s ease",
                "&:hover": {
                  color: "rgba(255,255,255,0.95)",
                },
              }}
            >
              Freepik
            </Link>{" "}
            from{" "}
            <Link
              href="https://www.flaticon.com/"
              color="inherit"
              underline="hover"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                fontWeight: 500,
                transition: "all 0.2s ease",
                "&:hover": {
                  color: "rgba(255,255,255,0.95)",
                },
              }}
            >
              Flaticon
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;