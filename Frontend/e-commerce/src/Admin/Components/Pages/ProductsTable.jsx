import React, { useEffect, useState } from "react";
import {
  Paper,
  TableContainer,
  TableRow,
  Table,
  TableHead,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  Box,
} from "@mui/material";

import { Delete, Refresh, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { findProducts } from "../../../State/Product/Action";
import { api } from "../../../Config/apiConfig";
import { debugAuth } from "../../../utils/authDebug";

const ProductsTable = () => {
  const dispatch = useDispatch();
   const navigate = useNavigate();
  // ✅ Get auth state from Redux
  const { jwt, user } = useSelector((state) => state.auth);
  
  // ✅ Get products from Redux
  const { products, loading, error } = useSelector((state) => state.product);
  const rows = products?.content || [];
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  
  // Snackbar state for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // Debug authentication on component mount
  useEffect(() => {
    console.log("🔍 ProductsTable - Running Auth Debug");
    debugAuth();
    
    console.log("\n📊 Current Redux Auth State:");
    console.log("   JWT:", jwt ? "Present" : "Missing");
    console.log("   User:", user);
    console.log("   User Role:", user?.role || "❌ NOT SET");
    
    if (!user?.role) {
      console.error("\n❌ PROBLEM FOUND:");
      console.error("   Redux state does not have user.role");
      console.error("   This means either:");
      console.error("   1. Backend is not returning user object in login response");
      console.error("   2. Frontend is not storing user object in Redux");
      console.error("\n🔧 Check:");
      console.error("   - Backend AuthController returns user in response");
      console.error("   - Frontend reducer stores action.payload.user");
    }
  }, [jwt, user]); // ✅ Dependencies are correct now
  
  // Fetch products based on current page
  useEffect(() => {
    fetchProducts();
  }, [dispatch, page, rowsPerPage]);

  const fetchProducts = () => {
    const data = {
      category: undefined,
      colors: undefined,
      sizes: undefined,
      minPrice: 0,
      maxPrice: 99999,
      minDiscount: 0,
      sort: "price_low",
      pageNumber: page,
      pageSize: rowsPerPage,
      stock: undefined,
    };
    
    console.log("🔎 Fetching products with data:", data);
    dispatch(findProducts(data));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    setDeleting(true);
    try {
      const response = await api.delete(
        `/api/admin/products/${productToDelete.id}/delete`
      );

      console.log("✅ Product deleted:", response.data);
      
      setSnackbar({
        open: true,
        message: `Product "${productToDelete.title}" deleted successfully!`,
        severity: "success"
      });
      
      fetchProducts();
      handleCloseDialog();
    } catch (err) {
      console.error("❌ Delete error:", err);
      console.error("❌ Error response:", err.response?.data);
      
      let errorMessage = "Failed to delete product";
      
      if (err.response?.status === 403) {
        errorMessage = "Access denied. You need admin privileges to delete products.";
      } else if (err.response?.status === 401) {
        errorMessage = "Not authenticated. Please log in again.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error"
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getCategoryPath = (category) => {
    if (!category) return "N/A";
    
    const parts = [];
    let current = category;
    
    while (current) {
      parts.unshift(current.name);
      current = current.parentCategory;
    }
    
    return parts.join(" > ");
  };

  const totalProducts = products?.totalElements || 0;

  return (
    <div>
      {/* Header */}
      <div style={{ 
        marginBottom: '16px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <div>
          <h2 style={{ margin: 0 }}>Products Management</h2>
          <p style={{ color: '#666', fontSize: '14px', margin: '4px 0 0 0' }}>
            Total: {totalProducts} products
          </p>
        </div>
        <Tooltip title="Refresh products">
          <IconButton onClick={fetchProducts} color="primary">
            <Refresh />
          </IconButton>
        </Tooltip>
      </div>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="products table">
 <TableHead>
    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
      <TableCell><strong>ID</strong></TableCell>
      <TableCell><strong>Image</strong></TableCell>
      <TableCell><strong>Name</strong></TableCell>
      <TableCell align="right"><strong>Price</strong></TableCell>
      <TableCell align="right"><strong>Discounted</strong></TableCell>
      <TableCell align="center"><strong>Discount</strong></TableCell>
      <TableCell><strong>Category</strong></TableCell>
      <TableCell align="center"><strong>Stock</strong></TableCell>
      <TableCell align="center"><strong>Featured</strong></TableCell> {/* ← ADD THIS */}
      <TableCell align="center"><strong>Actions</strong></TableCell>
    </TableRow>
  </TableHead>
          <TableBody>
  {!loading &&
    !error &&
    rows.map((row) => (
      <TableRow
        key={row.id}
        sx={{ 
          "&:last-child td, &:last-child th": { border: 0 },
          "&:hover": { backgroundColor: '#fafafa' }
        }}
      >
        <TableCell component="th" scope="row">
          <strong>{row.id}</strong>
        </TableCell>
        
        <TableCell>
          <img 
            src={row.imageUrl} 
            alt={row.title}
            style={{ 
              width: '60px', 
              height: '60px', 
              objectFit: 'cover',
              borderRadius: '4px',
              border: '1px solid #e0e0e0'
            }}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/60?text=No+Image';
            }}
          />
        </TableCell>
        
        <TableCell>
          <div>
            <strong>{row.title}</strong>
            <br />
            <span style={{ fontSize: '12px', color: '#666' }}>
              {row.brand}
            </span>
          </div>
        </TableCell>
        
        <TableCell align="right">
          <span style={{ textDecoration: 'line-through', color: '#999' }}>
            ₹{row.price}
          </span>
        </TableCell>
        
        <TableCell align="right">
          <strong style={{ color: '#2e7d32' }}>₹{row.discountedPrice}</strong>
        </TableCell>
        
        <TableCell align="center">
          <Chip 
            label={`${row.discountPercent}% OFF`} 
            color="success" 
            size="small"
            sx={{ fontWeight: 'bold' }}
          />
        </TableCell>
        
        <TableCell>
          <span style={{ fontSize: '13px' }}>
            {getCategoryPath(row.category)}
          </span>
        </TableCell>
        
        <TableCell align="center">
          <Chip 
            label={row.quantity}
            color={row.quantity > 5 ? "success" : row.quantity > 0 ? "warning" : "error"}
            size="small"
            sx={{ fontWeight: 'bold', minWidth: '50px' }}
          />
        </TableCell>
        
        {/* ← ADD THIS FEATURED CELL */}
        <TableCell align="center">
          {row.isFeatured ? (
            <Chip 
              icon={<span>⭐</span>}
              label={`#${row.featuredOrder}`}
              color="warning"
              size="small"
              sx={{ fontWeight: 'bold' }}
            />
          ) : (
            <span style={{ color: '#999', fontSize: '12px' }}>—</span>
          )}
        </TableCell>
        
        {/* ← UPDATE ACTIONS CELL */}
        <TableCell align="center">
          <Box display="flex" gap={1} justifyContent="center">
            <Tooltip title="Edit product">
              <IconButton 
                color="primary" 
                size="small"
                onClick={() => navigate(`/admin/products/edit/${row.id}`)}
              >
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete product">
              <IconButton 
                color="error" 
                size="small"
                onClick={() => handleDeleteClick(row)}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>
      </TableRow>
    ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        {!loading && !error && rows.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={totalProducts}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Products per page:"
          />
        )}
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title" sx={{ color: '#d32f2f' }}>
          ⚠️ Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this product?
            <br /><br />
            <strong>Product:</strong> {productToDelete?.title}
            <br />
            <strong>Brand:</strong> {productToDelete?.brand}
            <br />
            <strong>ID:</strong> {productToDelete?.id}
            <br /><br />
            <span style={{ color: '#d32f2f' }}>
              This action cannot be undone!
            </span>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: '16px' }}>
          <Button 
            onClick={handleCloseDialog} 
            variant="outlined"
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained"
            disabled={deleting}
            autoFocus
          >
            {deleting ? "Deleting..." : "Delete Product"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* CSS for spinner animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ProductsTable;