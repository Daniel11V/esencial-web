// material-ui
import { Divider, Grid, Stack, Typography, Button, Box, TextField, MenuItem, Checkbox, FormControlLabel, IconButton, List } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { activeItem } from 'store/reducers/money';

// project import
import MainCard from 'components/MainCard';
import { useState, useEffect, useRef } from 'react';
import IncomeAreaChart from 'pages/dashboard/IncomeAreaChart';
// import MonthlyBarChart from 'pages/dashboard/MonthlyBarChart';
import { EyeOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';


// ==============================|| COMPONENTS - TYPOGRAPHY ||============================== //

const DashboardDefault = () => {
    const { interestAccounts } = useSelector((state) => state.money.data);
    const fullHeight = 'calc(100vh - 210px)';
    const GraphCardRef = useRef(null);
    const [GraphCardSize, setGraphCardSize] = useState(['100%', '100%'])
    useEffect(() => {
        const handleResize = () => {
            setGraphCardSize(GraphCardRef.current ? [
                GraphCardRef.current.offsetWidth - 30,
                GraphCardRef.current.offsetHeight - 10
            ] : ['100%', '100%'])
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [GraphCardRef?.current?.offsetWidth])

    const interestAccountsPlot = Object.values((interestAccounts || {})).reduce((prevSeries, intAcc) =>
        [...prevSeries, intAcc], [])
    const extraPlot = [
        { id: 'total', accountName: 'Total' },
        { id: 'inflation', accountName: 'Inflación' }
    ];
    const [checked, setChecked] = useState([...interestAccountsPlot, ...extraPlot].reduce((prevSeries, intAcc, index) =>
        ({ ...prevSeries, [intAcc.id]: (!index) ? true : false }), {}))

    const checkAll = () => {
        setChecked(lv =>
            Object.keys(lv).reduce((allValues, lvKey) => ({ ...allValues, [lvKey]: true }), {})
        )
    }

    const checkOnlyOne = (intAccId) => {
        setChecked(lv => {
            const negativeValues = Object.keys(lv).reduce((allValues, lvKey) => ({ ...allValues, [lvKey]: false }), {})
            return { ...negativeValues, [intAccId]: true }
        })
    }

    const [value, setValue] = useState(12);
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

    return (
        <Grid container columnSpacing={2.75} rowSpacing={4} >
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
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
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
                        ammountPeriods={value}
                        checked={checked}
                        showOnlyInterest={showOnlyInterest}
                        width={GraphCardSize[0]} height={GraphCardSize[1]} />
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
                                                color={Object.keys(checked).every(c => checked[c] === true) ? 'primary' : 'secondary'}
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
                                                        checked={!!checked[extraAcc.id]}
                                                        sx={{ p: 2, pl: 2, ml: 2 }}
                                                        onChange={(event) => setChecked(lv => ({ ...lv, [extraAcc.id]: event.target.checked }))}
                                                        name={extraAcc.id}
                                                        color="primary"
                                                        size="small"
                                                    />
                                                }
                                                label={<Typography variant="h6">{extraAcc.accountName}</Typography>}
                                            />
                                            <IconButton
                                                sx={{ fontSize: '0.875rem', pr: 4, pl: 4 }}
                                                size="medium"
                                                color={checked[extraAcc.id] ? 'primary' : 'secondary'}
                                                onClick={() => checkOnlyOne(extraAcc.id)}
                                            >
                                                <EyeOutlined />
                                            </IconButton>
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
                                                        checked={checked[intAcc.id]}
                                                        sx={{ p: 1.5, ml: 2.5 }}
                                                        onChange={(event) => setChecked(lv => ({ ...lv, [intAcc.id]: event.target.checked }))}
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
                                                color={checked[intAcc.id] ? 'primary' : 'secondary'}
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
        </Grid>
    );
};

export default DashboardDefault;
