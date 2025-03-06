/******************************************************************************
 * CONSTANTS & DEFAULTS (Given in the prompt)
 *****************************************************************************/
const a = 288;               // Max passengers per month
// b, e, f, k, m, n are user inputs from sliders

/******************************************************************************
 * HELPER: PMT Calculation (Google Sheets style)
 * monthlyInstallment = PMT((k/m), (m*n), -s)
 *****************************************************************************/
function computePMT(ratePerInstallment, totalInstallments, presentValue) {
  // If rate = 0, then PMT = PV / totalInstallments
  if (ratePerInstallment === 0) {
    return presentValue / totalInstallments;
  }
  return (
    presentValue *
    (ratePerInstallment * Math.pow(1 + ratePerInstallment, totalInstallments)) /
    (Math.pow(1 + ratePerInstallment, totalInstallments) - 1)
  );
}

/******************************************************************************
 * MAIN CALCULATION
 *****************************************************************************/
function calculateOutputs() {
  // 1. Grab input values
  const b = parseFloat(document.getElementById("occupancyRate").value) / 100;  // Occupancy rate
  const e = parseFloat(document.getElementById("tourFee").value);             // Tour fee
  const f = parseFloat(document.getElementById("souvenirFee").value);         // Souvenir fee

  const k = parseFloat(document.getElementById("interestRate").value) / 100;  // Annual interest rate
  const m = parseFloat(document.getElementById("installmentsPerYear").value); // Installments per year
  const n = parseFloat(document.getElementById("loanYears").value);           // Number of years

  // 2. Derived values
  // c = a*b (estimated passengers per month)
  const c = a * b;

  // total investment = s = 64540.90 + (c*11/2)
  // c*11/2 = c*5.5
  const s = 64540.90 + (c * 5.5);

  // total revenue (monthly) = d = c*(e + f)
  const d = c * (e + f);

  // monthly installment = j = PMT((k/m), m*n, -s)
  // presentValue = -s => we pass s as positive to our function and then interpret sign
  const ratePerInstallment = k / m;
  const totalInstallments = m * n;
  const j = computePMT(ratePerInstallment, totalInstallments, s);

  // total expenses (operational cost) = q
  // q = 10746.25 + (600 + c*5.5) + j + (0.0758*d)
  const variablePart = 600 + (c * 5.5);
  const q = 10746.25 + variablePart + j + (0.0758 * d);

  // net profit (monthly) = t = d - q
  const t = d - q;

  // ROI (u) = (t / s)*100
  const u = (t / s) * 100;

  // payback period (w) = s / t (in years)
  let w = t > 0 ? s / t : Infinity;
  // If payback is extremely large, treat as Infinity
  if (w > 100) w = Infinity;

  /******************************************************************************
   * ALTERNATIVE SCENARIOS
   * Best-case: +20% to revenue, -10% to total expenses
   * Worst-case: -20% to revenue, +10% to total expenses
   *****************************************************************************/
  // Base-case (just our d, q, t, s)
  const baseD = d;
  const baseQ = q;
  const baseT = t;
  const baseROI = u;
  let baseW = w;

  // Best-case
  const bestD = d * 1.2;
  const bestQ = q * 0.9;
  const bestT = bestD - bestQ;
  const bestROI = (bestT / s) * 100;
  let bestW = bestT > 0 ? s / bestT : Infinity;
  if (bestW > 100) bestW = Infinity;

  // Worst-case
  const worstD = d * 0.8;
  const worstQ = q * 1.1;
  const worstT = worstD - worstQ;
  const worstROI = (worstT / s) * 100;
  let worstW = worstT > 0 ? s / worstT : Infinity;
  if (worstW > 100) worstW = Infinity;

  /******************************************************************************
   * UPDATE DOM
   *****************************************************************************/
  // MID SECTION: main outputs
  document.getElementById("totalRevenueOutput").innerText = d.toFixed(2);
  document.getElementById("netProfitOutput").innerText = t.toFixed(2);
  document.getElementById("roiOutput").innerText = u.toFixed(2) + "%";
  document.getElementById("paybackOutput").innerText =
    (w === Infinity) ? "∞" : w.toFixed(2);

  // BOTTOM SECTION: Alternative Scenarios
  // Base-case
  document.getElementById("baseRevenue").innerText = baseD.toFixed(2);
  document.getElementById("baseNetProfit").innerText = baseT.toFixed(2);
  document.getElementById("baseROI").innerText = baseROI.toFixed(2) + "%";
  document.getElementById("basePayback").innerText =
    (baseW === Infinity) ? "∞" : baseW.toFixed(2);

  // Best-case
  document.getElementById("bestRevenue").innerText = bestD.toFixed(2);
  document.getElementById("bestNetProfit").innerText = bestT.toFixed(2);
  document.getElementById("bestROI").innerText = bestROI.toFixed(2) + "%";
  document.getElementById("bestPayback").innerText =
    (bestW === Infinity) ? "∞" : bestW.toFixed(2);

  // Worst-case
  document.getElementById("worstRevenue").innerText = worstD.toFixed(2);
  document.getElementById("worstNetProfit").innerText = worstT.toFixed(2);
  document.getElementById("worstROI").innerText = worstROI.toFixed(2) + "%";
  document.getElementById("worstPayback").innerText =
    (worstW === Infinity) ? "∞" : worstW.toFixed(2);
}

/******************************************************************************
 * SLIDER DISPLAY HELPERS
 *****************************************************************************/
function updateSliderDisplay(sliderId, displayId, isInteger = false) {
  const slider = document.getElementById(sliderId);
  const display = document.getElementById(displayId);
  const val = parseFloat(slider.value);
  display.innerText = isInteger ? val.toFixed(0) : val.toFixed(2);
}

/******************************************************************************
 * ON DOMContentLoaded
 *****************************************************************************/
document.addEventListener("DOMContentLoaded", () => {
  const tuners = document.querySelectorAll(".tuner");

  // On input change, update display and recalc
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
        case "interestRate":
          updateSliderDisplay("interestRate", "interestRateVal");
          break;
        case "installmentsPerYear":
          updateSliderDisplay("installmentsPerYear", "installmentsVal", true);
          break;
        case "loanYears":
          updateSliderDisplay("loanYears", "loanYearsVal", true);
          break;
        default:
          break;
      }
      calculateOutputs();
    });
  });

  // Initialize slider displays
  updateSliderDisplay("occupancyRate", "occupancyRateVal", true);
  updateSliderDisplay("tourFee", "tourFeeVal");
  updateSliderDisplay("souvenirFee", "souvenirFeeVal");
  updateSliderDisplay("interestRate", "interestRateVal");
  updateSliderDisplay("installmentsPerYear", "installmentsVal", true);
  updateSliderDisplay("loanYears", "loanYearsVal", true);

  // Initial calculation
  calculateOutputs();
});
