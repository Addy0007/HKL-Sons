package com.HKL.Ecomm_App.Controller;

import com.HKL.Ecomm_App.Exception.UserException;
import com.HKL.Ecomm_App.Model.Address;
import com.HKL.Ecomm_App.Model.User;
import com.HKL.Ecomm_App.Repository.AddressRepository;
import com.HKL.Ecomm_App.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/address")
public class AddressController {

    private final AddressRepository addressRepository;
    private final UserService userService;

    public AddressController(AddressRepository addressRepository, UserService userService) {
        this.addressRepository = addressRepository;
        this.userService = userService;
    }

    // ✅ Get all saved addresses for logged-in user
    @GetMapping
    public ResponseEntity<List<Address>> getUserAddresses(@RequestHeader("Authorization") String jwt)
            throws UserException {
        User user = userService.findUserProfileByJwt(jwt);
        List<Address> addresses = addressRepository.findByUserIdAndActiveTrue(user.getId());
        return ResponseEntity.ok(addresses);
    }

    // ✅ Save a new address
    @PostMapping
    public ResponseEntity<Address> saveAddress(
            @RequestBody Address address,
            @RequestHeader("Authorization") String jwt
    ) throws UserException {
        User user = userService.findUserProfileByJwt(jwt);
        address.setUser(user);
        Address saved = addressRepository.save(address);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAddress(
            @PathVariable Long id,
            @RequestHeader("Authorization") String jwt
    ) throws UserException {
        User user = userService.findUserProfileByJwt(jwt);

        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (!address.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("You are not authorized to delete this address");
        }

        // ✅ Instead of deleting, mark inactive
        address.setActive(false);
        addressRepository.save(address);

        return ResponseEntity.ok("Address marked as deleted successfully");
    }

}
