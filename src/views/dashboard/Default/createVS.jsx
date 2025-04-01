import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useVSContext } from '../../../context/VSContext';

export default function CreateVS({ open, handleClose }) {
    const [name, setName] = React.useState("");
    const { state, dispatch } = useVSContext();

    const saveVS = async (event) => {
        event.preventDefault();

        if (!name.trim()) {
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_END_POINT}/new`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: name }),
            });

            if (!response.ok) {
                throw new Error("Failed to create vector store");
            }

            const data = await response.json();
            dispatch({ type: "CREATE_VS_SUCCESS", payload: data['new_vs'] });
            handleClose();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        component: 'form',
                        onSubmit: (event) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                            const formJson = Object.fromEntries(formData.entries());
                            const email = formJson.email;
                            console.log(email);
                            handleClose();
                        },
                    },
                }}
            >
                <DialogTitle>Create a new vector store</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="name"
                        label="Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        onChange={(e) => setName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button type="submit" onClick={saveVS}>Save</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}