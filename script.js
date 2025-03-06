/******************************************************************************
 * CONSTANTS & DEFAULTS
 *****************************************************************************/
const a = 288;  // Maximum passengers per month

/******************************************************************************
 * MAIN CALCULATION FUNCTION
 *****************************************************************************/
function calculateOutputs() {
  // Retrieve Global input values:
  const b = parseFloat(document.getElementById("occupancyRate").value) / 100; // Occupancy rate as a decimal
  const e = parseFloat(document.getElementById("tourFee").value);            // Climbing fee (ANG)
  const f = parseFloat(document.getElementById("souvenirFee").value);          // Souvenir fee (ANG)

  // Derived values:
  const c = a * b;                      // Estimated passengers per month
  const d = c * (e + f);                // Total revenue (ANG/month)
  const s = 64540.90 + (c * 5.5);         // Total investment (ANG)

  // Monthly loan installment is removed (set to 0)
  // Total expenses (q) = 10746.25 + (600 + (c * 5.5)) + 0 + (0.0758 * d)
  const q = 10746.25 + (600 + (c * 5.5)) + (0.0758 * d);

  // Net profit (ANG/month)
  const t = d - q;

  // ROI (%) = (t / s) * 100
  const u = (t / s) * 100;

  // Payback period (months) = s / t (if t > 0; otherwise Infinity)
  let w = t > 0 ? s / t : Infinity;
  if (w > 1000) w = Infinity;  // Bound for extreme values

  /******************************************************************************
   * ALTERNATIVE SCENARIOS
   * Best-case: Revenue increased by 20% and expenses decreased by 10%
   * Worst-case: Revenue decreased by 20% and expenses increased by 10%
   *****************************************************************************/
  // Base-case values:
  const baseD = d;
  const baseROI = u;
  let baseW = w;

  // Best-case:
  const bestD = d * 1.2;
  const bestQ = q * 0.9;
  const bestT = bestD - bestQ;
  const bestROI = (bestT / s) * 100;
  let bestW = bestT > 0 ? s / bestT : Infinity;
  if (bestW > 1000) bestW = Infinity;

  // Worst-case:
  const worstD = d * 0.8;
  const worstQ = q * 1.1;
  const worstT = worstD - worstQ;
  const worstROI = (worstT / s) * 100;
  let worstW = worstT > 0 ? s / worstT : Infinity;
  if (worstW > 1000) worstW = Infinity;

  // Scenario percentage differences:
  const bestPercent = ((bestD - d) / d) * 100;    // should be +20%
  const worstPercent = ((worstD - d) / d) * 100;    // should be -20%

  /******************************************************************************
   * UPDATE DOM OUTPUTS
   *****************************************************************************/
  // MID SECTION: Main outputs
  document.getElementById("totalRevenueOutput").innerText = d.toFixed(2);
  document.getElementById("netProfitOutput").innerText = t.toFixed(2);
  document.getElementById("roiOutput").innerText = u.toFixed(2) + "%";
  document.getElementById("paybackOutput").innerText = (w === Infinity) ? "∞" : w.toFixed(2);

  // BOTTOM SECTION: Alternative Scenarios
  document.getElementById("baseScenario").innerText = "Base-case (0%)";
  document.getElementById("bestScenario").innerText = "Best-case (" + (bestPercent > 0 ? "+" : "") + bestPercent.toFixed(0) + "%)";
  document.getElementById("worstScenario").innerText = "Worst-case (" + (worstPercent > 0 ? "+" : "") + worstPercent.toFixed(0) + "%)";

  document.getElementById("baseRevenue").innerText = baseD.toFixed(2);
  document.getElementById("baseROI").innerText = baseROI.toFixed(2) + "%";
  document.getElementById("basePayback").innerText = (baseW === Infinity) ? "∞" : baseW.toFixed(2);

  document.getElementById("bestRevenue").innerText = bestD.toFixed(2);
  document.getElementById("bestROI").innerText = bestROI.toFixed(2) + "%";
  document.getElementById("bestPayback").innerText = (bestW === Infinity) ? "∞" : bestW.toFixed(2);

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
        case "occupancyRate":
          updateSliderDisplay("occupancyRate", "occupancyRateVal", true);
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
  
  updateSliderDisplay("occupancyRate", "occupancyRateVal", true);
  updateSliderDisplay("tourFee", "tourFeeVal");
  updateSliderDisplay("souvenirFee", "souvenirFeeVal");
  
  calculateOutputs();
});
