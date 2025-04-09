import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import FolderTreeView from './FolderTreeView'; // Import FolderTreeView component
import axiosInstance from '../../../axiosInstance';
import QueryResultRightPanel from './QueryResultRightPanel'; // Import the right panel component

export default function QueryResult() {
  const [selectedFiles, setSelectedFiles] = useState({});
  const [folders, setFolders] = useState([]);
  const [queues, setQueues] = useState([]);
  const [queries, setQueries] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [queryDialogOpen, setQueryDialogOpen] = useState(false);
  const [selectedQueryIds, setSelectedQueryIds] = useState([]);

  // Fetch folders and files
  const fetchFolders = async () => {
    try {
      const response = await axiosInstance.get('/api/folders-with-files-and-query-results/');
      setFolders(response.data);
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  const fetchQueues = async () => {
    try {
      const response = await axiosInstance.get('/api/file-query-queues/');
      setQueues(response.data);
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  const fetchQueries = async () => {
    try {
      const response = await axiosInstance.get('/api/queries/');
      setQueries(response.data);
    } catch (error) {
      console.error('Error fetching queries: ', error);
    }
  };

  const handleQueryCheckboxChange = (queryId) => {
    setSelectedQueryIds((prev) => (prev.includes(queryId) ? prev.filter((id) => id !== queryId) : [...prev, queryId]));
  };

  useEffect(() => {
    // Function to fetch data
    const fetchData = () => {
      fetchFolders();
      fetchQueues();
    };

    // Initial fetch
    fetchData();
    fetchQueries();

    // Set an interval to fetch data periodically (e.g., every 30 seconds)
    const intervalId = setInterval(fetchData, 10000); // 30000ms = 30 seconds

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Handle folder selection/deselection (select/deselect all files and subfolders)
  const handleFolderSelection = (folderId, isSelected) => {
    const updatedFolders = folders.map((folder) => {
      if (folder.id === folderId) {
        return {
          ...folder,
          selectedStatus: isSelected ? 'selected' : 'notSelected',
          files:
            folder?.files?.map((file) => ({
              ...file,
              selectedStatus: isSelected ? 'selected' : 'notSelected'
            })) || [],
          subfolders: folder.subfolders?.map((subfolder) => ({
            ...subfolder,
            selectedStatus: isSelected ? 'selected' : 'notSelected'
          }))
        };
      }
      return folder;
    });

    // Update the folders state directly
    setFolders(updatedFolders);

    // Create the updated selectedFiles state
    const updatedSelectedFiles = { ...selectedFiles };
    const folder = folders.find((folder) => folder.id === folderId);

    folder.files.forEach((file) => {
      updatedSelectedFiles[file.id] = isSelected ? 'selected' : 'notSelected';
    });

    setSelectedFiles(updatedSelectedFiles);
  };

  const handleConfirmRunQueue = async () => {
    const selectedFileIds = filteredFiles.flatMap((folder) => folder.files.map((file) => file.id));

    try {
      await axiosInstance.post('/api/create-file-query-queue/', {
        file_ids: selectedFileIds,
        query_ids: selectedQueryIds
      });
      setQueryDialogOpen(false);
      fetchQueues(); // Refresh queues
    } catch (error) {
      console.error('Failed to run queries on selected files:', error);
    }
  };

  // Handle file selection updates from FolderTreeView
  const handleFileSelection = (fileId, folderId, isSelected) => {
    let updatedSelectedFiles = {
      ...selectedFiles,
      [fileId]: isSelected ? 'selected' : 'notSelected'
    };

    setSelectedFiles(updatedSelectedFiles);
  };

  const handleClearQueue = async () => {
    try {
      await axiosInstance.post('/api/clear-queue-list/');
      setQueues([]); // Optionally reset UI
      setConfirmOpen(false); // Close dialog
    } catch (error) {
      console.error('Failed to clear queue:', error);
    }
  };

  // Assuming the state for folders and selectedFiles are available in the component
  const filteredFiles = useMemo(() => {
    return folders.reduce((result, folder) => {
      const selectedFolderFiles = folder?.files?.filter((file) => selectedFiles[file.id] === 'selected') || [];
      if (selectedFolderFiles.length > 0) {
        result.push({
          folderName: folder.folderName,
          files: selectedFolderFiles,
          folderId: folder.folderId
        });
      }
      return result;
    }, []);
  }, [folders, selectedFiles]);

  // Count statuses
  const total = queues.length;
  const completed = queues.filter((q) => q.status === 'completed').length;
  const failed = queues.filter((q) => q.status === 'failed').length;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h5" gutterBottom>
        File Selection Dashboard
      </Typography>
      <Grid container spacing={2}>
        {/* Left side: Folder Tree View */}
        <Grid item xs={12} lg={6}>
          <FolderTreeView
            folders={folders}
            selectedFiles={selectedFiles}
            handleFileSelection={handleFileSelection}
            handleFolderSelection={handleFolderSelection}
          />
        </Grid>

        {/* Right side: Query Result and Selected File List */}
        <Grid item xs={12} lg={6}>
          {queues.length > 0 ? (
            <Stack spacing={1}>
              <Typography variant="body2" align="center">
                Queue: {total} | ✅ Completed: {completed} | ❌ Failed: {failed}
              </Typography>
              <Button variant="contained" sx={{ width: '100%' }} onClick={() => setConfirmOpen(true)}>
                Clear Queue
              </Button>
            </Stack>
          ) : (
            <Button
              variant="contained"
              sx={{ width: '100%' }}
              onClick={() => setQueryDialogOpen(true)}
              disabled={filteredFiles.length === 0}
            >
              Run Queue
            </Button>
          )}
          <QueryResultRightPanel selectedFiles={filteredFiles} />
        </Grid>
      </Grid>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Clear Queue?</DialogTitle>
        <DialogContent>
          <DialogContentText>This action will remove all queued results. Are you sure you want to continue?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleClearQueue} color="error">
            Clear
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={queryDialogOpen} onClose={() => setQueryDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Select Queries to Run</DialogTitle>
        <DialogContent>
          {queries.map((query) => (
            <Box key={query.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedQueryIds.includes(query.id)}
                    onChange={() => handleQueryCheckboxChange(query.id)}
                    color="primary" // You can change this to any color, or even use 'default' or 'secondary'
                  />
                }
                label={query.name}
              />
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQueryDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmRunQueue} variant="contained">
            Run Selected Queries
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
