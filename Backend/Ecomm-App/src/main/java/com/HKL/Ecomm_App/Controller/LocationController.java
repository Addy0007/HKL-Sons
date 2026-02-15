package com.HKL.Ecomm_App.Controller;

import com.HKL.Ecomm_App.Model.District;
import com.HKL.Ecomm_App.Model.Pincode;
import com.HKL.Ecomm_App.Model.State;
import com.HKL.Ecomm_App.Repository.DistrictRepository;
import com.HKL.Ecomm_App.Repository.PincodeRepository;
import com.HKL.Ecomm_App.Repository.StateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;

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
                .sorted()
                .toList();
    }

    @GetMapping("/districts/{stateName}")
    public List<String> getDistricts(@PathVariable String stateName) {
        return districtRepo.findByState_StateName(stateName)
                .stream()
                .map(District::getDistrictName)
                .sorted()
                .toList();
    }

    @GetMapping("/pincodes/{districtName}")
    public List<String> getPincodes(@PathVariable String districtName) {
        return pincodeRepo.findByDistrict_DistrictName(districtName)
                .stream()
                .map(Pincode::getPincode)
                .sorted()
                .toList();
    }

    /**
     * ✅ NEW: Lookup pincode - returns existing data OR allows new entry
     * Always returns deliverable=true (we deliver everywhere!)
     */
    @GetMapping("/lookup/{pincode}")
    public ResponseEntity<Map<String, Object>> lookup(@PathVariable String pincode) {
        Optional<Pincode> pincodeOpt = pincodeRepo.findByPincode(pincode);

        Map<String, Object> response = new HashMap<>();

        if (pincodeOpt.isPresent()) {
            // ✅ Pincode exists in database - return stored data
            Pincode pc = pincodeOpt.get();
            response.put("state", pc.getDistrict().getState().getStateName());
            response.put("district", pc.getDistrict().getDistrictName());
            response.put("deliverable", true); // Always deliverable
            response.put("pincode", pc.getPincode());
            response.put("found", true);
        } else {
            // ✅ Pincode NOT in database - allow user to add it
            response.put("deliverable", true); // Still deliverable!
            response.put("pincode", pincode);
            response.put("found", false);
            response.put("message", "Pincode not in our database yet. Please enter state and district.");
        }

        return ResponseEntity.ok(response);
    }

    /**
     * ✅ NEW: Validate and optionally auto-add pincode when user saves address
     */
    @PostMapping("/validate-pincode")
    @Transactional
    public ResponseEntity<Map<String, Object>> validateAndAddPincode(
            @RequestBody Map<String, String> request
    ) {
        String pincode = request.get("pincode");
        String stateName = request.get("state");
        String districtName = request.get("district");

        if (pincode == null || pincode.length() != 6) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid pincode format"));
        }

        if (stateName == null || stateName.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "State is required"));
        }

        if (districtName == null || districtName.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "District is required"));
        }

        try {
            // Normalize inputs
            String normalizedState = stateName.trim().toUpperCase();
            String normalizedDistrict = districtName.trim().toUpperCase();

            // ✅ Get or create State
            State state = stateRepo.findByStateName(normalizedState)
                    .orElseGet(() -> {
                        State newState = new State();
                        newState.setStateName(normalizedState);
                        return stateRepo.save(newState);
                    });

            // ✅ Get or create District
            District district = districtRepo.findByDistrictNameAndState(normalizedDistrict, state)
                    .orElseGet(() -> {
                        District newDistrict = new District();
                        newDistrict.setDistrictName(normalizedDistrict);
                        newDistrict.setState(state);
                        return districtRepo.save(newDistrict);
                    });

            // ✅ Get or create Pincode
            Pincode pincodeEntity = pincodeRepo.findByPincodeAndDistrict(pincode, district)
                    .orElseGet(() -> {
                        Pincode newPincode = new Pincode();
                        newPincode.setPincode(pincode);
                        newPincode.setDistrict(district);
                        newPincode.setDeliverable(true); // Always deliverable
                        return pincodeRepo.save(newPincode);
                    });

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("state", state.getStateName());
            response.put("district", district.getDistrictName());
            response.put("pincode", pincodeEntity.getPincode());
            response.put("deliverable", true);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Failed to process pincode: " + e.getMessage()));
        }
    }
}