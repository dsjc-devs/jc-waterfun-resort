import React, { useMemo, useState } from 'react';
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { useGetFAQS } from 'api/faqs';
import { toast } from 'react-toastify';
import agent from 'api';
import ReusableTable from 'components/ReusableTable';
import ConfirmationDialog from 'components/ConfirmationDialog';
import IconButton from 'components/@extended/IconButton';
import ConvertDate from 'components/ConvertDate';

const statusLabels = {
  POSTED: 'Posted',
  UNPUBLISHED: 'Unpublished',
  ARCHIVED: 'Archived'
};
const statusColors = {
  POSTED: 'primary',
  UNPUBLISHED: 'warning',
  ARCHIVED: 'error'
};

const FAQsTable = () => {
  const { data, isLoading, mutate } = useGetFAQS();
  const faqs = data?.faqs || [];

  const [modalState, setModalState] = useState({
    open: false,
    editingFaq: null
  });

  const [deleteTarget, setDeleteTarget] = useState(null);

  const [formState, setFormState] = useState({
    title: '',
    answer: '',
    category: '', 
    status: 'POSTED'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setFormState({ title: '', answer: '', category: '', status: 'POSTED' });
    setModalState({ open: true, editingFaq: null });
  };

  const openEditModal = (faq) => {
    setFormState({
      title: faq.title,
      answer: faq.answer,
      category: faq.category || '', // ← SUPPORT EXISTING FAQ CATEGORY
      status: faq.status
    });
    setModalState({ open: true, editingFaq: faq });
  };

  const handleSubmit = async () => {
    try {
      if (!formState.title.trim() || !formState.answer.trim()) {
        toast.error('Title and answer are required');
        return;
      }

      if (modalState.editingFaq) {
        await agent.FAQS.editFAQ(modalState.editingFaq._id, formState);
        toast.success('FAQ updated');
      } else {
        await agent.FAQS.addFAQ(formState);
        toast.success('FAQ created');
      }

      await mutate();
      setModalState({ open: false, editingFaq: null });
    } catch (error) {
      console.error('Submit FAQ error:', error.response || error.message || error);
      toast.error('Something went wrong: ' + (error.response?.data?.message || error.message || 'Unknown error'));
    }
  };

  const handleDelete = async () => {
    try {
      if (deleteTarget) {
        await agent.FAQS.deleteFAQ(deleteTarget._id);
        toast.success('FAQ deleted');
        await mutate();
        setDeleteTarget(null);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete FAQ');
    }
  };

  const columns = useMemo(
    () => [
      {
        id: 'title',
        label: 'Title',
        renderCell: (row) => (
          <Tooltip title={row.title}>
            <Typography
              variant="subtitle1"
              noWrap
              sx={{
                maxWidth: 250,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {row.title}
            </Typography>
          </Tooltip>
        )
      },
      {
        id: 'status',
        label: 'Status',
        renderCell: (row) => (
          <Chip sx={{ width: '150px' }} label={statusLabels[row.status]} color={statusColors[row.status]} />
        )
      },
      {
        id: 'createdAt',
        align: 'left',
        disablePadding: true,
        label: 'Date Created',
        renderCell: (row) => <ConvertDate dateString={row.createdAt} />
      },
      {
        id: 'actions',
        label: 'Actions',
        renderCell: (row) => (
          <Stack direction="row" spacing={1}>
            <Tooltip title="Edit FAQ">
              <IconButton color="info" onClick={() => openEditModal(row)}>
                <EditOutlined />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete FAQ">
              <IconButton color="error" onClick={() => setDeleteTarget(row)}>
                <DeleteOutlined />
              </IconButton>
            </Tooltip>
          </Stack>
        )
      }
    ],
    []
  );

  const otherActionButtons = (
    <Button
      variant="contained"
      startIcon={<PlusOutlined />}
      onClick={openAddModal}
      sx={{ width: '150px' }}
    >
      Add FAQ
    </Button>
  );

  return (
    <React.Fragment>
      <ReusableTable
        searchableColumns={['title', 'answer', 'status']}
        itemsPerPage={6}
        columns={columns}
        rows={faqs}
        isLoading={isLoading}
        noMessage="No FAQs found"
        settings={{
          otherActionButton: otherActionButtons
        }}
      />

      <Dialog
        open={modalState.open}
        onClose={() => setModalState({ open: false, editingFaq: null })}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Typography variant="h4">{modalState.editingFaq ? 'Edit FAQ' : 'Add New FAQ'}</Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography>Title (Required)</Typography>
              <TextField
                name="title"
                fullWidth
                value={formState.title}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography mt={2}>Answer (Required)</Typography>
              <TextField
                name="answer"
                fullWidth
                multiline
                rows={3}
                value={formState.answer}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography mt={2}>Category (Required)</Typography>
              <TextField
                name="category"
                fullWidth
                value={formState.category}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography mt={2}>Status</Typography>
              <TextField
                select
                name="status"
                value={formState.status}
                onChange={handleInputChange}
                fullWidth
              >
                {Object.entries(statusLabels).map(([key, label]) => (
                  <MenuItem key={key} value={key}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalState({ open: false, editingFaq: null })}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {modalState.editingFaq ? 'Update FAQ' : 'Create FAQ'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmationDialog
        title="Delete FAQ"
        description={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        handleConfirm={handleDelete}
        open={Boolean(deleteTarget)}
        handleClose={() => setDeleteTarget(null)}
      />
    </React.Fragment>
  );
};

export default FAQsTable;
