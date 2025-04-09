import React from 'react';
import { Box, Typography } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { Checkbox, FormControlLabel } from '@mui/material';

export default function FolderTreeView({ folders, selectedFiles, handleFileSelection, handleFolderSelection }) {
  // Map folders and files to SimpleTreeView format
  const mapFoldersToTreeItems = (folders) => {
    return folders.map((folder) => (
      <TreeItem
        key={'folder-' + folder.id}
        itemId={'folder-' + folder.id.toString()}
        label={
          <FormControlLabel
            control={
              <Checkbox
                checked={folder.selectedStatus === 'selected'}
                indeterminate={folder.selectedStatus === 'someSelected'}
                onChange={(e) => handleFolderSelection(folder.id, e.target.checked)}
              />
            }
            label={folder.name}
            onClick={(e) => e.stopPropagation()} // Prevent toggle on label click
          />
        }
        onToggle={() => {}} // Prevent expansion/collapse on toggle
      >
        {folder.files.map((file) => (
          <TreeItem
            key={'file-' + file.id}
            itemId={'file-' + file.id.toString()}
            label={
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedFiles[file.id] === 'selected'}
                    onChange={(e) => handleFileSelection(file.id, folder.id, e.target.checked)}
                  />
                }
                label={
                  <a href={file.file} target="_blank" rel="noreferrer">
                    {file.name}
                  </a>
                }
              />
            }
          />
        ))}
        {folder.subfolders?.map((subfolder) => (
          <TreeItem
            key={'subfolder-' + subfolder.id}
            itemId={'subfolder-' + subfolder.id.toString()}
            label={
              <FormControlLabel
                control={
                  <Checkbox
                    checked={subfolder.selectedStatus === 'selected'}
                    onChange={(e) => handleFolderSelection(subfolder.id, e.target.checked)}
                  />
                }
                label={subfolder.name}
              />
            }
          />
        ))}
      </TreeItem>
    ));
  };

  return (
    <Box sx={{ minHeight: 352, minWidth: 290 }}>
      <Typography variant="h5" gutterBottom>
        Folder & File Tree
      </Typography>
      <SimpleTreeView multiSelect>{mapFoldersToTreeItems(folders)}</SimpleTreeView>
    </Box>
  );
}
