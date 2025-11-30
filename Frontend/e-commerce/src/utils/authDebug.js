export const debugAuth = () => {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🔐 COMPLETE AUTH DEBUG");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  
  // Check localStorage
  const jwt = localStorage.getItem("jwt");
  console.log("\n1️⃣ LocalStorage Check:");
  console.log("   JWT exists:", !!jwt);
  
  if (!jwt) {
    console.log("   ❌ No JWT in localStorage!");
    return false;
  }
  
  // Decode JWT
  console.log("\n2️⃣ JWT Token Analysis:");
  try {
    const payload = JSON.parse(atob(jwt.split('.')[1]));
    console.log("   Token Payload:", payload);
    console.log("   Email:", payload.email || payload.sub);
    console.log("   Role in Token:", payload.role || "❌ NOT FOUND");
    console.log("   Issued At:", new Date(payload.iat * 1000).toLocaleString());
    console.log("   Expires:", new Date(payload.exp * 1000).toLocaleString());
    
    const now = Date.now() / 1000;
    const isExpired = payload.exp < now;
    console.log("   Is Expired:", isExpired ? "❌ YES" : "✅ NO");
    
    if (isExpired) {
      console.log("   ⚠️ Token is expired! User needs to login again.");
    }
    
    // Check role
    if (!payload.role) {
      console.log("   ❌ PROBLEM: Token does not contain role claim!");
      console.log("   → Backend JwtProvider is not adding role to token");
    } else if (payload.role === "ROLE_ADMIN") {
      console.log("   ✅ Token has ADMIN role");
    } else {
      console.log("   ℹ️ Token role:", payload.role);
    }
  } catch (error) {
    console.error("   ❌ Failed to decode token:", error);
  }
  
  // Check Redux state (if available)
  console.log("\n3️⃣ Redux State Check:");
  try {
    const reduxState = window.__REDUX_DEVTOOLS_EXTENSION__ ? 
      JSON.stringify(window.store.getState().auth, null, 2) : 
      "Redux DevTools not available";
    console.log("   Auth State:", reduxState);
  } catch (error) {
    console.log("   Could not access Redux state");
  }
  
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  return true;
};
