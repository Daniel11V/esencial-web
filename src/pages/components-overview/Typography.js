// material-ui
import { Breadcrumbs, Divider, Grid, Stack, Typography, Button, Box, TextField, MenuItem } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { activeItem } from 'store/reducers/money';

// project import
import ComponentSkeleton from './ComponentSkeleton';
import MainCard from 'components/MainCard';
import ListIncomesCard from 'components/ListIncomesCard';
import { useState } from 'react';
import IncomeAreaChart from 'pages/dashboard/IncomeAreaChart';
import MonthlyBarChart from 'pages/dashboard/MonthlyBarChart';


// ==============================|| COMPONENTS - TYPOGRAPHY ||============================== //

const ComponentTypography = () => {
    const { periodicOperations, interestAccounts, mainCurrency, currencies } = useSelector((state) => state.money);
    const periodicIncomes = periodicOperations.filter((perOper) => perOper.type === 'INCOME');
    const totalMonthlyIncome = periodicIncomes.reduce((sum, perInc) => sum + perInc.initialAmmount, 0);
    const [value, setValue] = useState(12);
    const status = [
        {
            value: 12,
            label: '1 Year'
        },
        {
            value: 24,
            label: '2 Years'
        },
        {
            value: 72,
            label: '6 Years'
        }
    ];
    const [slot, setSlot] = useState('FUTURE');


    const formatNum = (x) => x.toString().replace(".", ",").replace(/\B(?<!\,\d*)(?=(\d{3})+(?!\d))/g, ".");

    return (
        <ComponentSkeleton>
            <Grid container rowSpacing={4.5} columnSpacing={2.75}>
                {/* row 2 */}
                <Grid item xs={12} md={8} lg={10}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Typography variant="h5">Unique Visitor</Typography>
                        </Grid>
                        <Grid item>
                            <Stack direction="row" alignItems="center" spacing={0}>
                                <Button
                                    size="small"
                                    onClick={() => setSlot('PAST')}
                                    color={slot === 'PAST' ? 'primary' : 'secondary'}
                                    variant={slot === 'PAST' ? 'outlined' : 'text'}
                                >
                                    Pasado
                                </Button>
                                <Button
                                    size="small"
                                    onClick={() => setSlot('FUTURE')}
                                    color={slot === 'FUTURE' ? 'primary' : 'secondary'}
                                    variant={slot === 'FUTURE' ? 'outlined' : 'text'}
                                >
                                    Futuro
                                </Button>
                                <TextField
                                    id="standard-select-currency"
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
                            </Stack>
                        </Grid>
                    </Grid>
                    <MainCard content={false} sx={{ mt: 1.5 }}>
                        <Box sx={{ pt: 1, pr: 2 }}>
                            <IncomeAreaChart slot={slot} ammountPeriods={value} interestAccounts={interestAccounts} />
                        </Box>
                    </MainCard>
                </Grid>
                <Grid item xs={12} md={4} lg={2}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Typography variant="h5">Income Overview</Typography>
                        </Grid>
                        <Grid item />
                    </Grid>
                    <MainCard sx={{ mt: 2 }} content={false}>
                        <Box sx={{ p: 3, pb: 0 }}>
                            <Stack spacing={2}>
                                <Typography variant="h6" color="textSecondary">
                                    This Week Statistics
                                </Typography>
                                <Typography variant="h3">$7,650</Typography>
                            </Stack>
                        </Box>
                        <MonthlyBarChart />
                    </MainCard>
                </Grid>
                <Grid item xs={12} lg={6}>
                    <Stack spacing={3}>
                        <ListIncomesCard title={`Ingresos Recurrentes Mensuales: $${totalMonthlyIncome}`} codeHighlight>
                            <Stack spacing={2}>
                                {periodicIncomes?.map((perInc, index) => (
                                    <>
                                        {!!index && <Divider />}
                                        <Typography variant="h3">{perInc.title}</Typography>
                                        <Breadcrumbs aria-label="breadcrumb">
                                            <Typography variant="h6">Cuenta: {perInc.accountName}</Typography>
                                            <Typography variant="h6">
                                                Monto: ${formatNum(perInc.initialAmmount)} {perInc.currencyName}
                                            </Typography>
                                            <Typography variant="h6">Cada: {perInc.termInDays} días</Typography>
                                        </Breadcrumbs>
                                    </>
                                ))}
                            </Stack>
                        </ListIncomesCard>
                    </Stack>
                </Grid>
                <Grid item xs={12} lg={6}>
                    <Stack spacing={3}>
                        <ListIncomesCard title={`Cuentas con Intereses`} codeHighlight>
                            <Stack spacing={2}>
                                {interestAccounts?.map((intAcc, index) => (
                                    <>
                                        {!!index && <Divider />}
                                        <Typography variant="h3">{intAcc.accountName}</Typography>
                                        <Breadcrumbs aria-label="breadcrumb">
                                            <Typography variant="h6">TNA: {formatNum(intAcc.TNA * 100)}%</Typography>
                                            <Typography variant="h6">Moneda: {intAcc.currencyName}</Typography>
                                            <Typography variant="h6">Plazo: {intAcc.termInDays} días</Typography>
                                            <Typography variant="h6">
                                                Capital inicial:
                                                {intAcc.currencyName === mainCurrency
                                                    ? ` $${formatNum(intAcc.initialAmmount)}`
                                                    : ` ${formatNum(intAcc.initialAmmount)} ${intAcc.currencyName} ($${formatNum(intAcc.initialAmmount * currencies[intAcc.currencyName].actualValue)
                                                    })`}
                                            </Typography>
                                            {!!intAcc.periodicAdd &&
                                                <Typography variant="h6">Agrego por plazo:
                                                    {intAcc.currencyName === mainCurrency
                                                        ? ` $${formatNum(intAcc.periodicAdd)}`
                                                        : ` ${formatNum(intAcc.periodicAdd)} ${intAcc.currencyName} ($${formatNum(intAcc.periodicAdd * currencies[intAcc.currencyName].actualValue)
                                                        })`}
                                                </Typography>
                                            }
                                        </Breadcrumbs>
                                    </>
                                ))}
                            </Stack>
                        </ListIncomesCard>
                    </Stack>
                </Grid>
            </Grid>
        </ComponentSkeleton>
    );
};

export default ComponentTypography;
