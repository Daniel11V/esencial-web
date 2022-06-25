import { useState, useEffect } from 'react';
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
    Paper,
    Checkbox,
    IconButton,
    Tooltip,
    Breadcrumbs,
    Stack
} from '@mui/material';
import ListIncomesCard from 'components/ListIncomesCard';
import { DeleteOutlined, FilterFilled } from '@ant-design/icons';
import { visuallyHidden } from '@mui/utils';
import { formatDate, formatNum } from 'utils/utils';

function createOper(title, initialDate, days, finalDate, initialAmount, dif, difPorc, finalAmount) {
    return {
        title,
        initialDate,
        days,
        finalDate,
        initialAmount,
        dif,
        difPorc,
        finalAmount,
    };
}

// function createOper(name, calories, fat, carbs, protein, finalAmount, finalDate) {
//     return {
//         name,
//         calories,
//         fat,
//         carbs,
//         protein,
//         finalAmount,
//         finalDate,
//     };
// }

const rows = [
    createOper('Apertura de cuenta', 0, 0, new Date('05/06/2022').getTime(), 0, 100000.75, 0, 100000.75),
    createOper('Intereses', new Date('05/06/2022').getTime(), 30, new Date('06/06/2022').getTime(), 100000.75, 4032.91, 0.0307, 104033.66),
    createOper('Ingreso', 0, 0, new Date('06/16/2022').getTime(), 104033.66, 37756.12, 0, 141789.78),
    createOper('Intereses', new Date('06/06/2022').getTime(), 30, new Date('07/06/2022').getTime(), 141789.78, 5593.90, 0.0486, 147383.7),
    // createOper('Donut', 452, 25.0, 51, 4.9, 51, 4.9),
    // createOper('Eclair', 262, 16.0, 24, 6.0, 24, 6.0),
    // createOper('Frozen yoghurt', 159, 6.0, 24, 4.0, 24, 4.0),
    // createOper('Gingerbread', 356, 16.0, 49, 3.9, 49, 3.9),
    // createOper('Honeycomb', 408, 3.2, 87, 6.5, 87, 6.5),
    // createOper('Ice cream sandwich', 237, 9.0, 37, 4.3, 37, 4.3),
    // createOper('Jelly Bean', 375, 0.0, 94, 0.0, 94, 0.0),
    // createOper('KitKat', 518, 26.0, 65, 7.0, 65, 7.0),
    // createOper('Lollipop', 392, 0.2, 98, 0.0),
    // createOper('Marshmallow', 318, 0, 81, 2.0),
    // createOper('Nougat', 360, 19.0, 9, 37.0),
    // createOper('Oreo', 437, 18.0, 63, 4.0),
];

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
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: 'title',
        numeric: false,
        disablePadding: true,
        label: 'Operación',
    },
    {
        id: 'initialDate',
        numeric: true,
        disablePadding: false,
        label: 'Fecha inicial',
    },
    {
        id: 'days',
        numeric: true,
        disablePadding: false,
        label: 'Plazo (días)',
    },
    {
        id: 'finalDate',
        numeric: true,
        disablePadding: false,
        label: 'Fecha final',
    },
    {
        id: 'initialAmount',
        numeric: true,
        disablePadding: false,
        label: 'Capital inicial',
    },
    {
        id: 'dif',
        numeric: true,
        disablePadding: false,
        label: 'Monto',
    },
    {
        id: 'difPorc',
        numeric: true,
        disablePadding: false,
        label: 'Porcentaje',
    },
    {
        id: 'finalAmount',
        numeric: true,
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
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell>
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

const IncomeTableToolbar = (props) => {
    const { numSelected } = props;

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Nutrition
                </Typography>
            )}

            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton>
                        <DeleteOutlined />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <FilterFilled />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
};

IncomeTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

const IncomeTable = (account, mainCurrency, currencies) => {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('finalDate');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    console.log("ACA", mainCurrency, currencies, account)
    const formatCurrency = (num, currencyName) => currencyName === mainCurrency
        ? `$${formatNum(num)}`
        : `${formatNum(num)} ${currencyName} ($${formatNum(num * currencies?.find(c => c.name === currencyName)?.actualValue)})`


    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.finalDate);
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

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <ListIncomesCard title={`Cuentas e Inversiones Seleccionadas`} codeHighlight>
            <Stack spacing={2}>
                <Typography variant="h3">{account.accountName}</Typography>
                <Breadcrumbs aria-label="breadcrumb">
                    <Typography variant="h6">TNA: {formatNum(account.TNA * 100)}%</Typography>
                    <Typography variant="h6">Moneda: {account.currencyName}</Typography>
                    <Typography variant="h6">Plazo: {account.termInDays} días</Typography>
                    <Typography variant="h6">
                        Capital inicial: {formatCurrency(account.initialAmount, account.currencyName)}
                    </Typography>
                    {!!account.periodicAdd &&
                        <Typography variant="h6">
                            Agrego por plazo: {formatCurrency(account.periodicAdd, account.currencyName)}
                        </Typography>
                    }
                </Breadcrumbs>



                <Paper sx={{ width: '100%', mb: 2 }}>
                    <IncomeTableToolbar numSelected={selected.length} />
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
                                rowCount={rows.length}
                            />
                            <TableBody>
                                {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                    rows.slice().sort(getComparator(order, orderBy)) */}
                                {stableSort(rows, getComparator(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        const isItemSelected = isSelected(row.finalDate);
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                        return (
                                            <TableRow
                                                hover
                                                onClick={(event) => handleClick(event, row.finalDate)}
                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={row.finalDate}
                                                selected={isItemSelected}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        color="primary"
                                                        checked={isItemSelected}
                                                        inputProps={{
                                                            'aria-labelledby': labelId,
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    id={labelId}
                                                    scope="row"
                                                    padding="none"
                                                >
                                                    {row.title}
                                                </TableCell>
                                                <TableCell align="right">{row.initialDate ? formatDate(row.initialDate) : "-"}</TableCell>
                                                <TableCell align="right">{row.days ? row.days : "-"}</TableCell>
                                                <TableCell align="right">{row.finalDate ? formatDate(row.finalDate) : "-"}</TableCell>
                                                <TableCell align="right">{row.initialAmount ? "$" + formatNum(row.initialAmount) : "-"}</TableCell>
                                                <TableCell align="right">{row.dif ? "$" + formatNum(row.dif) : "-"}</TableCell>
                                                <TableCell align="right">{row.difPorc ? formatNum(row.difPorc * 100) + "%" : "-"}</TableCell>
                                                <TableCell align="right">{row.finalAmount ? "$" + formatNum(row.finalAmount) : "-"}</TableCell>
                                            </TableRow>
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
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Stack>
        </ListIncomesCard>
    );
}

export default IncomeTable;