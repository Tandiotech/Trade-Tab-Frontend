import { SeparadorDecimal } from "../../utils/SeparadorDecimal";


export const publick_link_chart_options = {
    maintainAspectRatio: true,
    responsive: true,
    scales: {
      x: {
        ticks: {
          color:"black",
        },
        grid: {
          color:"rgba(34,38,46,1)",
        },
      },
      y: {
        beginAtZero: false,
        min: 0,
        max: 0,
        ticks: {
          color:"black",
          callback: value => `$${SeparadorDecimal(value.toFixed(0))}`,
        },
        grid: {
          color:"rgba(34,38,46,1)",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
      },
    },
};


export const public_link__chart_plugins = [
    {
      beforeDatasetsDraw(chart) {
        chart.ctx.shadowColor = "rgba(13, 40, 74, 0.2)";
        chart.ctx.shadowBlur = 8;
      },
      afterDatasetsDraw(chart) {
        chart.ctx.shadowColor = "rgba(33, 140, 74, 0.2)";
        chart.ctx.shadowBlur = 0;
      },
    },
  ];
