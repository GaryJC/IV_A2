let isLineShown = false;
$("#rateLine input").on("change", () => {
  if ($("input[name=showLine]:checked", "#rateLine").val() === "showLine") {
    // gradUnempRate = new Map(
    //   filteredData.map((i) => [i.Major, i.Grad_unemployment_rate * 100])
    // );
    // ungradUnempRate = new Map(
    //   filteredData.map((i) => [i.Major, i.Nongrad_unemployment_rate * 100])
    // );

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

let gradUnempRate, ungradUnempRate;
var sortByAscGradFilter = (main, rely) => {
  main = new Map([...main].sort((a, b) => a[1] - b[1]));
  rely = sortHalfFilter(rely, main);
  gradUnempRate = rely;
};

var sortByDscGradFilter = (main, rely) => {
  let temp = new Map([...main].sort((a, b) => b[1] - a[1]));
  rely = sortHalfFilter(rely, temp);
  gradUnempRate = rely;
};

var sortByDscUngradFilter = (main, rely) => {
  let temp = new Map([...main].sort((a, b) => b[1] - a[1]));
  rely = sortHalfFilter(rely, temp);
  ungradUnempRate = rely;
};

var sortByAscUngradFilter = (main, rely) => {
  main = new Map([...main].sort((a, b) => a[1] - b[1]));
  rely = sortHalfFilter(rely, main);
  ungradUnempRate = rely;
};

function sortHalfFilter(unsorted, sorted) {
  unsorted = new Map(
    [...unsorted].sort(function (a, b) {
      return (
        [...sorted.keys()].indexOf(a[0]) - [...sorted.keys()].indexOf(b[0])
      );
    })
  );

  return unsorted;
}
