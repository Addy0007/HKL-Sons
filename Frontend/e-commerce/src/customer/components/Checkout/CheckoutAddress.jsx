import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import DeliveryForm from "./DeliveryForm";
import { api } from "../../../Config/apiConfig"; // ✅ use api instance, not axios
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

  // ✅ Load saved addresses using api instance (has baseURL + JWT interceptor)
  const loadSavedAddresses = async () => {
    try {
      const res = await api.get("/api/address");
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

  // ✅ Fetch states using api instance
  useEffect(() => {
    const fetchStates = async () => {
      try {
        setLoadingStates(true);
        const res = await api.get("/api/locations/states");
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

  // ✅ Restore saved address (uses api instance)
  useEffect(() => {
    const restore = async () => {
      if (!savedAddress || isInitialized || loadingStates) return;

      setAddress(savedAddress);

      try {
        if (savedAddress.state) {
          const distRes = await api.get(
            `/api/locations/districts/${savedAddress.state}`
          );
          setDistricts(distRes.data || []);
        } else {
          setDistricts([]);
        }

        if (savedAddress.district) {
          const pinRes = await api.get(
            `/api/locations/pincodes/${savedAddress.district}`
          );
          setPincodes(pinRes.data || []);
        } else {
          setPincodes([]);
        }

        if (savedAddress.zipCode && savedAddress.zipCode.length === 6) {
          try {
            const lookup = await api.get(
              `/api/locations/lookup/${savedAddress.zipCode}`
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

  // ✅ State change using api instance
  const onStateChange = async (stateName) => {
    const updated = { ...address, state: stateName, district: "", zipCode: "" };
    setAddress(updated);
    setDistricts([]);
    setPincodes([]);
    setPincodeStatus("");
    dispatch(saveCheckoutAddress(updated));

    if (!stateName) return;

    try {
      const res = await api.get(`/api/locations/districts/${stateName}`);
      setDistricts(Array.isArray(res.data) ? res.data : []);
    } catch {
      setDistricts([]);
    }
  };

  // ✅ District change using api instance
  const onDistrictChange = async (districtName) => {
    const updated = { ...address, district: districtName, zipCode: "" };
    setAddress(updated);
    setPincodes([]);
    setPincodeStatus("");
    dispatch(saveCheckoutAddress(updated));

    if (!districtName) return;

    try {
      const res = await api.get(`/api/locations/pincodes/${districtName}`);
      setPincodes(Array.isArray(res.data) ? res.data : []);
    } catch {
      setPincodes([]);
    }
  };

  // ✅ Pincode lookup using api instance
  const handlePincodeInput = async (pin) => {
    const updated = { ...address, zipCode: pin };
    setAddress(updated);

    if (pin.length < 6) {
      setPincodeStatus("");
      dispatch(saveCheckoutAddress(updated));
      return;
    }

    try {
      const res = await api.get(`/api/locations/lookup/${pin}`);

      setPincodeStatus("deliverable");

      if (res.data.found) {
        const finalAddress = {
          ...updated,
          state: res.data.state || updated.state,
          district: res.data.district || updated.district,
        };
        setAddress(finalAddress);

        if (res.data.state) {
          try {
            const distRes = await api.get(`/api/locations/districts/${res.data.state}`);
            setDistricts(Array.isArray(distRes.data) ? distRes.data : []);
          } catch {
            setDistricts([]);
          }
        }

        if (res.data.district) {
          try {
            const pinRes = await api.get(`/api/locations/pincodes/${res.data.district}`);
            setPincodes(Array.isArray(pinRes.data) ? pinRes.data : []);
          } catch {
            setPincodes([]);
          }
        }

        dispatch(saveCheckoutAddress(finalAddress));
      } else {
        dispatch(saveCheckoutAddress(updated));
      }
    } catch {
      setPincodeStatus("deliverable");
      dispatch(saveCheckoutAddress(updated));
    }
  };

  // ✅ Save address using api instance
  const handleSaveAddress = async () => {
    if (!cart.cartItems || cart.cartItems.length === 0) {
      alert("Your cart is empty. Please add items before checkout.");
      navigate("/cart");
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    try {
      await api.post("/api/address", address);
      setSaveMessage({ type: "success", text: "✅ Address saved successfully!" });
      await loadSavedAddresses();
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
        text: "❌ Failed to save address. Please try again.",
      });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  const handleContinue = async () => {
    if (!cart.cartItems || cart.cartItems.length === 0) {
      alert("Your cart is empty. Please add items before checkout.");
      navigate("/cart");
      return;
    }
    dispatch(saveCheckoutAddress(address));
    navigate("/checkout/summary");
  };

  // ✅ Select saved address + delete using api instance
  const selectSavedAddress = (addr) => {
    setSelectedSavedAddressId(addr.id);
    dispatch(saveCheckoutAddress(addr));
    navigate("/checkout/summary");
  };

  if (isLoading) return <div className="text-center mt-10 text-[#2C2C2C]">Checking login...</div>;
  if (!user) return null;

  if (!isCartChecked || cart.loading) {
    return (
      <div className="min-h-screen bg-[#F6F3EC] py-10 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F3D2B] mx-auto mb-4"></div>
          <p className="text-[#3D3D3D]">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (!cart.cartItems || cart.cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#F6F3EC] py-10 px-4 flex items-center justify-center">
        <div className="text-center bg-[#F6F3EC] p-8 rounded-xl shadow border border-[#C6A15B]/20">
          <p className="text-[#3D3D3D] mb-4 text-lg">Your cart is empty</p>
          <button
            onClick={() => navigate("/cart")}
            className="bg-[#1F3D2B] text-white py-2 px-6 rounded-md hover:bg-[#162d1f]"
          >
            Go to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F3EC] py-10 px-4">
      <div className="max-w-6xl mx-auto bg-[#F6F3EC] p-6 rounded-xl shadow border border-[#C6A15B]/20">
        <h1 className="text-2xl font-bold text-[#1F3D2B] mb-6">Select Delivery Address</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
        )}

        {saveMessage && (
          <div
            className={`p-3 rounded mb-4 ${
              saveMessage.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {saveMessage.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Saved Addresses */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-lg font-semibold text-[#2C2C2C]">Saved Addresses</h3>

            {savedAddresses.length === 0 && (
              <p className="text-[#3D3D3D] text-sm">No saved addresses</p>
            )}

            {savedAddresses.map((addr) => {
              const selected = selectedSavedAddressId === addr.id;
              return (
                <div
                  key={addr.id}
                  className={`relative p-4 border rounded-lg transition cursor-pointer group ${
                    selected
                      ? "border-[#1F3D2B] bg-[#1F3D2B]/5"
                      : "border-[#C6A15B]/30 hover:border-[#1F3D2B]"
                  }`}
                  onClick={() => selectSavedAddress(addr)}
                >
                  {selected && (
                    <div className="absolute -top-2 -right-2 bg-[#1F3D2B] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shadow">
                      ✓
                    </div>
                  )}
                  <p className="font-medium text-[#2C2C2C]">{addr.firstName} {addr.lastName}</p>
                  <p className="text-[#3D3D3D]">{addr.streetAddress}</p>
                  <p className="text-[#3D3D3D]">{addr.city}, {addr.district}</p>
                  <p className="text-[#3D3D3D]">{addr.state} - {addr.zipCode}</p>
                  <p className="text-sm text-[#555555] mt-1">📞 {addr.mobile}</p>

                  <div className="flex gap-2 mt-3">
                    <button
                      className="flex-1 bg-[#1F3D2B] text-white py-2 rounded-md hover:bg-[#162d1f] text-sm"
                      onClick={(e) => { e.stopPropagation(); selectSavedAddress(addr); }}
                    >
                      Deliver to this address
                    </button>
                    <button
                      className="flex-1 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 text-sm"
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (!window.confirm("Are you sure you want to delete this address?")) return;
                        try {
                          // ✅ api instance handles baseURL + JWT automatically
                          await api.delete(`/api/address/${addr.id}`);
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

          {/* New Address Form */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-[#2C2C2C] mb-4">Add New Address</h3>
            {loadingStates ? (
              <div className="text-center py-10 text-[#3D3D3D]">Loading form...</div>
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