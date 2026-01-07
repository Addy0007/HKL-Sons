import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  MenuItem,
  Typography,
  Box,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Autocomplete,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "../../../State/Admin/Action";
import { navigation } from "../../../customer/components/Navigation/NavigationConfig";

// Predefined options
const COLORS = [
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Black",
  "White",
  "Pink",
  "Purple",
  "Orange",
  "Brown",
  "Gray",
  "Multi",
];

const SIZES = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "Free Size",
  "UK 6",
  "UK 7",
  "UK 8",
  "UK 9",
  "UK 10",
];

const CreateProductForm = () => {
  const [productData, setProductData] = useState({
    imageUrl: "",
    additionalImages: ["", "", ""],
    brand: "",
    title: "",
    color: "",
    description: "",
    highlights: [""],
    material: "",
    careInstructions: "",
    countryOfOrigin: "India",
    manufacturer: "",
    price: "",
    discountedPrice: "",
    discountPercent: "",
    quantity: "",
    topLevelCategory: "",
    secondLevelCategory: "",
    thirdLevelCategory: "",
    sizes: [],
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

      // Reset form
      setProductData({
        imageUrl: "",
        additionalImages: ["", "", ""],
        brand: "",
        title: "",
        color: "",
        description: "",
        highlights: [""],
        material: "",
        careInstructions: "",
        countryOfOrigin: "India",
        manufacturer: "",
        price: "",
        discountedPrice: "",
        discountPercent: "",
        quantity: "",
        topLevelCategory: "",
        secondLevelCategory: "",
        thirdLevelCategory: "",
        sizes: [],
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

  // Compute dependent dropdown options
  const selectedTopCategory = navigation?.categories?.find(
    (cat) => cat.id === productData.topLevelCategory
  );

  const secondLevelOptions = selectedTopCategory?.sections || [];

  const selectedSecondLevel = secondLevelOptions.find(
    (section) => section.id === productData.secondLevelCategory
  );

  const thirdLevelOptions = selectedSecondLevel?.items || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdditionalImageChange = (index, value) => {
    const newImages = [...productData.additionalImages];
    newImages[index] = value;
    setProductData((prev) => ({
      ...prev,
      additionalImages: newImages,
    }));
  };

  const addHighlight = () => {
    setProductData((prev) => ({
      ...prev,
      highlights: [...prev.highlights, ""],
    }));
  };

  const removeHighlight = (index) => {
    setProductData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  };

  const handleHighlightChange = (index, value) => {
    const newHighlights = [...productData.highlights];
    newHighlights[index] = value;
    setProductData((prev) => ({
      ...prev,
      highlights: newHighlights,
    }));
  };

  const addSize = () => {
    setProductData((prev) => ({
      ...prev,
      sizes: [...prev.sizes, { name: "", quantity: 0 }],
    }));
  };

  const removeSize = (index) => {
    setProductData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index),
    }));
  };

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...productData.sizes];
    newSizes[index][field] = value;
    setProductData((prev) => ({
      ...prev,
      sizes: newSizes,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const highlightsString = productData.highlights
      .filter((h) => h.trim() !== "")
      .join(", ");

    const filteredImages = productData.additionalImages.filter(
      (img) => img.trim() !== ""
    );

    const sizesSet = productData.sizes
      .filter((s) => s.name && s.quantity >= 0)
      .map((s) => ({ name: s.name, quantity: parseInt(s.quantity) || 0 }));

    const submitData = {
      ...productData,
      highlights: highlightsString,
      additionalImages: filteredImages,
      size: sizesSet,
      price: parseInt(productData.price) || 0,
      discountedPrice: parseInt(productData.discountedPrice) || 0,
      discountPercent: parseInt(productData.discountPercent) || 0,
      quantity: parseInt(productData.quantity) || 0,
    };

    console.log("📦 Submitting product:", submitData);
    await dispatch(createProduct(submitData));
  };

  return (
    <Box maxWidth="900px" mx="auto" py={3} px={2}>
      <Typography variant="h4" fontWeight={700} textAlign="center" mb={3}>
        Add New Product
      </Typography>

      <Card elevation={2} sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            {/* MEDIA */}
            <Typography variant="h6" fontWeight={600} mb={1}>
              📸 Product Media
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <TextField
              fullWidth
              label="Main Image URL"
              name="imageUrl"
              value={productData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/main-image.jpg"
              required
              margin="normal"
            />

            <Typography
              variant="subtitle2"
              color="text.secondary"
              mt={2}
              mb={1}
            >
              Additional Images (3 images maximum)
            </Typography>

            {productData.additionalImages.map((img, index) => (
              <TextField
                key={index}
                fullWidth
                size="small"
                label={`Image ${index + 2} URL`}
                value={img}
                onChange={(e) =>
                  handleAdditionalImageChange(index, e.target.value)
                }
                placeholder={`https://example.com/image-${index + 2}.jpg`}
                margin="dense"
              />
            ))}

            {/* BASIC INFO */}
            <Typography variant="h6" fontWeight={600} mt={4} mb={1}>
              📝 Basic Information
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Brand"
                  name="brand"
                  value={productData.brand}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={productData.title}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Autocomplete
                  freeSolo
                  options={COLORS}
                  value={productData.color}
                  onChange={(e, newValue) => {
                    setProductData((prev) => ({
                      ...prev,
                      color: newValue || "",
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Color"
                      name="color"
                      required
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Total Quantity"
                  name="quantity"
                  inputProps={{ min: 0 }}
                  value={productData.quantity}
                  onChange={handleChange}
                  required
                />
              </Grid>
            </Grid>

            {/* PRICING */}
            <Typography variant="h6" fontWeight={600} mt={4} mb={1}>
              💰 Pricing Details
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Original Price"
                  name="price"
                  value={productData.price}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Discounted Price"
                  name="discountedPrice"
                  value={productData.discountedPrice}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Discount Percentage"
                  name="discountPercent"
                  value={productData.discountPercent}
                  onChange={handleChange}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            {/* CATEGORIES */}
            <Typography variant="h6" fontWeight={600} mt={4} mb={1}>
              📂 Categories
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              {/* TOP LEVEL */}
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  fullWidth
                  label="Top Level Category"
                  name="topLevelCategory"
                  value={productData.topLevelCategory}
                  onChange={(e) => {
                    const value = e.target.value;
                    setProductData((prev) => ({
                      ...prev,
                      topLevelCategory: value,
                      secondLevelCategory: "",
                      thirdLevelCategory: "",
                    }));
                  }}
                  required
                  helperText="Select Men, Women, Lifestyle"
                >
                  {navigation?.categories?.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* SECOND LEVEL */}
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  fullWidth
                  label="Second Level Category"
                  name="secondLevelCategory"
                  value={productData.secondLevelCategory}
                  onChange={(e) => {
                    const value = e.target.value;
                    setProductData((prev) => ({
                      ...prev,
                      secondLevelCategory: value,
                      thirdLevelCategory: "",
                    }));
                  }}
                  required
                  disabled={!productData.topLevelCategory}
                  helperText={
                    productData.topLevelCategory
                      ? `${secondLevelOptions.length} options available`
                      : "Select top category first"
                  }
                >
                  {secondLevelOptions.length > 0 ? (
                    secondLevelOptions.map((section) => (
                      <MenuItem key={section.id} value={section.id}>
                        {section.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>
                      No sections available
                    </MenuItem>
                  )}
                </TextField>
              </Grid>

              {/* THIRD LEVEL */}
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  fullWidth
                  label="Third Level Category"
                  name="thirdLevelCategory"
                  value={productData.thirdLevelCategory}
                  onChange={handleChange}
                  required
                  disabled={!productData.secondLevelCategory}
                  helperText={
                    productData.secondLevelCategory
                      ? `${thirdLevelOptions.length} items available`
                      : "Select second category first"
                  }
                >
                  {thirdLevelOptions.length > 0 ? (
                    thirdLevelOptions.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>
                      No items available
                    </MenuItem>
                  )}
                </TextField>
              </Grid>
            </Grid>

            {/* DESCRIPTION */}
            <Typography variant="h6" fontWeight={600} mt={4} mb={1}>
              📄 Description & Details
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
              required
              margin="normal"
            />

            {/* HIGHLIGHTS */}
            <Typography variant="subtitle2" mt={2} mb={1}>
              Product Highlights
            </Typography>
            {productData.highlights.map((highlight, index) => (
              <Box key={index} display="flex" gap={1} mb={1}>
                <TextField
                  fullWidth
                  size="small"
                  value={highlight}
                  onChange={(e) =>
                    handleHighlightChange(index, e.target.value)
                  }
                  placeholder="e.g., Premium quality fabric"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">✓</InputAdornment>
                    ),
                  }}
                />
                {productData.highlights.length > 1 && (
                  <IconButton
                    color="error"
                    onClick={() => removeHighlight(index)}
                    size="small"
                  >
                    <Delete />
                  </IconButton>
                )}
              </Box>
            ))}
            <Button
              startIcon={<Add />}
              onClick={addHighlight}
              variant="outlined"
              size="small"
              sx={{ mt: 1 }}
            >
              Add Highlight
            </Button>

            {/* EXTRA DETAILS */}
            <Grid container spacing={2} mt={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Material"
                  name="material"
                  value={productData.material}
                  onChange={handleChange}
                  placeholder="e.g., 100% Cotton"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Country of Origin"
                  name="countryOfOrigin"
                  value={productData.countryOfOrigin}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Manufacturer"
                  name="manufacturer"
                  value={productData.manufacturer}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Care Instructions"
                  name="careInstructions"
                  value={productData.careInstructions}
                  onChange={handleChange}
                  placeholder="e.g., Machine wash cold"
                />
              </Grid>
            </Grid>

            {/* SIZES */}
            <Typography variant="h6" fontWeight={600} mt={4} mb={1}>
              📏 Size Variants
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {productData.sizes.map((size, index) => (
              <Grid
                container
                spacing={2}
                key={index}
                mb={2}
                alignItems="center"
              >
                <Grid item xs={5}>
                  <Autocomplete
                    freeSolo
                    options={SIZES}
                    value={size.name}
                    onChange={(e, newValue) =>
                      handleSizeChange(index, "name", newValue || "")
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Size Name"
                        required
                        size="small"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={5}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Quantity"
                    inputProps={{ min: 0 }}
                    value={size.quantity}
                    onChange={(e) =>
                      handleSizeChange(index, "quantity", e.target.value)
                    }
                    required
                    size="small"
                  />
                </Grid>

                <Grid item xs={2}>
                  <IconButton
                    color="error"
                    onClick={() => removeSize(index)}
                    size="small"
                  >
                    <Delete />
                  </IconButton>
                </Grid>
              </Grid>
            ))}

            <Button
              startIcon={<Add />}
              onClick={addSize}
              variant="outlined"
              size="small"
              sx={{ mt: 1 }}
            >
              Add Size
            </Button>

            {/* SUBMIT */}
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 4, py: 1.5, fontSize: "16px", fontWeight: 600 }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 2, color: "white" }} />
                  Creating Product...
                </>
              ) : (
                "✨ Create Product"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateProductForm;