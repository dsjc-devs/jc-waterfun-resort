import React, { useMemo } from 'react';
import { APP_DEFAULT_PATH } from 'config/config';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import PageTitle from 'components/PageTitle';
import ReusableTable from 'components/ReusableTable';
import { Button, Chip } from '@mui/material';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useGetBlockedDates } from 'api/blocked-dates';
import agent from 'api';
import useGetPosition from 'hooks/useGetPosition';
import { toast } from 'react-toastify';

const BlockedDatesPage = () => {
  const navigate = useNavigate();
  const { isAdmin, isMasterAdmin } = useGetPosition();
  const { data = [], isLoading, mutate } = useGetBlockedDates();

  // Guard: Only Admin & Master Admin
  if (!isAdmin && !isMasterAdmin) {
    return (
      <React.Fragment>
        <PageTitle title="Unauthorized" />
        <Breadcrumbs custom heading="Unauthorized" links={[{ title: 'Home', to: APP_DEFAULT_PATH }]} subheading="You do not have access to Blocked Dates." />
      </React.Fragment>
    );
  }

  const rows = Array.isArray(data) ? data : (data?.blockedDates || []);

  const columns = useMemo(() => [
    {
      id: 'startDate',
      label: 'Start',
      sortValue: (r) => new Date(r.startDate).getTime(),
      renderCell: (r) => new Date(r.startDate).toLocaleString()
    },
    {
      id: 'endDate',
      label: 'End',
      sortValue: (r) => new Date(r.endDate).getTime(),
      renderCell: (r) => new Date(r.endDate).toLocaleString()
    },
    {
      id: 'reason',
      label: 'Reason',
      renderCell: (r) => r.reason || '—'
    },
    {
      id: 'scope',
      label: 'Scope',
      renderCell: (r) => (
        r.accommodationId ? <Chip size="small" color="primary" label="Specific Facility" /> : <Chip size="small" color="warning" label="Resort-wide" />
      )
    },
    {
      id: 'actions',
      label: 'Actions',
      renderCell: (r) => (
        <>
          <Button size="small" color="primary" startIcon={<EditOutlined />} sx={{ mr: 1 }} onClick={() => navigate(`/portal/blocked-dates/form?id=${r._id || r.id}`)}>
            Edit
          </Button>
          <Button size="small" color="error" startIcon={<DeleteOutlined />} onClick={() => handleDelete(r)}>
            Delete
          </Button>
        </>
      )
    }
  ], []);

  const handleDelete = async (row) => {

    try {
      await agent.BlockedDates.deleteBlockedDate(row._id || row.id);
      toast.success('Blocked date removed');
      mutate();
    } catch (e) {
      toast.error(e.message || 'Failed to delete');
    }
  };

  return (
    <React.Fragment>
      <PageTitle title="Blocked Dates" />
      <Breadcrumbs
        custom
        heading="Blocked Dates"
        links={[{ title: 'Home', to: APP_DEFAULT_PATH }, { title: 'Blocked Dates' }]}
        subheading="Create resort-wide or facility-specific date ranges where bookings are disabled."
      />

      <ReusableTable
        columns={columns}
        rows={rows?.filter((f) => !f.isFromReservation)}
        isLoading={isLoading}
        searchableColumns={["reason"]}
        settings={{
          otherActionButton: (
            <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => navigate('/portal/blocked-dates/form')}>
              New Blocked Date
            </Button>
          ),
          order: 'desc',
          orderBy: 'startDate'
        }}
      />
    </React.Fragment>
  );
};

export default BlockedDatesPage;
