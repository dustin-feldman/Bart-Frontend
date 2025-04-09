import React, { useState, useEffect } from 'react';
import { Button, TextField, Box, Grid, Card, CardContent, Typography, IconButton } from '@mui/material';
import { Add, Delete, UploadFile } from '@mui/icons-material';
import axiosInstance from '../../../axiosInstance';
import FolderTable from './FolderTable';

const FileUploadPage = () => {
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [files, setFiles] = useState([]);

  const fetchFolders = async () => {
    try {
      const response = await axiosInstance.get('/api/folders/'); // Change to your API
      setFolders(response.data);
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  const createFolder = async () => {
    if (!newFolderName) return;
    try {
      const response = await axiosInstance.post('/api/folders/create/', { name: newFolderName });
      setFolders([...folders, response.data]);
      setNewFolderName('');
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  const removeFolder = async (folderId) => {
    try {
      await axiosInstance.delete(`/api/folders/${folderId}/delete/`);
      setFolders(folders.filter((folder) => folder.id !== folderId));
    } catch (error) {
      console.error('Error removing folder:', error);
    }
  };

  const handleFolderClick = async (folder) => {
    setSelectedFolder(folder);
    try {
      const response = await axiosInstance.get(`/api/folders/${folder.id}/files`);
      setFiles(response.data);
    } catch (error) {
      console.error('Error fetching files for folder:', error);
    }
  };

  const handleFileUpload = async (event) => {
    const formData = new FormData();
    Array.from(event.target.files).forEach((file) => {
      formData.append('files', file);
    });
    try {
      await axiosInstance.post(`/api/folders/${selectedFolder.id}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchFolders(); // Re-fetch folders to get updated files
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  return <FolderTable />;
};

export default FileUploadPage;
