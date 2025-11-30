import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Box,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "../../../State/Admin/Action";

const initialSizes = [
  { name: "S", quantity: 0 },
  { name: "M", quantity: 0 },
  { name: "L", quantity: 0 },
];

const CreateProductForm = () => {
  const [productData, setProductData] = useState({
    imageUrl: "",
    brand: "",
    title: "",
    color: "",
    description: "",
    price: "",
    discountedPrice: "",
    discountPercent: "",
    quantity: "",
    topLevelCategory: "",
    secondLevelCategory: "",
    thirdLevelCategory: "",
    sizes: initialSizes,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const dispatch = useDispatch();
  const { loading, error, product } = useSelector(
    (state) => state.adminProduct
  );

  useEffect(() => {
    if (product) {
      setSnackbar({
        open: true,
        message: "Product created successfully!",
        severity: "success",
      });

      setProductData({
        imageUrl: "",
        brand: "",
        title: "",
        color: "",
        description: "",
        price: "",
        discountedPrice: "",
        discountPercent: "",
        quantity: "",
        topLevelCategory: "",
        secondLevelCategory: "",
        thirdLevelCategory: "",
        sizes: initialSizes,
      });
    }
  }, [product]);

  useEffect(() => {
    if (error) {
      setSnackbar({
        open: true,
        message: `Failed to create product: ${error}`,
        severity: "error",
      });
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSizeChange = (index, e) => {
    let { name, value } = e.target;
    name = name === "size_quantity" ? "quantity" : name;

    const updatedSizes = [...productData.sizes];
    updatedSizes[index][name] = value;

    setProductData((prev) => ({
      ...prev,
      sizes: updatedSizes,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(createProduct(productData));
  };

  return (
    <Box maxWidth="650px" mx="auto" py={3}>
      <Typography variant="h4" fontWeight={700} textAlign="center" mb={3}>
        Add New Product
      </Typography>

      <Card elevation={2} sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            {/* --- Media --- */}
            <Typography variant="h6" fontWeight={600} mb={1}>
              Product Media
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <TextField
              fullWidth
              label="Image URL"
              name="imageUrl"
              value={productData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              required
              margin="normal"
            />

            {/* --- Basic Info --- */}
            <Typography variant="h6" fontWeight={600} mt={3} mb={1}>
              Basic Information
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <TextField
              fullWidth
              label="Brand"
              name="brand"
              value={productData.brand}
              onChange={handleChange}
              required
              margin="normal"
            />

            <TextField
              fullWidth
              label="Title"
              name="title"
              value={productData.title}
              onChange={handleChange}
              required
              margin="normal"
            />

            <TextField
              fullWidth
              label="Color"
              name="color"
              value={productData.color}
              onChange={handleChange}
              required
              margin="normal"
            />

            <TextField
              fullWidth
              type="number"
              label="Total Quantity"
              name="quantity"
              inputProps={{ min: 0 }}
              value={productData.quantity}
              onChange={handleChange}
              required
              margin="normal"
            />

            {/* --- Pricing --- */}
            <Typography variant="h6" fontWeight={600} mt={3} mb={1}>
              Pricing Details
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <TextField
              fullWidth
              type="number"
              label="Original Price"
              name="price"
              value={productData.price}
              onChange={handleChange}
              margin="normal"
            />

            <TextField
              fullWidth
              type="number"
              label="Discounted Price"
              name="discountedPrice"
              value={productData.discountedPrice}
              onChange={handleChange}
              margin="normal"
            />

            <TextField
              fullWidth
              type="number"
              label="Discount Percentage"
              name="discountPercent"
              value={productData.discountPercent}
              onChange={handleChange}
              margin="normal"
            />

            {/* --- Categories --- */}
            <Typography variant="h6" fontWeight={600} mt={3} mb={1}>
              Categories
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <FormControl fullWidth margin="normal">
              <InputLabel>Top Level Category</InputLabel>
              <Select
                value={productData.topLevelCategory}
                name="topLevelCategory"
                label="Top Level Category"
                onChange={handleChange}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="men">Men</MenuItem>
                <MenuItem value="women">Women</MenuItem>
                <MenuItem value="kids">Kids</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Second Level Category</InputLabel>
              <Select
                value={productData.secondLevelCategory}
                name="secondLevelCategory"
                label="Second Level Category"
                onChange={handleChange}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="clothing">Clothing</MenuItem>
                <MenuItem value="accessories">Accessories</MenuItem>
                <MenuItem value="brands">Brands</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Third Level Category</InputLabel>
              <Select
                value={productData.thirdLevelCategory}
                name="thirdLevelCategory"
                label="Third Level Category"
                onChange={handleChange}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="tops">Tops</MenuItem>
                <MenuItem value="mens_kurta">Men's Kurta</MenuItem>
                <MenuItem value="women_dress">Women Dress</MenuItem>
                <MenuItem value="t-shirts">T-Shirts</MenuItem>
                <MenuItem value="jeans">Jeans</MenuItem>
                <MenuItem value="lengha_choli">Lengha Choli</MenuItem>
              </Select>
            </FormControl>

            {/* --- Description --- */}
            <Typography variant="h6" fontWeight={600} mt={3} mb={1}>
              Description
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Product Description"
              name="description"
              value={productData.description}
              onChange={handleChange}
              margin="normal"
            />

            {/* --- Sizes --- */}
            <Typography variant="h6" fontWeight={600} mt={3} mb={1}>
              Size Variants
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {productData.sizes.map((size, index) => (
              <Box key={index} mb={2}>
                <TextField
                  fullWidth
                  label="Size Name"
                  name="name"
                  value={size.name}
                  onChange={(e) => handleSizeChange(index, e)}
                  margin="dense"
                />

                <TextField
                  fullWidth
                  type="number"
                  label="Size Quantity"
                  name="size_quantity"
                  inputProps={{ min: 0 }}
                  value={size.quantity}
                  onChange={(e) => handleSizeChange(index, e)}
                  margin="dense"
                />
              </Box>
            ))}

            {/* --- Submit --- */}
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 3, py: 1.4, fontSize: "16px", fontWeight: 600 }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 2, color: "white" }} />
                  Creating...
                </>
              ) : (
                "Create Product"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateProductForm;
