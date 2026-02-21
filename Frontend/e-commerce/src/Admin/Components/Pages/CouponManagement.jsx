import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Percent,
  Calendar,
  Users,
  TrendingUp,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { api } from "../../../Config/apiConfig";

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  // Form state
  const [formData, setFormData] = useState({
    id: null,
    code: "",
    description: "",
    discountPercentage: "",
    maxDiscountAmount: "",
    minOrderAmount: "",
    isActive: true,
    isFirstOrderOnly: false,
    validFrom: "",
    validUntil: "",
    maxUsagePerUser: 1,
    totalUsageLimit: "",
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/admin/coupons");
      setCoupons(response.data || []);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      showAlert("error", "Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: "", message: "" }), 5000);
  };

  const handleOpenDialog = (coupon = null) => {
    if (coupon) {
      // Edit mode
      setEditMode(true);
      setFormData({
        id: coupon.id,
        code: coupon.code,
        description: coupon.description,
        discountPercentage: coupon.discountPercentage,
        maxDiscountAmount: coupon.maxDiscountAmount || "",
        minOrderAmount: coupon.minOrderAmount || "",
        isActive: coupon.isActive,
        isFirstOrderOnly: coupon.isFirstOrderOnly,
        validFrom: coupon.validFrom ? coupon.validFrom.slice(0, 16) : "",
        validUntil: coupon.validUntil ? coupon.validUntil.slice(0, 16) : "",
        maxUsagePerUser: coupon.maxUsagePerUser,
        totalUsageLimit: coupon.totalUsageLimit || "",
      });
    } else {
      // Create mode
      setEditMode(false);
      setFormData({
        id: null,
        code: "",
        description: "",
        discountPercentage: "",
        maxDiscountAmount: "",
        minOrderAmount: "",
        isActive: true,
        isFirstOrderOnly: false,
        validFrom: "",
        validUntil: "",
        maxUsagePerUser: 1,
        totalUsageLimit: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
  };

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.code || !formData.description || !formData.discountPercentage) {
      showAlert("error", "Please fill in all required fields");
      return;
    }

    if (formData.discountPercentage < 0 || formData.discountPercentage > 100) {
      showAlert("error", "Discount percentage must be between 0 and 100");
      return;
    }

    try {
      // Prepare data for API
      const payload = {
        code: formData.code.toUpperCase(),
        description: formData.description,
        discountPercentage: parseFloat(formData.discountPercentage),
        maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : null,
        minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : null,
        isActive: formData.isActive,
        isFirstOrderOnly: formData.isFirstOrderOnly,
        validFrom: formData.validFrom || null,
        validUntil: formData.validUntil || null,
        maxUsagePerUser: parseInt(formData.maxUsagePerUser) || 1,
        totalUsageLimit: formData.totalUsageLimit ? parseInt(formData.totalUsageLimit) : null,
      };

      if (editMode) {
        // Update existing coupon
        await api.put(`/api/admin/coupons/${formData.id}`, payload);
        showAlert("success", "Coupon updated successfully!");
      } else {
        // Create new coupon
        await api.post("/api/admin/coupons", payload);
        showAlert("success", "Coupon created successfully!");
      }

      handleCloseDialog();
      fetchCoupons();
    } catch (error) {
      console.error("Error saving coupon:", error);
      showAlert("error", error.response?.data?.message || "Failed to save coupon");
    }
  };

  const handleToggleActive = async (coupon) => {
    try {
      const payload = {
        ...coupon,
        isActive: !coupon.isActive,
      };
      
      await api.put(`/api/admin/coupons/${coupon.id}`, payload);
      
      // Update local state immediately for better UX
      setCoupons(prevCoupons =>
        prevCoupons.map(c =>
          c.id === coupon.id ? { ...c, isActive: !c.isActive } : c
        )
      );
      
      showAlert("success", `Coupon ${!coupon.isActive ? "activated" : "deactivated"} successfully!`);
    } catch (error) {
      console.error("Error toggling coupon:", error);
      showAlert("error", "Failed to update coupon status");
      // Refresh to ensure UI is in sync with backend
      fetchCoupons();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;

    try {
      await api.delete(`/api/admin/coupons/${id}`);
      showAlert("success", "Coupon deleted successfully!");
      fetchCoupons();
    } catch (error) {
      console.error("Error deleting coupon:", error);
      const errorMessage = error.response?.data?.message || "Failed to delete coupon";
      showAlert("error", errorMessage);
    }
  };

  // Filter coupons
  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && coupon.isActive) ||
      (filterStatus === "inactive" && !coupon.isActive);

    return matchesSearch && matchesStatus;
  });

  // Statistics
  const stats = {
    total: coupons.length,
    active: coupons.filter((c) => c.isActive).length,
    inactive: coupons.filter((c) => !c.isActive).length,
    firstOrder: coupons.filter((c) => c.isFirstOrderOnly).length,
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "primary.main", mb: 1 }}>
          Coupon Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create and manage discount coupons for your customers
        </Typography>
      </Box>

      {/* Alert */}
      {alert.show && (
        <Alert severity={alert.type} sx={{ mb: 3 }} onClose={() => setAlert({ show: false })}>
          {alert.message}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Total Coupons
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats.total}
                  </Typography>
                </Box>
                <Percent size={40} color="#1976d2" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Active
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: "success.main" }}>
                    {stats.active}
                  </Typography>
                </Box>
                <TrendingUp size={40} color="#2e7d32" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Inactive
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: "error.main" }}>
                    {stats.inactive}
                  </Typography>
                </Box>
                <Calendar size={40} color="#d32f2f" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    First Order
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: "warning.main" }}>
                    {stats.firstOrder}
                  </Typography>
                </Box>
                <Users size={40} color="#ed6c02" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Actions */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search coupons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                label="Status"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="all">All Coupons</MenuItem>
                <MenuItem value="active">Active Only</MenuItem>
                <MenuItem value="inactive">Inactive Only</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={5} sx={{ textAlign: "right" }}>
            <Button
              variant="contained"
              startIcon={<Plus />}
              onClick={() => handleOpenDialog()}
            >
              Add New Coupon
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Coupons Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.100" }}>
              <TableCell sx={{ fontWeight: 700 }}>Code</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Discount</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Min Order</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Valid Period</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Usage</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredCoupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No coupons found
                </TableCell>
              </TableRow>
            ) : (
              filteredCoupons.map((coupon) => (
                <TableRow 
                  key={coupon.id} 
                  hover
                  sx={{
                    opacity: coupon.isActive ? 1 : 0.6,
                    bgcolor: coupon.isActive ? "inherit" : "grey.50",
                  }}
                >
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: "monospace", 
                        fontWeight: 700,
                        color: coupon.isActive ? "inherit" : "text.disabled",
                      }}
                    >
                      {coupon.code}
                    </Typography>
                    {coupon.isFirstOrderOnly && (
                      <Chip 
                        label="First Order" 
                        size="small" 
                        color="info" 
                        sx={{ mt: 0.5 }} 
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2"
                      sx={{ color: coupon.isActive ? "inherit" : "text.disabled" }}
                    >
                      {coupon.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600,
                        color: coupon.isActive ? "inherit" : "text.disabled",
                      }}
                    >
                      {coupon.discountPercentage}%
                    </Typography>
                    {coupon.maxDiscountAmount && (
                      <Typography 
                        variant="caption" 
                        color="text.secondary" 
                        display="block"
                      >
                        Max: ₹{coupon.maxDiscountAmount}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2"
                      sx={{ color: coupon.isActive ? "inherit" : "text.disabled" }}
                    >
                      {coupon.minOrderAmount ? `₹${coupon.minOrderAmount}` : "No Min"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" display="block">
                      {formatDate(coupon.validFrom)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      to {formatDate(coupon.validUntil)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {coupon.currentUsageCount || 0}
                      {coupon.totalUsageLimit ? ` / ${coupon.totalUsageLimit}` : " / ∞"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Max/user: {coupon.maxUsagePerUser}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={coupon.isActive ? "Active" : "Inactive"}
                      color={coupon.isActive ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleOpenDialog(coupon)}
                        title="Edit coupon"
                      >
                        <Edit size={18} />
                      </IconButton>
                      <IconButton
                        size="small"
                        color={coupon.isActive ? "warning" : "success"}
                        onClick={() => handleToggleActive(coupon)}
                        title={coupon.isActive ? "Deactivate" : "Activate"}
                      >
                        {coupon.isActive ? (
                          <ToggleRight size={18} />
                        ) : (
                          <ToggleLeft size={18} />
                        )}
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(coupon.id)}
                        title="Delete coupon"
                      >
                        <Trash2 size={18} />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editMode ? "Edit Coupon" : "Create New Coupon"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Coupon Code *"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="e.g., FIRST20"
                  inputProps={{ style: { textTransform: "uppercase" } }}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Discount Percentage *"
                  name="discountPercentage"
                  type="number"
                  value={formData.discountPercentage}
                  onChange={handleInputChange}
                  inputProps={{ min: 0, max: 100, step: 0.01 }}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description *"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="e.g., 20% off for first-time buyers"
                  multiline
                  rows={2}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Max Discount Amount (₹)"
                  name="maxDiscountAmount"
                  type="number"
                  value={formData.maxDiscountAmount}
                  onChange={handleInputChange}
                  placeholder="e.g., 500"
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Min Order Amount (₹)"
                  name="minOrderAmount"
                  type="number"
                  value={formData.minOrderAmount}
                  onChange={handleInputChange}
                  placeholder="e.g., 1000"
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Valid From"
                  name="validFrom"
                  type="datetime-local"
                  value={formData.validFrom}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Valid Until"
                  name="validUntil"
                  type="datetime-local"
                  value={formData.validUntil}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Max Usage Per User"
                  name="maxUsagePerUser"
                  type="number"
                  value={formData.maxUsagePerUser}
                  onChange={handleInputChange}
                  inputProps={{ min: 1 }}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Total Usage Limit"
                  name="totalUsageLimit"
                  type="number"
                  value={formData.totalUsageLimit}
                  onChange={handleInputChange}
                  placeholder="Leave empty for unlimited"
                  inputProps={{ min: 1 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      name="isActive"
                    />
                  }
                  label="Active"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isFirstOrderOnly}
                      onChange={handleInputChange}
                      name="isFirstOrderOnly"
                    />
                  }
                  label="First Order Only"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editMode ? "Update Coupon" : "Create Coupon"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default CouponManagement;