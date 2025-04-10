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
  FormControlLabel,
  LinearProgress
} from '@mui/material';
import FolderTreeView from './FolderTreeView'; // Import FolderTreeView component
import axiosInstance from '../../../axiosInstance';
import QueryResultRightPanel from './QueryResultRightPanel'; // Import the right panel component
import moment from 'moment';
import { useTheme } from '@mui/material/styles';

export default function QueryResult() {
  const theme = useTheme();  // Access the theme object

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

  const handleExport = async () => {
    try {
      // Get the selected file IDs
      const selectedFileIds = filteredFiles.flatMap((folder) => folder.files.map((file) => file.id));

      // Make the POST request to generate the CSV
      const response = await axiosInstance.post(
        '/api/export/',
        {
          file_ids: selectedFileIds // Send the file IDs in the body of the request
        },
        {
          responseType: 'blob' // Ensure the response is a binary file (CSV)
        }
      );

      // Create a Blob from the CSV data in the response
      const blob = new Blob([response.data], { type: 'text/csv' });

      // Create a link element to trigger the download
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      link.href = url;

      const currentDate = moment().format('MM-DD-YYYY');

      link.download = `file_query_results_${currentDate}.csv`; // The name of the downloaded file

      // Programmatically click the link to trigger the download
      link.click();

      // Clean up the object URL after the download
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting CSV:', error);
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
            <Stack>
              <Box sx={{ position: 'relative', width: '100%', padding: 0, margin: 0 }}>
                {/* Progress text */}
                <Typography
                  align="center"
                  sx={{
                    position: 'absolute',
                    top: '30%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1, // Ensures text is on top
                    color: 'white', // Optional: Change text color for better visibility
                    backgroundColor: theme.palette.primary.main, // Set background to primary color
                  }}
                >
                  Queue: {total} | ✅ Completed: {completed} | ❌ Failed: {failed}
                </Typography>

                {/* Progress Bar */}
                <LinearProgress
                  variant="buffer"
                  value={((completed + failed) / total) * 100} // Actual progress
                  valueBuffer={((completed + failed) / total) * 100} // Target progress
                  sx={{ marginBottom: 2, height: 30, borderRadius: 1 }}
                  color="primary"
                />
              </Box>
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

          <Button variant="contained" sx={{ width: '100%' }} onClick={handleExport} disabled={filteredFiles.length === 0}>
            Export
          </Button>
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
