/******************************************************************************
 * CONSTANTS & DEFAULTS
 *****************************************************************************/
const a = 288; // Max passengers per month

/******************************************************************************
 * MAIN CALCULATION FUNCTION
 *****************************************************************************/
function calculateOutputs() {
  // Retrieve Global input values:
  const y = parseFloat(document.getElementById("vehicles").value);             // Number of vehicles (y)
  const b = parseFloat(document.getElementById("occupancyRate").value);          // Occupancy rate (b) (already as a decimal)
  const e = parseFloat(document.getElementById("tourFee").value);                // Climbing fee (e) in ANG
  const f = parseFloat(document.getElementById("souvenirFee").value);              // Souvenir fee (f) in ANG

  // Derived Values:
  const c = a * b * y;                  // Estimated passengers per month (c = a*b*y)
  const d = c * (e + f);                // Total revenue (d = c*(e+f)) in ANG/month
  const s = 3000 + y * 62332.90;         // Total investment (s = 3000 + y*62332.90) in ANG

  // Total operational costs (q)
  // q = y*10986.33 + 0.0758*d + 1152.02
  const q = y * 10986.33 + 0.0758 * d + 1152.02;

  // Net Profit (t)
  const t = d - q;

  // ROI (u) = (t/s)*100
  const u = (t / s) * 100;

  // Payback period (w) = s/t (in months)
  let w = t > 0 ? s / t : Infinity;
  if (w > 1000) w = Infinity;

  /******************************************************************************
   * ALTERNATIVE SCENARIOS
   * Best-case: d increased by 20% and q decreased by 10%
   * Worst-case: d decreased by 20% and q increased by 10%
   *****************************************************************************/
  // Base-case values:
  const baseD = d;
  const baseROI = u;
  let baseW = w;

  // Best-case scenario:
  const bestD = d * 1.2;
  const bestQ = q * 0.9;
  const bestT = bestD - bestQ;
  const bestROI = (bestT / s) * 100;
  let bestW = bestT > 0 ? s / bestT : Infinity;
  if (bestW > 1000) bestW = Infinity;

  // Worst-case scenario:
  const worstD = d * 0.8;
  const worstQ = q * 1.1;
  const worstT = worstD - worstQ;
  const worstROI = (worstT / s) * 100;
  let worstW = worstT > 0 ? s / worstT : Infinity;
  if (worstW > 1000) worstW = Infinity;

  // Calculate scenario percentage differences relative to base-case:
  const bestPercent = ((bestD - d) / d) * 100;    // should be approximately +20%
  const worstPercent = ((worstD - d) / d) * 100;    // should be approximately -20%

  /******************************************************************************
   * UPDATE DOM OUTPUTS
   *****************************************************************************/
  // MID SECTION: Main outputs
  document.getElementById("totalRevenueOutput").innerText = d.toFixed(2);
  document.getElementById("netProfitOutput").innerText = t.toFixed(2);
  document.getElementById("roiOutput").innerText = u.toFixed(2) + "%";
  document.getElementById("paybackOutput").innerText = (w === Infinity) ? "∞" : w.toFixed(2);

  // BOTTOM SECTION: Alternative Scenarios labels
  document.getElementById("baseScenario").innerText = "Base-case (0%)";
  document.getElementById("bestScenario").innerText = "Best-case (" + (bestPercent >= 0 ? "+" : "") + bestPercent.toFixed(0) + "%)";
  document.getElementById("worstScenario").innerText = "Worst-case (" + (worstPercent >= 0 ? "+" : "") + worstPercent.toFixed(0) + "%)";

  // Base-case row
  document.getElementById("baseRevenue").innerText = baseD.toFixed(2);
  document.getElementById("baseROI").innerText = baseROI.toFixed(2) + "%";
  document.getElementById("basePayback").innerText = (baseW === Infinity) ? "∞" : baseW.toFixed(2);

  // Best-case row
  document.getElementById("bestRevenue").innerText = bestD.toFixed(2);
  document.getElementById("bestROI").innerText = bestROI.toFixed(2) + "%";
  document.getElementById("bestPayback").innerText = (bestW === Infinity) ? "∞" : bestW.toFixed(2);

  // Worst-case row
  document.getElementById("worstRevenue").innerText = worstD.toFixed(2);
  document.getElementById("worstROI").innerText = worstROI.toFixed(2) + "%";
  document.getElementById("worstPayback").innerText = (worstW === Infinity) ? "∞" : worstW.toFixed(2);
}

/******************************************************************************
 * SLIDER DISPLAY HELPER
 *****************************************************************************/
function updateSliderDisplay(sliderId, displayId, isInteger = false) {
  const slider = document.getElementById(sliderId);
  const display = document.getElementById(displayId);
  const val = parseFloat(slider.value);
  display.innerText = isInteger ? val.toFixed(0) : val.toFixed(2);
}

/******************************************************************************
 * INITIALIZE ON DOMContentLoaded
 *****************************************************************************/
document.addEventListener("DOMContentLoaded", () => {
  const tuners = document.querySelectorAll(".tuner");
  tuners.forEach(input => {
    input.addEventListener("input", () => {
      switch (input.id) {
        case "vehicles":
          updateSliderDisplay("vehicles", "vehiclesVal", true);
          break;
        case "occupancyRate":
          updateSliderDisplay("occupancyRate", "occupancyRateVal");
          break;
        case "tourFee":
          updateSliderDisplay("tourFee", "tourFeeVal");
          break;
        case "souvenirFee":
          updateSliderDisplay("souvenirFee", "souvenirFeeVal");
          break;
        default:
          break;
      }
      calculateOutputs();
    });
  });
  
  // Initialize slider displays
  updateSliderDisplay("vehicles", "vehiclesVal", true);
  updateSliderDisplay("occupancyRate", "occupancyRateVal");
  updateSliderDisplay("tourFee", "tourFeeVal");
  updateSliderDisplay("souvenirFee", "souvenirFeeVal");
  
  // Perform initial calculation
  calculateOutputs();
});
