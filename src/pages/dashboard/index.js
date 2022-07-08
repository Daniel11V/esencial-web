// import { activeItem } from 'store/reducers/money';
import { Divider, Grid, Stack, Typography, Button, Box, TextField, MenuItem, Checkbox, FormControlLabel, IconButton, List, Icon } from '@mui/material';
import { EyeOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import IncomeAreaChart from 'pages/dashboard/IncomeAreaChart';
import IncomeTable from './IncomeTable';

import { useContext } from 'react';
import DashboardContext from 'context/DashboardContext';

import useFullParentSize from 'hooks/useFullParentSize';


// ==============================|| COMPONENTS - TYPOGRAPHY ||============================== //

const DashboardDefault = () => {
    const {
        slot = 0, setSlot,
        selectedAmountPeriods = 12, setSelectedAmountPeriods,
        showOnlyInterest = false, setShowOnlyInterest,

        selectableAccounts,
        extraInfoData,
        accountChecked, setAccountChecked,
        extraInfoChecked, setExtraInfoChecked,

        checkAll, checkOnlyOne,
    } = useContext(DashboardContext)

    const selectedAmountPeriodsOptions = [
        { value: 12, label: '1 Año' },
        { value: 24, label: '2 Años' },
        { value: 72, label: '6 Años' }
    ];

    const fullHeight = 'calc(60vh)';
    const [graphCardWidth, graphCardHeight, graphCardRef] = useFullParentSize()

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
                                value={selectedAmountPeriods}
                                onChange={(e) => setSelectedAmountPeriods(e.target.value)}
                                sx={{ '& .MuiInputBase-input': { py: 0.5, fontSize: '0.875rem' } }}
                            >
                                {selectedAmountPeriodsOptions?.map((option) => (
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
                <MainCard ref={graphCardRef} content={false} sx={{ mt: 1.5, pt: 1, pr: 2, pl: 1, height: fullHeight }}>
                    {/* <IncomeAreaChart width={graphCardWidth} height={graphCardHeight} /> */}
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
                                        {/* <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: "100%" }}>
                                            <Typography variant="h6" color="textPrimary">
                                                Ver todas las cuentas
                                            </Typography>
                                            <IconButton
                                                sx={{ fontSize: '0.875rem', p: 0, m: 0 }}
                                                size="medium"
                                                color={Object.keys(accountChecked).every(c => accountChecked[c] === true) ? 'primary' : 'secondary'}
                                            >
                                                <EyeOutlined />
                                            </IconButton>
                                        </Stack> */}
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: "100%", p: 1, pl: 0, pr: 1.4 }}>
                                            <Typography variant="h6" color="textPrimary">
                                                Ver todas las cuentas
                                            </Typography>
                                            <EyeOutlined
                                                sx={{ fontSize: '0.875rem' }}
                                                size="medium"
                                                color={Object.keys(accountChecked || {}).every(c => accountChecked[c] === true) ? 'primary' : 'secondary'}
                                            />
                                        </Stack>
                                    </Button>
                                </Grid>
                                {extraInfoData?.map(extraAcc => (
                                    <Grid item xs={12} sx={{ mt: -1, p: 0, }} key={extraAcc?.accInfo?.creationDate}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={!!extraInfoChecked[extraAcc?.accInfo?.creationDate]}
                                                        sx={{ p: 2, pl: 2, ml: 2 }}
                                                        onChange={(event) => setExtraInfoChecked(lv => ({ ...lv, [extraAcc?.accInfo?.creationDate]: event.target.checked }))}
                                                        name={extraAcc?.accInfo?.creationDate}
                                                        color="primary"
                                                        size="small"
                                                    />
                                                }
                                                label={<Typography variant="h6">{extraAcc?.accInfo?.accountName}</Typography>}
                                            />
                                            {!extraAcc?.params?.cantOnlySeeThis && (
                                                <IconButton
                                                    sx={{ fontSize: '0.875rem', pr: 4, pl: 4 }}
                                                    size="medium"
                                                    color={extraInfoChecked[extraAcc?.accInfo?.creationDate] ? 'primary' : 'secondary'}
                                                    onClick={() => checkOnlyOne(extraAcc?.accInfo?.creationDate)}
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
                                {selectableAccounts?.map(intAcc => (
                                    <Grid item xs={12} key={intAcc?.creationDate} >
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={accountChecked[intAcc?.creationDate]}
                                                        sx={{ p: 1.5, ml: 2.5 }}
                                                        onChange={(event) => setAccountChecked(lv => ({ ...lv, [intAcc?.creationDate]: event.target.checked }))}
                                                        name={String(intAcc?.creationDate)}
                                                        color="primary"
                                                        size="small"
                                                    />
                                                }
                                                label={<Typography variant="h6">{intAcc?.accountName}</Typography>}
                                            />
                                            <IconButton
                                                sx={{ fontSize: '0.875rem', pr: 4, pl: 4 }}
                                                size="medium"
                                                color={accountChecked[intAcc?.creationDate] ? 'primary' : 'secondary'}
                                                onClick={() => checkOnlyOne(intAcc?.creationDate)}
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
                <IncomeTable />
            </Grid>
        </Grid>
    );
};

export default DashboardDefault;
