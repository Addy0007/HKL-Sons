package com.HKL.Ecomm_App.Controller;

import com.HKL.Ecomm_App.Exception.UserException;
import com.HKL.Ecomm_App.Model.Address;
import com.HKL.Ecomm_App.Model.User;
import com.HKL.Ecomm_App.Repository.AddressRepository;
import com.HKL.Ecomm_App.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

    @PostMapping
    public ResponseEntity<Address> saveAddress(@RequestBody Address address) throws UserException {
        User user = getLoggedUser();
        address.setUser(user);
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
