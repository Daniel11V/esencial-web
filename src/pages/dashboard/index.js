// material-ui
import { Divider, Grid, Stack, Typography, Button, Box, TextField, MenuItem, Checkbox, FormControlLabel, IconButton, List } from '@mui/material';
import { setOpenBackdrop } from 'store/reducers/money';
import { useDispatch, useSelector } from 'react-redux';
// import { activeItem } from 'store/reducers/money';

// project import
import MainCard from 'components/MainCard';
import { useState, useEffect, useRef } from 'react';
import IncomeAreaChart from 'pages/dashboard/IncomeAreaChart';
// import MonthlyBarChart from 'pages/dashboard/MonthlyBarChart';
import { EyeOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import IncomeTable from './IncomeTable';
import {
    formatNum,
    truncateTwoDecimals,
    getDifMonths,
    calcResIntComp,
} from 'utils/utils';


// ==============================|| COMPONENTS - TYPOGRAPHY ||============================== //

const DashboardDefault = () => {
    const dispatch = useDispatch();
    const { accounts, mainCurrency, currencies, operations } = useSelector((state) => state.money.data);

    const fullHeight = 'calc(60vh)';
    const GraphCardRef = useRef(null);
    const [graphCardSize, setGraphCardSize] = useState(['100%', '100%'])
    useEffect(() => {
        const handleResize = () => {
            setGraphCardSize(GraphCardRef.current ? [
                GraphCardRef.current.offsetWidth - 30 + "px",
                GraphCardRef.current.offsetHeight - 10 + "px"
            ] : ['100%', '100%'])
        }
        window.addEventListener('resize', handleResize)
        handleResize();
        return () => { window.removeEventListener('resize', handleResize) }
    }, [GraphCardRef?.current?.offsetWidth])

    const [interestAccountsPlot, setInterestAccountsPlot] = useState([])
    const [extraPlot, setExtraPlot] = useState([
        { id: 'total', accountName: 'Total' },
        { id: 'totalSelection', accountName: 'Total Seleccionados', cantOnlySeeThis: true },
        { id: 'inflation', accountName: 'Inflación' }
    ])
    const [accountChecked, setAccountChecked] = useState({})
    const [extraChecked, setExtraChecked] = useState({
        total: false, totalSelection: false, inflation: false
    })

    // Set first interestAccountPlot and accountChecked
    useEffect(() => {
        const interestAccountsValues = Object.values(accounts);
        if (interestAccountsValues?.length) {
            const newInterestAccountsPlot = interestAccountsValues.reduce((prevSeries, intAcc) =>
                [...prevSeries, intAcc], [])

            setInterestAccountsPlot(newInterestAccountsPlot);

            setAccountChecked([...newInterestAccountsPlot, ...extraPlot].reduce((prevSeries, intAcc) =>
                ({ ...prevSeries, [intAcc.id]: (!Object.values(prevSeries).some(pS => !!pS) && !!intAcc.TNA) ? true : false }), {}))
        }

        dispatch(setOpenBackdrop(false));
    }, [accounts, extraPlot, setInterestAccountsPlot, setAccountChecked, dispatch])

    const checkAll = () => {
        setAccountChecked(lv =>
            Object.keys(lv).reduce((allValues, lvKey) => ({ ...allValues, [lvKey]: true }), {})
        )
    }

    const checkOnlyOne = (intAccId) => {
        const checkedIsExtra = Object.keys(extraChecked).includes(intAccId);
        setAccountChecked(lv => {
            const negativeValues = Object.keys(lv).reduce((allValues, lvKey) => ({ ...allValues, [lvKey]: false }), {})
            if (checkedIsExtra) return negativeValues;
            return { ...negativeValues, [intAccId]: true };
        })
        setExtraChecked(lv => {
            const negativeValues = Object.keys(lv).reduce((allValues, lvKey) => ({ ...allValues, [lvKey]: false }), {})
            if (!checkedIsExtra) return negativeValues;
            return { ...negativeValues, [intAccId]: true };
        })
    }

    // Visual Options
    const [ammountPeriods, setAmmountPeriods] = useState(12);
    const status = [
        {
            value: 12,
            label: '1 Año'
        },
        {
            value: 24,
            label: '2 Años'
        },
        {
            value: 72,
            label: '6 Años'
        }
    ];
    const [slot, setSlot] = useState(0);
    const [showOnlyInterest, setShowOnlyInterest] = useState(false);


    // FOR CHART
    const [datePeriods, setDatePeriods] = useState([])
    const [biggerValues, setBiggerValues] = useState([{}, {}])
    const [accountSeries, setAccountSeries] = useState([]);
    const [lastAccountSeriesProps, setLastAccountSeriesProps] = useState([]);
    const [extraSeries, setExtraSeries] = useState({});

    // FOR TABLE
    const [accountsTableRows, setAccountsTableRows] = useState({})


    useEffect(() => {

        // Calculate newDatePeriods
        let newDatePeriods = []
        for (let i = ammountPeriods * slot; i <= ammountPeriods * (slot + 1); i++) {
            const now = new Date(new Date().getFullYear(), 0, 1);
            if (now.getMonth() + i > 11) {
                newDatePeriods.push(new Date(now.getFullYear() + 1, now.getMonth() + i - 12, 1).getTime())
            } else {
                newDatePeriods.push(new Date(now.getFullYear(), now.getMonth() + i, 1).getTime())
            }
        }

        // Start BiggerValues
        let biggerValue = {};
        const saveBiggerVal = (v, id) => { if (!biggerValue?.[id] || v > biggerValue[id]) biggerValue[id] = Math.floor(v) }
        let biggerValueInt = {};
        const saveBiggerValInt = (v, id) => { if (!biggerValueInt?.[id] || v > biggerValueInt[id]) biggerValueInt[id] = Math.floor(v) }

        const newAccountsTableRows = {}

        // Function getAccountSerie
        const getAccountSerie = (intAcc) => {
            const resIntAccSerie = [];
            const intAccSerie = [];
            const intAccPercSerie = [];

            const creationPoint = [intAcc.creationDate, intAcc.initialAmount];
            let lastAccPoint = [...creationPoint];
            const lastPointSerie = () => resIntAccSerie.length ? resIntAccSerie[resIntAccSerie.length - 1] : [newDatePeriods[0], lastAccPoint[1]];
            const savePoint = (date, resInt, hasInterest = true, hasPeriodicAdd = false, lastResInt) => {
                if (hasInterest) {
                    const realInt = ((resInt - (lastResInt || lastPointSerie()[1])) - (hasPeriodicAdd ? intAcc.periodicAdd : 0));
                    intAccSerie.push([date, truncateTwoDecimals(realInt)])
                    saveBiggerValInt(realInt, intAcc.id)
                    // console.log("ACA realInt", realInt, resInt, lastPointSerie()[1])

                    const realIntPerc = realInt / lastPointSerie()[1]
                    intAccPercSerie.push([date, truncateTwoDecimals(realIntPerc * 100)])
                }

                resIntAccSerie.push([date, resInt])
                saveBiggerVal(resInt, intAcc.id)
            }

            if (creationPoint[0] > newDatePeriods[0]) savePoint(creationPoint[0], creationPoint[1])
            newAccountsTableRows[intAcc.id] = [{
                // initialDate: 0,
                // days: 0,
                finalDate: intAcc.creationDate,
                title: "Creación",
                // initialAmount: 0,
                dif: intAcc.initialAmount,
                difPorc: 0,
                finalAmount: intAcc.initialAmount,
            }]

            // accountOperPoints
            const accountOperations = Object.values(operations)
                .filter(intOper => (intOper.fromAccount === intAcc.id))
                .sort((a, b) => a.date - b.date);

            for (let i = 0; i < accountOperations.length; i++) {
                //accOper in Serie
                const operPoint = [accountOperations[i].date, accountOperations[i].newValue]
                if (operPoint[0] > lastPointSerie()[0] && operPoint[0] < newDatePeriods[newDatePeriods.length - 1]) {
                    if (accountOperations[i].operType === "INTEREST") {
                        savePoint(operPoint[0], operPoint[1]);
                    } else {
                        savePoint(operPoint[0], operPoint[1], false);
                    }
                }

                if (accountOperations[i].operType === "INTEREST") {
                    newAccountsTableRows[intAcc.id].push({
                        // initialDate: accountOperations[i].initialDate ||
                        //     ((accountOperations[i].date && intAcc.termInDays)
                        //         ? accountOperations[i].date - intAcc.termInDays : 0),
                        // days: intAcc.termInDays ? intAcc.termInDays : 0,
                        finalDate: accountOperations[i].date,
                        title: "Intereses",
                        // initialAmount: lastAccPoint[1],
                        dif: accountOperations[i].newValue - lastAccPoint[1],
                        difPorc: (accountOperations[i].newValue - lastAccPoint[1]) / lastAccPoint[1],
                        finalAmount: accountOperations[i].newValue,
                    })
                } else if (accountOperations[i].operType === "INCOME") {
                    newAccountsTableRows[intAcc.id].push({
                        // initialDate: 0,
                        // days: 0,
                        finalDate: accountOperations[i].date,
                        title: "Ingreso",
                        // initialAmount: lastAccPoint[1],
                        dif: accountOperations[i].fromAmount || accountOperations[i].newValue - lastAccPoint[1],
                        difPorc: 0,
                        finalAmount: accountOperations[i].newValue,
                    })
                }

                lastAccPoint = operPoint;
            }

            // intAccountFuturePoints
            const monthToFill = [...newDatePeriods].filter(d => d + 1 > lastPointSerie()[0])
            for (let i = 0; i < monthToFill.length; i++) {
                const futurePointDate = new Date(monthToFill[i]).setDate(new Date(lastAccPoint[0]).getDate())

                const daysOfInt = (lastAccPoint[0] < newDatePeriods[0])
                    ? getDifMonths(new Date(lastAccPoint[0]), new Date(futurePointDate)) * 30
                    : intAcc.termInDays * (i + 1)

                const resIntComp = calcResIntComp(daysOfInt, intAcc.termInDays, intAcc.TNA, lastAccPoint[1], intAcc.periodicAdd, intAcc.currencyName);
                // if (intAcc.id === 2) console.log("ACA", resIntComp, daysOfInt)
                // console.log("ACAAAA", i, monthToFill.length, ammountPeriods)
                savePoint(futurePointDate, resIntComp, true, (daysOfInt >= 60), (monthToFill.length === (ammountPeriods + 1) && i === 0) ?
                    calcResIntComp(daysOfInt - 30, intAcc.termInDays, intAcc.TNA, lastAccPoint[1], intAcc.periodicAdd, intAcc.currencyName)
                    : null)
            }

            return {
                id: intAcc.id,
                name: intAcc.accountName + (intAcc.TNA === 0 ? '' : ' (TNM ' + formatNum(intAcc.TNA / 365 * 30 * 100) + '%)'),
                resIntAccSerie, intAccSerie, intAccPercSerie
            }
        }

        // Function getTotalSerie (ARREGLAR)
        const getTotalSerie = (prevSeries) => {
            const totalData = [];
            const totalDataInt = [];
            const totalDataIntPerc = [];
            // const ex = { Jan: {}, Feb: {}, Mar: {}, Apr: {}, May: {}, Jun: {}, Jul: {}, Aug: {}, Sep: {}, Oct: {}, Nov: {}, Dec: {} }
            // const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

            for (let i = 1; i < newDatePeriods.length; i++) {
                let totalValue = 0;
                for (let j = 0; j < prevSeries.length; j++) {
                    totalValue += [...prevSeries[j].resIntAccSerie]?.reverse()
                        ?.find(point => point[0] < newDatePeriods[i])?.[1] || 0;

                    // ex[months[new Date(newDatePeriods[i]).getMonth()]][prevSeries[j].name] =
                    //     [...prevSeries[j].resIntAccSerie]?.reverse()
                    //         ?.find(point => point[0] < newDatePeriods[i])?.[1] || 0

                }

                // ex[months[new Date(newDatePeriods[i]).getMonth()]]['Total'] = totalValue;
                const pointDate = newDatePeriods[i];
                totalData[i - 1] = [pointDate, truncateTwoDecimals(totalValue)]
                saveBiggerVal(totalValue, 'total');
                const totalValueInt = totalValue - (totalData[i - 2]?.[1] || 0)
                totalDataInt[i - 1] = [pointDate, truncateTwoDecimals(totalValueInt)]
                saveBiggerValInt(totalValueInt, 'total');
                const totalValueIntPerc = totalData[i - 2]?.[1] ? totalValueInt / (totalData[i - 2]?.[1]) * 100 : 100
                totalDataIntPerc[i - 1] = [pointDate, truncateTwoDecimals(totalValueIntPerc)]
            }
            // console.log("ACA ex", ex);
            return { id: 'total', name: 'Total', resIntAccSerie: totalData, intAccSerie: totalDataInt, intAccPercSerie: totalDataIntPerc };
        }

        // Function getTotalSelectionSerie
        const getTotalSelectionSerie = (selectedAccountSeries) => {
            const totalData = [];
            const totalDataInt = [];
            const totalDataIntPerc = [];

            for (let i = 1; i < datePeriods.length; i++) {
                let totalValue = 0;
                for (let j = 0; j < selectedAccountSeries.length; j++) {
                    totalValue += [...selectedAccountSeries[j].resIntAccSerie]?.reverse()
                        ?.find(point => point[0] < datePeriods[i])?.[1] || 0;
                }

                const pointDate = datePeriods[i];
                totalData[i - 1] = [pointDate, truncateTwoDecimals(totalValue)]
                saveBiggerVal(totalValue, 'totalSelection');
                const totalValueInt = totalValue - (totalData[i - 2]?.[1] || 0)
                totalDataInt[i - 1] = [pointDate, truncateTwoDecimals(totalValueInt)]
                saveBiggerValInt(totalValueInt, 'totalSelection');
                const totalValueIntPerc = totalData[i - 2]?.[1] ? totalValueInt / (totalData[i - 2]?.[1]) * 100 : 100
                totalDataIntPerc[i - 1] = [pointDate, truncateTwoDecimals(totalValueIntPerc)]
            }
            return { id: 'totalSelection', name: 'Total Seleccionados', resIntAccSerie: totalData, intAccSerie: totalDataInt, intAccPercSerie: totalDataIntPerc };
        }


        //// START

        // Get selectedAccountsSeries
        const newSelectedAccountSeries = Object.values(accounts).reduce((prevSeries, intAcc) => {
            if (!!accountChecked[intAcc.id] || !!extraChecked?.total) {
                if (1) { // different that lastSaved
                    return [...prevSeries, getAccountSerie(intAcc)]
                }
            } else {
                return prevSeries
            }
        }, [])
        // console.log("ACA newSelectedAccountSeries", newSelectedAccountSeries)

        const newAccountSeriesProps = [slot, ammountPeriods, accounts, mainCurrency, currencies, operations, accountChecked, extraChecked]
        if (JSON.stringify(newAccountSeriesProps) !== JSON.stringify(lastAccountSeriesProps)) {

            // Get selectedExtrasSeries
            const newSelectedExtraSeries = {}

            if (!!extraChecked?.total && newSelectedAccountSeries.length > 1) {
                newSelectedExtraSeries.total = getTotalSerie(newSelectedAccountSeries)
            }

            if (!!extraChecked?.totalSelection && newSelectedAccountSeries.length > 1) {
                newSelectedExtraSeries.totalSelection = getTotalSelectionSerie(newSelectedAccountSeries.filter(s => !!accountChecked[s.id]));
            }



            console.log("ACA newAllSeries", { newSelectedAccountSeries, newSelectedExtraSeries, biggerValue, biggerValueInt, newDatePeriods })
            setAccountSeries(prevSeries => ([...prevSeries.filter(pS => !newSelectedAccountSeries.some(nS => nS.name === pS.name)), ...newSelectedAccountSeries]))
            setLastAccountSeriesProps(newAccountSeriesProps)
            setExtraSeries(prevSeries => ({ ...prevSeries, ...newSelectedExtraSeries }))
            setDatePeriods(newDatePeriods)
            setBiggerValues([biggerValue, biggerValueInt])

            // Select accTableRows
            console.log("ACA newAccountsTableRows", newAccountsTableRows)
            setAccountsTableRows(prevTables => ({ ...prevTables, ...newAccountsTableRows }));
        }

    }, [
        slot,
        ammountPeriods,

        accounts,
        mainCurrency,
        currencies,
        operations,

        accountChecked,
        extraChecked,

        setAccountSeries,
        setLastAccountSeriesProps,
        setExtraSeries,
        setDatePeriods,
        setBiggerValues,
        setAccountsTableRows
    ]);

    // // Calculate plots only when they are selected
    // useEffect(() => {
    //     const selectedAccounts = Object.keys(accountChecked).filter(s => !!accountChecked[s])
    //     console.log("ACA selectedAccounts", selectedAccounts)



    //     if (!!extraChecked?.totalSelection && selectedAccounts.length > 1 && JSON.stringify([selectedAccounts, datePeriods]) !== JSON.stringify(lastTotalSelectionProps)) {

    //         let biggerValue = 0;
    //         const saveBiggerVal = (v) => { if (v > biggerValue) biggerValue = Math.floor(v) }
    //         let biggerValueInt = 0;
    //         const saveBiggerValInt = (v) => { if (v > biggerValueInt) biggerValueInt = Math.floor(v) }


    //         const getTotalSelectionSeries = (selectedAccountSeries) => {
    //             const totalData = [];
    //             const totalDataInt = [];
    //             const totalDataIntPerc = [];

    //             for (let i = 1; i < datePeriods.length; i++) {
    //                 let totalValue = 0;
    //                 for (let j = 0; j < selectedAccountSeries.length; j++) {
    //                     totalValue += [...selectedAccountSeries[j].resIntAccSerie]?.reverse()
    //                         ?.find(point => point[0] < datePeriods[i])?.[1] || 0;
    //                 }

    //                 const pointDate = datePeriods[i];
    //                 totalData[i - 1] = [pointDate, truncateTwoDecimals(totalValue)]
    //                 saveBiggerVal(totalValue);
    //                 const totalValueInt = totalValue - (totalData[i - 2]?.[1] || 0)
    //                 totalDataInt[i - 1] = [pointDate, truncateTwoDecimals(totalValueInt)]
    //                 saveBiggerValInt(totalValueInt);
    //                 const totalValueIntPerc = totalData[i - 2]?.[1] ? totalValueInt / (totalData[i - 2]?.[1]) * 100 : 100
    //                 totalDataIntPerc[i - 1] = [pointDate, truncateTwoDecimals(totalValueIntPerc)]
    //             }
    //             return { id: 'totalSelection', name: 'Total Seleccionados', resIntAccSerie: totalData, intAccSerie: totalDataInt, intAccPercSerie: totalDataIntPerc };
    //         }
    //         const totalSelectionSeries = getTotalSelectionSeries(Object.values(accountSeries).filter(s => s.id !== 'total' && accountChecked[s.id]));

    //         setExtraSeries((prevSeries) => ({ ...prevSeries, "totalSelection": totalSelectionSeries }))
    //         setBiggerValues((bigTypes) => [{ ...bigTypes[0], totalSelection: biggerValue }, { ...bigTypes[1], totalSelection: biggerValueInt }]);
    //         setLastTotalSelection([selectedAccounts, datePeriods]);
    //         // console.log("ACA Total Selection 2", totalSelectionSeries)
    //     }

    // }, [accountChecked, extraChecked, datePeriods, accountSeries, lastTotalSelectionProps, setBiggerValues, setExtraSeries, setLastTotalSelection])




    return (
        <Grid container columnSpacing={2.5} rowSpacing={2.5} >
            {/* row 1 */}
            <Grid item xs={12} md={8} lg={9} >
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Visualización de Cuentas</Typography>
                    </Grid>
                    <Grid item>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <TextField
                                id="standard-select-ammount-periods"
                                size="small"
                                select
                                value={ammountPeriods}
                                onChange={(e) => setAmmountPeriods(e.target.value)}
                                sx={{ '& .MuiInputBase-input': { py: 0.5, fontSize: '0.875rem' } }}
                            >
                                {status.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                id="standard-select-show-only-interest"
                                size="small"
                                select
                                value={showOnlyInterest}
                                onChange={(e) => setShowOnlyInterest(e.target.value)}
                                sx={{ '& .MuiInputBase-input': { py: 0.5, fontSize: '0.875rem' } }}
                            >
                                <MenuItem value={false}>Capital + Intereses</MenuItem>
                                <MenuItem value={true}>Solo Intereses</MenuItem>
                            </TextField>
                            <Stack direction="row" alignItems="center" spacing={0} >
                                <Button
                                    size="small"
                                    onClick={() => setSlot(val => val - 1)}
                                    color={slot < 0 ? 'primary' : 'secondary'}
                                    variant={slot < 0 ? 'outlined' : 'text'}
                                    style={{ minWidth: '33px', padding: '7px 9px' }}
                                >
                                    <LeftOutlined />
                                </Button>
                                <Button
                                    size="small"
                                    onClick={() => setSlot(0)}
                                    color={slot === 0 ? 'primary' : 'secondary'}
                                    variant={slot === 0 ? 'outlined' : 'text'}
                                    style={{ minWidth: '50px' }}
                                >
                                    Hoy
                                </Button>
                                <Button
                                    size="small"
                                    onClick={() => setSlot(val => val + 1)}
                                    color={slot > 0 ? 'primary' : 'secondary'}
                                    variant={slot > 0 ? 'outlined' : 'text'}
                                    style={{ minWidth: '33px', padding: '7px 9px' }}
                                >
                                    <RightOutlined />
                                </Button>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
                <MainCard ref={GraphCardRef} content={false} sx={{ mt: 1.5, pt: 1, pr: 2, pl: 1, height: fullHeight }}>
                    <IncomeAreaChart
                        slot={slot}
                        ammountPeriods={ammountPeriods}
                        datePeriods={datePeriods}
                        biggerValues={biggerValues}
                        allSeries={[...accountSeries, ...Object.values(extraSeries)]}
                        allChecked={{ ...accountChecked, ...extraChecked }}
                        showOnlyInterest={showOnlyInterest}
                        width={graphCardSize[0]} height={graphCardSize[1]} />
                </MainCard>
            </Grid>
            <Grid item xs={12} md={4} lg={3} >
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Ajuste de Grafico</Typography>
                    </Grid>
                    <Grid item />
                </Grid>
                <MainCard sx={{ mt: 2, height: fullHeight }} content={false}>
                    <Box>
                        <List style={{ maxHeight: fullHeight, overflow: 'auto' }}>
                            <Stack spacing={0} sx={{ p: 0 }}>
                                <Grid item xs={12} sx={{ mt: -1, p: 3, pb: '3px' }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" >
                                        <Typography variant="h6" color="textSecondary">
                                            Funciones Extras
                                        </Typography>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} sx={{ p: 0, m: 0 }}>
                                    <Button variant="text" sx={{ pb: '5px', pt: '9px', pl: '22px', pr: '14px', width: "100%" }} onClick={checkAll}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: "100%" }}>
                                            <Typography variant="h6" color="textPrimary">
                                                Ver todas las cuentas
                                            </Typography>
                                            <IconButton
                                                sx={{ fontSize: '0.875rem', m: 0, p: 0 }}
                                                size="medium"
                                                color={Object.keys(accountChecked).every(c => accountChecked[c] === true) ? 'primary' : 'secondary'}
                                            >
                                                <EyeOutlined />
                                            </IconButton>
                                        </Stack>
                                    </Button>
                                </Grid>
                                {extraPlot?.map(extraAcc => (
                                    <Grid item xs={12} sx={{ mt: -1, p: 0, }} key={extraAcc.id}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={!!extraChecked[extraAcc.id]}
                                                        sx={{ p: 2, pl: 2, ml: 2 }}
                                                        onChange={(event) => setExtraChecked(lv => ({ ...lv, [extraAcc.id]: event.target.checked }))}
                                                        name={extraAcc.id}
                                                        color="primary"
                                                        size="small"
                                                    />
                                                }
                                                label={<Typography variant="h6">{extraAcc.accountName}</Typography>}
                                            />
                                            {!extraAcc.cantOnlySeeThis && (
                                                <IconButton
                                                    sx={{ fontSize: '0.875rem', pr: 4, pl: 4 }}
                                                    size="medium"
                                                    color={extraChecked[extraAcc.id] ? 'primary' : 'secondary'}
                                                    onClick={() => checkOnlyOne(extraAcc.id)}
                                                >
                                                    <EyeOutlined />
                                                </IconButton>
                                            )}
                                        </Stack>
                                    </Grid>
                                ))}
                                <Divider />
                                <Typography variant="h6" color="textSecondary" sx={{ pl: 3, pt: 2 }}>
                                    Cuentas
                                </Typography>
                                {interestAccountsPlot?.map(intAcc => (
                                    <Grid item xs={12} key={intAcc.id} >
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={accountChecked[intAcc.id]}
                                                        sx={{ p: 1.5, ml: 2.5 }}
                                                        onChange={(event) => setAccountChecked(lv => ({ ...lv, [intAcc.id]: event.target.checked }))}
                                                        name={String(intAcc.id)}
                                                        color="primary"
                                                        size="small"
                                                    />
                                                }
                                                label={<Typography variant="h6">{intAcc.accountName}</Typography>}
                                            />
                                            <IconButton
                                                sx={{ fontSize: '0.875rem', pr: 4, pl: 4 }}
                                                size="medium"
                                                color={accountChecked[intAcc.id] ? 'primary' : 'secondary'}
                                                onClick={() => checkOnlyOne(intAcc.id)}
                                            >
                                                <EyeOutlined />
                                            </IconButton>
                                        </Stack>
                                    </Grid>
                                ))}
                            </Stack>
                        </List>
                    </Box>
                    {/* <MonthlyBarChart /> */}
                </MainCard>
            </Grid>
            <Grid item xs={12} md={12} lg={12} >
                <IncomeTable
                    accountTableRows={[...(accountsTableRows[Object.keys(accountChecked).find(accId => !!accountChecked[accId])] || [])]}
                    account={interestAccountsPlot?.find(intAcc => !!accountChecked[intAcc.id])} />
            </Grid>
        </Grid>
    );
};

export default DashboardDefault;
