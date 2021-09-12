const yankDateString = (d) => {
    let day = (d.getDate()).toString();
    let month = (d.getMonth() + 1).toString();
    let year = d.getFullYear().toString();
    let day_p = (day.length < 2) ? `0${day}` : day;
    let month_p = (month.length < 2) ? `0${month}` : month;
    return `${year}-${month_p}-${day_p}`;
  };

export { yankDateString }