import { useEffect, useState } from 'react';
import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import { Button } from '@mui/material';
import { Box } from '@mui/material';

import { useVSContext } from '../../../context/VSContext';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../../../store/loadingSlice';

const columns = [
  { id: 'name', label: 'Store Name' },
  { id: 'files', label: 'Files' }
];

let rows = [];

let selectedVSIds = [];

export default function SearchVS() {
  const { state, dispatch } = useVSContext();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const originDispatch = useDispatch();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const onSearch = async (selectedVSIds) => {
    if (selectedVSIds.length == 0) {
      return;
    }

    originDispatch(showLoading());

    try {
      const response = await fetch(`${import.meta.env.VITE_API_END_POINT}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ vsIds: selectedVSIds })
      });

      if (!response.ok) {
        throw new Error('Failed to search vector store');
      }

      const data = await response.json();

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      });

      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'data.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      originDispatch(hideLoading());
    }
  };

  useEffect(() => {
    const fetchVectorStores = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_END_POINT}/store_list`);
        if (!response.ok) {
          throw new Error('Failed to fetch vector stores');
        }
        const data = await response.json();
        dispatch({ type: 'FETCH_ALL_VS_SUCCESS', payload: data['vector_stores'] });
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchVectorStores();
  }, [dispatch]);

  selectedVSIds = JSON.parse(localStorage.getItem('selectedVSIds'));

  rows = [];

  if (state.vector_stores) {
    state.vector_stores.map((vs) => {
      if (selectedVSIds.includes(vs.store_id)) {
        rows.push({ store_id: vs.store_id, store_name: vs.store_name, files: vs.files });
      }
    });
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', paddingX: '12px', paddingY: '16px' }}>
        <Typography sx={{ flex: '1 1 100%' }} variant="h2" id="tableTitle" component="div">
          Selected Vector Store List
        </Typography>
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={() => {
            onSearch(selectedVSIds);
          }}
        >
          Search
        </Button>
      </Box>
      <TableContainer sx={{ maxHeight: '100%' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                  <TableCell>{row.store_name}</TableCell>
                  <TableCell>
                    {row.files.map((file) => (
                      <span
                        key={file.file_id}
                        style={{
                          display: 'inline-block',
                          backgroundColor: '#CCC',
                          padding: '4px 8px',
                          borderRadius: '16px / 50%',
                          marginRight: '4px'
                        }}
                      >
                        {file.filename}
                      </span>
                    ))}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
