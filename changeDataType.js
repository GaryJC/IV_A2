// the function of changing data type
$("#typeForm input").on("change", () => {
  let selVal = $("input[name=dataType]:checked", "#typeForm").val();
  $("#sortbyMajor").val("dummy");
  $("#sortby").val("dummy");
  if (isAll === false) {
    if (selVal === "med") {
      let medCatGrad = new Map();
      let medCatUngrad = new Map();
      grad_salary_med_map = mapData(
        medCatGrad,
        "Major_category",
        "Grad_median",
        "avg"
      );
      console.log(grad_salary_med_map);
      ungrad_salary_med_map = mapData(
        medCatUngrad,
        "Major_category",
        "Nongrad_median",
        "avg"
      );
      salaryChart.config.data.labels = category_label;
      salaryChart.config.data.datasets[0].data = [
        ...grad_salary_med_map.values(),
      ];
      salaryChart.config.data.datasets[1].data = [
        ...ungrad_salary_med_map.values(),
      ];
      salaryChart.update();
    } else if (selVal === "p75") {
      let p75CatGrad = new Map();
      let p75CatUngrad = new Map();
      grad_salary_med_map = mapData(
        p75CatGrad,
        "Major_category",
        "Grad_P75",
        "avg"
      );
      ungrad_salary_med_map = mapData(
        p75CatUngrad,
        "Major_category",
        "Nongrad_P75",
        "avg"
      );
      salaryChart.config.data.labels = category_label;
      salaryChart.config.data.datasets[0].data = [
        ...grad_salary_med_map.values(),
      ];
      salaryChart.config.data.datasets[1].data = [
        ...ungrad_salary_med_map.values(),
      ];
      salaryChart.update();
    } else {
      let p25CatGrad = new Map();
      let p25CatUngrad = new Map();
      grad_salary_med_map = mapData(
        p25CatGrad,
        "Major_category",
        "Grad_P25",
        "avg"
      );
      ungrad_salary_med_map = mapData(
        p25CatUngrad,
        "Major_category",
        "Nongrad_P25",
        "avg"
      );
      salaryChart.config.data.labels = category_label;
      salaryChart.config.data.datasets[0].data = [
        ...grad_salary_med_map.values(),
      ];
      salaryChart.config.data.datasets[1].data = [
        ...ungrad_salary_med_map.values(),
      ];
      salaryChart.update();
    }
  }
  if (isAll === true) {
    if (selVal === "med") {
      let medAllGrad = new Map();
      let medAllUngrad = new Map();
      grad_major_salary_med_map = mapData(medAllGrad, "Major", "Grad_median");
      ungrad_major_salary_med_map = mapData(
        medAllUngrad,
        "Major",
        "Nongrad_median"
      );
      salaryChart.config.data.datasets[0].data = [
        ...grad_major_salary_med_map.values(),
      ];
      salaryChart.config.data.datasets[1].data = [
        ...ungrad_major_salary_med_map.values(),
      ];
      salaryChart.config.data.labels = all_major_label;
      salaryChart.update();
    } else if (selVal === "p75") {
      let p75AllGrad = new Map();
      let p75AllUngrad = new Map();
      grad_major_salary_med_map = mapData(p75AllGrad, "Major", "Grad_P75");
      ungrad_major_salary_med_map = mapData(
        p75AllUngrad,
        "Major",
        "Nongrad_P75"
      );
      salaryChart.config.data.datasets[0].data = [
        ...grad_major_salary_med_map.values(),
      ];
      salaryChart.config.data.datasets[1].data = [
        ...ungrad_major_salary_med_map.values(),
      ];
      salaryChart.config.data.labels = all_major_label;
      salaryChart.update();
    } else {
      let p25AllGrad = new Map();
      let p25AllUngrad = new Map();
      grad_major_salary_med_map = mapData(p25AllGrad, "Major", "Grad_P25");
      ungrad_major_salary_med_map = mapData(
        p25AllUngrad,
        "Major",
        "Nongrad_P25"
      );
      salaryChart.config.data.datasets[0].data = [
        ...grad_major_salary_med_map.values(),
      ];
      salaryChart.config.data.datasets[1].data = [
        ...ungrad_major_salary_med_map.values(),
      ];
      salaryChart.config.data.labels = all_major_label;
      salaryChart.update();
    }
  }
  if (isFiltered == true && isAll == false) {
    if (selVal == "p25") {
      filteredGradData = new Map(
        filteredData.map((i) => [i.Major, i.Grad_P25])
      );
      filteredUngradData = new Map(
        filteredData.map((i) => [i.Major, i.Nongrad_P25])
      );
    } else if (selVal == "p75") {
      filteredGradData = new Map(
        filteredData.map((i) => [i.Major, i.Grad_P75])
      );
      filteredUngradData = new Map(
        filteredData.map((i) => [i.Major, i.Nongrad_P75])
      );
    } else {
      filteredGradData = new Map(
        filteredData.map((i) => [i.Major, i.Grad_median])
      );
      filteredUngradData = new Map(
        filteredData.map((i) => [i.Major, i.Nongrad_median])
      );
    }
    salaryChart.config.data.labels = filteredLabel;
    salaryChart.config.data.datasets[0].data = [...filteredGradData.values()];
    salaryChart.config.data.datasets[1].data = [...filteredUngradData.values()];
    salaryChart.update();
  }
});
