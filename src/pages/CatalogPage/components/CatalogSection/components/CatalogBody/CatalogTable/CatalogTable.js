import React from 'react';

import _round from 'lodash/round';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


import styles from './catalogTable.module.scss';


const CatalogTable = (props) => {
    const { productList } = props;

    return (
        <div className={styles.tableContainer}>
            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Product Name</TableCell>
                        <TableCell align="right">Description</TableCell>
                        <TableCell align="right">Current Price</TableCell>
                        <TableCell align="right">Discount</TableCell>
                        <TableCell align="right">Rating</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {productList.map((row) => (
                        <TableRow
                            key={row?.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row?.title}
                            </TableCell>
                            <TableCell align="right">{row?.description}</TableCell>
                            <TableCell align="right">{`Rs ${row?.newPrice}`}</TableCell>
                            <TableCell align="right">{`${row?.discount}%`}</TableCell>
                            <TableCell align="right">{_round(row.rating, 1)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        </div>
  );
}

export default CatalogTable;
