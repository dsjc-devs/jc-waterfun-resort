import React, { useState, useEffect } from 'react';
import { Button, Grid, InputAdornment, Stack, TextField, Pagination, Box, Skeleton, Typography } from '@mui/material';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { useGetAccommodations } from 'api/accommodations';

import MainCard from 'components/MainCard';
import NoContentFound from './NoContentFound';
import RoomCard from 'components/accommodations/RoomCard';
import AnimateButton from 'components/@extended/AnimateButton';
import textFormatter from 'utils/textFormatter';
import ProductPlaceholder from 'components/cards/skeleton/ProductPlaceholder';
import ConfirmationDialog from 'components/ConfirmationDialog';
import agent from 'api';
import { toast } from 'react-toastify';
import Loader from 'components/Loader';
import EmptyUserCard from 'components/cards/skeleton/EmptyUserCard';

const AccommodationGroup = ({ type = '' }) => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [deleteConfigs, setDeleteConfigs] = useState({
    id: "",
    open: false
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(1);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchInput]);

  const { data, isLoading, mutate } = useGetAccommodations({
    type,
    page,
    limit: 6,
    search: searchTerm,
    sort: "name"
  });

  const accommodations = data?.accommodations ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handlePageChange = (event, value) => setPage(value);

  const handleDelete = async () => {
    setLoading(true)
    try {
      await agent.Accommodations.deleteAccommodation(deleteConfigs.id)
      toast.success('Deleted successfully.', {
        position: 'top-right',
        autoClose: 3000
      })
    } catch (error) {
      toast.error(error, {
        position: 'top-right',
        autoClose: 3000
      })
    } finally {
      setLoading(false)
      setDeleteConfigs({ open: false, id: '' })
      await mutate()
    }
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [accommodations]);

  return (
    <React.Fragment>
      <Stack direction="row" justifyContent="space-between" marginBlockEnd={2}>
        <TextField
          placeholder={`Search for ${textFormatter.fromSlug(type)}...`}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined style={{ color: "secondary" }} />
              </InputAdornment>
            ),
          }}
          sx={{ width: "300px", borderRadius: "12px" }}
        />

        <AnimateButton>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PlusOutlined />}
            onClick={() => navigate(`/portal/accommodations/form?type=${type}`)}
          >
            Add {textFormatter.fromSlug(type).replace(/s$/, '')}
          </Button>
        </AnimateButton>
      </Stack>

      <MainCard>
        <Grid container spacing={2}>
          {(isLoading || loading) && Array.from({ length: 6 }).map((_, index) => (
            <Grid item xs={12} md={4} key={index}>
              <ProductPlaceholder />
              <Loader />
            </Grid>
          ))}

          {!isLoading && accommodations.length > 0 && accommodations.map(acc => (
            <Grid item xs={12} md={4} key={acc._id}>
              <RoomCard
                roomData={acc}
                onView={() => navigate(`/portal/accommodations/details/${acc._id}`)}
                onEdit={() => navigate(`/portal/accommodations/form?id=${acc?._id}&isEditMode=true&type=${acc?.type}`)}
                onDelete={() => setDeleteConfigs(({ id: acc?._id, open: true }))}
                isOnPortal={true}
              />
            </Grid>
          ))}

          {!isLoading && accommodations.length === 0 && (
            <EmptyUserCard title={`No ${textFormatter.fromSlug(type)}s as of the moment`} />
          )}
        </Grid>

        {totalPages > 1 && !isLoading && (
          <Stack alignItems='center' marginBlockStart={3}>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Showing {accommodations.length} of {data.totalAccommodations} {textFormatter.fromSlug(type)}
            </Typography>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Stack>
        )}
      </MainCard>

      <ConfirmationDialog
        title={`Delete ${type}`}
        description={`Are you sure you want to delete this ${type}?`}
        handleConfirm={handleDelete}
        open={deleteConfigs.open}
        handleClose={() => setDeleteConfigs({ ...deleteConfigs, open: false })}
      />
    </React.Fragment>
  );
};

export default AccommodationGroup;
