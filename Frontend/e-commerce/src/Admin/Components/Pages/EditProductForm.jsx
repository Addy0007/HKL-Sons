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
  Switch,
  FormControlLabel,
  Chip,
} from "@mui/material";
import { Add, Delete, CloudUpload, Image as ImageIcon, ArrowBack } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../../Config/apiConfig";
import { navigation } from "../../../customer/components/Navigation/NavigationConfig";

// 🔥 CLOUDINARY CONFIGURATION
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dilhn8hzs/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "ecommerce_products";

const COLORS = [
  "Red", "Blue", "Green", "Yellow", "Black", "White", 
  "Pink", "Purple", "Orange", "Brown", "Gray", "Multi",
];

const SIZES = [
  "XS", "S", "M", "L", "XL", "XXL", "Free Size",
  "UK 6", "UK 7", "UK 8", "UK 9", "UK 10",
];

const EditProductForm = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
    isFeatured: false,
    featuredOrder: 0,
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

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/products/${productId}`);
        console.log("📦 Fetched product:", data);

        // Extract category hierarchy
        let topLevel = "";
        let secondLevel = "";
        let thirdLevel = "";

        if (data.category) {
          const buildPath = (cat) => {
            const path = [];
            let current = cat;
            while (current) {
              path.unshift(current.name);
              current = current.parentCategory;
            }
            return path;
          };

          const categoryPath = buildPath(data.category);
          if (categoryPath.length >= 1) topLevel = categoryPath[0];
          if (categoryPath.length >= 2) secondLevel = categoryPath[1];
          if (categoryPath.length >= 3) thirdLevel = categoryPath[2];
        }

        // Parse highlights
        const highlightsArray = data.highlights
          ? data.highlights.split(",").map((h) => h.trim())
          : [""];

        // Get additional images (assuming you have an images array in response)
        const additionalImgs = data.images && data.images.length > 1
          ? [
              data.images[1] || "",
              data.images[2] || "",
              data.images[3] || "",
            ]
          : ["", "", ""];

        setProductData({
          imageUrl: data.imageUrl || "",
          additionalImages: additionalImgs,
          brand: data.brand || "",
          title: data.title || "",
          color: data.color || "",
          description: data.description || "",
          highlights: highlightsArray,
          material: data.material || "",
          careInstructions: data.careInstructions || "",
          countryOfOrigin: data.countryOfOrigin || "India",
          manufacturer: data.manufacturer || "",
          price: data.price || "",
          discountedPrice: data.discountedPrice || "",
          discountPercent: data.discountPercent || "",
          quantity: data.quantity || "",
          topLevelCategory: topLevel,
          secondLevelCategory: secondLevel,
          thirdLevelCategory: thirdLevel,
          sizes: data.sizes || [],
          isFeatured: data.isFeatured || false,
          featuredOrder: data.featuredOrder || 0,
        });

        // Set image previews
        setImagePreviews({
          mainImage: data.imageUrl || "",
          additionalImages: additionalImgs,
        });

      } catch (error) {
        console.error("❌ Error fetching product:", error);
        setSnackbar({
          open: true,
          message: "Failed to load product details",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Upload to Cloudinary
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", "products");

    const response = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Upload failed");
    const data = await response.json();
    return data.secure_url;
  };

  // Handle main image change
  const handleMainImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setSnackbar({
        open: true,
        message: "Please select a valid image file",
        severity: "error",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSnackbar({
        open: true,
        message: "Image size should be less than 5MB",
        severity: "error",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviews((prev) => ({ ...prev, mainImage: reader.result }));
    };
    reader.readAsDataURL(file);

    setUploadingStates((prev) => ({ ...prev, mainImage: true }));
    try {
      const imageUrl = await uploadToCloudinary(file);
      setProductData((prev) => ({ ...prev, imageUrl }));
      setSnackbar({
        open: true,
        message: "Main image uploaded successfully!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to upload main image",
        severity: "error",
      });
    } finally {
      setUploadingStates((prev) => ({ ...prev, mainImage: false }));
    }
  };

  // Handle additional image change
  const handleAdditionalImageChange = async (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setSnackbar({
        open: true,
        message: "Please select a valid image file",
        severity: "error",
      });
      return;
    }

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

    const uploadKey = `additionalImage${index}`;
    setUploadingStates((prev) => ({ ...prev, [uploadKey]: true }));
    try {
      const imageUrl = await uploadToCloudinary(file);
      const newImages = [...productData.additionalImages];
      newImages[index] = imageUrl;
      setProductData((prev) => ({ ...prev, additionalImages: newImages }));
      setSnackbar({
        open: true,
        message: `Additional image ${index + 1} uploaded successfully!`,
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Failed to upload additional image ${index + 1}`,
        severity: "error",
      });
    } finally {
      setUploadingStates((prev) => ({ ...prev, [uploadKey]: false }));
    }
  };

  const removeMainImage = () => {
    setProductData((prev) => ({ ...prev, imageUrl: "" }));
    setImagePreviews((prev) => ({ ...prev, mainImage: "" }));
  };

  const removeAdditionalImage = (index) => {
    const newImages = [...productData.additionalImages];
    newImages[index] = "";
    setProductData((prev) => ({ ...prev, additionalImages: newImages }));

    const newPreviews = [...imagePreviews.additionalImages];
    newPreviews[index] = "";
    setImagePreviews((prev) => ({ ...prev, additionalImages: newPreviews }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeaturedToggle = (e) => {
    const isFeatured = e.target.checked;
    setProductData((prev) => ({
      ...prev,
      isFeatured,
      featuredOrder: isFeatured ? prev.featuredOrder || 1 : 0,
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
    setProductData((prev) => ({ ...prev, highlights: newHighlights }));
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
    setProductData((prev) => ({ ...prev, sizes: newSizes }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    const filteredImages = productData.additionalImages.filter((img) => img.trim() !== "");

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
      isFeatured: productData.isFeatured,
      featuredOrder: parseInt(productData.featuredOrder) || 0,
    };

    console.log("📝 UPDATING PRODUCT:", submitData);

    setSubmitting(true);
    try {
      const { data } = await api.put(`/api/admin/products/${productId}`, submitData);
      console.log("✅ Product updated:", data);

      setSnackbar({
        open: true,
        message: "Product updated successfully!",
        severity: "success",
      });

      // Navigate back after 1.5 seconds
      setTimeout(() => {
        navigate("/admin/products");
      }, 1500);
    } catch (error) {
      console.error("❌ Update error:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to update product",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Dependent dropdowns logic
  const selectedTopCategory = navigation?.categories?.find(
    (cat) => cat.id === productData.topLevelCategory
  );
  const secondLevelOptions = selectedTopCategory?.sections || [];
  const selectedSecondLevel = secondLevelOptions.find(
    (section) => section.id === productData.secondLevelCategory
  );
  const thirdLevelOptions = selectedSecondLevel?.items || [];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box maxWidth="900px" mx="auto" py={3} px={2}>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate("/admin/products")} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <div>
          <Typography variant="h4" fontWeight={700}>
            Edit Product
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ID: {productId}
          </Typography>
        </div>
      </Box>

      <Card elevation={2} sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            
            {/* 🌟 FEATURED SECTION */}
            <Box
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 2,
                backgroundColor: productData.isFeatured ? "#e8f5e9" : "#f5f5f5",
                border: productData.isFeatured ? "2px solid #4caf50" : "1px solid #e0e0e0",
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    ⭐ Featured Product
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Featured products appear in the homepage carousel
                  </Typography>
                </Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={productData.isFeatured}
                      onChange={handleFeaturedToggle}
                      color="success"
                    />
                  }
                  label={productData.isFeatured ? "Featured" : "Not Featured"}
                />
              </Box>

              {productData.isFeatured && (
                <Box mt={2}>
                  <TextField
                    type="number"
                    label="Display Order"
                    name="featuredOrder"
                    value={productData.featuredOrder}
                    onChange={handleChange}
                    inputProps={{ min: 1 }}
                    size="small"
                    helperText="Lower numbers appear first in carousel (e.g., 1, 2, 3...)"
                    sx={{ maxWidth: 200 }}
                  />
                </Box>
              )}
            </Box>

            {/* MEDIA SECTION */}
            <Typography variant="h6" fontWeight={600} mb={1}>
              📸 Product Media
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {/* Main Image */}
            <Box mb={3}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Main Product Image *
              </Typography>

              {imagePreviews.mainImage ? (
                <Paper elevation={2} sx={{ p: 2, position: "relative", borderRadius: 2 }}>
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
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  </Box>
                  <Box display="flex" justifyContent="space-between" mt={2}>
                    <Button
                      component="label"
                      size="small"
                      variant="outlined"
                      startIcon={<CloudUpload />}
                      disabled={uploadingStates.mainImage}
                    >
                      {uploadingStates.mainImage ? "Uploading..." : "Change Image"}
                      <input
                        type="file"
                        hidden
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={handleMainImageChange}
                      />
                    </Button>
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
              ) : (
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  disabled={uploadingStates.mainImage}
                  fullWidth
                  sx={{ py: 3, borderStyle: "dashed", borderWidth: 2 }}
                >
                  {uploadingStates.mainImage ? "Uploading..." : "Upload Main Image"}
                  <input
                    type="file"
                    hidden
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleMainImageChange}
                  />
                </Button>
              )}
            </Box>

            {/* Additional Images */}
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              Additional Images (Optional)
            </Typography>
            <Grid container spacing={2}>
              {[0, 1, 2].map((index) => (
                <Grid item xs={12} sm={4} key={index}>
                  {imagePreviews.additionalImages[index] ? (
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
                          style={{ width: "100%", height: "100%", objectFit: "contain" }}
                        />
                      </Box>
                      <Box display="flex" gap={1} mt={1}>
                        <Button
                          component="label"
                          size="small"
                          variant="outlined"
                          fullWidth
                          disabled={uploadingStates[`additionalImage${index}`]}
                        >
                          {uploadingStates[`additionalImage${index}`] ? "..." : "Change"}
                          <input
                            type="file"
                            hidden
                            accept="image/png, image/jpeg, image/jpg"
                            onChange={(e) => handleAdditionalImageChange(index, e)}
                          />
                        </Button>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => removeAdditionalImage(index)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </Paper>
                  ) : (
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<ImageIcon />}
                      disabled={uploadingStates[`additionalImage${index}`]}
                      fullWidth
                      sx={{ py: 2, borderStyle: "dashed" }}
                    >
                      {uploadingStates[`additionalImage${index}`] ? "Uploading..." : `Image ${index + 2}`}
                      <input
                        type="file"
                        hidden
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={(e) => handleAdditionalImageChange(index, e)}
                      />
                    </Button>
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
                    setProductData((prev) => ({ ...prev, color: newValue || "" }));
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Color" name="color" required />
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
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
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
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
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
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
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
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  fullWidth
                  label="Top Level Category"
                  name="topLevelCategory"
                  value={productData.topLevelCategory}
                  onChange={(e) => {
                    setProductData((prev) => ({
                      ...prev,
                      topLevelCategory: e.target.value,
                      secondLevelCategory: "",
                      thirdLevelCategory: "",
                    }));
                  }}
                  required
                >
                  {navigation?.categories?.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Autocomplete
                  freeSolo
                  options={secondLevelOptions.map((s) => s.id)}
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
                  disabled={!productData.topLevelCategory}
                  renderInput={(params) => (
                    <TextField {...params} label="Second Level Category" required />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Autocomplete
                  freeSolo
                  options={thirdLevelOptions.map((i) => i.id)}
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
                  disabled={!productData.secondLevelCategory}
                  renderInput={(params) => (
                    <TextField {...params} label="Third Level Category" required />
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
                  onChange={(e) => handleHighlightChange(index, e.target.value)}
                  placeholder="e.g., Premium quality fabric"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">✓</InputAdornment>,
                  }}
                />
                {productData.highlights.length > 1 && (
                  <IconButton color="error" onClick={() => removeHighlight(index)} size="small">
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
                />
              </Grid>
            </Grid>

            {/* SIZES */}
            <Typography variant="h6" fontWeight={600} mt={4} mb={1}>
              📏 Size Variants
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {productData.sizes.map((size, index) => (
              <Grid container spacing={2} key={index} mb={2} alignItems="center">
                <Grid item xs={5}>
                  <Autocomplete
                    freeSolo
                    options={SIZES}
                    value={size.name}
                    onChange={(e, newValue) =>
                      handleSizeChange(index, "name", newValue || "")
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Size Name" required size="small" />
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
                    onChange={(e) => handleSizeChange(index, "quantity", e.target.value)}
                    required
                    size="small"
                  />
                </Grid>

                <Grid item xs={2}>
                  <IconButton color="error" onClick={() => removeSize(index)} size="small">
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

            {/* SUBMIT BUTTONS */}
            <Box display="flex" gap={2} mt={4}>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/admin/products")}
                disabled={submitting}
                sx={{ flex: 1 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={submitting || Object.values(uploadingStates).some((s) => s)}
                sx={{ flex: 2, py: 1.5, fontSize: "16px", fontWeight: 600 }}
              >
                {submitting ? (
                  <>
                    <CircularProgress size={24} sx={{ mr: 2, color: "white" }} />
                    Updating...
                  </>
                ) : (
                  "💾 Update Product"
                )}
              </Button>
            </Box>
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

export default EditProductForm;