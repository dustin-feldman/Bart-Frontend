import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Paper
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

// Collapsible table row for each file with query results
function Row({ row }) {
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right">{row.status}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box>
              <Typography variant="h6" gutterBottom component="div">
                Query Results
              </Typography>
              <Table size="small" aria-label="query-results">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Total Price ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.queryResults.length > 0 ? (
                    row.queryResults.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell component="th" scope="row">
                          {result.date}
                        </TableCell>
                        <TableCell>{result.customer}</TableCell>
                        <TableCell align="right">{result.amount}</TableCell>
                        <TableCell align="right">{Math.round(result.amount * row.price * 100) / 100}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No query results
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function QueryResultRightPanel({ selectedFiles }) {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Selected Files and Query Results
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>File Name</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedFiles.map((folder) =>
              folder.files.map((file) => <Row key={file.id} row={{ ...file, queryResults: file.queryResults || [] }} />)
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
