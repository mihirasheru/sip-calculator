let sipChart;

function handleSIPTypeChange() {
  const sipType = document.getElementById("sipType").value;
  const monthlyGroup = document.getElementById("monthlyTimeGroup");
  const stepUpGroup = document.getElementById("stepUpGroup");
  const flexibleGroup = document.getElementById("flexibleGroup");
  const categoryGroup = document.getElementById("categoryGroup");

  if (sipType === "Flexible SIP") {
    if (monthlyGroup) monthlyGroup.remove();
    stepUpGroup.classList.add("hidden");
    flexibleGroup.classList.remove("hidden");
    categoryGroup.classList.add("hidden");
  } else {
    if (!document.getElementById("monthlyTimeGroup")) {
      const group = document.createElement("div");
      group.id = "monthlyTimeGroup";
      group.innerHTML = `
        <label>Monthly Investment Amount (₹)</label>
        <input type="number" id="monthlyAmount" placeholder="10000" />
        <label>Time Period (Years)</label>
        <input type="number" id="years" placeholder="10" />
      `;
      const button = document.querySelector("button[onclick='calculateSIP()']");
      button.parentNode.insertBefore(group, button);
    }

    stepUpGroup.classList.toggle("hidden", sipType !== "Step-up SIP");
    flexibleGroup.classList.add("hidden");
    categoryGroup.classList.remove("hidden");
  }
}

function generateFlexibleInputs() {
  const months = parseInt(document.getElementById("flexibleMonths").value);
  const container = document.getElementById("flexibleInputs");
  container.innerHTML = "";
  for (let i = 0; i < months; i++) {
    container.innerHTML += `<input type="number" placeholder="Month ${i + 1} amount" class="flex-input" style="width: 200px;" />`;

  }
}

function calculateSIP() {
  const sipType = document.getElementById("sipType").value;
  let totalInvestment = 0, futureValue = 0;
  let monthlyRate = 0.01;

  if (sipType === "Flexible SIP") {
    const inputs = document.querySelectorAll(".flex-input");
    const totalMonths = inputs.length;

    inputs.forEach((input, idx) => {
      const amt = parseFloat(input.value) || 0;
      const monthsLeft = totalMonths - idx;
      futureValue += amt * Math.pow(1 + monthlyRate, monthsLeft);
      totalInvestment += amt;
    });

  } else {
    const monthlyAmount = parseFloat(document.getElementById("monthlyAmount").value);
    const years = parseFloat(document.getElementById("years").value);
    const totalMonths = years * 12;

    if (sipType === "Step-up SIP") {
      const stepUpPercent = parseFloat(document.getElementById("stepUpPercent").value);
      monthlyRate = 0.15 / 12;
      let currentAmount = monthlyAmount;

      for (let i = 0; i < totalMonths; i++) {
        const monthsLeft = totalMonths - i;
        futureValue += currentAmount * Math.pow(1 + monthlyRate, monthsLeft);
        totalInvestment += currentAmount;
        if ((i + 1) % 12 === 0) {
          currentAmount *= (1 + stepUpPercent / 100);
        }
      }

    } else {
      const category = document.getElementById("investmentCategory").value;
      switch (category) {
        case "Small Cap": monthlyRate = 0.15 / 12; break;
        case "Mid Cap": monthlyRate = 0.12 / 12; break;
        case "Large Cap": monthlyRate = 0.10 / 12; break;
      }

      futureValue = monthlyAmount * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
      totalInvestment = monthlyAmount * totalMonths;
    }
  }

  const returns = futureValue - totalInvestment;
  document.getElementById("totalInvestment").textContent = Math.round(totalInvestment).toLocaleString("en-IN");
  document.getElementById("returns").textContent = Math.round(returns).toLocaleString("en-IN");
  document.getElementById("totalValue").textContent = Math.round(futureValue).toLocaleString("en-IN");

  document.getElementById("results").classList.remove("hidden");

  const ctx = document.getElementById("sipChart").getContext("2d");
  document.getElementById("sipChart").classList.remove("hidden");

  if (sipChart) sipChart.destroy();
  sipChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Total Investment", "Expected Returns"],
      datasets: [{
        label: "SIP Distribution",
        data: [Math.round(totalInvestment), Math.round(returns)],
        backgroundColor: ["#007bff", "#28a745"]
      }]
    }
  });
}

document.getElementById('faqToggle').addEventListener('click', () => {
  const faq = document.getElementById('faqSection');
  faq.classList.toggle('hidden');
});

document.getElementById("darkModeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.getElementById("darkModeToggle").textContent = document.body.classList.contains("dark") ? "LIGHT MODE" : "DARK MODE";
});
