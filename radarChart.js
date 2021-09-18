var radar = function () {
  // $("#salaryChart").hide();
  if (showRadar === true) {
    $("#reset").show();
    let radarMajor = salaryChart.config.data.labels[activePoints[0].index];
    let radarData = dataset.filter((item) => {
      return item.Major == radarMajor;
    });

    let radarGradSet = radarData.map((i) => [
      i.Grad_median,
      i.Grad_P25,
      i.Grad_P75,
    ]);

    let radarUngradSet = radarData.map((i) => [
      i.Nongrad_median,
      i.Nongrad_P25,
      i.Nongrad_P75,
    ]);
    const data = {
      labels: ["Median", "25th%", "75th%"],
      datasets: [
        {
          label: "Graduate",
          data: radarGradSet[0],
          borderColor: "rgba(54, 162, 235, 0.8)",
          backgroundColor: "rgba(54, 162, 235, 0.4)",
        },
        {
          label: "Undergraduate",
          data: radarUngradSet[0],
          borderColor: "rgba(255, 99, 132, 0.4)",
          backgroundColor: "rgba(255, 99, 132, 0.8)",
        },
      ],
    };
    document.getElementById("salaryChart").style.cursor = "default";
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          onHover: function (e) {
            if (e) {
              console.log(e);
              document.getElementById("salaryChart").style.cursor = "pointer";
            }
          },
          onLeave: function (e) {
            if (e) {
              console.log(e);
              document.getElementById("salaryChart").style.cursor = "default";
            }
          },
          display: true,
          labels: {
            font: {
              size: 15,
            },
          },
        },
        labels: {
          font: {
            size: 15,
          },
        },
        title: {
          display: true,
          text: "Earnings",
          font: { family: "'Lato', sans-serif", size: 20, weight: 800 },
        },
        subtitle: {
          display: true,
          text: "Major -- " + radarMajor,
          font: { family: "'Lato', sans-serif", size: 16, weight: 800 },
        },
      },
    };

    salaryChart.config.type = "radar";
    salaryChart.config.data = data;
    salaryChart.config.data.labels = ["Median", "25th%", "75th%"];
    salaryChart.config.options = options;
    salaryChart.update();
    showRadar = false;
    $(".filter").hide();
  }
};
