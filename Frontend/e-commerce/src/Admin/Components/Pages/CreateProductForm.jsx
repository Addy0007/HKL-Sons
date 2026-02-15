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
  Paper,
} from "@mui/material";
import { Add, Delete, CloudUpload, Image as ImageIcon } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "../../../State/Admin/Action";
import { navigation } from "../../../customer/components/Navigation/NavigationConfig";

// 🔥 CLOUDINARY CONFIGURATION
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dilhn8hzs/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "ecommerce_products";

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

  // 🔥 NEW: Image upload states
  const [imageFiles, setImageFiles] = useState({
    mainImage: null,
    additionalImages: [null, null, null],
  });

  const [imagePreviews, setImagePreviews] = useState({
    mainImage: "",
    additionalImages: ["", "", ""],
  });

  const [uploadingStates, setUploadingStates] = useState({
    mainImage: false,
    additionalImage0: false,
    additionalImage1: false,
    additionalImage2: false,
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

      // Reset image states
      setImageFiles({
        mainImage: null,
        additionalImages: [null, null, null],
      });
      setImagePreviews({
        mainImage: "",
        additionalImages: ["", "", ""],
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

  // 🔥 NEW: Upload image to Cloudinary
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", "products");

    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      return data.secure_url; // Returns the Cloudinary URL
    } catch (error) {
      console.error("❌ Cloudinary upload error:", error);
      throw error;
    }
  };

  // 🔥 NEW: Handle main image selection and upload
  const handleMainImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setSnackbar({
        open: true,
        message: "Please select a valid image file (PNG, JPG, JPEG)",
        severity: "error",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setSnackbar({
        open: true,
        message: "Image size should be less than 5MB",
        severity: "error",
      });
      return;
    }

    // Set preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviews((prev) => ({
        ...prev,
        mainImage: reader.result,
      }));
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    setUploadingStates((prev) => ({ ...prev, mainImage: true }));
    try {
      const imageUrl = await uploadToCloudinary(file);
      setProductData((prev) => ({
        ...prev,
        imageUrl: imageUrl,
      }));
      setSnackbar({
        open: true,
        message: "Main image uploaded successfully!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to upload main image. Please try again.",
        severity: "error",
      });
    } finally {
      setUploadingStates((prev) => ({ ...prev, mainImage: false }));
    }
  };

  // 🔥 NEW: Handle additional image selection and upload
  const handleAdditionalImageChange = async (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setSnackbar({
        open: true,
        message: "Please select a valid image file (PNG, JPG, JPEG)",
        severity: "error",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setSnackbar({
        open: true,
        message: "Image size should be less than 5MB",
        severity: "error",
      });
      return;
    }

    // Set preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const newPreviews = [...imagePreviews.additionalImages];
      newPreviews[index] = reader.result;
      setImagePreviews((prev) => ({
        ...prev,
        additionalImages: newPreviews,
      }));
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    const uploadKey = `additionalImage${index}`;
    setUploadingStates((prev) => ({ ...prev, [uploadKey]: true }));
    try {
      const imageUrl = await uploadToCloudinary(file);
      const newImages = [...productData.additionalImages];
      newImages[index] = imageUrl;
      setProductData((prev) => ({
        ...prev,
        additionalImages: newImages,
      }));
      setSnackbar({
        open: true,
        message: `Additional image ${index + 1} uploaded successfully!`,
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Failed to upload additional image ${index + 1}. Please try again.`,
        severity: "error",
      });
    } finally {
      setUploadingStates((prev) => ({ ...prev, [uploadKey]: false }));
    }
  };

  // 🔥 NEW: Remove uploaded image
  const removeMainImage = () => {
    setProductData((prev) => ({ ...prev, imageUrl: "" }));
    setImagePreviews((prev) => ({ ...prev, mainImage: "" }));
    setImageFiles((prev) => ({ ...prev, mainImage: null }));
  };

  const removeAdditionalImage = (index) => {
    const newImages = [...productData.additionalImages];
    newImages[index] = "";
    setProductData((prev) => ({
      ...prev,
      additionalImages: newImages,
    }));

    const newPreviews = [...imagePreviews.additionalImages];
    newPreviews[index] = "";
    setImagePreviews((prev) => ({
      ...prev,
      additionalImages: newPreviews,
    }));

    const newFiles = [...imageFiles.additionalImages];
    newFiles[index] = null;
    setImageFiles((prev) => ({
      ...prev,
      additionalImages: newFiles,
    }));
  };

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

  // Validate that main image is uploaded
  if (!productData.imageUrl) {
    setSnackbar({
      open: true,
      message: "Please upload a main product image",
      severity: "error",
    });
    return;
  }

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
    imageUrl: productData.imageUrl,
    brand: productData.brand,
    title: productData.title,
    color: productData.color,
    discountedPrice: parseInt(productData.discountedPrice) || 0,
    price: parseInt(productData.price) || 0,
    discountPercent: parseInt(productData.discountPercent) || 0,
    size: sizesSet,
    quantity: parseInt(productData.quantity) || 0,
    topLevelCategory: productData.topLevelCategory,
    secondLevelCategory: productData.secondLevelCategory,
    thirdLevelCategory: productData.thirdLevelCategory,
    description: productData.description,
    highlights: highlightsString,
    additionalImages: filteredImages,
    material: productData.material,
    careInstructions: productData.careInstructions,
    countryOfOrigin: productData.countryOfOrigin,
    manufacturer: productData.manufacturer,
  };

  console.log("📦 SUBMITTING PRODUCT - FULL PAYLOAD:");
  console.log(JSON.stringify(submitData, null, 2));
  
  try {
    await dispatch(createProduct(submitData));
  } catch (error) {
    console.error("🔥 CAUGHT ERROR IN FORM:", error);
  }
};


  return (
    <Box maxWidth="900px" mx="auto" py={3} px={2}>
      <Typography variant="h4" fontWeight={700} textAlign="center" mb={3}>
        Add New Product
      </Typography>

      <Card elevation={2} sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            {/* 🔥 UPDATED: MEDIA SECTION WITH IMAGE UPLOAD */}
            <Typography variant="h6" fontWeight={600} mb={1}>
              📸 Product Media
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {/* Main Image Upload */}
            <Box mb={3}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Main Product Image *
              </Typography>

              {!imagePreviews.mainImage ? (
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={uploadingStates.mainImage ? <CircularProgress size={20} /> : <CloudUpload />}
                  disabled={uploadingStates.mainImage}
                  fullWidth
                  sx={{
                    py: 3,
                    borderStyle: "dashed",
                    borderWidth: 2,
                    "&:hover": {
                      borderStyle: "dashed",
                      borderWidth: 2,
                    },
                  }}
                >
                  {uploadingStates.mainImage ? "Uploading..." : "Click to Upload Main Image"}
                  <input
                    type="file"
                    hidden
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleMainImageChange}
                  />
                </Button>
              ) : (
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    position: "relative",
                    borderRadius: 2,
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: 200,
                      borderRadius: 2,
                      overflow: "hidden",
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    <img
                      src={imagePreviews.mainImage}
                      alt="Main product"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                  <Box display="flex" justifyContent="space-between" mt={2}>
                    <Typography variant="caption" color="success.main">
                      ✓ Main image uploaded
                    </Typography>
                    <Button
                      size="small"
                      color="error"
                      onClick={removeMainImage}
                      startIcon={<Delete />}
                    >
                      Remove
                    </Button>
                  </Box>
                </Paper>
              )}
            </Box>

            {/* Additional Images Upload */}
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              Additional Images (Optional - Maximum 3)
            </Typography>

            <Grid container spacing={2}>
              {[0, 1, 2].map((index) => (
                <Grid item xs={12} sm={4} key={index}>
                  {!imagePreviews.additionalImages[index] ? (
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={
                        uploadingStates[`additionalImage${index}`] ? (
                          <CircularProgress size={16} />
                        ) : (
                          <ImageIcon />
                        )
                      }
                      disabled={uploadingStates[`additionalImage${index}`]}
                      fullWidth
                      sx={{
                        py: 2,
                        borderStyle: "dashed",
                        fontSize: "0.875rem",
                      }}
                    >
                      {uploadingStates[`additionalImage${index}`]
                        ? "Uploading..."
                        : `Image ${index + 2}`}
                      <input
                        type="file"
                        hidden
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={(e) => handleAdditionalImageChange(index, e)}
                      />
                    </Button>
                  ) : (
                    <Paper elevation={1} sx={{ p: 1, position: "relative" }}>
                      <Box
                        sx={{
                          width: "100%",
                          height: 120,
                          borderRadius: 1,
                          overflow: "hidden",
                          backgroundColor: "#f5f5f5",
                        }}
                      >
                        <img
                          src={imagePreviews.additionalImages[index]}
                          alt={`Additional ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </Box>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeAdditionalImage(index)}
                        sx={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                          backgroundColor: "white",
                          "&:hover": { backgroundColor: "#ffebee" },
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Paper>
                  )}
                </Grid>
              ))}
            </Grid>

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
                <Autocomplete
                  freeSolo
                  options={secondLevelOptions.map((section) => section.id)}
                  getOptionLabel={(option) => {
                    const section = secondLevelOptions.find((s) => s.id === option);
                    return section ? section.name : option;
                  }}
                  value={productData.secondLevelCategory}
                  onChange={(e, newValue) => {
                    setProductData((prev) => ({
                      ...prev,
                      secondLevelCategory: newValue || "",
                      thirdLevelCategory: "",
                    }));
                  }}
                  onInputChange={(e, newInputValue) => {
                    // Allow typing custom values
                    if (e?.type === 'change') {
                      setProductData((prev) => ({
                        ...prev,
                        secondLevelCategory: newInputValue,
                        thirdLevelCategory: "",
                      }));
                    }
                  }}
                  disabled={!productData.topLevelCategory}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Second Level Category"
                      name="secondLevelCategory"
                      required
                      helperText={
                        productData.topLevelCategory
                          ? `${secondLevelOptions.length} existing or type new`
                          : "Select top category first"
                      }
                    />
                  )}
                />
              </Grid>

              {/* THIRD LEVEL */}
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  freeSolo
                  options={thirdLevelOptions.map((item) => item.id)}
                  getOptionLabel={(option) => {
                    const item = thirdLevelOptions.find((i) => i.id === option);
                    return item ? item.name : option;
                  }}
                  value={productData.thirdLevelCategory}
                  onChange={(e, newValue) => {
                    setProductData((prev) => ({
                      ...prev,
                      thirdLevelCategory: newValue || "",
                    }));
                  }}
                  onInputChange={(e, newInputValue) => {
                    // Allow typing custom values
                    if (e?.type === 'change') {
                      setProductData((prev) => ({
                        ...prev,
                        thirdLevelCategory: newInputValue,
                      }));
                    }
                  }}
                  disabled={!productData.secondLevelCategory}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Third Level Category"
                      name="thirdLevelCategory"
                      required
                      helperText={
                        productData.secondLevelCategory
                          ? `${thirdLevelOptions.length} existing or type new`
                          : "Select second category first"
                      }
                    />
                  )}
                />
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
              disabled={loading || Object.values(uploadingStates).some((state) => state)}
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