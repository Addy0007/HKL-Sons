import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import DeliveryForm from "./DeliveryForm";
import axios from "axios";
import { saveCheckoutAddress } from "../../../State/Checkout/Action";
import { getCart } from "../../../State/Cart/Action";
import { CLEAR_CHECKOUT_ADDRESS } from "../../../State/Checkout/ActionType";

const CheckoutAddress = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user, isLoading } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state);
  const savedAddress = useSelector((state) => state.checkout.address);

  useEffect(() => {
    if (savedAddress && savedAddress._user && savedAddress._user !== user?.id) {
      dispatch({ type: CLEAR_CHECKOUT_ADDRESS });
    }
  }, [savedAddress, user, dispatch]);

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [pincodes, setPincodes] = useState([]);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedSavedAddressId, setSelectedSavedAddressId] = useState(null);
  const [loadingStates, setLoadingStates] = useState(true);
  const [error, setError] = useState(null);
  const [pincodeStatus, setPincodeStatus] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [isCartChecked, setIsCartChecked] = useState(false);
  
  // ✅ NEW: State for save feedback
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    streetAddress: "",
    state: "",
    district: "",
    zipCode: "",
    city: "",
    mobile: "",
  });

  useEffect(() => {
    const fetchCart = async () => {
      if (!isLoading) {
        await dispatch(getCart());
        setIsCartChecked(true);
      }
    };
    fetchCart();
  }, [dispatch, isLoading]);

  useEffect(() => {
    if (!isLoading && isCartChecked && !cart.loading) {
      if (!cart.cartItems || cart.cartItems.length === 0) {
        navigate("/cart", { replace: true });
      }
    }
  }, [isLoading, isCartChecked, cart.loading, cart.cartItems, navigate]);

  // ✅ MODIFIED: Reload saved addresses function
  const loadSavedAddresses = async () => {
    try {
      const jwt = localStorage.getItem("jwt");
      const res = await axios.get("/api/address", {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      setSavedAddresses(
  Array.isArray(res.data)
    ? res.data.filter((addr) => addr.active !== false)
    : []
);

    } catch (err) {
      setSavedAddresses([]);
    }
  };

  useEffect(() => {
    if (user) loadSavedAddresses();
  }, [user]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        setLoadingStates(true);
        const jwt = localStorage.getItem("jwt");
        const res = await axios.get("/api/locations/states", {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        if (Array.isArray(res.data)) {
          setStates(res.data);
          setError(null);
        } else {
          setStates([]);
          setError("Invalid data format received for states.");
        }
      } catch (err) {
        setError(`Failed to load states: ${err.message}`);
        setStates([]);
      } finally {
        setLoadingStates(false);
      }
    };
    fetchStates();
  }, []);

  useEffect(() => {
    const restore = async () => {
      if (!savedAddress || isInitialized || loadingStates) return;
      
      setAddress(savedAddress);
      
      try {
        const jwt = localStorage.getItem("jwt");
        if (savedAddress.state) {
          const distRes = await axios.get(
            `/api/locations/districts/${savedAddress.state}`,
            { headers: { Authorization: `Bearer ${jwt}` } }
          );
          setDistricts(distRes.data || []);
        } else {
          setDistricts([]);
        }
        
        if (savedAddress.district) {
          const pinRes = await axios.get(
            `/api/locations/pincodes/${savedAddress.district}`,
            { headers: { Authorization: `Bearer ${jwt}` } }
          );
          setPincodes(pinRes.data || []);
        } else {
          setPincodes([]);
        }
        
        if (savedAddress.zipCode && savedAddress.zipCode.length === 6) {
          try {
            const lookup = await axios.get(
              `/api/locations/lookup/${savedAddress.zipCode}`,
              { headers: { Authorization: `Bearer ${jwt}` } }
            );
            setPincodeStatus(lookup.data?.deliverable ? "deliverable" : "not-deliverable");
          } catch {
            setPincodeStatus("not-found");
          }
        } else {
          setPincodeStatus("");
        }
      } catch {}
      
      setIsInitialized(true);
    };
    restore();
  }, [savedAddress, isInitialized, loadingStates]);

  const handleFieldChange = (field, value) => {
    const updated = { ...address, [field]: value };
    setAddress(updated);
    dispatch(saveCheckoutAddress(updated));
  };

  const onStateChange = async (stateName) => {
    const updated = { ...address, state: stateName, district: "", zipCode: "" };
    setAddress(updated);
    setDistricts([]);
    setPincodes([]);
    setPincodeStatus("");
    dispatch(saveCheckoutAddress(updated));
    
    if (!stateName) return;
    
    try {
      const jwt = localStorage.getItem("jwt");
      const res = await axios.get(`/api/locations/districts/${stateName}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      setDistricts(Array.isArray(res.data) ? res.data : []);
    } catch {
      setDistricts([]);
    }
  };

  const onDistrictChange = async (districtName) => {
    const updated = { ...address, district: districtName, zipCode: "" };
    setAddress(updated);
    setPincodes([]);
    setPincodeStatus("");
    dispatch(saveCheckoutAddress(updated));
    
    if (!districtName) return;
    
    try {
      const jwt = localStorage.getItem("jwt");
      const res = await axios.get(`/api/locations/pincodes/${districtName}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      setPincodes(Array.isArray(res.data) ? res.data : []);
    } catch {
      setPincodes([]);
    }
  };

  const handlePincodeInput = async (pin) => {
    const updated = { ...address, zipCode: pin };
    setAddress(updated);
    
    if (pin.length < 6) {
      setPincodeStatus("");
      dispatch(saveCheckoutAddress(updated));
      return;
    }
    
    try {
      const jwt = localStorage.getItem("jwt");
      const res = await axios.get(`/api/locations/lookup/${pin}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      
      const deliverable = !!res.data?.deliverable;
      setPincodeStatus(deliverable ? "deliverable" : "not-deliverable");
      
      const finalAddress = {
        ...updated,
        state: res.data?.state || updated.state,
        district: res.data?.district || updated.district,
      };
      setAddress(finalAddress);
      
      if (res.data?.state) {
        try {
          const distRes = await axios.get(`/api/locations/districts/${res.data.state}`, {
            headers: { Authorization: `Bearer ${jwt}` },
          });
          setDistricts(Array.isArray(distRes.data) ? distRes.data : []);
        } catch {
          setDistricts([]);
        }
      }
      
      if (res.data?.district) {
        try {
          const pinRes = await axios.get(`/api/locations/pincodes/${res.data.district}`, {
            headers: { Authorization: `Bearer ${jwt}` },
          });
          setPincodes(Array.isArray(pinRes.data) ? pinRes.data : []);
        } catch {
          setPincodes([]);
        }
      }
      
      dispatch(saveCheckoutAddress(finalAddress));
    } catch {
      setPincodeStatus("not-found");
      dispatch(saveCheckoutAddress(updated));
    }
  };

  // ✅ NEW: Save Address to Database (without navigation)
  const handleSaveAddress = async () => {
    if (!cart.cartItems || cart.cartItems.length === 0) {
      alert("Your cart is empty. Please add items before checkout.");
      navigate("/cart");
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const jwt = localStorage.getItem("jwt");
      await axios.post("/api/address", address, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      
      setSaveMessage({ type: "success", text: "✅ Address saved successfully!" });
      
      // Reload saved addresses list
      await loadSavedAddresses();
      
      // Clear the form
      setAddress({
        firstName: "",
        lastName: "",
        streetAddress: "",
        state: "",
        district: "",
        zipCode: "",
        city: "",
        mobile: "",
      });
      setPincodeStatus("");
      
    } catch (err) {
      setSaveMessage({ 
        type: "error", 
        text: "❌ Failed to save address. Please try again." 
      });
    } finally {
      setIsSaving(false);
      // Clear message after 3 seconds
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  // ✅ MODIFIED: Continue now just navigates (no saving)
  const handleContinue = async () => {
    if (!cart.cartItems || cart.cartItems.length === 0) {
      alert("Your cart is empty. Please add items before checkout.");
      navigate("/cart");
      return;
    }
    
    dispatch(saveCheckoutAddress(address));
    navigate("/checkout/summary");
  };

  const selectSavedAddress = (addr) => {
    setSelectedSavedAddressId(addr.id);
    dispatch(saveCheckoutAddress(addr));
    navigate("/checkout/summary");
  };

  if (isLoading) return <div className="text-center mt-10">Checking login...</div>;
  if (!user) return null;
  
  if (!isCartChecked || cart.loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-10 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }
  
  if (!cart.cartItems || cart.cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 py-10 px-4 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow">
          <p className="text-gray-600 mb-4 text-lg">Your cart is empty</p>
          <button
            onClick={() => navigate("/cart")}
            className="bg-emerald-700 text-white py-2 px-6 rounded-md hover:bg-emerald-800"
          >
            Go to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-emerald-800 mb-6">Select Delivery Address</h1>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* ✅ NEW: Save feedback message */}
        {saveMessage && (
          <div className={`p-3 rounded mb-4 ${
            saveMessage.type === "success" 
              ? "bg-green-100 text-green-700" 
              : "bg-red-100 text-red-700"
          }`}>
            {saveMessage.text}
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Saved Addresses</h3>
            
            {savedAddresses.length === 0 && (
              <p className="text-gray-500 text-sm">No saved addresses</p>
            )}
            
{savedAddresses.map((addr) => {
  const selected = selectedSavedAddressId === addr.id;
  return (
    <div
      key={addr.id}
      className={`relative p-4 border rounded-lg transition cursor-pointer group ${
        selected ? "border-emerald-600 bg-emerald-50" : "hover:border-emerald-500"
      }`}
      onClick={() => selectSavedAddress(addr)}
    >
      {selected && (
        <div className="absolute -top-2 -right-2 bg-emerald-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shadow">
          ✓
        </div>
      )}

      <p className="font-medium text-gray-900">
        {addr.firstName} {addr.lastName}
      </p>
      <p className="text-gray-700">{addr.streetAddress}</p>
      <p className="text-gray-700">
        {addr.city}, {addr.district}
      </p>
      <p className="text-gray-700">
        {addr.state} - {addr.zipCode}
      </p>
      <p className="text-sm text-gray-500 mt-1">📞 {addr.mobile}</p>

      <div className="flex gap-2 mt-3">
        {/* ✅ Deliver button */}
        <button
          className="flex-1 bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700"
          onClick={(e) => {
            e.stopPropagation();
            selectSavedAddress(addr);
          }}
        >
          Deliver to this address
        </button>

        {/* 🗑️ Delete button */}
        <button
          className="flex-1 bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
          onClick={async (e) => {
            e.stopPropagation();
            if (!window.confirm("Are you sure you want to delete this address?")) return;

            try {
              const jwt = localStorage.getItem("jwt");
              await axios.delete(`/api/address/${addr.id}`, {
                headers: { Authorization: `Bearer ${jwt}` },
              });
              await loadSavedAddresses();
              alert("✅ Address deleted successfully");
            } catch (error) {
              console.error("Failed to delete address:", error);
              alert("❌ Failed to delete address. Please try again.");
            }
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
})}
</div>

<div className="lg:col-span-2">
  <h3 className="text-lg font-semibold text-gray-800 mb-4">
    Add New Address
  </h3>

  {loadingStates ? (
    <div className="text-center py-10">Loading form...</div>
  ) : (
    <DeliveryForm
      address={address}
      handleFieldChange={handleFieldChange}
      states={states}
      districts={districts}
      pincodes={pincodes}
      pincodeStatus={pincodeStatus}
      onStateChange={onStateChange}
      onDistrictChange={onDistrictChange}
      handlePincodeInput={handlePincodeInput}
      onContinue={handleContinue}
      onSaveAddress={handleSaveAddress}
      isSaving={isSaving}
    />
  )}
        </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutAddress;