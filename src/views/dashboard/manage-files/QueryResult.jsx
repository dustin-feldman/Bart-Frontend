import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import FolderTreeView from './FolderTreeView'; // Import FolderTreeView component
import axiosInstance from '../../../axiosInstance';
import QueryResultRightPanel from './QueryResultRightPanel'; // Import the right panel component

export default function QueryResult() {
  const [selectedFiles, setSelectedFiles] = useState({});
  const [folders, setFolders] = useState([]);

  // Fetch folders and files
  const fetchFolders = async () => {
    try {
      const response = await axiosInstance.get('/api/folders-with-files-and-query-results/');
      setFolders(response.data);
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  // Handle folder selection/deselection (select/deselect all files and subfolders)
  const handleFolderSelection = (folderId, isSelected) => {
    const updatedFolders = folders.map((folder) => {
      if (folder.id === folderId) {
        return {
          ...folder,
          selectedStatus: isSelected ? 'selected' : 'notSelected',
          files: folder.files.map((file) => ({
            ...file,
            selectedStatus: isSelected ? 'selected' : 'notSelected'
          })),
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

    console.log(updatedSelectedFiles);

    setSelectedFiles(updatedSelectedFiles);
  };

  // Handle file selection updates from FolderTreeView
  const handleFileSelection = (fileId, folderId, isSelected) => {
    let updatedSelectedFiles = {
      ...selectedFiles,
      [fileId]: isSelected ? 'selected' : 'notSelected'
    };

    console.log(updatedSelectedFiles);
    setSelectedFiles(updatedSelectedFiles);
  };

  // Assuming the state for folders and selectedFiles are available in the component
  const filteredFiles = useMemo(() => {
    return folders.reduce((result, folder) => {
      const selectedFolderFiles = folder.files.filter((file) => selectedFiles[file.id] === 'selected');
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
          <QueryResultRightPanel selectedFiles={filteredFiles} />
        </Grid>
      </Grid>
    </Box>
  );
}
