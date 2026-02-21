import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
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
  Chip,
} from "@mui/material";
import { Add, Delete, CloudUpload, Image as ImageIcon, AddCircleOutline } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "../../../State/Admin/Action";
import { api } from "../../../Config/apiConfig";

// ─── CLOUDINARY ──────────────────────────────────────────────────────────────
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dilhn8hzs/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "ecommerce_products";

const COLORS = ["Red","Blue","Green","Yellow","Black","White","Pink","Purple","Orange","Brown","Gray","Multi"];
const SIZES  = ["XS","S","M","L","XL","XXL","Free Size","UK 6","UK 7","UK 8","UK 9","UK 10"];

// ─── Helper: flatten tree → map by level ─────────────────────────────────────
// API returns: [{ id, name, level, slug, children: [...] }]
function flatByLevel(tree) {
  const level1 = [], level2 = [], level3 = [];
  tree.forEach((l1) => {
    level1.push({ id: l1.slug, name: l1.name, dbId: l1.id });
    (l1.children || []).forEach((l2) => {
      level2.push({ id: l2.slug, name: l2.name, dbId: l2.id, parentSlug: l1.slug });
      (l2.children || []).forEach((l3) => {
        level3.push({ id: l3.slug, name: l3.name, dbId: l3.id, parentSlug: l2.slug });
      });
    });
  });
  return { level1, level2, level3 };
}

// ─── Add category to backend ──────────────────────────────────────────────────
async function addCategoryToBackend(name, level, parentDbId) {
  console.log("Adding category:", { name, level, parentDbId });
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  const payload = { name: slug, level, parentCategoryId: parentDbId ?? null };
  const { data } = await api.post("/api/categories", payload);
  return data; // expects { id, name, level, slug, ... }
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const CreateProductForm = () => {
  const dispatch = useDispatch();
  const { loading, error, product } = useSelector((state) => state.adminProduct);

  // ── Category state ──────────────────────────────────────────────────────────
  const [catTree, setCatTree]     = useState([]);
  const [catLoading, setCatLoading] = useState(true);
  const [cats, setCats]           = useState({ level1: [], level2: [], level3: [] });

  // selected
  const [selL1, setSelL1] = useState(null); // { id(slug), name, dbId }
  const [selL2, setSelL2] = useState(null);
  const [selL3, setSelL3] = useState(null);

  // "add new" input visibility
  const [addingL1, setAddingL1] = useState(false);
  const [addingL2, setAddingL2] = useState(false);
  const [addingL3, setAddingL3] = useState(false);
  const [newL1, setNewL1] = useState("");
  const [newL2, setNewL2] = useState("");
  const [newL3, setNewL3] = useState("");
  const [addingCat, setAddingCat] = useState(false);

  // ── Product form state ──────────────────────────────────────────────────────
  const emptyForm = {
    imageUrl: "", additionalImages: ["", "", ""],
    brand: "", title: "", color: "", description: "",
    highlights: [""], material: "", careInstructions: "",
    countryOfOrigin: "India", manufacturer: "",
    price: "", discountedPrice: "", discountPercent: "",
    quantity: "", sizes: [],
  };
  const [productData, setProductData] = useState(emptyForm);

  const [imagePreviews, setImagePreviews] = useState({ mainImage: "", additionalImages: ["","",""] });
  const [uploadingStates, setUploadingStates] = useState({ mainImage: false, additionalImage0: false, additionalImage1: false, additionalImage2: false });

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // ── Fetch categories ────────────────────────────────────────────────────────
  const fetchCategories = async () => {
    setCatLoading(true);
    try {
      const { data } = await api.get("/api/categories/tree");
      setCatTree(data);
      setCats(flatByLevel(data));
    } catch (e) {
      console.error("Failed to load categories", e);
    } finally {
      setCatLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  // ── Derived filtered lists ──────────────────────────────────────────────────
  const filteredL2 = selL1 ? cats.level2.filter(c => c.parentSlug === selL1.id) : [];
  const filteredL3 = selL2 ? cats.level3.filter(c => c.parentSlug === selL2.id) : [];

  // ── Add new category handlers ───────────────────────────────────────────────
  const handleAddL1 = async () => {
    if (!newL1.trim()) return;
    setAddingCat(true);
    try {
      await addCategoryToBackend(newL1.trim(), 1, null);
      await fetchCategories();
      setNewL1(""); setAddingL1(false);
      showSnack("Category added!", "success");
    } catch { showSnack("Failed to add category", "error"); }
    finally { setAddingCat(false); }
  };

  const handleAddL2 = async () => {
    if (!newL2.trim() || !selL1) return;
    setAddingCat(true);
    try {
      await addCategoryToBackend(newL2.trim(), 2, selL1.dbId);
      await fetchCategories();
      setNewL2(""); setAddingL2(false);
      showSnack("Sub-category added!", "success");
    } catch { showSnack("Failed to add sub-category", "error"); }
    finally { setAddingCat(false); }
  };

  const handleAddL3 = async () => {
    if (!newL3.trim() || !selL2) return;
    setAddingCat(true);
    try {
      await addCategoryToBackend(newL3.trim(), 3, selL2.dbId);
      await fetchCategories();
      setNewL3(""); setAddingL3(false);
      showSnack("Item category added!", "success");
    } catch { showSnack("Failed to add item category", "error"); }
    finally { setAddingCat(false); }
  };

  // ── Snackbar helper ─────────────────────────────────────────────────────────
  const showSnack = (message, severity = "success") =>
    setSnackbar({ open: true, message, severity });

  // ── Image upload ────────────────────────────────────────────────────────────
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", "products");
    const res = await fetch(CLOUDINARY_URL, { method: "POST", body: formData });
    if (!res.ok) throw new Error("Upload failed");
    return (await res.json()).secure_url;
  };

  const validateImageFile = (file) => {
    if (!file.type.startsWith("image/")) { showSnack("Please select a valid image file", "error"); return false; }
    if (file.size > 5 * 1024 * 1024)    { showSnack("Image size should be less than 5MB", "error"); return false; }
    return true;
  };

  const handleMainImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !validateImageFile(file)) return;
    const reader = new FileReader();
    reader.onloadend = () => setImagePreviews(p => ({ ...p, mainImage: reader.result }));
    reader.readAsDataURL(file);
    setUploadingStates(s => ({ ...s, mainImage: true }));
    try {
      const url = await uploadToCloudinary(file);
      setProductData(p => ({ ...p, imageUrl: url }));
      showSnack("Main image uploaded!");
    } catch { showSnack("Failed to upload main image", "error"); }
    finally { setUploadingStates(s => ({ ...s, mainImage: false })); }
  };

  const handleAdditionalImageChange = async (index, e) => {
    const file = e.target.files[0];
    if (!file || !validateImageFile(file)) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const arr = [...imagePreviews.additionalImages];
      arr[index] = reader.result;
      setImagePreviews(p => ({ ...p, additionalImages: arr }));
    };
    reader.readAsDataURL(file);
    const key = `additionalImage${index}`;
    setUploadingStates(s => ({ ...s, [key]: true }));
    try {
      const url = await uploadToCloudinary(file);
      const arr = [...productData.additionalImages]; arr[index] = url;
      setProductData(p => ({ ...p, additionalImages: arr }));
      showSnack(`Image ${index + 2} uploaded!`);
    } catch { showSnack(`Failed to upload image ${index + 2}`, "error"); }
    finally { setUploadingStates(s => ({ ...s, [key]: false })); }
  };

  const removeMainImage = () => {
    setProductData(p => ({ ...p, imageUrl: "" }));
    setImagePreviews(p => ({ ...p, mainImage: "" }));
  };

  const removeAdditionalImage = (index) => {
    const imgs = [...productData.additionalImages]; imgs[index] = "";
    const prev = [...imagePreviews.additionalImages]; prev[index] = "";
    setProductData(p => ({ ...p, additionalImages: imgs }));
    setImagePreviews(p => ({ ...p, additionalImages: prev }));
  };

  // ── Form helpers ────────────────────────────────────────────────────────────
  const handleChange = (e) => setProductData(p => ({ ...p, [e.target.name]: e.target.value }));
  const addHighlight    = () => setProductData(p => ({ ...p, highlights: [...p.highlights, ""] }));
  const removeHighlight = (i) => setProductData(p => ({ ...p, highlights: p.highlights.filter((_, idx) => idx !== i) }));
  const handleHighlightChange = (i, v) => { const arr = [...productData.highlights]; arr[i] = v; setProductData(p => ({ ...p, highlights: arr })); };
  const addSize    = () => setProductData(p => ({ ...p, sizes: [...p.sizes, { name: "", quantity: 0 }] }));
  const removeSize = (i) => setProductData(p => ({ ...p, sizes: p.sizes.filter((_, idx) => idx !== i) }));
  const handleSizeChange = (i, field, value) => { const arr = [...productData.sizes]; arr[i][field] = value; setProductData(p => ({ ...p, sizes: arr })); };

  // ── Reset after success ─────────────────────────────────────────────────────
  useEffect(() => {
    if (product) {
      showSnack("Product created successfully!");
      setProductData(emptyForm);
      setImagePreviews({ mainImage: "", additionalImages: ["","",""] });
      setSelL1(null); setSelL2(null); setSelL3(null);
    }
  }, [product]);

  useEffect(() => {
    if (error) showSnack(`Failed to create product: ${error}`, "error");
  }, [error]);

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productData.imageUrl) { showSnack("Please upload a main product image", "error"); return; }
    if (!selL1 || !selL2 || !selL3) { showSnack("Please select all 3 category levels", "error"); return; }

    const submitData = {
      imageUrl: productData.imageUrl,
      brand: productData.brand,
      title: productData.title,
      color: productData.color,
      discountedPrice: parseInt(productData.discountedPrice) || 0,
      price: parseInt(productData.price) || 0,
      discountPercent: parseInt(productData.discountPercent) || 0,
      size: productData.sizes.filter(s => s.name && s.quantity >= 0).map(s => ({ name: s.name, quantity: parseInt(s.quantity) || 0 })),
      quantity: parseInt(productData.quantity) || 0,
      topLevelCategory: selL1.id,
      secondLevelCategory: selL2.id,
      thirdLevelCategory: selL3.id,
      description: productData.description,
      highlights: productData.highlights.filter(h => h.trim()).join(", "),
      additionalImages: productData.additionalImages.filter(img => img.trim()),
      material: productData.material,
      careInstructions: productData.careInstructions,
      countryOfOrigin: productData.countryOfOrigin,
      manufacturer: productData.manufacturer,
    };

    try { await dispatch(createProduct(submitData)); }
    catch (err) { console.error("Submit error:", err); }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <Box maxWidth="900px" mx="auto" py={3} px={2}>
      <Typography variant="h4" fontWeight={700} textAlign="center" mb={3}>
        Add New Product
      </Typography>

      <Card elevation={2} sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>

            {/* ── IMAGES ── */}
            <Typography variant="h6" fontWeight={600} mb={1}>📸 Product Media</Typography>
            <Divider sx={{ mb: 2 }} />

            <Box mb={3}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>Main Product Image *</Typography>
              {!imagePreviews.mainImage ? (
                <Button component="label" variant="outlined" startIcon={uploadingStates.mainImage ? <CircularProgress size={20}/> : <CloudUpload/>}
                  disabled={uploadingStates.mainImage} fullWidth sx={{ py: 3, borderStyle:"dashed", borderWidth:2 }}>
                  {uploadingStates.mainImage ? "Uploading..." : "Click to Upload Main Image"}
                  <input type="file" hidden accept="image/png,image/jpeg,image/jpg" onChange={handleMainImageChange}/>
                </Button>
              ) : (
                <Paper elevation={2} sx={{ p:2, borderRadius:2 }}>
                  <Box sx={{ width:"100%", height:200, borderRadius:2, overflow:"hidden", backgroundColor:"#f5f5f5" }}>
                    <img src={imagePreviews.mainImage} alt="Main" style={{ width:"100%", height:"100%", objectFit:"contain" }}/>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mt={2}>
                    <Typography variant="caption" color="success.main">✓ Main image uploaded</Typography>
                    <Button size="small" color="error" onClick={removeMainImage} startIcon={<Delete/>}>Remove</Button>
                  </Box>
                </Paper>
              )}
            </Box>

            <Typography variant="subtitle2" color="text.secondary" mb={1}>Additional Images (Optional — max 3)</Typography>
            <Grid container spacing={2} mb={3}>
              {[0,1,2].map(index => (
                <Grid item xs={12} sm={4} key={index}>
                  {!imagePreviews.additionalImages[index] ? (
                    <Button component="label" variant="outlined" fullWidth
                      startIcon={uploadingStates[`additionalImage${index}`] ? <CircularProgress size={16}/> : <ImageIcon/>}
                      disabled={uploadingStates[`additionalImage${index}`]}
                      sx={{ py:2, borderStyle:"dashed", fontSize:"0.875rem" }}>
                      {uploadingStates[`additionalImage${index}`] ? "Uploading..." : `Image ${index + 2}`}
                      <input type="file" hidden accept="image/png,image/jpeg,image/jpg" onChange={(e) => handleAdditionalImageChange(index, e)}/>
                    </Button>
                  ) : (
                    <Paper elevation={1} sx={{ p:1, position:"relative" }}>
                      <Box sx={{ width:"100%", height:120, borderRadius:1, overflow:"hidden", backgroundColor:"#f5f5f5" }}>
                        <img src={imagePreviews.additionalImages[index]} alt={`Additional ${index+1}`} style={{ width:"100%", height:"100%", objectFit:"contain" }}/>
                      </Box>
                      <IconButton size="small" color="error" onClick={() => removeAdditionalImage(index)}
                        sx={{ position:"absolute", top:4, right:4, backgroundColor:"white" }}>
                        <Delete fontSize="small"/>
                      </IconButton>
                    </Paper>
                  )}
                </Grid>
              ))}
            </Grid>

            {/* ── CATEGORIES (Live from DB) ── */}
            <Typography variant="h6" fontWeight={600} mb={1}>📂 Categories</Typography>
            <Divider sx={{ mb: 2 }} />

            {catLoading ? (
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <CircularProgress size={20}/> <Typography variant="body2">Loading categories from database...</Typography>
              </Box>
            ) : (
              <Grid container spacing={2} mb={2}>

                {/* LEVEL 1 */}
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={0.5}>
                    Level 1 — Top Category
                  </Typography>
                  <Autocomplete
                    options={cats.level1}
                    getOptionLabel={(o) => o.name}
                    value={selL1}
                    onChange={(_, v) => { setSelL1(v); setSelL2(null); setSelL3(null); }}
                    renderOption={(props, option) => (
                      <li {...props} key={option.dbId}>
                        <Typography variant="body2">{option.name}</Typography>
                      </li>
                    )}
                    renderInput={(params) => <TextField {...params} label="e.g. Men, Women, Hemp" required size="small"/>}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => <Chip label={option.name} {...getTagProps({ index })} size="small"/>)
                    }
                  />
                  {!addingL1 ? (
                    <Button size="small" startIcon={<AddCircleOutline fontSize="small"/>} onClick={() => setAddingL1(true)}
                      sx={{ mt: 1, fontSize: "0.75rem", color: "teal" }}>
                      Add new top category
                    </Button>
                  ) : (
                    <Box display="flex" gap={1} mt={1}>
                      <TextField size="small" value={newL1} onChange={e => setNewL1(e.target.value)}
                        placeholder="e.g. Kids" autoFocus sx={{ flex: 1 }}
                        onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleAddL1())}/>
                      <Button size="small" variant="contained" onClick={handleAddL1} disabled={addingCat}
                        sx={{ minWidth: 0, px: 1.5, backgroundColor: "teal" }}>
                        {addingCat ? <CircularProgress size={14} color="inherit"/> : "Add"}
                      </Button>
                      <Button size="small" onClick={() => { setAddingL1(false); setNewL1(""); }}>✕</Button>
                    </Box>
                  )}
                </Grid>

                {/* LEVEL 2 */}
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={0.5}>
                    Level 2 — Section
                  </Typography>
                  <Autocomplete
                    options={filteredL2}
                    getOptionLabel={(o) => o.name}
                    value={selL2}
                    onChange={(_, v) => { setSelL2(v); setSelL3(null); }}
                    disabled={!selL1}
                    renderOption={(props, option) => (
                      <li {...props} key={option.dbId}>
                        <Typography variant="body2">{option.name}</Typography>
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField {...params} label={selL1 ? "e.g. Clothing, Bags" : "Select Level 1 first"} required size="small"/>
                    )}
                  />
                  {selL1 && (!addingL2 ? (
                    <Button size="small" startIcon={<AddCircleOutline fontSize="small"/>} onClick={() => setAddingL2(true)}
                      sx={{ mt: 1, fontSize: "0.75rem", color: "teal" }}>
                      Add new section
                    </Button>
                  ) : (
                    <Box display="flex" gap={1} mt={1}>
                      <TextField size="small" value={newL2} onChange={e => setNewL2(e.target.value)}
                        placeholder={`Under ${selL1.name}`} autoFocus sx={{ flex: 1 }}
                        onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleAddL2())}/>
                      <Button size="small" variant="contained" onClick={handleAddL2} disabled={addingCat}
                        sx={{ minWidth: 0, px: 1.5, backgroundColor: "teal" }}>
                        {addingCat ? <CircularProgress size={14} color="inherit"/> : "Add"}
                      </Button>
                      <Button size="small" onClick={() => { setAddingL2(false); setNewL2(""); }}>✕</Button>
                    </Box>
                  ))}
                </Grid>

                {/* LEVEL 3 */}
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={0.5}>
                    Level 3 — Item
                  </Typography>
                  <Autocomplete
                    options={filteredL3}
                    getOptionLabel={(o) => o.name}
                    value={selL3}
                    onChange={(_, v) => setSelL3(v)}
                    disabled={!selL2}
                    renderOption={(props, option) => (
                      <li {...props} key={option.dbId}>
                        <Typography variant="body2">{option.name}</Typography>
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField {...params} label={selL2 ? "e.g. Jeans, Pouches" : "Select Level 2 first"} required size="small"/>
                    )}
                  />
                  {selL2 && (!addingL3 ? (
                    <Button size="small" startIcon={<AddCircleOutline fontSize="small"/>} onClick={() => setAddingL3(true)}
                      sx={{ mt: 1, fontSize: "0.75rem", color: "teal" }}>
                      Add new item
                    </Button>
                  ) : (
                    <Box display="flex" gap={1} mt={1}>
                      <TextField size="small" value={newL3} onChange={e => setNewL3(e.target.value)}
                        placeholder={`Under ${selL2.name}`} autoFocus sx={{ flex: 1 }}
                        onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleAddL3())}/>
                      <Button size="small" variant="contained" onClick={handleAddL3} disabled={addingCat}
                        sx={{ minWidth: 0, px: 1.5, backgroundColor: "teal" }}>
                        {addingCat ? <CircularProgress size={14} color="inherit"/> : "Add"}
                      </Button>
                      <Button size="small" onClick={() => { setAddingL3(false); setNewL3(""); }}>✕</Button>
                    </Box>
                  ))}
                </Grid>

              </Grid>
            )}

            {/* Selected path breadcrumb */}
            {(selL1 || selL2 || selL3) && (
              <Box mb={3} p={1.5} bgcolor="#f0fdf4" borderRadius={2} border="1px solid #bbf7d0">
                <Typography variant="caption" color="text.secondary">Selected path: </Typography>
                <Typography variant="caption" fontWeight={600} color="green">
                  {[selL1?.name, selL2?.name, selL3?.name].filter(Boolean).join(" → ")}
                </Typography>
              </Box>
            )}

            {/* ── BASIC INFO ── */}
            <Typography variant="h6" fontWeight={600} mb={1}>📝 Basic Information</Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Brand" name="brand" value={productData.brand} onChange={handleChange} required/>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Title" name="title" value={productData.title} onChange={handleChange} required/>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete freeSolo options={COLORS} value={productData.color}
                  onChange={(_, v) => setProductData(p => ({ ...p, color: v || "" }))}
                  renderInput={(params) => <TextField {...params} label="Color" required/>}/>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth type="number" label="Total Quantity" name="quantity"
                  inputProps={{ min:0 }} value={productData.quantity} onChange={handleChange} required/>
              </Grid>
            </Grid>

            {/* ── PRICING ── */}
            <Typography variant="h6" fontWeight={600} mt={4} mb={1}>💰 Pricing Details</Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth type="number" label="Original Price" name="price" value={productData.price}
                  onChange={handleChange} required InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}/>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth type="number" label="Discounted Price" name="discountedPrice" value={productData.discountedPrice}
                  onChange={handleChange} required InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}/>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth type="number" label="Discount %" name="discountPercent" value={productData.discountPercent}
                  onChange={handleChange} required InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}/>
              </Grid>
            </Grid>

            {/* ── DESCRIPTION ── */}
            <Typography variant="h6" fontWeight={600} mt={4} mb={1}>📄 Description & Details</Typography>
            <Divider sx={{ mb: 2 }} />
            <TextField fullWidth multiline rows={4} label="Product Description" name="description"
              value={productData.description} onChange={handleChange} required margin="normal"/>

            <Typography variant="subtitle2" mt={2} mb={1}>Product Highlights</Typography>
            {productData.highlights.map((h, i) => (
              <Box key={i} display="flex" gap={1} mb={1}>
                <TextField fullWidth size="small" value={h} onChange={e => handleHighlightChange(i, e.target.value)}
                  placeholder="e.g., Premium quality fabric"
                  InputProps={{ startAdornment: <InputAdornment position="start">✓</InputAdornment> }}/>
                {productData.highlights.length > 1 && (
                  <IconButton color="error" onClick={() => removeHighlight(i)} size="small"><Delete/></IconButton>
                )}
              </Box>
            ))}
            <Button startIcon={<Add/>} onClick={addHighlight} variant="outlined" size="small" sx={{ mt: 1 }}>
              Add Highlight
            </Button>

            <Grid container spacing={2} mt={2}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Material" name="material" value={productData.material} onChange={handleChange} placeholder="e.g., 100% Cotton"/>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Country of Origin" name="countryOfOrigin" value={productData.countryOfOrigin} onChange={handleChange}/>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Manufacturer" name="manufacturer" value={productData.manufacturer} onChange={handleChange}/>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Care Instructions" name="careInstructions" value={productData.careInstructions} onChange={handleChange} placeholder="e.g., Machine wash cold"/>
              </Grid>
            </Grid>

            {/* ── SIZES ── */}
            <Typography variant="h6" fontWeight={600} mt={4} mb={1}>📏 Size Variants</Typography>
            <Divider sx={{ mb: 2 }} />
            {productData.sizes.map((size, i) => (
              <Grid container spacing={2} key={i} mb={2} alignItems="center">
                <Grid item xs={5}>
                  <Autocomplete freeSolo options={SIZES} value={size.name}
                    onChange={(_, v) => handleSizeChange(i, "name", v || "")}
                    renderInput={(params) => <TextField {...params} label="Size" required size="small"/>}/>
                </Grid>
                <Grid item xs={5}>
                  <TextField fullWidth type="number" label="Quantity" inputProps={{ min:0 }}
                    value={size.quantity} onChange={e => handleSizeChange(i, "quantity", e.target.value)} required size="small"/>
                </Grid>
                <Grid item xs={2}>
                  <IconButton color="error" onClick={() => removeSize(i)} size="small"><Delete/></IconButton>
                </Grid>
              </Grid>
            ))}
            <Button startIcon={<Add/>} onClick={addSize} variant="outlined" size="small" sx={{ mt: 1 }}>
              Add Size
            </Button>

            {/* ── SUBMIT ── */}
            <Button fullWidth type="submit" variant="contained" color="primary" size="large"
              sx={{ mt: 4, py: 1.5, fontSize: "16px", fontWeight: 600 }}
              disabled={loading || Object.values(uploadingStates).some(Boolean) || addingCat}>
              {loading ? <><CircularProgress size={24} sx={{ mr:2, color:"white" }}/>Creating Product...</> : "✨ Create Product"}
            </Button>

          </form>
        </CardContent>
      </Card>

      <Snackbar open={snackbar.open} autoHideDuration={5000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical:"bottom", horizontal:"right" }}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateProductForm;