import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import { saveMoneyString, setOpenCreatePin, setOpenAskPin, setIsAuth, setInvalidPin, setOpenBackdrop, setLocaleStoragePin, saveMoneyInLocalStorage } from 'store/reducers/money';

import {
    Button,
    TextField,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Backdrop,
    CircularProgress
} from '@mui/material';

// ==============================|| AUTHENTICATION ||============================== //

const Authentication = ({ children }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { localStoragePin, openCreatePin, openAskPin, openBackdrop, isAuth, invalidPin } = useSelector((state) => state.money.session);

    const [inputPin, setInputPin] = useState('')

    useEffect(() => {
        if (localStoragePin && !isAuth) dispatch(setOpenAskPin(true));
    }, [localStoragePin, dispatch, isAuth]);

    const submitPin = () => {
        if (inputPin && inputPin === localStoragePin) {
            dispatch(setOpenAskPin(false));
            dispatch(saveMoneyString(localStorage.getItem('moneyData')));
            dispatch(setIsAuth(true));
        } else {
            dispatch(setInvalidPin(true));
        }
        setInputPin('');
    }

    const createPin = () => {
        if (inputPin) {
            dispatch(setOpenCreatePin(false));
            dispatch(setOpenBackdrop(true));
            dispatch(setIsAuth(true));
            dispatch(saveMoneyInLocalStorage());
            dispatch(setLocaleStoragePin(inputPin));
            navigate("/");
        } else {
            dispatch(setInvalidPin(true));
        }
        setInputPin('');
    }

    return (
        <>
            {children || null}
            <Dialog open={openAskPin}>
                <DialogTitle>
                    {/* <Typography variant="h3"> */}
                    Cargar Datos
                    {/* </Typography> */}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Se han encontrado datos guardados en el dispositivo. Si desea
                        accederlos ingrese el Pin de Seguridad.
                    </DialogContentText>
                    <TextField
                        // autoFocus
                        margin="dense"
                        id="newPin"
                        label="Pin"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={inputPin}
                        onChange={(e) => setInputPin(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && submitPin()}
                        autoComplete="off"
                        error={invalidPin}
                    />
                </DialogContent>
                <DialogActions>
                    <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ mr: 2, mb: 1 }}>
                        <Button onClick={() => dispatch(setOpenAskPin(false))}>CANCELAR</Button>
                        <Button onClick={submitPin} variant="contained">CARGAR</Button>
                    </Stack>
                </DialogActions>
            </Dialog>


            <Dialog open={openCreatePin} >
                <DialogTitle>
                    {/* <Typography variant="h3"> */}
                    Crear Pin de Seguridad
                    {/* </Typography> */}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Este pin se le solicitará cada vez que ingrese en la página para poder acceder a estos
                        datos guardados en la memoría del dispositivo.
                    </DialogContentText>
                    <TextField
                        // autoFocus
                        margin="dense"
                        id="newPin"
                        label="Nuevo Pin"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={inputPin}
                        onChange={(e) => setInputPin(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && createPin()}
                        autoComplete="off"
                        error={invalidPin}
                    />
                </DialogContent>
                <DialogActions>
                    <Stack direction="row" spacing={2} sx={{ mr: 2, mb: 1 }}>
                        <Button onClick={() => dispatch(setOpenCreatePin(false))}>CANCELAR</Button>
                        <Button onClick={createPin} variant="contained">CREAR Y GUARDAR</Button>
                    </Stack>
                </DialogActions>
            </Dialog>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
};

Authentication.propTypes = {
    children: PropTypes.node
};

export default Authentication;
