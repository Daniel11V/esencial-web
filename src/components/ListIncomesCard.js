import PropTypes from 'prop-types';
import { forwardRef } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, CardHeader, Divider, Typography, Stack, ButtonBase } from '@mui/material';
import { PlusOutlined } from '@ant-design/icons';

// project import
import PeriodicIncomeForm from './forms/PeriodicIncomeForm';
import OpenCardFooter from './third-party/OpenCardFooter';

// header style
const headerSX = {
    p: 0, pl: 2,
    '& .MuiCardHeader-action': { m: '0px auto', alignSelf: 'center' }
};

// ==============================|| CUSTOM - MAIN CARD ||============================== //

const ListIncomesCard = forwardRef(
    (
        {
            border = true,
            boxShadow,
            children,
            content = true,
            contentSX = {},
            darkTitle,
            divider = true,
            elevation,
            secondary,
            shadow,
            sx = {},
            title,
            codeHighlight,
            handleNewAccount,
            ...others
        },
        ref
    ) => {
        const theme = useTheme();

        return (
            <Card
                elevation={elevation || 0}
                ref={ref}
                {...others}
                sx={{
                    ...sx,
                    border: '1px solid',
                    borderRadius: 2,
                    borderColor: theme.palette.grey.A800,
                    ':hover': {
                        boxShadow: boxShadow ? shadow || theme.customShadows.z1 : 'inherit'
                    },
                    '& pre': {
                        m: 0,
                        p: '16px !important',
                        fontFamily: theme.typography.fontFamily,
                        fontSize: '0.75rem'
                    }
                }}
            >
                {/* card header and action */}
                {!darkTitle && title && (
                    <CardHeader sx={headerSX} title={(
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: "100%" }}>
                            <Typography variant="subtitle1" sx={{ mb: -0.5 }}>{title}</Typography>
                            <ButtonBase sx={{ p: 2 }} onClick={handleNewAccount} >
                                <Typography sx={{ color: "#1890FF", mb: -0.3, fontWeight: 'bold', textDecoration: 'underline' }}>Nueva cuenta</Typography>
                            </ButtonBase>
                            {/* <Stack direction="row" alignItems="center">
                                <Tooltip title="Crear cuenta">
                                    <IconButton color="primary" size="small" sx={{ m: -0.5, height: 'auto' }} >
                                        <PlusOutlined />
                                    </IconButton>
                                </Tooltip>
                            </Stack> */}
                        </Stack>
                    )} action={secondary} />
                )}
                {darkTitle && title && (
                    <CardHeader sx={headerSX} title={<Typography variant="h3">{title}</Typography>} action={secondary} />
                )}

                {/* content & header divider */}
                {title && divider && <Divider />}

                {/* card content */}
                {content && <CardContent sx={contentSX}>{children}</CardContent>}
                {!content && children}

                {/* card footer - clipboard & highlighter  */}
                {codeHighlight && (
                    <>
                        <Divider sx={{ borderStyle: 'dashed' }} />
                        <OpenCardFooter main>
                            <PeriodicIncomeForm />
                        </OpenCardFooter>
                    </>
                )}
            </Card>
        );
    }
);

ListIncomesCard.propTypes = {
    border: PropTypes.bool,
    boxShadow: PropTypes.bool,
    contentSX: PropTypes.object,
    darkTitle: PropTypes.bool,
    divider: PropTypes.bool,
    elevation: PropTypes.number,
    secondary: PropTypes.node,
    shadow: PropTypes.string,
    sx: PropTypes.object,
    title: PropTypes.string,
    codeHighlight: PropTypes.bool,
    content: PropTypes.bool,
    children: PropTypes.node
};

export default ListIncomesCard;
