package com.HKL.Ecomm_App.Controller;

import com.HKL.Ecomm_App.Exception.UserException;
import com.HKL.Ecomm_App.Model.Address;
import com.HKL.Ecomm_App.Model.District;
import com.HKL.Ecomm_App.Model.Pincode;
import com.HKL.Ecomm_App.Model.State;
import com.HKL.Ecomm_App.Model.User;
import com.HKL.Ecomm_App.Repository.AddressRepository;
import com.HKL.Ecomm_App.Repository.DistrictRepository;
import com.HKL.Ecomm_App.Repository.PincodeRepository;
import com.HKL.Ecomm_App.Repository.StateRepository;
import com.HKL.Ecomm_App.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/address")
public class AddressController {

    private final AddressRepository addressRepository;
    private final UserService userService;
    private final StateRepository stateRepository;
    private final DistrictRepository districtRepository;
    private final PincodeRepository pincodeRepository;

    public AddressController(
            AddressRepository addressRepository,
            UserService userService,
            StateRepository stateRepository,
            DistrictRepository districtRepository,
            PincodeRepository pincodeRepository
    ) {
        this.addressRepository = addressRepository;
        this.userService = userService;
        this.stateRepository = stateRepository;
        this.districtRepository = districtRepository;
        this.pincodeRepository = pincodeRepository;
    }

    private User getLoggedUser() throws UserException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userService.findUserByEmail(email);
    }

    @GetMapping
    public ResponseEntity<List<Address>> getUserAddresses() throws UserException {
        User user = getLoggedUser();
        List<Address> addresses = addressRepository.findByUserIdAndActiveTrue(user.getId());
        return ResponseEntity.ok(addresses);
    }

    /**
     * ✅ UPDATED: Auto-add pincode/district/state if they don't exist
     */
    @PostMapping
    @Transactional
    public ResponseEntity<Address> saveAddress(@RequestBody Address address) throws UserException {
        User user = getLoggedUser();
        address.setUser(user);

        // ✅ Validate and auto-add location data
        if (address.getZipCode() != null && address.getZipCode().length() == 6) {
            String normalizedState = address.getState().trim().toUpperCase();
            String normalizedDistrict = address.getDistrict().trim().toUpperCase();
            String pincode = address.getZipCode().trim();

            // Get or create State
            State state = stateRepository.findByStateName(normalizedState)
                    .orElseGet(() -> {
                        State newState = new State();
                        newState.setStateName(normalizedState);
                        return stateRepository.save(newState);
                    });

            // Get or create District
            District district = districtRepository.findByDistrictNameAndState(normalizedDistrict, state)
                    .orElseGet(() -> {
                        District newDistrict = new District();
                        newDistrict.setDistrictName(normalizedDistrict);
                        newDistrict.setState(state);
                        return districtRepository.save(newDistrict);
                    });

            // Get or create Pincode (always deliverable)
            pincodeRepository.findByPincodeAndDistrict(pincode, district)
                    .orElseGet(() -> {
                        Pincode newPincode = new Pincode();
                        newPincode.setPincode(pincode);
                        newPincode.setDistrict(district);
                        newPincode.setDeliverable(true);
                        return pincodeRepository.save(newPincode);
                    });
        }

        Address saved = addressRepository.save(address);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAddress(@PathVariable Long id) throws UserException {
        User user = getLoggedUser();

        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (!address.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("You are not authorized to delete this address");
        }

        address.setActive(false);
        addressRepository.save(address);

        return ResponseEntity.ok("Address marked as deleted successfully");
    }
}