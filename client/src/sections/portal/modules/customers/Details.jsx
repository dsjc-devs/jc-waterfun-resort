import React, { useState } from 'react';
import {
  Grid, CircularProgress, Stack, Button
} from '@mui/material';
import MainCard from 'components/MainCard';
import ConvertDate from 'components/ConvertDate';
import LabeledValue from 'components/LabeledValue';
import {
  BookOutlined, CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined,
  DeleteOutlined, EditOutlined, MailOutlined, PhoneOutlined, PictureOutlined,
  TagOutlined, UserOutlined
} from '@ant-design/icons';
import AnimateButton from 'components/@extended/AnimateButton';
import ConfirmationDialog from 'components/ConfirmationDialog';
import UserEditModal from './UserEditModal';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import agent from 'api';

const Details = ({ user, isLoading, mutate = () => { } }) => {
  const navigate = useNavigate();

  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(false);

  if (isLoading || !user) {
    return (
      <Grid container justifyContent="center" sx={{ mt: 5 }}>
        <CircularProgress />
      </Grid>
    );
  }

  const {
    firstName,
    lastName,
    emailAddress,
    phoneNumber,
    avatar,
    createdAt,
    status,
    userId
  } = user;

  const handleEditOpen = () => {
    setEditForm({
      firstName,
      lastName,
      emailAddress,
      phoneNumber,
      avatar,
      createdAt,
      status,
      userId,
    });
    setOpenEdit(true);
  };

  const handleEditChange = (data) => {
    setEditForm((prev) => ({ ...prev, ...data }));
  };

  const handleEditSave = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData()
      Object.keys(values).forEach((key) => {
        if (key === 'avatar') {
          if (typeof values[key] === 'string') {
            formData.append('avatar', values[key]);
          } else if (values[key] && values[key].length > 0) {
            formData.append('avatar', values[key][0]);
          }
        } else {
          formData.append(key, values[key]);
        }
      });

      await agent.Users.editUser(userId, formData);
      toast.success('Customer updated successfully.');
      setOpenEdit(false);
      await mutate();
    } catch (error) {
      toast.error(error?.message || 'Error updating customer.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      await agent.Users.deleteUser(userId);
      toast.success('Customer successfully deleted.');
      setOpenDelete(false);
      navigate('/portal/customers');
    } catch (error) {
      toast.error(error?.message || 'Error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack direction="row" justifyContent="flex-end" paddingInline={2} marginBottom={1} spacing={2}>
        <AnimateButton>
          <Button
            variant="contained"
            size="small"
            color="info"
            startIcon={<EditOutlined />}
            onClick={handleEditOpen}
          >
            Edit
          </Button>
        </AnimateButton>
        <AnimateButton>
          <Button
            variant="contained"
            size="small"
            color="error"
            startIcon={<DeleteOutlined />}
            onClick={() => setOpenDelete(true)}
          >
            Delete
          </Button>
        </AnimateButton>
      </Stack>

      <MainCard>
        <Grid container spacing={2} alignItems="stretch">
          <Grid item sm={12} md={6} sx={{ display: 'flex' }}>
            <MainCard title="Profile Information">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <LabeledValue icon={<UserOutlined />} title="Full Name" subTitle={`${firstName} ${lastName}`} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LabeledValue icon={<MailOutlined />} title="Email Address" subTitle={emailAddress} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LabeledValue icon={<PhoneOutlined />} title="Mobile Number" subTitle={phoneNumber || 'N/A'} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LabeledValue icon={<CalendarOutlined />} title="Account Created" subTitle={<ConvertDate dateString={createdAt} time />} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LabeledValue icon={<CheckCircleOutlined />} title="Status" subTitle={status} />
                </Grid>
                {avatar && (
                  <Grid item xs={12}>
                    <LabeledValue
                      icon={<PictureOutlined />}
                      title="Avatar"
                      subTitle={<img src={avatar} alt={`${firstName} ${lastName}`} style={{ width: 100, height: 100, borderRadius: '50%' }} />}
                    />
                  </Grid>
                )}
              </Grid>
            </MainCard>
          </Grid>

          <Grid item sm={12} md={6} sx={{ display: 'flex' }}>
            <MainCard title="Reservation Summary">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <LabeledValue icon={<BookOutlined />} title="Total Reservations" subTitle={18} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LabeledValue icon={<ClockCircleOutlined />} title="Upcoming Reservations" subTitle={5} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LabeledValue icon={<CheckCircleOutlined />} title="Past Reservations" subTitle={13} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LabeledValue icon={<CalendarOutlined />} title="Last Reservation" subTitle={<ConvertDate dateString="2025-08-06T14:30:00Z" time />} />
                </Grid>
                <Grid item xs={12}>
                  <LabeledValue icon={<TagOutlined />} title="Most Frequent Service" subTitle="Cottage Rental" />
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
        </Grid>
      </MainCard>

      <UserEditModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        formData={editForm}
        onChange={handleEditChange}
        onSave={handleEditSave}
        isSaving={loading}
      />

      <ConfirmationDialog
        title="Delete Customer"
        description="Are you sure you want to delete this customer?"
        handleConfirm={handleDeleteConfirm}
        open={openDelete}
        handleClose={() => setOpenDelete(false)}
      />
    </>
  );
};

export default Details;
