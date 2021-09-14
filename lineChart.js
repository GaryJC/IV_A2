let gradUnempRate, ungradUnempRate;
let isLineShown = false;
$("#rateLine input").on("change", () => {
  if ($("input[name=showLine]:checked", "#rateLine").val() === "showLine") {
    gradUnempRate = new Map(
      filteredData.map((i) => [i.Major, i.Grad_unemployment_rate * 100])
    );
    ungradUnempRate = new Map(
      filteredData.map((i) => [i.Major, i.Nongrad_unemployment_rate * 100])
    );

    const gradDataset = {
      label: "Graduate Unemployment Rate",
      type: "line",
      data: [...gradUnempRate.values()],
      backgroundColor: "rgba(54, 162, 235, 0.4)",
      borderColor: "rgba(54, 162, 235, 0.8)",
      yAxisID: "unempRateAxis",
    };
    const ungradDataset = {
      label: "Undergraduate Unemployment Rate",
      type: "line",
      data: [...ungradUnempRate.values()],
      backgroundColor: "rgba(255, 99, 132, 0.4)",
      borderColor: "rgba(255, 99, 132, 0.8)",
      yAxisID: "unempRateAxis",
    };

    salaryChart.config.options.scales.unempRateAxis.display = true;

    salaryChart.config.data.datasets.push(gradDataset, ungradDataset);
    salaryChart.update();
    isLineShown = true;
  } else {
    for (let i = 0; i < 2; i++) {
      salaryChart.config.data.datasets.pop();
    }
    salaryChart.config.options.scales.unempRateAxis.display = false;
    salaryChart.update();
    isLineShown = false;
  }
});
