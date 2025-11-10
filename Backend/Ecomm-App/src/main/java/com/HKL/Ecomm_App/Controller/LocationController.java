package com.HKL.Ecomm_App.Controller;

import com.HKL.Ecomm_App.Model.District;
import com.HKL.Ecomm_App.Model.Pincode;
import com.HKL.Ecomm_App.Model.State;
import com.HKL.Ecomm_App.Repository.DistrictRepository;
import com.HKL.Ecomm_App.Repository.PincodeRepository;
import com.HKL.Ecomm_App.Repository.StateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
public class LocationController {

    private final StateRepository stateRepo;
    private final DistrictRepository districtRepo;
    private final PincodeRepository pincodeRepo;

    @GetMapping("/states")
    public List<String> getStates() {
        return stateRepo.findAll()
                .stream()
                .map(State::getStateName)
                .toList();
    }

    @GetMapping("/districts/{stateName}")
    public List<String> getDistricts(@PathVariable String stateName) {
        return districtRepo.findByState_StateName(stateName)
                .stream()
                .map(District::getDistrictName)
                .toList();
    }

    @GetMapping("/pincodes/{districtName}")
    public List<String> getPincodes(@PathVariable String districtName) {
        return pincodeRepo.findByDistrict_DistrictName(districtName)
                .stream()
                .map(Pincode::getPincode)
                .toList();
    }

    // ✅ Auto-fill state + district from pincode input + check deliverability
    @GetMapping("/lookup/{pincode}")
    public ResponseEntity<Map<String, Object>> lookup(@PathVariable String pincode) {
        Optional<Pincode> pincodeOpt = pincodeRepo.findByPincode(pincode);

        if (pincodeOpt.isEmpty()) {
            // Return 404 if pincode not found
            return ResponseEntity.notFound().build();
        }

        Pincode pc = pincodeOpt.get();

        // Create response map with proper types
        Map<String, Object> response = new HashMap<>();
        response.put("state", pc.getDistrict().getState().getStateName());
        response.put("district", pc.getDistrict().getDistrictName());
        response.put("deliverable", pc.getDeliverable()); // Boolean, not String!
        response.put("pincode", pc.getPincode());

        return ResponseEntity.ok(response);
    }
}