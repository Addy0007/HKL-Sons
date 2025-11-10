import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import DeliveryForm from "./DeliveryForm";
import axios from "axios";
import { saveCheckoutAddress } from "../../../State/Checkout/Action";
import { getCart } from "../../../State/Cart/Action"; // ✅ Import getCart action

const CheckoutAddress = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state);

  // ✅ Get saved address from Redux (which loads from localStorage)
  const savedAddress = useSelector((state) => state.checkout.address);

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [pincodes, setPincodes] = useState([]);
  const [loadingStates, setLoadingStates] = useState(true);
  const [error, setError] = useState(null);
  const [pincodeStatus, setPincodeStatus] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [isCartChecked, setIsCartChecked] = useState(false); // ✅ Track if cart has been checked

  // ✅ Initialize form state with saved address or empty values
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

  // ✅ Fetch cart on component mount (handles page refresh)
  useEffect(() => {
    const fetchCart = async () => {
      if (!isLoading) {
        console.log("🛒 Fetching cart data...");
        await dispatch(getCart());
        setIsCartChecked(true); // ✅ Mark that we've checked the cart
      }
    };
    
    fetchCart();
  }, [dispatch, isLoading]);

  // ✅ Only redirect if cart is confirmed empty AFTER we've fetched it
  useEffect(() => {
    // Wait for: auth loaded, cart checked, and cart not currently loading
    if (!isLoading && isCartChecked && !cart.loading) {
      // If cart is definitely empty, redirect
      if (!cart.cartItems || cart.cartItems.length === 0) {
        console.warn("Cart is empty, redirecting to cart page");
        navigate("/cart", { replace: true });
      }
    }
  }, [cart.cartItems, cart.loading, isLoading, isCartChecked, navigate]);

  // ✅ Load States
  useEffect(() => {
    const fetchStates = async () => {
      try {
        setLoadingStates(true);
        const jwt = localStorage.getItem("jwt");
        const res = await axios.get("/api/locations/states", {
          headers: { Authorization: `Bearer ${jwt}` }
        });

        if (Array.isArray(res.data)) {
          setStates(res.data);
          setError(null);
        } else {
          setStates([]);
          setError("Invalid data format received");
        }
      } catch (err) {
        setError(`Failed to load states: ${err.message}`);
      } finally {
        setLoadingStates(false);
      }
    };
    fetchStates();
  }, []);

  // ✅ Initialize form with saved address (runs once after states are loaded)
  useEffect(() => {
    const initializeForm = async () => {
      if (!savedAddress || isInitialized || loadingStates) return;

      console.log("🔄 Restoring saved address:", savedAddress);
      setAddress(savedAddress);

      // ✅ If saved address has state, load districts
      if (savedAddress.state) {
        try {
          const jwt = localStorage.getItem("jwt");
          const distRes = await axios.get(`/api/locations/districts/${savedAddress.state}`, {
            headers: { Authorization: `Bearer ${jwt}` }
          });
          setDistricts(distRes.data);

          // ✅ If saved address has district, load pincodes
          if (savedAddress.district) {
            const pinRes = await axios.get(`/api/locations/pincodes/${savedAddress.district}`, {
              headers: { Authorization: `Bearer ${jwt}` }
            });
            setPincodes(pinRes.data);
          }

          // ✅ If saved address has pincode, validate it
          if (savedAddress.zipCode && savedAddress.zipCode.length === 6) {
            try {
              const lookupRes = await axios.get(`/api/locations/lookup/${savedAddress.zipCode}`, {
                headers: { Authorization: `Bearer ${jwt}` }
              });
              setPincodeStatus(lookupRes.data.deliverable ? "deliverable" : "not-deliverable");
            } catch {
              setPincodeStatus("not-found");
            }
          }
        } catch (err) {
          console.error("Error restoring address data:", err);
        }
      }

      setIsInitialized(true);
    };

    initializeForm();
  }, [savedAddress, loadingStates, isInitialized]);

  const onStateChange = async (stateName) => {
    const updatedAddress = { ...address, state: stateName, district: "", zipCode: "" };
    setAddress(updatedAddress);
    setDistricts([]);
    setPincodes([]);
    setPincodeStatus("");

    if (stateName) {
      const jwt = localStorage.getItem("jwt");
      const res = await axios.get(`/api/locations/districts/${stateName}`, {
        headers: { Authorization: `Bearer ${jwt}` }
      });
      setDistricts(res.data);
    }

    // ✅ Save to Redux/localStorage on change
    dispatch(saveCheckoutAddress(updatedAddress));
  };

  const onDistrictChange = async (districtName) => {
    const updatedAddress = { ...address, district: districtName, zipCode: "" };
    setAddress(updatedAddress);
    setPincodes([]);
    setPincodeStatus("");

    if (districtName) {
      const jwt = localStorage.getItem("jwt");
      const res = await axios.get(`/api/locations/pincodes/${districtName}`, {
        headers: { Authorization: `Bearer ${jwt}` }
      });
      setPincodes(res.data);
    }

    // ✅ Save to Redux/localStorage on change
    dispatch(saveCheckoutAddress(updatedAddress));
  };

  const handlePincodeInput = async (pin) => {
    const updatedAddress = { ...address, zipCode: pin };
    setAddress(updatedAddress);

    if (pin.length < 6) {
      // ✅ Save partial pincode too
      dispatch(saveCheckoutAddress(updatedAddress));
      return;
    }

    try {
      const jwt = localStorage.getItem("jwt");
      const res = await axios.get(`/api/locations/lookup/${pin}`, {
        headers: { Authorization: `Bearer ${jwt}` }
      });

      setPincodeStatus(res.data.deliverable ? "deliverable" : "not-deliverable");

      const finalAddress = {
        ...updatedAddress,
        state: res.data.state,
        district: res.data.district,
      };
      setAddress(finalAddress);

      const distRes = await axios.get(`/api/locations/districts/${res.data.state}`, {
        headers: { Authorization: `Bearer ${jwt}` }
      });
      setDistricts(distRes.data);

      const pinRes = await axios.get(`/api/locations/pincodes/${res.data.district}`, {
        headers: { Authorization: `Bearer ${jwt}` }
      });
      setPincodes(pinRes.data);

      // ✅ Save complete address
      dispatch(saveCheckoutAddress(finalAddress));

    } catch {
      setPincodeStatus("not-found");
      dispatch(saveCheckoutAddress(updatedAddress));
    }
  };

  // ✅ Auto-save on field changes
  const handleFieldChange = (field, value) => {
    const updatedAddress = { ...address, [field]: value };
    setAddress(updatedAddress);
    dispatch(saveCheckoutAddress(updatedAddress));
  };

  const handleContinue = () => {
    // ✅ Double-check cart before continuing
    if (!cart.cartItems || cart.cartItems.length === 0) {
      alert("Your cart is empty. Please add items before checkout.");
      navigate("/cart");
      return;
    }

    dispatch(saveCheckoutAddress(address));
    navigate("/checkout/summary");
  };

  if (isLoading) return <div className="text-center mt-10">Checking login...</div>;
  if (!user) return null;

  // ✅ Show loading while cart is being fetched
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

  // ✅ Show message if cart is empty
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
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        {loadingStates ? (
          <div className="text-center py-10">Loading states...</div>
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
          />
        )}
      </div>
    </div>
  );
};

export default CheckoutAddress;