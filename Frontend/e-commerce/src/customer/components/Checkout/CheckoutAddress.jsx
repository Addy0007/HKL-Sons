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

  // Auth & Cart from Redux
  const { user, isLoading } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state);

  // Last saved/working address from Redux (persisted to localStorage by your action)
  const savedAddress = useSelector((state) => state.checkout.address);

  
useEffect(() => {
  if (savedAddress && savedAddress._user && savedAddress._user !== user?.id) {
    // ✅ Different user is logged in now → clear old address
    dispatch({ type: CLEAR_CHECKOUT_ADDRESS });
  }
}, [savedAddress, user, dispatch]);


  // ---------- Local UI/Data State ----------
  // Lists for dynamic selects
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [pincodes, setPincodes] = useState([]);

  // Saved addresses from backend
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedSavedAddressId, setSelectedSavedAddressId] = useState(null);

  // UX & Guards
  const [loadingStates, setLoadingStates] = useState(true);
  const [error, setError] = useState(null);
  const [pincodeStatus, setPincodeStatus] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [isCartChecked, setIsCartChecked] = useState(false);

  // Address form model (when adding a new address)
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

  // ---------- Effects: Fetch Cart ----------
  useEffect(() => {
    const fetchCart = async () => {
      if (!isLoading) {
        await dispatch(getCart());
        setIsCartChecked(true);
      }
    };
    fetchCart();
  }, [dispatch, isLoading]);

  // If cart empty after fetch → bounce to /cart
  useEffect(() => {
    if (!isLoading && isCartChecked && !cart.loading) {
      if (!cart.cartItems || cart.cartItems.length === 0) {
        navigate("/cart", { replace: true });
      }
    }
  }, [isLoading, isCartChecked, cart.loading, cart.cartItems, navigate]);

  // ---------- Effects: Fetch Saved Addresses ----------
  useEffect(() => {
    const loadSavedAddresses = async () => {
      try {
        const jwt = localStorage.getItem("jwt");
        const res = await axios.get("/api/address", {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        setSavedAddresses(Array.isArray(res.data) ? res.data : []);
      } catch (err) {

        setSavedAddresses([]);
      }
    };
    if (user) loadSavedAddresses();
  }, [user]);

  // ---------- Effects: Load States List ----------
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

  // ---------- Effects: Restore Address (Redux/localStorage) ----------
  useEffect(() => {
    const restore = async () => {
      if (!savedAddress || isInitialized || loadingStates) return;

      // restore base address fields
      setAddress(savedAddress);

      // preload dependent lists for better UX
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

        // validate pincode if available
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
      } catch {
        // ignore restore/preload errors
      }

      setIsInitialized(true);
    };
    restore();
  }, [savedAddress, isInitialized, loadingStates]);

  // ---------- Handlers: Form field changes (with Redux persist) ----------
  const handleFieldChange = (field, value) => {
    const updated = { ...address, [field]: value };
    setAddress(updated);
    dispatch(saveCheckoutAddress(updated));
  };

  // ---------- Handlers: State/District/Pincode cascade ----------
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

      // preload cascades if lookup returned state/district
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

  // ---------- Continue with NEW address ----------
  const handleContinue = async () => {
    if (!cart.cartItems || cart.cartItems.length === 0) {
      alert("Your cart is empty. Please add items before checkout.");
      navigate("/cart");
      return;
    }

    // Save address so it appears next time in saved list (non-blocking)
    try {
      const jwt = localStorage.getItem("jwt");
      await axios.post("/api/address", address, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
    } catch {
      // ignore save failure; don't block checkout
    }

    dispatch(saveCheckoutAddress(address));
    navigate("/checkout/summary");
  };

  // ---------- Select Saved Address (direct proceed) ----------
  const selectSavedAddress = (addr) => {
    setSelectedSavedAddressId(addr.id);
    dispatch(saveCheckoutAddress(addr));
    navigate("/checkout/summary");
  };

  // ---------- Loading / Guards ----------
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

  // ---------- Render ----------
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-emerald-800 mb-6">Select Delivery Address</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Saved Addresses (30–40%) */}
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
                  className={`relative p-4 border rounded-lg transition cursor-pointer group 
                    ${selected ? "border-emerald-600 bg-emerald-50" : "hover:border-emerald-500"}`}
                  onClick={() => selectSavedAddress(addr)}
                >
                  {/* Amazon-style selection tick */}
                  {selected && (
                    <div className="absolute -top-2 -right-2 bg-emerald-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shadow">
                      ✓
                    </div>
                  )}

                  {/* Address text */}
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

                  {/* CTA */}
                  <button
                    className="mt-3 w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      selectSavedAddress(addr);
                    }}
                  >
                    Deliver to this address
                  </button>
                </div>
              );
            })}
          </div>

          {/* RIGHT: Add New Address Form (60–70%) */}
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
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutAddress;
