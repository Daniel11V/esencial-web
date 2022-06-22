// material-ui
import { Divider, Grid, Stack, Typography, Button, Card, CardContent, CardHeader, IconButton, Input, TextareaAutosize } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { saveMoneyString } from 'store/reducers/money';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import reactElementToJSXString from 'react-element-to-jsx-string';
// import { activeItem } from 'store/reducers/money';

// project import
import ComponentSkeleton from './ComponentSkeleton';
import SyntaxHighlight from 'utils/SyntaxHighlight';
import { useState, useEffect } from 'react';
// import MonthlyBarChart from 'pages/dashboard/MonthlyBarChart';
import { FolderOpenFilled, RocketFilled, CopyFilled, CloudDownloadOutlined } from '@ant-design/icons';
import { useTheme } from '@mui/material/styles';


// ==============================|| COMPONENTS - TYPOGRAPHY ||============================== //

const Database = () => {
    const theme = useTheme();
    const headerSX = { p: 2.5, '& .MuiCardHeader-action': { m: '0px auto', alignSelf: 'center' } };

    const dispatch = useDispatch();
    const allMoneyData = useSelector((state) => state.money.data);
    const [stringData, setStringData] = useState("")

    useEffect(() => {
        if (allMoneyData) {
            setStringData(JSON.stringify(allMoneyData, null, '\t'));
        }
    }, [allMoneyData])

    const [localStoragePin, setLocalStoragePin] = useState(localStorage.getItem('moneyPin') || '')
    const [inputPin, setInputPin] = useState('')
    // setStringData(localStorage.setItem('moneyData', JSON.stringify({})));

    useEffect(() => {
        if (localStoragePin) {
            // preguntar por pin
            setInputPin('123')
        }
    }, [localStoragePin]);

    useEffect(() => {
        if (inputPin && inputPin === localStoragePin) {
            // dispatch me loguee
            setStringData(JSON.parse(localStorage.getItem('moneyData')));
        }
    }, [inputPin]);

    const saveDataString = () => {
        dispatch(saveMoneyString({ stringData }));
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
                        <CardHeader sx={headerSX} title={(
                            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                                <Typography variant="h3">Código de tu Base de Datos</Typography>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                                    <Button variant="contained" endIcon={<RocketFilled />} onClick={saveDataString}>
                                        Procesar
                                    </Button>
                                    {/* <label htmlFor="contained-button-file">
                                        <Input accept="image/*" id="contained-button-file" multiple type="file" style={{ display: 'none' }} />
                                        <Button variant="contained" endIcon={<FolderOpenFilled />}>
                                            Cargar
                                        </Button>
                                    </label> */}
                                    <CopyToClipboard text={JSON.stringify(allMoneyData)}>
                                        <Button variant="contained" endIcon={<CopyFilled />}>
                                            Copiar minificado
                                        </Button>
                                    </CopyToClipboard>
                                    {/* <Button variant="contained" endIcon={<CloudDownloadOutlined />}>
                                        Descargar
                                    </Button> */}
                                </Stack>
                            </Stack>
                        )} />
                        <Divider />
                        <CardContent>
                            <Stack spacing={2}>
                                <TextareaAutosize
                                    aria-label="codigo de datos"
                                    placeholder="Ingrese el código de sus datos..."
                                    value={stringData}
                                    onChange={(e) => setStringData(e.target.value)}
                                    sx={{
                                        border: '1px solid',
                                        borderColor: theme.palette.grey.A800,
                                        borderRadius: 5,
                                    }}
                                    style={{
                                        padding: 10,
                                    }}
                                />
                            </Stack>
                        </CardContent>

                    </Card>
                    {/* <MainCard title={`Código de tu Base de Datos`}>
                        <Stack spacing={2}>
                            <Typography variant="h4">Pegar texto plano</Typography>
                            <TextareaAutosize
                                // maxRows={4}
                                aria-label="codigo de datos"
                                placeholder="Ingrese el código de sus datos..."
                                defaultValue={stringData}
                                style={{ padding: 10, border: '1px solid blue', borderRadius: 5 }}
                            />
                            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                                <Button variant="contained" endIcon={<RocketFilled />}>
                                    Procesar
                                </Button>
                                <label htmlFor="contained-button-file">
                                    <Input accept="image/*" id="contained-button-file" multiple type="file" style={{ display: 'none' }} />
                                    <Button variant="contained" endIcon={<FolderOpenFilled />}>
                                        Cargar
                                    </Button>
                                </label>
                                <CopyToClipboard text={stringData}>
                                    <Button variant="contained" endIcon={<CopyFilled />}>
                                        Copiar
                                    </Button>
                                </CopyToClipboard>
                                <Button variant="contained" endIcon={<CloudDownloadOutlined />}>
                                    Descargar
                                </Button>
                            </Stack>
                        </Stack>
                    </MainCard> */}
                </Grid>
            </Grid>
        </ComponentSkeleton>
    );
};

export default Database;
