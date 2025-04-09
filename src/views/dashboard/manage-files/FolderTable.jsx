import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  LinearProgress
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp, Delete as DeleteIcon, UploadFile } from '@mui/icons-material';
import axiosInstance from '../../../axiosInstance';
import { useDispatch } from 'react-redux';
import { showSnackbar } from '../../../store/snackbarSlice';

function FolderRow({ folder, onFileUpload, onDeleteFile, onDeleteFolder }) {
  const [open, setOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const dispatch = useDispatch();

  const fileInputRef = useRef(null);

  const handleClickUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // Reset file input
    }
  };

  const handleFileUpload = async (folderId, files) => {
    if (!files.length) return;

    console.log(files.length);

    const formData = new FormData();
    Array.from(files).forEach((file, index) => {
      formData.append(`file-${index}`, file);
    });

    try {
      setIsUploading(true);
      const uploadRes = await axiosInstance.post('/api/upload/files', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        }
      });

      const attachments = uploadRes.data.attachments;

      // Create files after upload
      await Promise.all(
        attachments.map((att) =>
          axiosInstance.post('/api/files/create/', {
            folder_id: folderId,
            file_url: att.file_url,
            file_name: att.file_name
          })
        )
      );

      dispatch(showSnackbar({ message: 'Files uploaded successfully' }));
      onFileUpload();
    } catch (err) {
      dispatch(showSnackbar({ message: 'Upload failed', severity: 'error' }));
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{folder.name}</TableCell>
        <TableCell align="right">
          <Button variant="outlined" color="error" onClick={() => onDeleteFolder(folder.id)} size="small">
            Delete Folder
          </Button>
        </TableCell>
        <TableCell align="right" colSpan={2}>
          <Button variant="outlined" component="label" size="small" onClick={handleClickUpload}>
            Upload
            <input type="file" hidden multiple ref={fileInputRef} onChange={(e) => handleFileUpload(folder.id, e.target.files)} />
          </Button>
        </TableCell>
      </TableRow>
      {isUploading && (
        <TableRow>
          <TableCell colSpan={5}>
            <Box px={2} py={1}>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Typography variant="body2" color="textSecondary" align="center" mt={1}>
                Uploading... {uploadProgress}%
              </Typography>
            </Box>
          </TableCell>
        </TableRow>
      )}
      <TableRow>
        <TableCell colSpan={5} style={{ paddingBottom: 0, paddingTop: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box m={2}>
              <Typography variant="subtitle1">Files</Typography>
              {folder.files.length === 0 ? (
                <Typography variant="body2">No files</Typography>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>File Name</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {folder.files.map((file) => (
                      <TableRow key={file.id}>
                        <TableCell>
                          <a href={file.file} target="_blank" rel="noreferrer">
                            {file.name}
                          </a>
                        </TableCell>
                        <TableCell>
                          <Button variant="outlined" color="error" size="small" onClick={() => onDeleteFile(file.id)}>
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function FolderTable() {
  const [folders, setFolders] = useState([]);
  const [folderName, setFolderName] = useState('');

  const [openRemoveFolderDialog, setOpenRemoveFolderDialog] = useState(false);
  const [openRemoveFileDialog, setOpenRemoveFileDialog] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState(null);
  const [fileToDelete, setFileToDelete] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const showToast = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchFolders = () => {
    axiosInstance.get('/api/folders-with-files/').then((res) => setFolders(res.data));
  };

  const handleCreateFolder = () => {
    if (!folderName) return;
    axiosInstance
      .post('/api/folders/create/', { name: folderName })
      .then(() => {
        setFolderName('');
        fetchFolders();
        showToast('Folder created successfully');
      })
      .catch(() => {
        showToast('Failed to create folder', 'error');
      });
  };

  const confirmDeleteFolder = (folderId) => {
    setFolderToDelete(folderId);
    setOpenRemoveFolderDialog(true);
  };

  const handleConfirmFolderDelete = () => {
    if (!folderToDelete) return;
    axiosInstance.delete(`/api/folders/${folderToDelete}/delete/`).then(() => {
      fetchFolders();
      setOpenRemoveFolderDialog(false);
      setFolderToDelete(null);
    });
  };

  const confirmDeleteFile = (fileId) => {
    setFileToDelete(fileId);
    setOpenRemoveFileDialog(true);
  };

  const handleConfirmFileDelete = () => {
    if (!fileToDelete) return;
    axiosInstance.delete(`/api/files/${fileToDelete}/delete/`).then(() => {
      fetchFolders();
      setOpenRemoveFileDialog(false);
      setFileToDelete(null);
    });
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Folder & File Manager
      </Typography>

      <Box display="flex" gap={2} mb={2}>
        <TextField label="New Folder Name" value={folderName} onChange={(e) => setFolderName(e.target.value)} size="small" />
        <Button variant="contained" onClick={handleCreateFolder}>
          Create Folder
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Folder Name</TableCell>
              <TableCell align="right">Actions</TableCell>
              <TableCell align="right" colSpan={2}>
                Upload
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {folders.map((folder) => (
              <FolderRow
                key={folder.id}
                folder={folder}
                onFileUpload={fetchFolders}
                onDeleteFile={confirmDeleteFile}
                onDeleteFolder={confirmDeleteFolder}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openRemoveFolderDialog} onClose={() => setOpenRemoveFolderDialog(false)}>
        <DialogTitle>Confirm Folder Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this folder and all of its files?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRemoveFolderDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmFolderDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openRemoveFileDialog} onClose={() => setOpenRemoveFileDialog(false)}>
        <DialogTitle>Confirm File Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this file?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRemoveFileDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmFileDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
