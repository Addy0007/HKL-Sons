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

const SearchablePincodeSelect = ({ value, onChange, options, placeholder, onManualInput, disabled }) => {
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
  onContinue
}) => {

  // ✅ NEW — Mode Toggle
  const [useSavedAddress, setUseSavedAddress] = useState(false);

  const isFormValid = () => {
    if (useSavedAddress) return true; // 👉 If using saved address, skip validation
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

      {/* ✅ Mode Switch */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Address Mode</label>
        <select
          value={useSavedAddress ? "saved" : "new"}
          onChange={(e) => setUseSavedAddress(e.target.value === "saved")}
          className="border rounded-md p-2 text-sm"
        >
          <option value="new">Add New Address</option>
          <option value="saved">Use Saved Address</option>
        </select>
      </div>

      <h2 className="text-xl font-semibold text-emerald-800">Delivery Address</h2>

      <input
        type="text"
        value={address.firstName}
        onChange={(e) => handleFieldChange("firstName", e.target.value)}
        disabled={useSavedAddress}
        placeholder="First Name"
        className="border rounded-md p-3 w-full disabled:bg-gray-100"
      />

      <input
        type="text"
        value={address.lastName}
        onChange={(e) => handleFieldChange("lastName", e.target.value)}
        disabled={useSavedAddress}
        placeholder="Last Name"
        className="border rounded-md p-3 w-full disabled:bg-gray-100"
      />

      <textarea
        value={address.streetAddress}
        onChange={(e) => handleFieldChange("streetAddress", e.target.value)}
        disabled={useSavedAddress}
        placeholder="House / Flat / Street Address"
        className="border rounded-md p-3 w-full min-h-[80px] disabled:bg-gray-100"
      />

      <SearchableSelect
        value={address.state}
        onChange={onStateChange}
        options={states}
        placeholder="Search state..."
        disabled={useSavedAddress}
      />

      <SearchableSelect
        value={address.district}
        onChange={onDistrictChange}
        options={districts}
        placeholder={address.state ? "Search district..." : "Select State First"}
        disabled={useSavedAddress || !address.state}
      />

      <SearchablePincodeSelect
        value={address.zipCode}
        onChange={handlePincodeInput}
        options={pincodes}
        placeholder="Enter PIN Code"
        onManualInput={handlePincodeInput}
        disabled={useSavedAddress}
      />

      {pincodeStatus === "deliverable" && (
        <p className="text-green-600 text-sm">✅ Delivery available</p>
      )}
      {(pincodeStatus === "not-deliverable" || pincodeStatus === "not-found") && (
        <p className="text-red-600 text-sm">🚫 We cannot deliver here</p>
      )}

      <input
        type="text"
        value={address.city}
        onChange={(e) => handleFieldChange("city", e.target.value)}
        disabled={useSavedAddress}
        placeholder="City"
        className="border rounded-md p-3 w-full disabled:bg-gray-100"
      />

      <input
        type="tel"
        value={address.mobile}
        onChange={(e) => handleFieldChange("mobile", e.target.value)}
        disabled={useSavedAddress}
        placeholder="Phone Number"
        maxLength={10}
        className="border rounded-md p-3 w-full disabled:bg-gray-100"
      />

      {/* Continue */}
      <div className="flex justify-end">
        <button
          disabled={!isFormValid()}
          onClick={onContinue}
          className="bg-emerald-700 text-white py-2 px-6 rounded-md hover:bg-emerald-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>

    </div>
  );
};

export default DeliveryForm;
