import React from 'react'
import PropTypes from 'prop-types';
import useChartData from 'hooks/useChartData';

// third-party
import ReactApexChart from 'react-apexcharts';

// ==============================|| INCOME AREA CHART ||============================== //

const IncomeAreaChart = React.memo(({ height, width }) => {
    const { options, series } = useChartData()
    // console.log("ACA IncomeAreaChart")
    return <ReactApexChart options={options} series={series} type="area" height={height} width={width} />;
});

IncomeAreaChart.propTypes = {
    height: PropTypes.string,
    width: PropTypes.string,
};

export default IncomeAreaChart;
