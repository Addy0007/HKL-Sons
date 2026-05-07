import React, { useState } from "react";

const SearchableSelect = ({ value, onChange, options, placeholder, disabled, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = options.filter((option) =>
    option?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option) => {
    onChange(option);
    setSearchTerm("");
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={isOpen ? searchTerm : value}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        disabled={disabled}
        className={`border rounded-md p-3 w-full bg-[#F6F3EC] text-[#2C2C2C] placeholder-[#555555] focus:outline-none focus:ring-2 focus:ring-[#1F3D2B] disabled:bg-[#EDE9E0] disabled:cursor-not-allowed ${
          error ? "border-red-400 bg-red-50/30" : "border-[#C6A15B]/30"
        }`}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
      {isOpen && !disabled && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => {
              setIsOpen(false);
              setSearchTerm("");
            }}
          />
          <div className="absolute z-20 w-full mt-1 bg-[#F6F3EC] border border-[#C6A15B]/30 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleSelect(option)}
                  className="p-3 hover:bg-[#1F3D2B]/5 cursor-pointer border-b border-[#C6A15B]/10 last:border-b-0 text-[#2C2C2C]"
                >
                  {option}
                </div>
              ))
            ) : (
              <div className="p-3 text-[#3D3D3D]">No results found</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const SearchablePincodeSelect = ({
  value,
  onChange,
  options,
  placeholder,
  onManualInput,
  disabled,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = options.filter((option) => option.includes(searchTerm));

  const handleSelect = (option) => {
    onChange(option);
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    setIsOpen(true);
    if (onManualInput) {
      onManualInput(val);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={isOpen ? searchTerm : value}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        disabled={disabled}
        placeholder={placeholder}
        maxLength={6}
        className={`border rounded-md p-3 w-full bg-[#F6F3EC] text-[#2C2C2C] placeholder-[#555555] focus:outline-none focus:ring-2 focus:ring-[#1F3D2B] disabled:bg-[#EDE9E0] disabled:cursor-not-allowed ${
          error ? "border-red-400 bg-red-50/30" : "border-[#C6A15B]/30"
        }`}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
      {isOpen && !disabled && options.length > 0 && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => {
              setIsOpen(false);
              setSearchTerm("");
            }}
          />
          <div className="absolute z-20 w-full mt-1 bg-[#F6F3EC] border border-[#C6A15B]/30 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleSelect(option)}
                  className="p-3 hover:bg-[#1F3D2B]/5 cursor-pointer border-b border-[#C6A15B]/10 last:border-b-0 text-[#2C2C2C]"
                >
                  {option}
                </div>
              ))
            ) : (
              <div className="p-3 text-[#3D3D3D]">No matching pincodes</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// Validation rules for each field
const validate = (address, pincodeStatus) => {
  const errors = {};

  if (!address.firstName?.trim())
    errors.firstName = "First name is required";

  if (!address.lastName?.trim())
    errors.lastName = "Last name is required";

  if (!address.streetAddress?.trim())
    errors.streetAddress = "Street address is required";

  if (!address.state?.trim())
    errors.state = "Please select a state";

  if (!address.district?.trim())
    errors.district = "Please select a district";

  if (!address.zipCode?.trim()) {
    errors.zipCode = "PIN code is required";
  } else if (address.zipCode.length !== 6) {
    errors.zipCode = "PIN code must be 6 digits";
  } else if (pincodeStatus === "not-deliverable") {
    errors.zipCode = "Delivery not available at this PIN code";
  } else if (pincodeStatus === "not-found") {
    errors.zipCode = "Invalid PIN code";
  }

  if (!address.city?.trim())
    errors.city = "City is required";

  if (!address.mobile?.trim()) {
    errors.mobile = "Phone number is required";
  } else if (!/^\d{10}$/.test(address.mobile.trim())) {
    errors.mobile = "Enter a valid 10-digit phone number";
  }

  return errors;
};

const DeliveryForm = ({
  address,
  handleFieldChange,
  states,
  districts,
  pincodes,
  pincodeStatus,
  onStateChange,
  onDistrictChange,
  handlePincodeInput,
  onContinue,
  onSaveAddress,
  isSaving,
}) => {
  // Track which fields the user has interacted with
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const errors = validate(address, pincodeStatus);
  const isFormValid = Object.keys(errors).length === 0;

  const touch = (field) => setTouched((prev) => ({ ...prev, [field]: true }));

  // Show error only if field was touched OR a submit was attempted
  const fieldError = (field) =>
    (touched[field] || submitAttempted) ? errors[field] : undefined;

  const handleSubmit = (action) => {
    setSubmitAttempted(true);
    // Mark all fields touched so all errors show at once
    setTouched({
      firstName: true,
      lastName: true,
      streetAddress: true,
      state: true,
      district: true,
      zipCode: true,
      city: true,
      mobile: true,
    });
    if (isFormValid) action();
  };

  const inputClass = (field) =>
    `border rounded-md p-3 w-full bg-[#F6F3EC] text-[#2C2C2C] placeholder-[#555555] focus:outline-none focus:ring-2 focus:ring-[#1F3D2B] ${
      fieldError(field)
        ? "border-red-400 bg-red-50/30"
        : "border-[#C6A15B]/30"
    }`;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-[#1F3D2B]">Delivery Address</h2>

      {/* First Name */}
      <div>
        <input
          type="text"
          value={address.firstName}
          onChange={(e) => handleFieldChange("firstName", e.target.value)}
          onBlur={() => touch("firstName")}
          placeholder="First Name *"
          className={inputClass("firstName")}
        />
        {fieldError("firstName") && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            <span>⚠</span> {fieldError("firstName")}
          </p>
        )}
      </div>

      {/* Last Name */}
      <div>
        <input
          type="text"
          value={address.lastName}
          onChange={(e) => handleFieldChange("lastName", e.target.value)}
          onBlur={() => touch("lastName")}
          placeholder="Last Name *"
          className={inputClass("lastName")}
        />
        {fieldError("lastName") && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            <span>⚠</span> {fieldError("lastName")}
          </p>
        )}
      </div>

      {/* Street Address */}
      <div>
        <textarea
          value={address.streetAddress}
          onChange={(e) => handleFieldChange("streetAddress", e.target.value)}
          onBlur={() => touch("streetAddress")}
          placeholder="House / Flat / Street Address *"
          className={`${inputClass("streetAddress")} min-h-[80px]`}
        />
        {fieldError("streetAddress") && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            <span>⚠</span> {fieldError("streetAddress")}
          </p>
        )}
      </div>

      {/* State */}
      <div onBlur={() => touch("state")}>
        <SearchableSelect
          value={address.state}
          onChange={(val) => { onStateChange(val); touch("state"); }}
          options={states}
          placeholder="Search state... *"
          error={fieldError("state")}
        />
      </div>

      {/* District */}
      <div onBlur={() => touch("district")}>
        <SearchableSelect
          value={address.district}
          onChange={(val) => { onDistrictChange(val); touch("district"); }}
          options={districts}
          placeholder={address.state ? "Search district... *" : "Select State First"}
          disabled={!address.state}
          error={fieldError("district")}
        />
      </div>

      {/* PIN Code */}
      <div onBlur={() => touch("zipCode")}>
        <SearchablePincodeSelect
          value={address.zipCode}
          onChange={(val) => { handlePincodeInput(val); touch("zipCode"); }}
          options={pincodes}
          placeholder="Enter PIN Code *"
          onManualInput={(val) => { handlePincodeInput(val); touch("zipCode"); }}
          error={fieldError("zipCode")}
        />
      </div>

      {pincodeStatus === "deliverable" && !fieldError("zipCode") && (
        <p className="text-[#1F3D2B] text-sm">✅ Delivery available</p>
      )}

      {/* City */}
      <div>
        <input
          type="text"
          value={address.city}
          onChange={(e) => handleFieldChange("city", e.target.value)}
          onBlur={() => touch("city")}
          placeholder="City *"
          className={inputClass("city")}
        />
        {fieldError("city") && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            <span>⚠</span> {fieldError("city")}
          </p>
        )}
      </div>

      {/* Mobile */}
      <div>
        <input
          type="tel"
          value={address.mobile}
          onChange={(e) => handleFieldChange("mobile", e.target.value)}
          onBlur={() => touch("mobile")}
          placeholder="Phone Number * (10 digits)"
          maxLength={10}
          className={inputClass("mobile")}
        />
        {fieldError("mobile") && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            <span>⚠</span> {fieldError("mobile")}
          </p>
        )}
      </div>

      {/* Summary error count shown only after submit attempt */}
      {submitAttempted && !isFormValid && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-md px-4 py-2 text-sm">
          Please fill in all required fields correctly before continuing.
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 justify-end pt-2">
        <button
          onClick={() => handleSubmit(onSaveAddress)}
          disabled={isSaving}
          className="bg-[#1F3D2B] text-white py-2 px-6 rounded-md hover:bg-[#162d1f] disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Saving...
            </>
          ) : (
            "💾 Save Address"
          )}
        </button>

        <button
          onClick={() => handleSubmit(onContinue)}
          className="bg-[#1F3D2B] text-white py-2 px-6 rounded-md hover:bg-[#162d1f] disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          Continue to Summary →
        </button>
      </div>

      <p className="text-xs text-[#555555] text-center pt-2">
        💡 Tip: Save your address to use it again in future orders
      </p>
    </div>
  );
};

export default DeliveryForm;