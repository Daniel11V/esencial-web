import { useEffect, useState } from 'react'
import useTableData from 'hooks/useTableData';

import {
    TableSortLabel,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Toolbar,
    Typography,
    ButtonBase,
    // Switch,
    IconButton,
    Tooltip,
    Breadcrumbs,
    Collapse,
    FormControlLabel,
    Button,
    // TextField,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    FormHelperText,
    InputAdornment,
    ToggleButtonGroup,
    Switch,
    ToggleButton,
    Stack,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    Card,
    CardHeader,
    CardContent,
    Divider,
} from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { DownOutlined, UpOutlined, EditOutlined } from '@ant-design/icons';
import { visuallyHidden } from '@mui/utils';
import { formatNum, formatDate } from 'utils/utils';
import useCurrency from 'hooks/useCurrency';
import { useTheme } from '@mui/material/styles';

const AccountForm = ({ editingAccount, setEditingAccount, saveAccount }) => {
    const { currencies, showCurrency, getCurrencyTranslation, formatCurrencyAmount } = useCurrency();
    const [hasInterests, setHasInterests] = useState(false);
    useEffect(() => { setHasInterests(editingAccount?.TNA !== 0) }, [])
    const [inputCurrency, setInputCurrency] = useState(showCurrency);
    const [interestSimbol, setInterestSimbol] = useState("TNA");
    const [initialCapital, setInitialCapital] = useState("")

    // console.log("ACA editingAccount", editingAccount)
    const handleChange = (e, fieldId) => {
        setEditingAccount(lastEditing => ({ ...lastEditing, [fieldId]: e?.target?.value }))
    }

    const handleChangeAccountCurrency = (e) => {
        handleChange(e, 'currency');
        handleChangeCurrency(e)
    }

    const handleChangeCurrency = (e) => {
        handleChange({
            target: {
                value:
                    formatCurrencyAmount(editingAccount?.periodicAdd, e.target.value, inputCurrency)
            }
        }, 'periodicAdd')
        setInitialCapital(formatCurrencyAmount(initialCapital, e.target.value, inputCurrency))
        setInputCurrency(e.target.value);
    }

    const interests = [
        {
            key: 'TNA',
            label: 'Tasa Nominal Anual',
            func: (tna) => tna,
            backToTNA: (tna) => tna,
        },
        {
            key: 'TNM',
            label: 'Tasa Nominal Mensual',
            func: (tna) => tna / 12,
            backToTNA: (tnm) => tnm * 12,
        },
        {
            key: 'TEA',
            label: 'Tasa Efectiva Anual',
            func: (tna) => Math.pow(1 + (tna / (360 / editingAccount?.termInDays)), 360 / editingAccount?.termInDays) - 1,
            backToTNA: (tea) => Math.pow(tea + 1, 1 / (360 / editingAccount?.termInDays)) - 1,
        },
        {
            key: 'TEM',
            label: 'Tasa Efectiva Mensual',
            func: (tna) => (Math.pow(1 + (tna / (360 / editingAccount?.termInDays)), 360 / editingAccount?.termInDays) - 1) / 12,
            backToTNA: (tem) => Math.pow(tem * 12 + 1, 1 / (360 / editingAccount?.termInDays)) - 1,
        },
    ]

    const getInterest = (key) => interests.find(int => int.key === key)

    const getInterestTranslation = (e) => {
        const actualTNA = getInterest(e?.target?.value)?.backToTNA(editingAccount?.TNA)
        handleChange({
            target: {
                value: getInterest(e?.target?.value)?.func(actualTNA)
            }
        }, 'TNA')
        setInterestSimbol(e?.target?.value);
    }

    const someFormattedValues = {
        periodicAdd: formatCurrencyAmount(editingAccount?.periodicAdd, showCurrency, inputCurrency),
        TNA: getInterest(interestSimbol)?.backToTNA(editingAccount?.TNA) / 100
    }

    return (
        <Dialog open={!!editingAccount?.creationDate}>
            <DialogTitle sx={{ fontSize: '21px' }}> Editar Cuenta </DialogTitle>
            <DialogContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: "100%", mt: 2 }}>
                    <MobileDatePicker
                        value={editingAccount?.initialDate || editingAccount?.creationDate}
                        onChange={(e) => handleChange(e, 'initialDate')}
                        inputFormat="DD/MM/yyyy"
                        label="Fecha de creación"
                        renderInput={(params) => <TextField {...params} fullWidth />} />
                    <TextField
                        value={editingAccount?.wallet}
                        onChange={(e) => handleChange(e, 'wallet')}
                        fullWidth
                        sx={{ ml: 2, mr: 2 }}
                        label="Billetera de la cuenta" />
                    <FormControl fullWidth>
                        <InputLabel id="editAcc-selectCurrency-label">Moneda de la cuenta</InputLabel>
                        <Select
                            labelId={'editAcc-selectCurrency-label'}
                            value={editingAccount?.currency || showCurrency}
                            onChange={(e) => handleChangeAccountCurrency(e)}
                        // sx={{ height: 45 }}
                        >
                            {currencies.map(curr => (
                                <MenuItem key={curr.name} value={curr.name}>{curr.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>
                <TextField
                    value={editingAccount?.accountName}
                    onChange={(e) => handleChange(e, 'accountName')}
                    sx={{ mt: 4 }}
                    fullWidth
                    label="Nombre de la cuenta" />
                <TextField
                    value={editingAccount?.description}
                    onChange={(e) => handleChange(e, 'description')}
                    sx={{ mt: 4 }}
                    fullWidth
                    label="Descripción" />
                {!!editingAccount?.isNewAccount && (
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: "100%", mt: 4 }}>
                        <FormControl fullWidth>
                            <TextField
                                value={initialCapital}
                                onChange={(e) => setInitialCapital(e.target.value)}
                                sx={{ '& .MuiInputBase-root': { borderBottomRightRadius: 0, borderTopRightRadius: 0, height: 45 } }}
                                fullWidth
                                label="Capital inicial" />
                            <FormHelperText sx={{ height: 21 }}>{getCurrencyTranslation(editingAccount?.periodicAdd, inputCurrency)}</FormHelperText>
                        </FormControl>
                        <Select
                            value={inputCurrency}
                            onChange={handleChangeCurrency}
                            sx={{ mb: 3, height: 45, borderBottomLeftRadius: 0, borderTopLeftRadius: 0 }}
                        >
                            {currencies.map(curr => (
                                <MenuItem key={curr.name} value={curr.name}>{curr.name}</MenuItem>
                            ))}
                        </Select>
                    </Stack>
                )}
                <FormControlLabel sx={{ mt: 2 }}
                    control={(
                        <Switch checked={hasInterests}
                            onChange={() => setHasInterests(lv => !lv)}
                            inputProps={{ 'aria-label': 'controlled' }} />
                    )}
                    label="Cuenta con intereses" />
                <Collapse in={hasInterests} timeout="auto" unmountOnExit>
                    <Stack direction="row" alignItems="center" sx={{ width: "100%", mt: 2 }}>
                        <TextField
                            value={editingAccount?.termInDays}
                            onChange={(e) => handleChange(e, 'termInDays')}
                            fullWidth
                            sx={{ '& .MuiInputBase-root': { height: 45, mb: 3 } }}
                            InputProps={{
                                endAdornment: <InputAdornment position={'end'}>{'días'}</InputAdornment>,
                            }}
                            label="Plazo estimado" />
                        <FormControl fullWidth sx={{ ml: 2 }}>
                            <TextField
                                value={editingAccount?.TNA}
                                onChange={(e) => handleChange(e, 'TNA')}
                                sx={{ '& .MuiInputBase-root': { borderBottomRightRadius: 0, borderTopRightRadius: 0, borderRightWidth: 0, height: 45 } }}
                                InputProps={{
                                    endAdornment: <InputAdornment position={'end'}>{'%'}</InputAdornment>,
                                }}
                                label="Rendimiento" />
                            <FormHelperText sx={{ height: 21 }}>{interests.find(int => int.key === interestSimbol)?.label}</FormHelperText>
                        </FormControl>
                        <Select
                            value={interestSimbol}
                            onChange={getInterestTranslation}
                            sx={{ mb: 3, mr: 2, height: 45, borderBottomLeftRadius: 0, borderTopLeftRadius: 0 }}
                        >
                            {/* <MenuItem key={'TNA'} value={'TNA'}>{'TNA'}</MenuItem> */}
                            {interests.map(int => (
                                <MenuItem key={int.key} value={int.key}>{int.key}</MenuItem>
                            ))}
                        </Select>
                        {/* <Stack direction="row" alignItems="center" sx={{ width: "100%" }}>
                        </Stack> */}
                        <FormControl fullWidth>
                            <TextField
                                value={editingAccount?.periodicAdd}
                                onChange={(e) => handleChange(e, 'periodicAdd')}
                                sx={{ '& .MuiInputBase-root': { borderBottomRightRadius: 0, borderTopRightRadius: 0, height: 45 } }}
                                fullWidth
                                // InputProps={{
                                //     startAdornment: <InputAdornment position={'start'}>{'$ '}</InputAdornment>,
                                // }}
                                label="Añadir cada plazo" />
                            <FormHelperText sx={{ height: 21 }}>{getCurrencyTranslation(editingAccount?.periodicAdd, inputCurrency)}</FormHelperText>
                        </FormControl>
                        <Select
                            value={inputCurrency}
                            onChange={handleChangeCurrency}
                            sx={{ mb: 3, height: 45, borderBottomLeftRadius: 0, borderTopLeftRadius: 0 }}
                        >
                            {currencies.map(curr => (
                                <MenuItem key={curr.name} value={curr.name}>{curr.name}</MenuItem>
                            ))}
                        </Select>

                    </Stack>
                </Collapse>
            </DialogContent>
            <DialogActions sx={{ pt: 0 }} >
                <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ mr: 2, mb: 1 }}>
                    <Button onClick={() => setEditingAccount({})}>CANCELAR</Button>
                    <Button onClick={() => saveAccount(someFormattedValues, initialCapital, hasInterests)} variant="contained">GUARDAR</Button>
                </Stack>
            </DialogActions>
        </Dialog>
    )
}


const OperationForm = ({ editingOperation, setEditingOperation, saveOperation }) => {
    const { currencies, showCurrency, getCurrencyTranslation, formatCurrencyAmount } = useCurrency();
    const [amountToShow, setAmountToShow] = useState('AMOUNT');
    const [inputCurrency, setInputCurrency] = useState(showCurrency);

    const handleChange = (e, fieldId) => {
        setEditingOperation(lastEditing => (fieldId === 'finalDate')
            ? ({ ...lastEditing, finalDate: e?.['_d'].getTime() })
            : ({ ...lastEditing, [fieldId]: e?.target?.value }))
    }

    const handleChangeCurrency = (e) => {
        handleChange({
            target: {
                value:
                    formatCurrencyAmount(editingOperation?.amount, e.target.value, inputCurrency)
            }
        }, 'amount')
        handleChange({
            target: {
                value:
                    formatCurrencyAmount(editingOperation?.totalAmount, e.target.value, inputCurrency)
            }
        }, 'totalAmount')
        setInputCurrency(e.target.value);
    }

    const newAmountValue = (amountToShow === 'AMOUNT') ? ({
        amount: formatCurrencyAmount(editingOperation?.amount, showCurrency, inputCurrency)
    }) : ({
        totalAmount: formatCurrencyAmount(editingOperation?.totalAmount, showCurrency, inputCurrency)
    })

    return (
        <Dialog open={!!editingOperation?.finalDate}>
            <DialogTitle sx={{ fontSize: '21px' }}>
                Editar Operación
            </DialogTitle>
            <DialogContent>
                {/* <DialogContentText>
                        Se han encontrado datos guardados en el dispositivo. Si desea
                        accederlos ingrese el Pin de Seguridad.
                    </DialogContentText> */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: "100%", mt: 2 }}>
                    <MobileDatePicker
                        value={editingOperation?.finalDate}
                        onChange={(e) => handleChange(e, 'finalDate')}
                        inputFormat="DD/MM/yyyy"
                        label="Fin de la operación"
                        renderInput={(params) => <TextField {...params} />} />
                    <FormControl fullWidth sx={{ ml: 2 }}>
                        <InputLabel id="editOper-selectOperType-label">Tipo de operación</InputLabel>
                        <Select
                            id={'editOper-selectOperType'}
                            labelId={'editOper-selectOperType-label'}
                            value={editingOperation?.operType}
                            onChange={(e) => handleChange(e, 'operType')}
                        // label="Tipo de operación"
                        >
                            <MenuItem value={"CREATION"}>Monto inicial de cuenta</MenuItem>
                            <MenuItem value={"INTEREST"}>Rendimiento</MenuItem>
                            <MenuItem value={"INCOME"}>Ingreso</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
                <TextField
                    value={editingOperation?.title}
                    onChange={(e) => handleChange(e, 'title')}
                    sx={{ mt: 4 }}
                    fullWidth
                    label="Titulo" />
                <TextField
                    value={editingOperation?.description}
                    onChange={(e) => handleChange(e, 'description')}
                    sx={{ mt: 4 }}
                    fullWidth
                    placeholder="Opcional"
                    label="Descripción" />
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: "100%", mt: 4 }}>
                    <ToggleButtonGroup
                        color="primary"
                        value={amountToShow}
                        exclusive
                        sx={{ flexShrink: 0, mb: 3, mr: 2, height: 45 }}
                        onChange={e => setAmountToShow(e.target.value)}
                    >
                        <ToggleButton value={'AMOUNT'} sx={{ py: '8px', borderColor: '#d9d9d9' }}>Monto</ToggleButton>
                        <ToggleButton value={'TOTAL_AMOUNT'} sx={{ py: '8px', borderColor: '#d9d9d9' }}>Capital final</ToggleButton>
                    </ToggleButtonGroup>
                    <FormControl >
                        {amountToShow === 'AMOUNT' ? (
                            <TextField
                                value={editingOperation?.amount}
                                onChange={(e) => handleChange(e, 'amount')}
                                sx={{ '& .MuiInputBase-root': { borderBottomRightRadius: 0, borderTopRightRadius: 0, height: 45 } }}
                                fullWidth label="Monto" />
                        ) : (
                            <TextField
                                value={editingOperation?.totalAmount}
                                onChange={(e) => handleChange(e, 'totalAmount')}
                                sx={{ height: 45, '& .MuiInputBase-root': { borderBottomRightRadius: 0, borderTopRightRadius: 0, height: 45 } }}
                                fullWidth
                                // InputProps={{
                                //     startAdornment: <InputAdornment position={'start'}>{'$ '}</InputAdornment>,
                                // }}
                                label="Capital final" />
                        )}
                        <FormHelperText sx={{ height: 20 }}>{getCurrencyTranslation((amountToShow === 'AMOUNT' ? editingOperation?.amount : editingOperation?.totalAmount), inputCurrency)}</FormHelperText>
                    </FormControl>
                    <Select
                        value={inputCurrency}
                        onChange={handleChangeCurrency}
                        sx={{ mb: 3, height: 45, borderBottomLeftRadius: 0, borderTopLeftRadius: 0 }}
                    >
                        {currencies.map(curr => (
                            <MenuItem key={curr.name} value={curr.name}>{curr.name}</MenuItem>
                        ))}
                    </Select>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ pt: 0 }} >
                <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ mr: 2, mb: 1 }}>
                    <Button onClick={() => setEditingOperation({})}>CANCELAR</Button>
                    <Button onClick={() => saveOperation(newAmountValue)} variant="contained">GUARDAR</Button>
                </Stack>
            </DialogActions>
        </Dialog>
    )
}
const IncomeTableRow = ({ oper, setEditingOperation }) => {
    const { CurrencyComponent } = useCurrency();

    const [openDetails, setOpenDetails] = useState(false)

    const formattedValues = {
        finalDate: oper?.finalDate ? formatDate(oper?.finalDate) : "  -  ",
        title: oper?.title,
        dif: oper?.amount ? formatNum(oper?.amount) : "0",
        difPerc: oper?.percAmount ? formatNum(oper?.percAmount) : "  -  ",
        finalAmount: oper?.totalAmount ? formatNum(oper?.totalAmount) : "0",

        initialDate: oper?.initialDate ? formatDate(oper?.initialDate) : "  -  ",
        termInDays: oper?.days ? oper?.days : "  -  ",
    }

    const isFuture = oper?.operType === "FUTURE_INTEREST" || oper?.operType === "FUTURE_INCOME";

    return (
        <>
            <TableRow
                hover
                tabIndex={-1}
                sx={isFuture ? { fontStyle: 'italic' } : {}}
            >
                <TableCell sx={{ p: 0, pl: 1 }}>
                    <IconButton
                        aria-label="expand oper"
                        size="small"
                        onClick={() => setOpenDetails(lV => !lV)}
                    >
                        {openDetails ? <UpOutlined /> : <DownOutlined />}
                    </IconButton>
                </TableCell>
                <TableCell sx={{ p: 0, pl: 2 }} >
                    <span>{formattedValues['finalDate']}</span>
                    {/* <TextField
                        value={formattedValues['finalDate']}
                        sx={cellFieldStyle}
                        focused={false}
                        // focused={isEditingCell(operId, 'finalDate')}
                        // onClick={() => !isFuture && onClickCell(operId, 'finalDate')}
                        // onChange={(e) => handleChangeCell(operId, 'finalDate', e.target.value)}
                        InputProps={{
                            readOnly: true,
                        }} /> */}
                </TableCell>
                <TableCell sx={{ p: 0, pl: 1.5 }}>
                    <span>{formattedValues['title']}</span>
                    {/* <TextField
                        value={formattedValues['title']}
                        sx={cellFieldStyle}
                        focused={false}
                        // focused={isEditingCell(operId, 'title')}
                        // onClick={() => !isFuture && onClickCell(operId, 'title')}
                        // onChange={(e) => handleChangeCell(operId, 'title', e.target.value)}
                        InputProps={{
                            readOnly: true,
                        }} /> */}
                </TableCell>
                <TableCell sx={{ p: 0, pl: 1.5 }}>
                    {/* <TextField
                        value={formattedValues['dif']}
                        sx={{ ...cellFieldStyle, width: ((oper?.amount + "").length * 1.3 + 'ch') }}
                        focused={false}
                        // focused={isEditingCell(operId, 'dif')}
                        // onClick={() => !isFuture && onClickCell(operId, 'dif')}
                        // onChange={(e) => handleChangeCell(operId, 'dif', e.target.value)}
                        InputProps={{
                            readOnly: true,
                            startAdornment: <InputAdornment position="start" sx={{ mr: 0 }}>{getCurrencySimbol()}</InputAdornment>,
                            endAdornment: <InputAdornment position="end" sx={{ ml: 0 }}>{getCurrencyTranslation(oper?.amount)}</InputAdornment>,
                        }} /> */}
                    <CurrencyComponent num={oper?.amount || "0"} />
                </TableCell>
                <TableCell sx={{ p: 0, pl: 1.5 }}>
                    <span>{formattedValues['difPerc']}</span>
                    {formattedValues['difPerc'] !== "  -  " && (
                        <span style={{ color: '#8c8c8c', paddingLeft: 10 }}>%</span>
                    )}
                    {/* <TextField
                        value={formattedValues['difPerc']}
                        sx={{ ...cellFieldStyle, width: '11ch' }}
                        focused={false}
                        // focused={isEditingCell(operId, 'difPerc')}
                        // onClick={() => !isFuture && onClickCell(operId, 'difPerc')}
                        // onChange={(e) => handleChangeCell(operId, 'difPerc', e.target.value)}
                        InputProps={{
                            readOnly: true,
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }} /> */}
                </TableCell>
                <TableCell sx={{ p: 0, pl: 1.5 }}>
                    {/* <TextField
                        value={formattedValues['finalAmount']}
                        sx={{ ...cellFieldStyle, width: '11ch' }}
                        focused={false}
                        // focused={isEditingCell(operId, 'finalAmount')}
                        // onClick={() => !isFuture && onClickCell(operId, 'finalAmount')}
                        // onChange={(e) => handleChangeCell(operId, 'finalAmount', e.target.value)}
                        InputProps={{
                            readOnly: true,
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }} /> */}
                    <CurrencyComponent num={oper?.totalAmount || "0"} />
                </TableCell>
                <TableCell sx={{ p: 0, pl: 1.5, pr: 0.5 }} align="right">
                    {!isFuture && (
                        <Tooltip title="Editar">
                            <IconButton onClick={() => setEditingOperation(oper)} >
                                <EditOutlined />
                            </IconButton>
                        </Tooltip>
                    )}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                    <Collapse in={openDetails} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                History
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Customer</TableCell>
                                        <TableCell align="right">Amount</TableCell>
                                        <TableCell align="right">Total price ($)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {/* {oper.history.map((historyRow) => (
                                            <TableRow key={historyRow.date}>
                                                <TableCell component="th" scope="oper">
                                                    {historyRow.date}
                                                </TableCell>
                                                <TableCell>{historyRow.customerId}</TableCell>
                                                <TableCell align="right">{historyRow.amount}</TableCell>
                                                <TableCell align="right">
                                                    {Math.round(historyRow.amount * oper.price * 100) / 100}
                                                </TableCell>
                                            </TableRow>
                                        ))} */}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    )
}


const IncomeTable = () => {
    const {
        accountData, tableData,

        stableSort, getComparator,

        order, orderBy, page, rowsPerPage,
        emptyRows, handleChangePage, handleChangeRowsPerPage,

        headCells, createSortHandler,

        handleNewAccount, handleNewOperation,

        editingOperation, setEditingOperation, saveOperation,
        editingAccount, setEditingAccount, saveAccount,
    } = useTableData()
    const { formatCurrency } = useCurrency();
    const theme = useTheme();

    return (
        <Card
            elevation={0}
            sx={{
                width: '100%', mb: 2,
                border: '1px solid',
                borderRadius: 2,
                borderColor: theme.palette.grey.A800,
                '& pre': {
                    m: 0,
                    p: '16px !important',
                    fontFamily: theme.typography.fontFamily,
                    fontSize: '0.75rem'
                }
            }} >
            <CardHeader sx={{
                p: 0, pl: 2,
                '& .MuiCardHeader-action': { m: '0px auto', alignSelf: 'center' }
            }} title={(
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: "100%" }}>
                    <Typography variant="subtitle1" sx={{ mb: -0.5 }}>Cuenta Seleccionada</Typography>
                    <ButtonBase sx={{ p: 2 }} onClick={handleNewAccount} >
                        <Typography sx={{ color: "#1890FF", mb: -0.3, fontWeight: 'bold', textDecoration: 'underline' }}>Nueva cuenta</Typography>
                    </ButtonBase>
                </Stack>
            )} />
            <Divider />
            <CardContent style={{ padding: 0 }}>
                <Toolbar
                    sx={{
                        pl: { sm: 2 },
                        pr: { xs: 1, sm: 1 },
                        // ...(editing?.length > 0 && {
                        //     bgcolor: (theme) =>
                        //         alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                        // }),
                    }}
                >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: "100%", pt: 1 }}>
                        <Stack>
                            <Stack direction="row" justifyContent="start" alignItems="center" spacing={3}>
                                <Typography variant="h3">{accountData?.accountName}</Typography>
                                <Tooltip title="Editar">
                                    <IconButton onClick={() => setEditingAccount({ ...accountData, TNA: accountData?.TNA * 100 })} >
                                        <EditOutlined />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                            <Breadcrumbs aria-label="breadcrumb">
                                <Typography variant="h6">TNA: {formatNum(accountData?.TNA * 100)}%</Typography>
                                <Typography variant="h6">Moneda: {accountData?.currency}</Typography>
                                <Typography variant="h6">Plazo: {accountData?.termInDays} días</Typography>
                                {!!accountData?.periodicAdd &&
                                    <Typography variant="h6">
                                        Agrego por plazo: {formatCurrency(accountData?.periodicAdd)}
                                    </Typography>
                                }
                            </Breadcrumbs>
                        </Stack>
                        <ButtonBase sx={{ p: 2, mr: -1, mt: -3.5 }} onClick={handleNewOperation} >
                            <Typography sx={{ color: "#1890FF", fontWeight: 'bold', textDecoration: 'underline' }}>Nueva operación</Typography>
                        </ButtonBase>
                    </Stack >
                </Toolbar >
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={'small'}
                    >
                        <TableHead>
                            <TableRow>
                                {/* <TableCell padding="checkbox">
                        <Switch
                            color="primary"
                            indeterminate={editing?.length > 0 && editing?.length < rowCount}
                            checked={rowCount > 0 && editing?.length === rowCount}
                            onChange={handleSelectAllClick}
                            inputProps={{
                                'aria-label': 'select all desserts',
                            }}
                        />
                    </TableCell> */}
                                <TableCell />
                                {headCells.map((headCell) => (
                                    <TableCell
                                        key={headCell.id}
                                        align={headCell.numeric ? 'right' : 'left'}
                                        padding={headCell.disablePadding ? 'none' : 'normal'}
                                        sortDirection={orderBy === headCell.id ? order : false}
                                    >
                                        <TableSortLabel
                                            active={orderBy === headCell.id}
                                            direction={orderBy === headCell.id ? order : 'asc'}
                                            onClick={createSortHandler(headCell.id)}
                                        >
                                            {headCell.label}
                                            {orderBy === headCell.id ? (
                                                <Box component="span" sx={visuallyHidden}>
                                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                </Box>
                                            ) : null}
                                        </TableSortLabel>
                                    </TableCell>
                                ))}
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                account.slice().sort(getComparator(order, orderBy)) */}
                            {stableSort(tableData, getComparator(order, orderBy))
                                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                ?.map((oper) =>
                                    <IncomeTableRow key={oper?.finalDate} oper={oper}
                                        setEditingOperation={setEditingOperation} />
                                )}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 33 * emptyRows }}
                                >
                                    <TableCell colSpan={7} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={tableData?.length || 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                <OperationForm
                    editingOperation={editingOperation}
                    setEditingOperation={setEditingOperation}
                    saveOperation={saveOperation} />
                <AccountForm
                    editingAccount={editingAccount}
                    setEditingAccount={setEditingAccount}
                    saveAccount={saveAccount} />
            </CardContent>
        </Card>
    );
}

export default IncomeTable;