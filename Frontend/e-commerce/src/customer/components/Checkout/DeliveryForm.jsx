import React, { useState } from "react";

const SearchableSelect = ({ value, onChange, options, placeholder, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = options.filter(option =>
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
        className="border rounded-md p-3 w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
      {isOpen && !disabled && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => {
              setIsOpen(false);
              setSearchTerm("");
            }}
          />
          <div className="absolute z-20 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleSelect(option)}
                  className="p-3 hover:bg-emerald-50 cursor-pointer border-b last:border-b-0"
                >
                  {option}
                </div>
              ))
            ) : (
              <div className="p-3 text-gray-500">No results found</div>
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
  disabled
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = options.filter(option => option.includes(searchTerm));

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
        className="border rounded-md p-3 w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
      {isOpen && !disabled && options.length > 0 && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => {
              setIsOpen(false);
              setSearchTerm("");
            }}
          />
          <div className="absolute z-20 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleSelect(option)}
                  className="p-3 hover:bg-emerald-50 cursor-pointer border-b last:border-b-0"
                >
                  {option}
                </div>
              ))
            ) : (
              <div className="p-3 text-gray-500">No matching pincodes</div>
            )}
          </div>
        </>
      )}
    </div>
  );
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
  onSaveAddress,  // ✅ NEW prop
  isSaving  // ✅ NEW prop
}) => {
  const isFormValid = () => {
    return (
      address.firstName &&
      address.lastName &&
      address.streetAddress &&
      address.state &&
      address.district &&
      address.zipCode &&
      address.city &&
      address.mobile &&
      pincodeStatus === "deliverable"
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-emerald-800">Delivery Address</h2>

      <input
        type="text"
        value={address.firstName}
        onChange={(e) => handleFieldChange("firstName", e.target.value)}
        placeholder="First Name"
        className="border rounded-md p-3 w-full"
      />

      <input
        type="text"
        value={address.lastName}
        onChange={(e) => handleFieldChange("lastName", e.target.value)}
        placeholder="Last Name"
        className="border rounded-md p-3 w-full"
      />

      <textarea
        value={address.streetAddress}
        onChange={(e) => handleFieldChange("streetAddress", e.target.value)}
        placeholder="House / Flat / Street Address"
        className="border rounded-md p-3 w-full min-h-[80px]"
      />

      <SearchableSelect
        value={address.state}
        onChange={onStateChange}
        options={states}
        placeholder="Search state..."
      />

      <SearchableSelect
        value={address.district}
        onChange={onDistrictChange}
        options={districts}
        placeholder={address.state ? "Search district..." : "Select State First"}
        disabled={!address.state}
      />

      <SearchablePincodeSelect
        value={address.zipCode}
        onChange={handlePincodeInput}
        options={pincodes}
        placeholder="Enter PIN Code"
        onManualInput={handlePincodeInput}
      />

      {pincodeStatus === "deliverable" && (
        <p className="text-green-600 text-sm">✅ Delivery available</p>
      )}

      <input
        type="text"
        value={address.city}
        onChange={(e) => handleFieldChange("city", e.target.value)}
        placeholder="City"
        className="border rounded-md p-3 w-full"
      />

      <input
        type="tel"
        value={address.mobile}
        onChange={(e) => handleFieldChange("mobile", e.target.value)}
        placeholder="Phone Number"
        maxLength={10}
        className="border rounded-md p-3 w-full"
      />

      {/* ✅ NEW: Two-button layout */}
      <div className="flex gap-3 justify-end pt-2">
        <button
          disabled={!isFormValid() || isSaving}
          onClick={onSaveAddress}
          className="bg-emerald-600 text-white py-2 px-6 rounded-md hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            "💾 Save Address"
          )}
        </button>

        <button
          disabled={!isFormValid()}
          onClick={onContinue}
          className="bg-emerald-700 text-white py-2 px-6 rounded-md hover:bg-emerald-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          Continue to Summary →
        </button>
      </div>

      <p className="text-xs text-gray-500 text-center pt-2">
        💡 Tip: Save your address to use it again in future orders
      </p>
    </div>
  );
};

export default DeliveryForm;