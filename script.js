// Constants & Assumptions
const maxCustomers = 100;             // Maximum customers per month
const operatingCostRatio = 0.40;      // 40% of revenue as operating costs

// Calculate monthly loan installment using the annuity formula
function calculateLoanInstallment(totalInvestment, annualInterestRate, years, installmentsPerYear) {
  const P = totalInvestment;
  const r = (annualInterestRate / 100) / installmentsPerYear;
  const n = years * installmentsPerYear;
  const installment = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return installment;
}

function calculateOutputs() {
  // Retrieve input values
  const servicePrice = parseFloat(document.getElementById("servicePrice").value);
  const souvenirPrice = parseFloat(document.getElementById("souvenirPrice").value);
  const occupancyRate = parseFloat(document.getElementById("occupancyRate").value) / 100;
  const totalInvestment = parseFloat(document.getElementById("totalInvestment").value);
  
  // Loan parameters (fixed)
  const loanInterestRate = 18;  // Annual interest rate (%)
  const loanTerms = 3;          // Years
  const installmentsPerYear = 12;
  
  // Calculate number of customers based on occupancy
  const numCustomers = maxCustomers * occupancyRate;
  
  // Revenue calculations (monthly)
  const serviceRevenue = numCustomers * servicePrice;
  const souvenirRevenue = numCustomers * souvenirPrice;
  const totalRevenue = serviceRevenue + souvenirRevenue;
  
  // Operating costs (assumed as 40% of revenue)
  const operatingCost = totalRevenue * operatingCostRatio;
  
  // Loan installment (monthly)
  const loanInstallment = calculateLoanInstallment(totalInvestment, loanInterestRate, loanTerms, installmentsPerYear);
  
  // Base-case: monthly net profit = revenue - operating cost - loan installment
  const netProfitMonthly = totalRevenue - operatingCost - loanInstallment;
  const netProfitAnnual = netProfitMonthly * 12;
  
  // ROI: (annual net profit / total investment) * 100%
  const ROI = (netProfitAnnual / totalInvestment) * 100;
  
  // Payback period (years)
  const paybackPeriod = netProfitAnnual > 0 ? (totalInvestment / netProfitAnnual) : NaN;
  
  // Alternative scenarios:
  // Best-case: 20% increase in revenue and 10% reduction in operating costs
  const bestRevenue = totalRevenue * 1.20;
  const bestOperatingCost = (totalRevenue * operatingCostRatio) * 0.90;
  const bestNetProfitMonthly = bestRevenue - bestOperatingCost - loanInstallment;
  const bestNetProfitAnnual = bestNetProfitMonthly * 12;
  const bestROI = (bestNetProfitAnnual / totalInvestment) * 100;
  const bestPayback = bestNetProfitAnnual > 0 ? (totalInvestment / bestNetProfitAnnual) : NaN;
  
  // Worst-case: 20% decrease in revenue and 10% increase in operating costs
  const worstRevenue = totalRevenue * 0.80;
  const worstOperatingCost = (totalRevenue * operatingCostRatio) * 1.10;
  const worstNetProfitMonthly = worstRevenue - worstOperatingCost - loanInstallment;
  const worstNetProfitAnnual = worstNetProfitMonthly * 12;
  const worstROI = (worstNetProfitAnnual / totalInvestment) * 100;
  const worstPayback = worstNetProfitAnnual > 0 ? (totalInvestment / worstNetProfitAnnual) : NaN;
  
  // Update main outputs table
  document.getElementById("totalRevenueOutput").innerText = totalRevenue.toFixed(2);
  document.getElementById("netProfitOutput").innerText = netProfitAnnual.toFixed(2);
  document.getElementById("roiOutput").innerText = ROI.toFixed(2) + "%";
  document.getElementById("paybackOutput").innerText = !isNaN(paybackPeriod) ? paybackPeriod.toFixed(2) + " years" : "N/A";
  
  // Update alternative scenarios table for Base-case
  document.getElementById("baseRevenue").innerText = totalRevenue.toFixed(2);
  document.getElementById("baseNetProfit").innerText = netProfitAnnual.toFixed(2);
  document.getElementById("baseROI").innerText = ROI.toFixed(2) + "%";
  document.getElementById("basePayback").innerText = !isNaN(paybackPeriod) ? paybackPeriod.toFixed(2) + " years" : "N/A";
  
  // Best-case scenario
  document.getElementById("bestRevenue").innerText = bestRevenue.toFixed(2);
  document.getElementById("bestNetProfit").innerText = bestNetProfitAnnual.toFixed(2);
  document.getElementById("bestROI").innerText = bestROI.toFixed(2) + "%";
  document.getElementById("bestPayback").innerText = !isNaN(bestPayback) ? bestPayback.toFixed(2) + " years" : "N/A";
  
  // Worst-case scenario
  document.getElementById("worstRevenue").innerText = worstRevenue.toFixed(2);
  document.getElementById("worstNetProfit").innerText = worstNetProfitAnnual.toFixed(2);
  document.getElementById("worstROI").innerText = worstROI.toFixed(2) + "%";
  document.getElementById("worstPayback").innerText = !isNaN(worstPayback) ? worstPayback.toFixed(2) + " years" : "N/A";
}

function updateSliderDisplay(id, displayId) {
  const slider = document.getElementById(id);
  const display = document.getElementById(displayId);
  display.innerText = slider.value;
}

document.addEventListener("DOMContentLoaded", function() {
  // Attach event listeners to tuner inputs
  const tuners = document.querySelectorAll(".tuner");
  tuners.forEach(input => input.addEventListener("input", () => {
    // Update slider display if applicable
    if (input.id === "servicePrice") updateSliderDisplay("servicePrice", "servicePriceVal");
    if (input.id === "souvenirPrice") updateSliderDisplay("souvenirPrice", "souvenirPriceVal");
    if (input.id === "occupancyRate") updateSliderDisplay("occupancyRate", "occupancyRateVal");
    
    // Recalculate outputs on any input change
    calculateOutputs();
  }));
  
  // Initial display update for sliders
  updateSliderDisplay("servicePrice", "servicePriceVal");
  updateSliderDisplay("souvenirPrice", "souvenirPriceVal");
  updateSliderDisplay("occupancyRate", "occupancyRateVal");
  
  // Perform an initial calculation on page load
  calculateOutputs();
});
