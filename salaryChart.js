let all_major_label = [];
let grad_salary_med = [];
let ungrad_salary_med = [];
let grad_salary_p25 = [];
let grad_salary_p75 = [];

let category_count = new Map();
for (i = 0; i < dataset.length; i++) {
  if (category_count.has(dataset[i].Major_category)) {
    category_count.set(
      dataset[i].Major_category,
      category_count.get(dataset[i].Major_category) + 1
    );
  } else {
    category_count.set(dataset[i].Major_category, 1);
  }
}

var dataGrad, dataUngrad;

//map with majors and corresponded grad salary
var mapData = (newData, dataKey, dataVal, bool) => {
  for (i = 0; i < dataset.length; i++) {
    if (newData.has(dataset[i][dataKey])) {
      newData.set(
        dataset[i][dataKey],
        newData.get(dataset[i][dataKey]) + dataset[i][dataVal]
      );
    } else {
      newData.set(dataset[i][dataKey], dataset[i][dataVal]);
    }
  }
  if (bool) {
    //   if (bool == "ungrad") {
    //     for (let [key, val] of ungrad_salary_med_map) {
    //       ungrad_salary_med_map.set(key, val / category_count.get(key));
    //     }
    //   } else {
    //     for (let [key, val] of grad_salary_med_map) {
    //       grad_salary_med_map.set(key, val / category_count.get(key));
    //     }
    //   }
    for (let [key, val] of newData) {
      newData.set(key, val / category_count.get(key));
    }
  }
  return newData;
};

//map with majors and corresponded grad salary
let grad_major_salary_med_map = new Map();
mapData(grad_major_salary_med_map, "Major", "Grad_median");

//map with majors and corresponded ungrad salary
let ungrad_major_salary_med_map = new Map();
mapData(ungrad_major_salary_med_map, "Major", "Nongrad_median");

//map with major category and corresponded grad salary
let grad_salary_med_map = new Map();
mapData(grad_salary_med_map, "Major_category", "Grad_median", "grad");

//map with major category and corresponded ungrad salary
let ungrad_salary_med_map = new Map();
mapData(ungrad_salary_med_map, "Major_category", "Nongrad_median", "ungrad");

let category_label = [...grad_salary_med_map.keys()];
// let category_grad_salary_med = [...grad_salary_med_map.values()];

// let category_ungrad_salary_med = [...ungrad_salary_med_map.values()];

for (i = 0; i < dataset.length; i++) {
  all_major_label.push(dataset[i].Major);
  grad_salary_med.push(dataset[i].Grad_median);
  ungrad_salary_med.push(dataset[i].Nongrad_median);
  grad_salary_p25.push(dataset[i].Grad_P25);
  grad_salary_p75.push(dataset[i].Grad_P75);
}

let data = {
  labels: category_label,
  datasets: [
    {
      label: "Graduate Earnings",
      data: [...grad_salary_med_map.values()],
      backgroundColor: "rgba(54, 162, 235, 0.4)",
      hoverBackgroundColor: "rgba(54, 162, 235, 0.8)",
      maxBarThickness: 80,
    },
    {
      label: "Undergraduate Earnings",
      data: [...ungrad_salary_med_map.values()],
      backgroundColor: "rgba(255, 99, 132, 0.4)",
      hoverBackgroundColor: "rgba(255, 99, 132, 0.8)",
      maxBarThickness: 80,
    },
  ],
};

let config = {
  type: "bar",
  data: data,
  options: {
    onHover: (event, chartElement) => {
      if (isAll == true || isFiltered == true) {
        document.getElementById("salaryChart").style.cursor = "default";
      } else {
        document.getElementById("salaryChart").style.cursor = chartElement[0]
          ? "pointer"
          : "default";
      }
    },
    plugins: {
      title: {
        display: true,
        text: "College Majors Earnings",
        font: { size: 20 },
      },
      subtitle: {
        display: true,
        text: "Major Categories",
        font: { size: 16, weight: "bold" },
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
        ticks: {
          display: true,
          callback: function (value) {
            if (this.getLabelForValue(value).length > 10) {
              return this.getLabelForValue(value).substr(0, 11) + "...";
            }
            return this.getLabelForValue(value);
          },
        },
      },
      y: {
        stacked: true,
      },
      unempRateAxis: {
        type: "linear",
        display: false,
        position: "right",

        // grid line settings
        grid: {
          drawOnChartArea: false, // only want the grid lines for one axis to show up
        },
      },
    },
  },
};

var salaryChart = new Chart(document.getElementById("salaryChart"), config);

var sortByAsc = (main, rely, f, s) => {
  main = new Map([...main].sort((a, b) => a[1] - b[1]));
  salaryChart.config.data.labels = [...main.keys()];
  salaryChart.config.data.datasets[f].data = [...main.values()];
  salaryChart.config.data.datasets[s].data = sortHalf(rely, main);
};

var sortByDsc = (main, rely, f, s) => {
  main = new Map([...main].sort((a, b) => b[1] - a[1]));
  salaryChart.config.data.labels = [...main.keys()];
  salaryChart.config.data.datasets[f].data = [...main.values()];
  salaryChart.config.data.datasets[s].data = sortHalf(rely, main);
};

function sortHalf(unsorted, sorted) {
  unsorted = new Map(
    [...unsorted].sort(function (a, b) {
      return (
        [...sorted.keys()].indexOf(a[0]) - [...sorted.keys()].indexOf(b[0])
      );
    })
  );

  return [...unsorted.values()];
}

$("#sortby").change(() => {
  if ($("#sortby").val() == "asc_grad") {
    if (isAll === false) {
      sortByAsc(grad_salary_med_map, ungrad_salary_med_map, 0, 1);
    } else {
      sortByAsc(grad_major_salary_med_map, ungrad_major_salary_med_map, 0, 1);
    }
    salaryChart.update();
  }
  if ($("#sortby").val() == "dsc_grad") {
    if (isAll === false) {
      sortByDsc(grad_salary_med_map, ungrad_salary_med_map, 0, 1);
    } else {
      sortByDsc(grad_major_salary_med_map, ungrad_major_salary_med_map, 0, 1);
    }
    salaryChart.update();
  }
  if ($("#sortby").val() == "asc_ungrad") {
    if (isAll === false) {
      sortByAsc(ungrad_salary_med_map, grad_salary_med_map, 1, 0);
    } else {
      sortByAsc(ungrad_major_salary_med_map, grad_major_salary_med_map, 1, 0);
    }
    salaryChart.update();
  }
  if ($("#sortby").val() == "dsc_ungrad") {
    if (isAll === false) {
      sortByDsc(ungrad_salary_med_map, grad_salary_med_map, 1, 0);
    } else {
      sortByDsc(ungrad_major_salary_med_map, grad_major_salary_med_map, 1, 0);
    }
    salaryChart.update();
  }
});

let isAll = false;

$("#majorForm input").on("change", () => {
  if ($("input[name=showAll]:checked", "#majorForm").val() === "showAll") {
    $("#sortbyMajor").hide();
    $("#sortby").show();
    salaryChart.config.data.datasets[0].hidden = false;
    salaryChart.config.data.datasets[1].hidden = false;
    isFiltered = true;
    isAll = true;
    salaryChart.config.data.labels = all_major_label;
    salaryChart.config.data.datasets[0].data = grad_salary_med;
    salaryChart.config.data.datasets[1].data = ungrad_salary_med;
    salaryChart.config.options.plugins.subtitle.text = "Majors";
    // salaryChart.config.options.scales.x.ticks.display = false;

    // hide the unemployment rate line when click show all majors
    if (isLineShown === true) {
      for (let i = 0; i < 2; i++) {
        salaryChart.config.data.datasets.pop();
      }
      salaryChart.config.options.scales.unempRateAxis.display = false;
      $("#showLine").prop("checked", false);
      $("#rateLine").hide();
      isLineShown = false;
    }
    salaryChart.update();
  } else {
    isFiltered = false;
    isAll = false;
    salaryChart.config.data.labels = category_label;
    salaryChart.config.data.datasets[0].data = [
      ...grad_salary_med_map.values(),
    ];
    salaryChart.config.data.datasets[1].data = sortHalf(
      ungrad_salary_med_map,
      grad_salary_med_map
    );
    salaryChart.config.options.plugins.subtitle.text = "Major Categories";
    // salaryChart.config.options.scales.x.ticks.display = true;
    salaryChart.update();
  }
});

let isFiltered = false;
let datasetIndex,
  selectedCat,
  filteredData,
  filteredLabel,
  filteredGradData,
  filteredUngradData;

document.getElementById("salaryChart").onclick = function (evt) {
  var activePoints = salaryChart.getElementsAtEventForMode(
    evt,
    "point",
    salaryChart.options
  );
  console.log(activePoints);
  if (isFiltered == false && activePoints.length) {
    $("#sortbyMajor").show();
    $("#sortby").hide();
    $("#rateLine").show();
    console.log(activePoints);
    datasetIndex = activePoints[0].datasetIndex;
    selectedCat = salaryChart.config.data.labels[activePoints[0].index];

    filteredData = dataset.filter((item) => {
      return item.Major_category == selectedCat;
    });

    filteredGradData = new Map(
      filteredData.map((i) => [i.Major, i.Grad_median])
    );
    filteredUngradData = new Map(
      filteredData.map((i) => [i.Major, i.Nongrad_median])
    );

    gradUnempRate = new Map(
      filteredData.map((i) => [i.Major, i.Grad_unemployment_rate * 100])
    );
    ungradUnempRate = new Map(
      filteredData.map((i) => [i.Major, i.Nongrad_unemployment_rate * 100])
    );

    filteredLabel = filteredData.map((item) => item.Major);
    salaryChart.config.data.labels = filteredLabel;
    salaryChart.config.data.datasets[0].data = [...filteredGradData.values()];
    salaryChart.config.data.datasets[1].data = [...filteredUngradData.values()];
    isFiltered = true;
    // if (datasetIndex == 0) {
    //   salaryChart.config.data.labels = filteredLabel;
    //   salaryChart.config.data.datasets[0].data = [...filteredGradData.values()];
    //   salaryChart.config.data.datasets[1].data = [
    //     ...filteredUngradData.values(),
    //   ];
    //   salaryChart.config.data.datasets[1].hidden = true;
    //   isFiltered = true;
    // } else if (datasetIndex == 1) {
    //   salaryChart.config.data.labels = filteredLabel;
    //   salaryChart.config.data.datasets[1].data = [
    //     ...filteredUngradData.values(),
    //   ];
    //   salaryChart.config.data.datasets[0].data = [...filteredGradData.values()];
    //   salaryChart.config.data.datasets[0].hidden = true;
    //   isFiltered = true;
    // }
    salaryChart.config.options.plugins.subtitle.text = "Majors";
    salaryChart.update();
  }
};

// $("#sortbyMajor").change(() => {
//   // order grad salary by asc
//   if ($("#sortbyMajor").val() == "asc_major" && datasetIndex == 0) {
//     sortByAsc(filteredGradData, filteredUngradData, 0, 1);
//   }
//   // sortByAsc(gradUnempRate, ungradUnempRate, 2, 3);

//   if ($("#sortbyMajor").val() == "dsc_major" && datasetIndex == 0) {
//     sortByDsc(filteredGradData, filteredUngradData, 0, 1);
//   }
//   if ($("#sortbyMajor").val() == "asc_major" && datasetIndex == 1) {
//     sortByAsc(filteredUngradData, filteredGradData, 1, 0);
//   }
//   if ($("#sortbyMajor").val() == "dsc_major" && datasetIndex == 1) {
//     sortByDsc(filteredUngradData, filteredGradData, 1, 0);
//   }
//   salaryChart.update();
// });

$("#sortbyMajor").change(() => {
  if (isLineShown === false) {
    if ($("#sortbyMajor").val() == "asc_grad") {
      sortByAsc(filteredGradData, filteredUngradData, 0, 1);
      sortByAscGradFilter(filteredGradData, gradUnempRate);
      sortByAscUngradFilter(filteredGradData, ungradUnempRate);
    }
    if ($("#sortbyMajor").val() == "dsc_grad") {
      sortByDsc(filteredGradData, filteredUngradData, 0, 1);
      sortByDscGradFilter(filteredGradData, gradUnempRate);
      sortByDscUngradFilter(filteredGradData, ungradUnempRate);
    }
    if ($("#sortbyMajor").val() == "asc_ungrad") {
      sortByAsc(filteredUngradData, filteredGradData, 1, 0);
      sortByAscGradFilter(filteredUngradData, gradUnempRate);
      sortByAscUngradFilter(filteredUngradData, ungradUnempRate);
    }
    if ($("#sortbyMajor").val() == "dsc_ungrad") {
      sortByDsc(filteredUngradData, filteredGradData, 1, 0);
      sortByDscGradFilter(filteredUngradData, gradUnempRate);
      sortByDscUngradFilter(filteredUngradData, ungradUnempRate);
    }
  } else {
    if ($("#sortbyMajor").val() == "asc_grad") {
      sortByAsc(filteredGradData, filteredUngradData, 0, 1);
      sortByAsc(filteredGradData, gradUnempRate, 0, 2);
      sortByAsc(filteredGradData, ungradUnempRate, 0, 3);
    }
    if ($("#sortbyMajor").val() == "dsc_grad") {
      sortByDsc(filteredGradData, filteredUngradData, 0, 1);
      sortByDsc(filteredGradData, gradUnempRate, 0, 2);
      sortByDsc(filteredGradData, ungradUnempRate, 0, 3);
    }
    if ($("#sortbyMajor").val() == "asc_ungrad") {
      sortByAsc(filteredUngradData, filteredGradData, 1, 0);
      sortByAsc(filteredUngradData, gradUnempRate, 1, 2);
      sortByAsc(filteredUngradData, ungradUnempRate, 1, 3);
    }
    if ($("#sortbyMajor").val() == "dsc_ungrad") {
      sortByDsc(filteredUngradData, filteredGradData, 1, 0);
      sortByDsc(filteredUngradData, gradUnempRate, 1, 2);
      sortByDsc(filteredUngradData, ungradUnempRate, 1, 3);
    }
  }
  // else {
  //   for (let i = 0; i < 2; i++) {
  //     salaryChart.config.data.datasets.pop();
  //   }
  //   salaryChart.config.options.scales.unempRateAxis.display = false;

  //   $("#showLine").prop("checked", false);
  // }
  salaryChart.update();
});

$("#sortbyMajor").hide();
$("#rateLine").hide();
