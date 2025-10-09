import React from "react";
import { Button, Typography, Grid, Link } from "@mui/material";

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
    <Grid
      container
      direction="column"
      sx={{
        bgcolor: "black",
        color: "white",
        py: 4,
        width: "100vw",
        overflowX: "hidden",
      }}
    >
      {/* === Top Footer Links === */}
      <Grid
        container
        sx={{
          display: "flex",
          flexWrap: "wrap",
          px: 0,
          margin: 0,
        }}
      >
        {sections.map((section, idx) => (
          <Grid
            item
            key={idx}
            xs={12}
            sm={6}
            md={3}
            sx={{
              flexBasis: { xs: "100%", sm: "50%", md: "25%" },
              flexGrow: 1,
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <Typography
              variant="h6"
              sx={{ pb: 2, fontWeight: 600, pl: { md: 4, xs: 0 } }}
            >
              {section.title}
            </Typography>

            {section.items.map((item, i) => (
              <Button
                key={i}
                disableRipple
                disableElevation
                sx={{
                  display: "block",
                  color: "white",
                  textTransform: "none",
                  justifyContent: "flex-start",
                  p: 0,
                  pl: { md: 4, xs: 0 },
                  mb: 1,
                  "&:hover": { color: "gray", background: "transparent" },
                }}
              >
                {item}
              </Button>
            ))}
          </Grid>
        ))}
      </Grid>

      {/* === Bottom Bar === */}
      <Grid
        item
        xs={12}
        sx={{
          textAlign: "center",
          mt: 5,
          pt: 2,
          borderTop: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <Typography variant="body2" component="p" align="center" sx={{ mb: 0.5 }}>
          © 2025 HKL SONS ESTD 1902. All rights reserved.
        </Typography>

        <Typography variant="body2" component="p" align="center" sx={{ mb: 0.5 }}>
          Made with ❤️ by Me.
        </Typography>

        <Typography variant="body2" component="p" align="center">
          Icons made by{" "}
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
            www.flaticon.com
          </Link>
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Footer;
