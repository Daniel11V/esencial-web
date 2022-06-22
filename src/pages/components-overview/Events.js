import PropTypes from 'prop-types';

// material-ui
import { Box, Card, Grid, Stack, Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import ComponentSkeleton from './ComponentSkeleton';

// ===============================|| COLOR BOX ||=============================== //

function Events({ bgcolor, title, data, dark, main }) {
    return (
        <>
            <Card sx={{ '&.MuiPaper-root': { borderRadius: '0px' } }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        py: 2.5,
                        bgcolor,
                        color: dark ? 'grey.800' : '#ffffff',
                        border: main ? '1px dashed' : '1px solid transparent'
                    }}
                >
                    {title && (
                        <Grid container justifyContent="space-around" alignItems="center">
                            <Grid item>
                                {data && (
                                    <Stack spacing={0.75} alignItems="center">
                                        <Typography variant="subtitle2">{data.label}</Typography>
                                        <Typography variant="subtitle1">{data.color}</Typography>
                                    </Stack>
                                )}
                            </Grid>
                            <Grid item>
                                <Typography variant="subtitle1" color="inherit">
                                    {title}
                                </Typography>
                            </Grid>
                        </Grid>
                    )}
                </Box>
            </Card>
        </>
    );
}

Events.propTypes = {
    bgcolor: PropTypes.string,
    title: PropTypes.string,
    data: PropTypes.object.isRequired,
    dark: PropTypes.bool,
    main: PropTypes.bool
};

// ===============================|| COMPONENT - COLOR ||=============================== //

const ComponentColor = () => (
    <ComponentSkeleton>
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
                <MainCard title="Primary Color" codeHighlight>
                    <Stack>
                        {/* <Events bgcolor="primary.lighter" data={{ label: 'Blue-1', color: '#e6f7ff' }} title="primary.lighter" dark />
                        <Events bgcolor="primary.100" data={{ label: 'Blue-2', color: '#bae7ff' }} title="primary[100]" dark />
                        <Events bgcolor="primary.200" data={{ label: 'Blue-3', color: '#91d5ff' }} title="primary[200]" dark />
                        <Events bgcolor="primary.light" data={{ label: 'Blue-4', color: '#69c0ff' }} title="primary.light" dark />
                        <Events bgcolor="primary.400" data={{ label: 'Blue-5', color: '#40a9ff' }} title="primary[400]" />
                        <Events bgcolor="primary.main" data={{ label: 'Blue-6', color: '#1890ff' }} title="primary.main" main />
                        <Events bgcolor="primary.dark" data={{ label: 'Blue-7', color: '#096dd9' }} title="primary.dark" />
                        <Events bgcolor="primary.700" data={{ label: 'Blue-8', color: '#0050b3' }} title="primary[700]" />
                        <Events bgcolor="primary.darker" data={{ label: 'Blue-9', color: '#003a8c' }} title="primary.darker" />
                        <Events bgcolor="primary.900" data={{ label: 'Blue-10', color: '#002766' }} title="primary.900" /> */}
                    </Stack>
                </MainCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <MainCard title="Secondary Color" codeHighlight>
                    <Stack>
                        {/* <Events bgcolor="secondary.lighter" data={{ label: 'Grey-1', color: '#fafafa' }} title="secondary.lighter" dark />
                        <Events bgcolor="secondary.100" data={{ label: 'Grey-2', color: '#f5f5f5' }} title="secondary[100]" dark />
                        <Events bgcolor="secondary.200" data={{ label: 'Grey-3', color: '#f0f0f0' }} title="secondary[200]" dark />
                        <Events bgcolor="secondary.light" data={{ label: 'Grey-4', color: '#d9d9d9' }} title="secondary.light" dark />
                        <Events bgcolor="secondary.400" data={{ label: 'Grey-5', color: '#bfbfbf' }} title="secondary[400]" dark />
                        <Events bgcolor="secondary.main" data={{ label: 'Grey-6', color: '#8c8c8c' }} title="secondary.main" main />
                        <Events bgcolor="secondary.600" data={{ label: 'Grey-7', color: '#595959' }} title="secondary.600" />
                        <Events bgcolor="secondary.dark" data={{ label: 'Grey-8', color: '#262626' }} title="secondary.dark" />
                        <Events bgcolor="secondary.800" data={{ label: 'Grey-9', color: '#141414' }} title="secondary[800]" />
                        <Events bgcolor="secondary.darker" data={{ label: 'Grey-10', color: '#000000' }} title="secondary.darker" /> */}
                    </Stack>
                </MainCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <MainCard title="Other Color" codeHighlight>
                    <Stack>
                        {/* <Events bgcolor="secondary.A100" data={{ label: 'Grey-A1', color: '#ffffff' }} title="secondary.A100" dark />
                        <Events bgcolor="secondary.A200" data={{ label: 'Grey-A2', color: '#434343' }} title="secondary.A200" />
                        <Events bgcolor="secondary.A300" data={{ label: 'Grey-A3', color: '#1f1f1f' }} title="secondary.A300" /> */}
                    </Stack>
                </MainCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <MainCard title="Success Color" codeHighlight>
                    <Stack>
                        {/* <Events bgcolor="success.lighter" data={{ label: 'Green-1', color: '#f6ffed' }} title="success.lighter" dark />
                        <Events bgcolor="success.light" data={{ label: 'Green-4', color: '#95de64' }} title="success.light" dark />
                        <Events bgcolor="success.main" data={{ label: 'Green-6', color: '#52c41a' }} title="success.main" main />
                        <Events bgcolor="success.dark" data={{ label: 'Green-8', color: '#237804' }} title="success.dark" />
                        <Events bgcolor="success.darker" data={{ label: 'Green-10', color: '#092b00' }} title="success.darker" /> */}
                    </Stack>
                </MainCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <MainCard title="Error Color" codeHighlight>
                    <Stack>
                        {/* <Events bgcolor="error.lighter" data={{ label: 'Red-1', color: '#fff1f0' }} title="error.lighter" dark />
                        <Events bgcolor="error.light" data={{ label: 'Red-4', color: '#ff7875' }} title="error.light" dark />
                        <Events bgcolor="error.main" data={{ label: 'Red-6', color: '#f5222d' }} title="error.main" main />
                        <Events bgcolor="error.dark" data={{ label: 'Red-8', color: '#a8071a' }} title="error.dark" />
                        <Events bgcolor="error.darker" data={{ label: 'Red-10', color: '#5c0011' }} title="error.darker" /> */}
                    </Stack>
                </MainCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <MainCard title="Warning Color" codeHighlight>
                    <Stack>
                        {/* <Events bgcolor="warning.lighter" data={{ label: 'Gold-1', color: '#fffbe6' }} title="warning.lighter" dark />
                        <Events bgcolor="warning.light" data={{ label: 'Gold-4', color: '#ffd666' }} title="warning.light" dark />
                        <Events bgcolor="warning.main" data={{ label: 'Gold-6', color: '#faad14' }} title="warning.main" main />
                        <Events bgcolor="warning.dark" data={{ label: 'Gold-8', color: '#ad6800' }} title="warning.dark" />
                        <Events bgcolor="warning.darker" data={{ label: 'Gold-10', color: '#613400' }} title="warning.darker" /> */}
                    </Stack>
                </MainCard>
            </Grid>
        </Grid>
    </ComponentSkeleton>
);

export default ComponentColor;
