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
  Paper,
  List,
  ListItem,
  ListItemText
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
                    <TableCell>Query Id</TableCell>
                    <TableCell>Query Name</TableCell>
                    <TableCell>Query Result</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.query_results.length > 0 ? (
                    row.query_results.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell component="th" scope="row">
                          {result.id}
                        </TableCell>
                        <TableCell>{result.query_name}</TableCell>
                        <TableCell>
                          {result.result.includes('\n') ? (
                            <List dense>
                              {result.result
                                .split('\n')
                                .map((item, index) => item.replace(/^-\s*/, '')) // Remove leading '- '
                                .filter(Boolean)
                                .map((point, index) => (
                                  <ListItem key={index} disablePadding>
                                    <ListItemText primary={`• ${point}`} />
                                  </ListItem>
                                ))}
                            </List>
                          ) : (
                            result.result
                          )}
                        </TableCell>
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
              folder.files.map((file) => <Row key={file.id} row={{ ...file, query_results: file.query_results || [] }} />)
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
