import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  AppBar,
  IconButton,
  Typography,
  Box,
  useMediaQuery,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";
import { Routes, Route, useNavigate } from "react-router-dom";

import {
  Menu as MenuIcon,
  LayoutDashboard,
  ShoppingBag,
  Users,
  Receipt,
  PlusSquare,
  UserRoundCog
} from "lucide-react";

import Dashboard from "./Pages/Dashboard";
import CreateProductForm from "./Pages/CreateProductForm";
import ProductsTable from "./Pages/ProductsTable";
import OrderTable from "./Pages/OrderTable";
import CustomerTable from "./Pages/CustomerTable";

const drawerWidth = 240;

const menu = [
  { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
  { name: "Products", path: "/admin/products", icon: <ShoppingBag size={20} /> },
  { name: "Customers", path: "/admin/customers", icon: <Users size={20} /> },
  { name: "Orders", path: "/admin/orders", icon: <Receipt size={20} /> },
  { name: "Add Product", path: "/admin/product/create", icon: <PlusSquare size={20} /> },
];

export default function Admin() {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Drawer content (Sidebar)
  const drawer = (
    <Box
      sx={{
        width: drawerWidth,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
      }}
    >
      <div>
        <Toolbar>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            HKL Admin
          </Typography>
        </Toolbar>

        <List>
          {menu.map((item) => (
            <ListItem key={item.name} disablePadding>
              <ListItemButton onClick={() => navigate(item.path)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </div>

      {/* Bottom User Section */}
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/admin/profile")}>
            <ListItemIcon>
              <UserRoundCog size={22} />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* Top AppBar for mobile */}
      {!isLargeScreen && (
        <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setSidebarOpen(true)}
            >
              <MenuIcon size={22} />
            </IconButton>
            <Typography variant="h6" noWrap>
              Admin Panel
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar Drawer */}
      {isLargeScreen ? (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="temporary"
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      {/* MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: isLargeScreen ? 0 : "64px",
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<ProductsTable />} />
          <Route path="/orders" element={<OrderTable />} />
          <Route path="/customers" element={<CustomerTable />} />
          <Route path="/product/create" element={<CreateProductForm />} />
        </Routes>
      </Box>
    </Box>
  );
}
