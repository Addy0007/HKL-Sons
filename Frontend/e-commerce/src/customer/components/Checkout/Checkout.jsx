import React, { useState, useEffect } from "react";

const Checkout = () => {
  // Step tracking (saved in localStorage)
  const [currentStep, setCurrentStep] = useState(
    parseInt(localStorage.getItem("checkoutStep")) || 1
  );

  useEffect(() => {
    localStorage.setItem("checkoutStep", currentStep);
  }, [currentStep]);

  // Mock dropdown data (later fetched from backend)
  const states = ["Madhya Pradesh", "Maharashtra", "Delhi", "Uttar Pradesh"];
  const cities = {
    "Madhya Pradesh": ["Indore", "Bhopal", "Gwalior"],
    Maharashtra: ["Mumbai", "Pune", "Nagpur"],
    Delhi: ["New Delhi"],
    "Uttar Pradesh": ["Lucknow", "Noida", "Kanpur"],
  };

  // ZIP data (mocked for demo)
  const zipCodes = [
    { code: "452001", city: "Indore", state: "Madhya Pradesh" },
    { code: "462001", city: "Bhopal", state: "Madhya Pradesh" },
    { code: "400001", city: "Mumbai", state: "Maharashtra" },
    { code: "411001", city: "Pune", state: "Maharashtra" },
    { code: "110001", city: "New Delhi", state: "Delhi" },
    { code: "201301", city: "Noida", state: "Uttar Pradesh" },
  ];

  // States
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [filteredZips, setFilteredZips] = useState([]);
  const [phone, setPhone] = useState("");

  // Steps
  const steps = [
    { id: 1, title: "Login" },
    { id: 2, title: "Delivery Address" },
    { id: 3, title: "Order Summary" },
    { id: 4, title: "Payment" },
  ];

  // Navigation
  const goNext = () => {
    if (currentStep < steps.length) setCurrentStep((prev) => prev + 1);
  };
  const goBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };
  const resetCheckout = () => {
    localStorage.removeItem("checkoutStep");
    setCurrentStep(1);
  };

  // ZIP auto-suggestion
  const handleZipChange = (e) => {
    const value = e.target.value;
    setPinCode(value);

    if (value.length >= 3) {
      const matches = zipCodes.filter((z) => z.code.startsWith(value));
      setFilteredZips(matches);
    } else {
      setFilteredZips([]);
    }
  };

  const handleZipSelect = (zip) => {
    setPinCode(zip.code);
    setSelectedCity(zip.city);
    setSelectedState(zip.state);
    setFilteredZips([]);
  };

  // Step Content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-emerald-800">Step 1: Login</h2>
            <p className="text-gray-600">
              Please log in to continue with your checkout. You can also continue as a guest.
            </p>
            <input
              type="email"
              placeholder="Enter your email"
              className="border border-gray-300 rounded-md p-3 w-full focus:ring-2 focus:ring-emerald-600 outline-none"
            />
            <button
              onClick={goNext}
              className="bg-emerald-700 text-white py-2 px-6 rounded-md hover:bg-emerald-800 transition"
            >
              Continue
            </button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-emerald-800">Step 2: Delivery Address</h2>
            <p className="text-gray-600">Please provide your delivery details below.</p>

            <div className="space-y-4 relative">
              {/* Address Line */}
              <input
                type="text"
                placeholder="House / Street / Locality"
                className="border border-gray-300 rounded-md p-3 w-full focus:ring-2 focus:ring-emerald-600 outline-none"
              />

              {/* State Dropdown */}
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedCity("");
                }}
                className="border border-gray-300 rounded-md p-3 w-full focus:ring-2 focus:ring-emerald-600 outline-none"
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state}>{state}</option>
                ))}
              </select>

              {/* City Dropdown */}
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={!selectedState}
                className={`border rounded-md p-3 w-full focus:ring-2 outline-none ${
                  selectedState
                    ? "border-gray-300 focus:ring-emerald-600"
                    : "border-gray-200 bg-gray-100 cursor-not-allowed"
                }`}
              >
                <option value="">
                  {selectedState ? "Select City" : "Select State First"}
                </option>
                {selectedState &&
                  cities[selectedState]?.map((city) => (
                    <option key={city}>{city}</option>
                  ))}
              </select>

              {/* PIN Code (with suggestions) */}
              <div className="relative">
                <input
                  type="text"
                  value={pinCode}
                  onChange={handleZipChange}
                  placeholder="6-digit PIN Code"
                  maxLength={6}
                  className="border border-gray-300 rounded-md p-3 w-full focus:ring-2 focus:ring-emerald-600 outline-none"
                />
                {filteredZips.length > 0 && (
                  <ul className="absolute bg-white border border-gray-200 rounded-md mt-1 w-full shadow-lg max-h-40 overflow-y-auto z-10">
                    {filteredZips.map((zip) => (
                      <li
                        key={zip.code}
                        onClick={() => handleZipSelect(zip)}
                        className="p-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                      >
                        {zip.code} — {zip.city}, {zip.state}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Phone Number */}
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number (10 digits)"
                maxLength={10}
                pattern="[0-9]{10}"
                className="border border-gray-300 rounded-md p-3 w-full focus:ring-2 focus:ring-emerald-600 outline-none"
              />
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <button
                onClick={goBack}
                className="text-gray-600 border border-gray-300 py-2 px-5 rounded-md hover:bg-gray-100"
              >
                Back
              </button>
              <button
                onClick={goNext}
                className="bg-emerald-700 text-white py-2 px-6 rounded-md hover:bg-emerald-800 transition"
              >
                Continue
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-emerald-800">Step 3: Order Summary</h2>
            <p className="text-gray-600">Review your order before making payment.</p>

            <div className="border rounded-lg p-4 bg-gray-50">
              <p className="font-semibold">Basic Tee 6-Pack × 2</p>
              <p className="text-sm text-gray-600">Size: L, Color: White</p>
              <p className="text-gray-800 font-medium">₹398</p>
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={goBack}
                className="text-gray-600 border border-gray-300 py-2 px-5 rounded-md hover:bg-gray-100"
              >
                Back
              </button>
              <button
                onClick={goNext}
                className="bg-emerald-700 text-white py-2 px-6 rounded-md hover:bg-emerald-800 transition"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-emerald-800">Step 4: Payment</h2>
            <p className="text-gray-600">Choose your preferred payment method.</p>

            <div className="space-y-3">
              <label className="flex items-center gap-2 border p-3 rounded-md cursor-pointer hover:bg-gray-50">
                <input type="radio" name="payment" /> UPI / Google Pay
              </label>
              <label className="flex items-center gap-2 border p-3 rounded-md cursor-pointer hover:bg-gray-50">
                <input type="radio" name="payment" /> Credit / Debit Card
              </label>
              <label className="flex items-center gap-2 border p-3 rounded-md cursor-pointer hover:bg-gray-50">
                <input type="radio" name="payment" /> Cash on Delivery
              </label>
            </div>

            <div className="flex justify-between">
              <button
                onClick={goBack}
                className="text-gray-600 border border-gray-300 py-2 px-5 rounded-md hover:bg-gray-100"
              >
                Back
              </button>
              <button
                onClick={() => {
                  alert("Payment Successful!");
                  resetCheckout();
                }}
                className="bg-emerald-700 text-white py-2 px-6 rounded-md hover:bg-emerald-800 transition"
              >
                Pay Now
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-10">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6 sm:p-8">
        {/* Stepper Header */}
        <div className="flex justify-between items-center mb-8">
          {steps.map((step) => (
            <div key={step.id} className="flex-1 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep >= step.id
                    ? "bg-emerald-700 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {step.id}
              </div>
              <p
                className={`text-xs mt-2 font-medium ${
                  currentStep >= step.id ? "text-emerald-700" : "text-gray-500"
                }`}
              >
                {step.title}
              </p>
            </div>
          ))}
        </div>

        {/* Step Content */}
        {renderStepContent()}
      </div>
    </div>
  );
};

export default Checkout;
