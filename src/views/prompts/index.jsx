import * as React from 'react';
import { useState, useEffect } from 'react';

// MUI Components
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Box } from '@mui/material';

// Custom Components
import MainCard from 'ui-component/cards/MainCard';
import axiosInstance from '../../axiosInstance';

const QueryPage = () => {
  const [queries, setQueries] = useState([]);
  const [newQuery, setNewQuery] = useState({ name: '', prompt: '' });
  const [open, setOpen] = useState(false); // Modal state for Create/Update
  const [deleteOpen, setDeleteOpen] = useState(false); // Modal state for Delete
  const [currentQuery, setCurrentQuery] = useState(null); // Current query for updating or deleting

  // Fetch the queries from the API
  useEffect(() => {
    axiosInstance
      .get('/api/queries/')
      .then((response) => {
        setQueries(response.data);
      })
      .catch((error) => {
        console.error('Error fetching queries:', error);
      });
  }, []);

  // Handle the Create (Add) operation
  const handleCreate = () => {
    axiosInstance
      .post('/api/queries/create/', newQuery)
      .then((response) => {
        setQueries([...queries, response.data]);
        setNewQuery({ name: '', prompt: '' }); // Reset the form
        setOpen(false); // Close modal
      })
      .catch((error) => {
        console.error('Error creating query:', error);
      });
  };

  // Handle Delete operation
  const handleDelete = (id) => {
    axiosInstance
      .delete(`/api/queries/${id}/`)
      .then(() => {
        setQueries(queries.filter((query) => query.id !== id));
        setDeleteOpen(false); // Close the delete modal
      })
      .catch((error) => {
        console.error('Error deleting query:', error);
      });
  };

  // Handle Update operation
  const handleUpdate = () => {
    console.log(currentQuery);
    axiosInstance
      .put(`/api/queries/${currentQuery.id}/`, currentQuery)
      .then((response) => {
        setQueries(queries.map((query) => (query.id === currentQuery.id ? response.data : query)));
        setOpen(false); // Close modal
      })
      .catch((error) => {
        console.error('Error updating query:', error);
      });
  };

  const handleOpen = (query = null) => {
    if (query) {
      setCurrentQuery(query);
      setNewQuery({ name: query.name, prompt: query.prompt }); // Pre-fill the fields for update
    } else {
      setCurrentQuery(null);
      setNewQuery({ name: '', prompt: '' }); // Clear fields for create
    }
    setOpen(true);
  };

  const handleDeleteOpen = (query) => {
    setCurrentQuery(query);
    setDeleteOpen(true);
  };

  return (
    <MainCard title="Query List">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Prompt</TableCell>
              <TableCell align="right" sx={{ minWidth: 200 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {queries.map((query) => (
              <TableRow key={query.id}>
                <TableCell component="th" scope="row">
                  {query.id}
                </TableCell>
                <TableCell>{query.name}</TableCell>
                <TableCell>{query.prompt}</TableCell>
                <TableCell align="right">
                  <Box display="flex" gap={1}>
                    <Button onClick={() => handleOpen(query)} variant="contained" color="primary" size="small">
                      Update
                    </Button>
                    <Button onClick={() => handleDeleteOpen(query)} variant="contained" color="secondary" size="small">
                      Delete
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Query Modal */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{currentQuery ? 'Update Query' : 'Add New Query'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Query Name"
            value={currentQuery ? currentQuery.name : newQuery.name}
            onChange={(e) => {
              if (currentQuery) {
                setCurrentQuery({ ...currentQuery, name: e.target.value });
              } else {
                setNewQuery({ ...newQuery, name: e.target.value });
              }
            }}
            fullWidth
            style={{ marginBottom: '20px' }}
          />
          <TextField
            label="Query Prompt"
            value={currentQuery ? currentQuery.prompt : newQuery.prompt}
            onChange={(e) => {
              if (currentQuery) {
                setCurrentQuery({ ...currentQuery, prompt: e.target.value });
              } else {
                setNewQuery({ ...newQuery, prompt: e.target.value });
              }
            }}
            fullWidth
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="default">
            Cancel
          </Button>
          <Button onClick={currentQuery ? handleUpdate : handleCreate} color="primary">
            {currentQuery ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this query?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)} color="default">
            Cancel
          </Button>
          <Button onClick={() => handleDelete(currentQuery.id)} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add New Query Form */}
      <div style={{ marginTop: '20px' }}>
        <Button onClick={() => handleOpen()} variant="contained" color="primary">
          Add New Query
        </Button>
      </div>
    </MainCard>
  );
};

export default QueryPage;
