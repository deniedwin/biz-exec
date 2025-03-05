/******************************************************************************
 * Assumptions & Key Ratios
 *****************************************************************************/
const operatingCostRatio = 0.40;      // 40% of revenue as operating costs
const loanInterestRate = 18;         // Annual interest rate (%)
const loanTerms = 3;                 // Loan duration (years)
const installmentsPerYear = 12;      // Number of installments per year

/******************************************************************************
 * Loan Installment Calculation (Annuity Formula)
 *****************************************************************************/
function calculateLoanInstallment(totalInvestment) {
  // Convert annual interest to monthly
  const r = (loanInterestRate / 100) / installmentsPerYear;
  const n = loanTerms * installmentsPerYear;
  // Annuity formula
  const installment = totalInvestment * (r * Math.pow(1 + r, n)) 
                      / (Math.pow(1 + r, n) - 1);
  return installment;
}

/******************************************************************************
 * Main Calculation Function
 *****************************************************************************/
function calculateOutputs() {
  // Retrieve input values
  const estimatedPassengers = parseFloat(document.getElementById("estimatedPassengers").value);
  const weightedAvgPrice = parseFloat(document.getElementById("weightedAvgPrice").value);
  const souvenirPrice = parseFloat(document.getElementById("souvenirPrice").value);
  const totalInvestment = parseFloat(document.getElementById("totalInvestment").value);

  // Monthly revenues
  const guidedToursRevenue = estimatedPassengers * weightedAvgPrice;
  const merchSalesRevenue = estimatedPassengers * souvenirPrice;
  const totalRevenue = guidedToursRevenue + merchSalesRevenue;

  // Operating cost
  const operatingCost = totalRevenue * operatingCostRatio;

  // Monthly loan installment
  const loanInstallment = calculateLoanInstallment(totalInvestment);

  // Base-case monthly net profit
  const netProfitMonthly = totalRevenue - operatingCost - loanInstallment;
  const netProfitAnnual = netProfitMonthly * 12;

  // ROI (annual)
  const ROI = (netProfitAnnual / totalInvestment) * 100;

  // Payback Period (years) - if net profit <= 0, mark as ∞
  let paybackPeriod = netProfitAnnual > 0 ? (totalInvestment / netProfitAnnual) : Infinity;
  // If payback is extremely large (e.g. > 50 years), treat as ∞
  if (paybackPeriod > 50) paybackPeriod = Infinity;

  /******************************************************************************
   * Alternative Scenarios
   * Best-case: +20% revenue, -10% operating cost
   * Worst-case: -20% revenue, +10% operating cost
   *****************************************************************************/
  // Best-case
  const bestRevenue = totalRevenue * 1.20;
  const bestOperatingCost = (totalRevenue * operatingCostRatio) * 0.90;
  const bestNetProfitMonthly = bestRevenue - bestOperatingCost - loanInstallment;
  const bestNetProfitAnnual = bestNetProfitMonthly * 12;
  let bestROI = (bestNetProfitAnnual / totalInvestment) * 100;
  let bestPayback = bestNetProfitAnnual > 0 ? (totalInvestment / bestNetProfitAnnual) : Infinity;
  if (bestPayback > 50) bestPayback = Infinity;

  // Worst-case
  const worstRevenue = totalRevenue * 0.80;
  const worstOperatingCost = (totalRevenue * operatingCostRatio) * 1.10;
  const worstNetProfitMonthly = worstRevenue - worstOperatingCost - loanInstallment;
  const worstNetProfitAnnual = worstNetProfitMonthly * 12;
  let worstROI = (worstNetProfitAnnual / totalInvestment) * 100;
  let worstPayback = worstNetProfitAnnual > 0 ? (totalInvestment / worstNetProfitAnnual) : Infinity;
  if (worstPayback > 50) worstPayback = Infinity;

  /******************************************************************************
   * Update DOM
   *****************************************************************************/
  // Main outputs (Base-case)
  document.getElementById("totalRevenueOutput").innerText = totalRevenue.toFixed(2);
  document.getElementById("netProfitOutput").innerText = netProfitAnnual.toFixed(2);
  document.getElementById("roiOutput").innerText = ROI.toFixed(2) + "%";
  document.getElementById("paybackOutput").innerText = 
    (paybackPeriod === Infinity) ? "∞" : paybackPeriod.toFixed(2) + " years";

  // Alternative Scenarios
  // Base-case row
  document.getElementById("baseRevenue").innerText = totalRevenue.toFixed(2);
  document.getElementById("baseNetProfit").innerText = netProfitAnnual.toFixed(2);
  document.getElementById("baseROI").innerText = ROI.toFixed(2) + "%";
  document.getElementById("basePayback").innerText = 
    (paybackPeriod === Infinity) ? "∞" : paybackPeriod.toFixed(2) + " years";

  // Best-case row
  document.getElementById("bestRevenue").innerText = bestRevenue.toFixed(2);
  document.getElementById("bestNetProfit").innerText = bestNetProfitAnnual.toFixed(2);
  document.getElementById("bestROI").innerText = bestROI.toFixed(2) + "%";
  document.getElementById("bestPayback").innerText = 
    (bestPayback === Infinity) ? "∞" : bestPayback.toFixed(2) + " years";

  // Worst-case row
  document.getElementById("worstRevenue").innerText = worstRevenue.toFixed(2);
  document.getElementById("worstNetProfit").innerText = worstNetProfitAnnual.toFixed(2);
  document.getElementById("worstROI").innerText = worstROI.toFixed(2) + "%";
  document.getElementById("worstPayback").innerText = 
    (worstPayback === Infinity) ? "∞" : worstPayback.toFixed(2) + " years";
}

/******************************************************************************
 * Slider Display Helper
 *****************************************************************************/
function updateSliderDisplay(sliderId, displayId) {
  const slider = document.getElementById(sliderId);
  const display = document.getElementById(displayId);
  display.innerText = parseFloat(slider.value).toFixed(2);
}

/******************************************************************************
 * On DOMContentLoaded
 *****************************************************************************/
document.addEventListener("DOMContentLoaded", function() {
  // Attach event listeners to tuner inputs
  const tuners = document.querySelectorAll(".tuner");
  tuners.forEach(input => {
    input.addEventListener("input", () => {
      // Update the slider display if it’s a range
      switch (input.id) {
        case "estimatedPassengers":
          document.getElementById("passengerVal").innerText = input.value;
          break;
        case "weightedAvgPrice":
          updateSliderDisplay("weightedAvgPrice", "weightedPriceVal");
          break;
        case "souvenirPrice":
          updateSliderDisplay("souvenirPrice", "souvenirVal");
          break;
        default:
          // totalInvestment is a numeric input, no separate display
          break;
      }
      calculateOutputs();
    });
  });

  // Initialize slider display text
  document.getElementById("passengerVal").innerText = 
    document.getElementById("estimatedPassengers").value;
  updateSliderDisplay("weightedAvgPrice", "weightedPriceVal");
  updateSliderDisplay("souvenirPrice", "souvenirVal");

  // Initial calculation
  calculateOutputs();
});
