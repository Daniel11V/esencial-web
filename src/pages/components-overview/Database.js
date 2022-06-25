// material-ui
import {
    Divider,
    Grid,
    Stack,
    Typography,
    Button,
    Card,
    CardContent,
    CardHeader,
    TextareaAutosize,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom"
import { saveMoneyString, saveMoneyInLocalStorage, setLocaleStoragePin, setOpenCreatePin, setOpenBackdrop } from 'store/reducers/money';
import { CopyToClipboard } from 'react-copy-to-clipboard';
// import { activeItem } from 'store/reducers/money';

// project import
import ComponentSkeleton from './ComponentSkeleton';
import { useState, useEffect } from 'react';
// import MonthlyBarChart from 'pages/dashboard/MonthlyBarChart';
import { FireOutlined, BarChartOutlined, CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTheme } from '@mui/material/styles';


// ==============================|| COMPONENTS - TYPOGRAPHY ||============================== //

const Database = () => {
    const navigate = useNavigate();

    const theme = useTheme();
    const headerSX = { p: 2.5, '& .MuiCardHeader-action': { m: '0px auto', alignSelf: 'center' } };
    const fullHeight = '65vh';

    const dispatch = useDispatch();
    const allMoneyData = useSelector((state) => state.money.data);
    const { isAuth } = useSelector((state) => state.money.session);
    const [stringData, setStringData] = useState("")

    useEffect(() => {
        if (allMoneyData) setStringData(JSON.stringify(allMoneyData, null, '\t'));
    }, [allMoneyData])

    const saveDataString = () => {
        dispatch(saveMoneyString(stringData));

        if (isAuth) {
            dispatch(setOpenBackdrop(true));
            dispatch(saveMoneyInLocalStorage());
            navigate("/");
        } else {
            dispatch(setOpenCreatePin(true));
        }
    }

    // const saveDataStringIntoLocalStorage = () => {
    //     if (isAuth) {
    //         dispatch(saveMoneyInLocalStorage());
    //     } else {
    //         dispatch(setOpenCreatePin(true));
    //     }
    // }

    const deleteLocalStorage = () => {
        dispatch(setLocaleStoragePin(''));
        dispatch(saveMoneyInLocalStorage('{}'));
    }

    return (
        <ComponentSkeleton>
            <Grid container rowSpacing={4.5} columnSpacing={2.75} >
                <Grid item xs={12} lg={12}>
                    <Card
                        elevation={0}
                        sx={{
                            border: '1px solid',
                            borderRadius: 2,
                            borderColor: theme.palette.grey.A800,
                            '& pre': {
                                m: 0,
                                p: '16px !important',
                                fontFamily: theme.typography.fontFamily,
                                fontSize: '0.75rem'
                            }
                        }}>
                        <CardHeader sx={headerSX} title={
                            <Typography variant="h3">Código de tu Base de Datos</Typography>
                        } />
                        <Divider />
                        <CardContent >
                            <Stack spacing={2}>
                                <TextareaAutosize
                                    aria-label="codigo de datos"
                                    placeholder="Ingrese el código de sus datos..."
                                    value={stringData}
                                    onChange={(e) => setStringData(e.target.value)}
                                    // maxRows={2}
                                    sx={{
                                        border: '1px solid',
                                        borderColor: theme.palette.grey.A800,
                                        borderRadius: 5,
                                    }}
                                    style={{
                                        padding: 10,
                                        maxHeight: fullHeight,
                                        overflow: 'auto',
                                        resize: 'none'
                                    }}
                                />
                                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                                    <Button sx={{ backgroundColor: theme.palette.error.main }} variant="contained" endIcon={<DeleteOutlined />} onClick={() => setStringData('')}>
                                        Vaciar editor
                                    </Button>
                                    <Button variant="contained" endIcon={<FireOutlined />} onClick={deleteLocalStorage}>
                                        Borrar almacenamiento
                                    </Button>
                                    {/* <Button variant="contained" endIcon={<SaveOutlined />} onClick={saveDataStringIntoLocalStorage}>
                                        Guardar en dispositivo
                                    </Button> */}
                                    {/* <label htmlFor="contained-button-file">
                                        <Input accept="image/*" id="contained-button-file" multiple type="file" style={{ display: 'none' }} />
                                        <Button variant="contained" endIcon={<FolderOpenFilled />}>
                                        Cargar
                                        </Button>
                                    </label> */}
                                    <CopyToClipboard text={JSON.stringify(allMoneyData)}>
                                        <Button variant="contained" endIcon={<CopyOutlined />}>
                                            Copiar minificado
                                        </Button>
                                    </CopyToClipboard>
                                    {/* <Button variant="contained" endIcon={<CloudDownloadOutlined />}>
                                        Descargar
                                    </Button> */}

                                    <Button variant="contained"
                                        sx={{ backgroundColor: '#4caf50' }}
                                        color="success"
                                        endIcon={<BarChartOutlined />} onClick={saveDataString}>
                                        Procesar
                                    </Button>
                                </Stack>
                            </Stack>
                        </CardContent>

                    </Card>
                </Grid>
            </Grid>

        </ComponentSkeleton>
    );
};

export default Database;
