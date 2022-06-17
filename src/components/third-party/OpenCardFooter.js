import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { Box, CardActions, Collapse, Divider, IconButton, Tooltip } from '@mui/material';

// assets
import { CodeOutlined, PlusOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { CardContent, Icon } from '../../../node_modules/@mui/material/index';

// ==============================|| CLIPBOARD & HIGHLIGHTER   ||============================== //

const OpenCardFooter = ({ children }) => {
    const [highlight, setHighlight] = useState(false);

    return (
        <Box sx={{ position: 'relative' }}>
            <CardActions sx={{ justifyContent: 'flex-end', p: 1, mb: highlight ? 1 : 0 }}>
                <Box sx={{ display: 'flex', position: 'inherit', right: 0, top: 6 }} >
                    {/* <CopyToClipboard text={reactElementToJSXString(children, { showFunctions: true, maxInlineAttributesLineLength: 100 })}>
                        <Tooltip title="Copy the source" placement="top-end">
                            <IconButton color="secondary" size="small" sx={{ fontSize: '0.875rem' }}>
                                <CopyOutlined />
                            </IconButton>
                        </Tooltip>
                    </CopyToClipboard>
                    <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 1 }} /> */}
                    <Tooltip title="Show the source" placement="top-end">
                        <IconButton
                            sx={{ fontSize: '0.875rem' }}
                            size="small"
                            color={highlight ? 'primary' : 'secondary'}
                            onClick={() => setHighlight(!highlight)}
                        >
                            <PlusOutlined />
                        </IconButton>
                    </Tooltip>
                    {/* <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 1 }} /> */}
                    <Tooltip title="Show the source" placement="top-end">
                        <IconButton
                            sx={{ fontSize: '0.875rem' }}
                            size="small"
                            color={highlight ? 'primary' : 'secondary'}
                            onClick={() => setHighlight(!highlight)}>
                            {highlight ?
                                <UpOutlined /> :
                                <DownOutlined />
                            }
                        </IconButton>
                    </Tooltip>
                    {/* <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 1 }} /> */}
                </Box>
            </CardActions>
            <Collapse in={highlight}>
                <CardContent>
                    {highlight && children}
                </CardContent>
            </Collapse>
        </Box>
    );
};

OpenCardFooter.propTypes = {
    children: PropTypes.node
};

export default OpenCardFooter;
