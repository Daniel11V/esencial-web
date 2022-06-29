import { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { alpha } from '@mui/material/styles';
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
    Checkbox,
    IconButton,
    Tooltip,
    Breadcrumbs,
    Collapse,
    Button,
    // TextField,
    TextField,
    InputAdornment,
    OutlinedInput,
    Stack
} from '@mui/material';
import ListIncomesCard from 'components/ListIncomesCard';
import { DeleteOutlined, FilterFilled } from '@ant-design/icons';
import { visuallyHidden } from '@mui/utils';
import { formatDate, formatNum, formatCurrency } from 'utils/utils';
import { DownOutlined, UpOutlined } from '@ant-design/icons';


function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
    // console.log("ACAA", array)
    const stabilizedThis = array?.map((el, index) => [el, index]);
    stabilizedThis?.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis?.map((el) => el[0]);
}

const headCells = [
    // {
    //     id: 'initialDate',
    //     numeric: true,
    //     disablePadding: false,
    //     label: 'Fecha inicial',
    // },
    // {
    //     id: 'days',
    //     numeric: true,
    //     disablePadding: false,
    //     label: 'Plazo (días)',
    // },
    {
        id: 'finalDate',
        numeric: false,
        disablePadding: false,
        label: 'Fecha final',
    },
    {
        id: 'title',
        numeric: false,
        disablePadding: true,
        label: 'Operación',
    },
    // {
    //     id: 'initialAmount',
    //     numeric: true,
    //     disablePadding: false,
    //     label: 'Capital inicial',
    // },
    {
        id: 'dif',
        numeric: false,
        disablePadding: false,
        label: 'Monto',
    },
    {
        id: 'difPorc',
        numeric: false,
        disablePadding: false,
        label: 'Interes',
    },
    {
        id: 'finalAmount',
        numeric: false,
        disablePadding: false,
        label: 'Capital final',
    },
];


// ==============================|| INCOME TABLE ||============================== //
function IncomeTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {/* <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
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
                )
                )}
            </TableRow>
        </TableHead>
    );
}

IncomeTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const IncomeTableToolbar = ({ numSelected, account }) => {
    const saveOper = () => { }

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                // ...(numSelected > 0 && {
                //     bgcolor: (theme) =>
                //         alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                // }),
            }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: "100%", pt: 1 }}>

                {numSelected > 0 ? (
                    // <Typography
                    //     sx={{ flex: '1 1 100%' }}
                    //     color="inherit"
                    //     variant="subtitle1"
                    //     component="div"
                    // >
                    //     {numSelected} selected
                    // </Typography>
                    <Tooltip title="Delete">
                        <IconButton sx={{ backgroundColor: 'red', color: 'white' }}>
                            <DeleteOutlined />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Stack>
                        <Typography variant="h3">{account?.accountName}</Typography>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Typography variant="h6">TNA: {formatNum(account?.TNA * 100)}%</Typography>
                            <Typography variant="h6">Moneda: {account?.currencyName}</Typography>
                            <Typography variant="h6">Plazo: {account?.termInDays} días</Typography>
                            <Typography variant="h6">
                                Capital inicial: {formatCurrency(account?.initialAmount, account?.currencyName)}
                            </Typography>
                            {!!account?.periodicAdd &&
                                <Typography variant="h6">
                                    Agrego por plazo: {formatCurrency(account?.periodicAdd, account?.currencyName)}
                                </Typography>
                            }
                        </Breadcrumbs>
                    </Stack>
                )
                }

                {
                    numSelected > 0 ? (
                        <Button variant="contained"
                            sx={{ backgroundColor: '#4caf50' }}
                            color="success"
                            // endIcon={<BarChartOutlined />} 
                            onClick={saveOper}>
                            Guardar
                        </Button>
                    ) : (
                        <Tooltip title="Filter list">
                            <IconButton>
                                <FilterFilled />
                            </IconButton>
                        </Tooltip>
                    )
                }
            </Stack >
        </Toolbar >
    );
};

IncomeTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

const IncomeTable = ({ accountTableRows, account }) => {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('finalDate');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    console.log("ACA 4", accountTableRows)

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = accountTableRows?.map((n) => n.finalDate);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, finalDate) => {
        const selectedIndex = selected.indexOf(finalDate);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, finalDate);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (finalDate) => selected.indexOf(finalDate) !== -1;

    // Avoid a layout jump when reaching the last page with empty accountTableRows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - accountTableRows?.length) : 0;

    // console.log("ACA IncomeTable", mainCurrency, currencies, account, account?.accountName)

    return (
        <ListIncomesCard title={`Cuentas e Inversiones Seleccionadas`} sx={{ width: '100%', mb: 2 }} contentSX={{ p: 0 }}>
            <IncomeTableToolbar numSelected={selected.length} account={account} />
            <TableContainer>
                <Table
                    sx={{ minWidth: 750 }}
                    aria-labelledby="tableTitle"
                    size={'small'}
                >
                    <IncomeTableHead
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={accountTableRows?.length}
                    />
                    <TableBody>
                        {/* if you don't need to support IE11, you can replace the `stableSort` call with:
            accountTableRows.slice().sort(getComparator(order, orderBy)) */}
                        {stableSort(accountTableRows, getComparator(order, orderBy))
                            ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            ?.map((row, index) => {
                                const isItemSelected = isSelected(row.finalDate);
                                // const labelId = `enhanced-table-checkbox-${index}`;
                                const cellFieldStyle = { m: 0, '& .MuiInputBase-root': { borderRadius: '0px', border: '1px 0px' }, '& .MuiOutlinedInput-notchedOutline': { border: '0px' } }

                                return (
                                    <Fragment key={row.finalDate}>
                                        <TableRow
                                            hover
                                            // onClick={(event) => handleClick(event, row.finalDate)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            selected={isItemSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                {/* <Checkbox
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    inputProps={{
                                                        'aria-labelledby': labelId,
                                                    }}
                                                /> */}
                                                <IconButton
                                                    aria-label="expand row"
                                                    size="small"
                                                    onClick={(event) => handleClick(event, row.finalDate)}
                                                >
                                                    {isItemSelected ? <UpOutlined /> : <DownOutlined />}
                                                </IconButton>
                                            </TableCell>
                                            {/* <TableCell align="right">{row.initialDate ? formatDate(row.initialDate) : "-"}</TableCell>
                                            <TableCell align="right">{row.days ? row.days : "-"}</TableCell> */}
                                            <TableCell sx={{ p: 0 }}>
                                                <TextField
                                                    sx={cellFieldStyle}
                                                    defaultValue={row.finalDate ? formatDate(row.finalDate) : "-"}
                                                    InputProps={{
                                                        readOnly: false,
                                                    }} />
                                            </TableCell>
                                            <TableCell sx={{ p: 0 }}>
                                                <TextField
                                                    fullWidth sx={cellFieldStyle}
                                                    defaultValue={row.title}
                                                    InputProps={{
                                                        readOnly: false,
                                                    }} />
                                            </TableCell>
                                            {/* <TableCell align="right">{row.initialAmount ? "$" + formatNum(row.initialAmount) : "-"}</TableCell> */}
                                            <TableCell sx={{ p: 0 }}>
                                                <TextField
                                                    sx={cellFieldStyle}
                                                    defaultValue={row.dif ? formatNum(row.dif) : "-"}
                                                    InputProps={{
                                                        readOnly: false,
                                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                                    }} />
                                            </TableCell>
                                            {/* <TableCell>{row.dif ? "$" + formatNum(row.dif) : "-"}</TableCell> */}
                                            <TableCell sx={{ p: 0 }}>
                                                <TextField
                                                    sx={{ ...cellFieldStyle, width: 'auto' }}
                                                    defaultValue={row.difPorc ? formatNum(row.difPorc * 100) : "-"}
                                                    InputProps={{
                                                        readOnly: true,
                                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                                    }} />
                                            </TableCell>
                                            <TableCell sx={{ p: 0 }}>
                                                <TextField
                                                    sx={cellFieldStyle}
                                                    defaultValue={row.finalAmount ? formatNum(row.finalAmount) : "-"}
                                                    InputProps={{
                                                        readOnly: false,
                                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                                    }} />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                <Collapse in={isItemSelected} timeout="auto" unmountOnExit>
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
                                                                {/* {row.history.map((historyRow) => (
                                                                    <TableRow key={historyRow.date}>
                                                                        <TableCell component="th" scope="row">
                                                                            {historyRow.date}
                                                                        </TableCell>
                                                                        <TableCell>{historyRow.customerId}</TableCell>
                                                                        <TableCell align="right">{historyRow.amount}</TableCell>
                                                                        <TableCell align="right">
                                                                            {Math.round(historyRow.amount * row.price * 100) / 100}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))} */}
                                                            </TableBody>
                                                        </Table>
                                                    </Box>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </Fragment>
                                );
                            })}
                        {emptyRows > 0 && (
                            <TableRow
                                style={{
                                    height: 33 * emptyRows,
                                }}
                            >
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={accountTableRows?.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </ListIncomesCard>
    );
}

export default IncomeTable;