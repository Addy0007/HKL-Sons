import React from "react";
import {
  Grid,
  Paper,
  Box,
  Typography,
} from "@mui/material";
import {
  Wallet,
  TrendingUp,
  RefreshCcw,
  ShoppingCart,
  Award,
  Calendar,
  BarChart3,
} from "lucide-react";

const StatCard = ({ title, value, icon, color }) => (
  <Paper
    elevation={3}
    style={{
      padding: "20px",
      borderRadius: "16px",
      display: "flex",
      alignItems: "center",
      gap: "16px",
      background: "white",
    }}
  >
    <Box
      sx={{
        backgroundColor: color,
        padding: 2,
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography variant="subtitle2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h5" fontWeight={700}>
        {value}
      </Typography>
    </Box>
  </Paper>
);

const Dashboard = () => {
  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Dashboard Overview
      </Typography>

      {/* ---------------------- TOP STATS ---------------------- */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Total Earnings"
            value="₹12,540"
            color="#E8F5E9"
            icon={<Wallet size={28} color="#2E7D32" />}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <StatCard
            title="Total Profit"
            value="₹8,210"
            color="#E3F2FD"
            icon={<TrendingUp size={28} color="#1976D2" />}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <StatCard
            title="Refunds"
            value="₹320"
            color="#FFF3E0"
            icon={<RefreshCcw size={28} color="#EF6C00" />}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <StatCard
            title="New Orders"
            value="36"
            color="#FCE4EC"
            icon={<ShoppingCart size={28} color="#C2185B" />}
          />
        </Grid>
      </Grid>

      {/* ---------------------- ACHIEVEMENT + MONTHLY ---------------------- */}

      <Grid container spacing={3} mt={3}>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              padding: "20px",
              borderRadius: "16px",
              height: "100%",
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Award size={32} color="#6A1B9A" />
              <Typography variant="h6" fontWeight={700}>
                Achievement
              </Typography>
            </Box>

            <Typography mt={2} color="text.secondary">
              🎉 Congratulations! Your first month sales crossed ₹10,000.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper
            elevation={3}
            sx={{
              padding: "20px",
              borderRadius: "16px",
              height: "100%",
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Calendar size={32} color="#0288D1" />
              <Typography variant="h6" fontWeight={700}>
                Monthly Overview
              </Typography>
            </Box>

            {/* Replace with chart later */}
            <Box
              mt={4}
              sx={{
                height: "200px",
                background: "#F5F5F5",
                borderRadius: "12px",
              }}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* ---------------------- WEEKLY OVERVIEW ---------------------- */}
      <Grid container spacing={3} mt={3}>
        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{ padding: "20px", borderRadius: "16px" }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <BarChart3 size={32} color="#1565C0" />
              <Typography variant="h6" fontWeight={700}>
                Weekly Overview
              </Typography>
            </Box>

            {/* Replace with graph later */}
            <Box
              mt={4}
              sx={{
                height: "250px",
                background: "#F5F5F5",
                borderRadius: "12px",
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
