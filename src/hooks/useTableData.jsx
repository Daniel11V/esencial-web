import {useState, useEffect} from 'react'
import { useContext } from 'react';
import DashboardContext from 'context/DashboardContext';
import { useDispatch } from 'react-redux';
import { editOperation, editAccount, setLoading, setShowCurrency } from 'store/reducers/money';

export default function useTableData () {
    const dispatch = useDispatch();
    const { accountsData, accountChecked, checkOnlyOne } = useContext(DashboardContext)

    
    const [accountData, setAccountData] = useState({})
    const [tableData, setTableData] = useState([])

    useEffect(() => {
        if (accountsData && accountChecked) {
            const accountInTableData = accountsData?.find(acc => !!accountChecked[acc?.accInfo.creationDate]) || accountsData[0]
            // console.log("ACA accountInTableData", accountInTableData)
            setAccountData({...accountInTableData?.accInfo});
            dispatch(setShowCurrency(accountInTableData?.accInfo?.currency));
            setTableData(lastTableData => accountInTableData?.operations
                ?.filter(oper => !!oper?.amount || oper?.amount !== 0))
        }
    }, [accountsData, accountChecked, setAccountData, setTableData])
    
    
    //// INCOME TABLE
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('finalDate');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);


    // const isSelected = (finalDate) => edittedCell.indexOf(finalDate) !== -1;
    // const wasEdittedCell = (operId, cellId) => 
    //     edittedCell.some(edit => edit.operId === operId && edit.cellId === cellId)
    

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

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // const handleSelectAllClick = (event) => {
    //     if (event.target.checked) {
    //         const newSelecteds = tableData.rows?.map((n) => n.finalDate);
    //         setEdittedCell(newSelecteds);
    //         return;
    //     }
    //     setEdittedCell([]);
    // };

    // const handleClick = (event, finalDate) => {
    //     const edittedIndex = edittedCell.indexOf(finalDate);
    //     let newSelected = [];

    //     if (edittedIndex === -1) {
    //         newSelected = newSelected.concat(edittedCell, finalDate);
    //     } else if (edittedIndex === 0) {
    //         newSelected = newSelected.concat(edittedCell.slice(1));
    //     } else if (edittedIndex === edittedCell.length - 1) {
    //         newSelected = newSelected.concat(edittedCell.slice(0, -1));
    //     } else if (edittedIndex > 0) {
    //         newSelected = newSelected.concat(
    //             edittedCell.slice(0, edittedIndex),
    //             edittedCell.slice(edittedIndex + 1),
    //         );
    //     }

    //     setEdittedCell(newSelected);
    // };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Avoid a layout jump when reaching the last page with empty account.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tableData?.length) : 0;


    // INCOME TABLE HEAD
    
    const headCells = [
        // {
        //     id: 'initialDate',
        //     numeric: true,
        //     label: 'Fecha inicial',
        // },
        // {
        //     id: 'days',
        //     numeric: true,
        //     label: 'Plazo (días)',
        // },
        {
            id: 'finalDate',
            numeric: false,
            label: 'Fecha final',
        },
        {
            id: 'title',
            numeric: false,
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
            label: 'Monto',
        },
        {
            id: 'difPorc',
            numeric: false,
            label: 'Rendimiento',
        },
        {
            id: 'finalAmount',
            numeric: false,
            label: 'Capital final',
        },
    ];

    const createSortHandler = (property) => (event) => {
        handleRequestSort(event, property);
    };


    // EDIT OPERATION IN TABLE
    const [editingOperation, setEditingOperation] = useState({})

    const isValidOperation = () => {
        return true
    }

    const saveOperation = (newAmountValue) => {
        if (isValidOperation()) {
            dispatch(setLoading(true));

            dispatch(editOperation, editAccount({ editingOperation: {
                ...editingOperation,
                amount: 0, totalAmount: 0,
                ...newAmountValue    
            } }));

            setEditingOperation({})
        } else {

        }
    }
    
    const handleNewOperation = () => {
        const newOperId = new Date().getTime()

        setEditingOperation({
            "creationDate": newOperId,
            "title": "",
            "description": "",
            "operType": "INCOME",
            "fromAccount": accountData?.creationDate,
            "fromAccountName": accountData?.accountName,
            "finalDate": newOperId,
            "amount": 0,
            "percAmount": 0,
            "totalAmount": 0
        })
    }

    // const handleNewOperation = () => {
    //     const newOperId = new Date().getTime()

    //     setTableData(lastTableData => [ 
    //         ...lastTableData,
    //         {
    //             finalDate: newOperId,
    //             title: "",
    //             dif: 0,
    //             difPerc: 0,
    //             finalAmount: 0,
    //             extraInfo: {
    //                 isFutureInterest: false,
    //                 operId: newOperId,
    //             }
    //         }
    //     ])

    //     setEdittedCell(lastEditing => [
    //         ...lastEditing,
    //         {operId: newOperId, cellId: 'finalDate', newValue: newOperId},
    //         {operId: newOperId, cellId: 'title', newValue: ''},
    //         {operId: newOperId, cellId: 'dif', newValue: 0},
    //         {operId: newOperId, cellId: 'finalAmount', newValue: 0}
    //     ])
    // }

    // const handleChangeCell = (operId, cellId, newValue) => {
    //     setEdittedCell(lastEditing => {
    //         const editIndex = lastEditing.findIndex((oper => oper.operId === operId && oper.cellId === cellId));
    //         const newEditing = [...lastEditing]
    //         if (editIndex >= 0) {
    //             newEditing[editIndex].newValue = newValue;
    //         } else newEditing.push({operId, cellId, newValue})
    //         return newEditing
    //     })
    //     // setOperValues(lV => ({ ...lV, [cellId]: newValue }))
    // }

    // const isEditingCell = (operId, cellId, actualFocusedCell = editingOperation) => 
    //     actualFocusedCell.operId ===  operId && actualFocusedCell.cellId ===  cellId

    // const getCellValue = (operId, cellId, value) => {
    //     const realValue = wasEdittedCell(operId, cellId) ? (edittedCell.find(oper => oper.operId === operId && oper.cellId === cellId)?.newValue || value) : value;
    //     if (operId === 1646418795717 && cellId === "dif") console.log("ACA getCellValue", edittedCell, wasEdittedCell(operId, cellId), realValue, typeof(realValue))
    //     return isEditingCell(operId, cellId) ? (realValue || "") : formattedValue[cellId](realValue);
    // }
    
    // const onClickCell = (operId, cellId) => {
    //     setEditingOperation( lastFocusedCell => isEditingCell(operId, cellId, lastFocusedCell) 
    //         ? {operId: '', cellId: ''} 
    //         : {operId, cellId}
    //     )
    // }

    // EDIT ACCOUNT IN TABLE
    const [editingAccount, setEditingAccount] = useState({})

    const isValidAccount = () => {
        return true
    }

    const saveAccount = (someFormattedValues, initialCapital, hasInterests) => {
        if (isValidAccount()) {
            dispatch(setLoading(true));

            dispatch(editAccount({ editingAccount: {
                ...editingAccount,
                ...someFormattedValues,
                ...(!hasInterests ? { termInDays: 0, TNA: 0, periodicAdd: 0 } : {})    
            }, initialCapital }));

            setEditingAccount({})
            checkOnlyOne(editingAccount.creationDate);
        } else {

        }
    }
    
    const handleNewAccount = () => {
        const newAccId = new Date().getTime()

        setEditingAccount({
            "creationDate": newAccId, // Id
            "initialDate": newAccId,
            "isNewAccount": true,
            "wallet": "",
            "currency": "",
            "accountName": "",
            "description": "",
            "TNA": 10,
            "termInDays": 30,
            "periodicAdd": "",
        })
    }


    return { 
        accountData, tableData,

        getComparator, stableSort,

        // IncomeTable
        order, orderBy, page, rowsPerPage, 
        emptyRows, handleChangePage, handleChangeRowsPerPage,
    
        // IncomeTableHead
        headCells, createSortHandler,

        // Edit in table
        handleNewAccount, handleNewOperation,
        
        editingOperation, setEditingOperation, saveOperation, 
        editingAccount, setEditingAccount, saveAccount, 
    }
}