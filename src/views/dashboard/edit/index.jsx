import * as React from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDropzone } from "react-dropzone";
import { Button, Typography, List, ListItem, IconButton, Paper } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import { useVSContext } from '../../../context/VSContext';

export default function EditVS() {
    const { id } = useParams();
    const { state, dispatch } = useVSContext();

    const [files, setFiles] = useState([]);

    const onDrop = (acceptedFiles) => {
        const pdfFiles = acceptedFiles.filter((file) => file.type === "application/pdf");
        setFiles((prevFiles) => [...prevFiles, ...pdfFiles]);
    };

    const removeFile = (fileName) => {
        setFiles(files.filter((file) => file.name !== fileName));
    };

    const uploadFiles = async () => {
        const formData = new FormData();
        formData.append("id", id);

        files.forEach((file) => {
            formData.append("pdfs", file);
        });

        try {
            const response = await fetch(`${import.meta.env.VITE_API_END_POINT}/upload-pdf`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to upload pdfs");
            }

            const data = await response.json();
            dispatch({ type: "UPLOAD_PDFS_SUCCESS", payload: {
                "store_id": id,
                "upload_results" : data.upload_results
            }});

        } catch (error) {
            console.error("Error uploading files:", error);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: { "application/pdf": [] },
        multiple: true,
    });


    useEffect(() => {
        const fetchVectorStore = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_END_POINT}/${id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch vector stores");
                }
                const data = await response.json();
                dispatch({ type: "FETCH_VS_SUCCESS", payload: data['vs'] });
            } catch (error) {
            }
        };

        fetchVectorStore();
    }, [dispatch]);

    return (
        <Box sx={{ width: '100%', mx: "auto", mt: 4, p: 2 }}>
            <Paper
                {...getRootProps()}
                sx={{
                    border: "2px dashed #1976d2",
                    borderRadius: 2,
                    p: 3,
                    textAlign: "center",
                    cursor: "pointer",
                }}
            >
                <input {...getInputProps()} />
                <CloudUploadIcon color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="body1" mt={1}>
                    Drag & drop PDF files here, or click to select
                </Typography>
            </Paper>

            {files.length > 0 && (
                <Box mt={3}>
                    <Typography variant="h6">Selected Files:</Typography>
                    <List>
                        {files.map((file) => (
                            <ListItem key={file.name} sx={{ display: "flex", justifyContent: "space-between" }}>
                                {file.name}
                                <IconButton onClick={() => removeFile(file.name)} color="error">
                                    <DeleteIcon />
                                </IconButton>
                            </ListItem>
                        ))}
                    </List>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<CloudUploadIcon />}
                        onClick={uploadFiles}
                        sx={{ mt: 2 }}
                    >
                        Upload PDFs
                    </Button>
                </Box>
            )}
            <Box mt={3} sx={{ border: '1px solid #ccc', padding: '8px 4px' }}>
                {state.vs ? state.vs.files.map((file) => (
                    <span
                        style={{
                            display: 'inline-block',
                            backgroundColor: '#CCC',
                            padding: '4px 8px',
                            borderRadius: '16px / 50%',
                            marginRight: '8px',
                            marginBottom: '8px'
                        }}
                        key={file.file_id}
                    >{file.filename}</span>
                )) : ''}
            </Box>
        </Box>
    )
}