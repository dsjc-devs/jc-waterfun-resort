import React, { useState, useEffect } from 'react';
import { Button, Grid, InputAdornment, Stack, TextField, Pagination, Box, Typography } from '@mui/material';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { useGetAmenities } from 'api/amenities';

import MainCard from 'components/MainCard';
import AmenityCard from 'components/amenities/AmenityCard';
import AnimateButton from 'components/@extended/AnimateButton';
import ProductPlaceholder from 'components/cards/skeleton/ProductPlaceholder';
import ConfirmationDialog from 'components/ConfirmationDialog';
import agent from 'api';
import { toast } from 'react-toastify';
import Loader from 'components/Loader';
import EmptyUserCard from 'components/cards/skeleton/EmptyUserCard';
import useGetPosition from 'hooks/useGetPosition';
import { NO_CATEGORY } from 'constants/constants';
import textFormatter from 'utils/textFormatter';

const AmenitiesGroup = ({ type = '' }) => {
  const { isCustomer } = useGetPosition();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [deleteConfigs, setDeleteConfigs] = useState({
    id: "",
    open: false
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(1);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchInput]);

  const { data, isLoading, mutate } = useGetAmenities({
    type,
    page,
    search: searchTerm,
    limit: 6,
  });

  const amenities = data?.amenities ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalAmenities = data?.totalAmenities ?? 0;

  const handlePageChange = (event, value) => setPage(value);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await agent.Amenities.deleteAmenity(deleteConfigs.id);
      toast.success('Amenity deleted successfully.', {
        position: 'top-right',
        autoClose: 3000
      });
    } catch (error) {
      toast.error(error.message || 'Failed to delete amenity', {
        position: 'top-right',
        autoClose: 3000
      });
    } finally {
      setLoading(false);
      setDeleteConfigs({ open: false, id: '' });
      await mutate();
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [amenities]);

  return (
    <React.Fragment>
      <Stack direction="row" justifyContent="space-between" marginBlockEnd={2}>
        <TextField
          placeholder={`Search for amenities...`}
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

        {(!isCustomer && textFormatter.fromSlug(type) !== NO_CATEGORY) && (
          <AnimateButton>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PlusOutlined />}
              onClick={() => navigate(`/portal/amenities/form${type ? `?type=${type}` : ''}`)}
            >
              Add Amenity
            </Button>
          </AnimateButton>
        )}
      </Stack>

      <MainCard>
        <Grid container spacing={2}>
          {(isLoading || loading) && Array.from({ length: 6 }).map((_, index) => (
            <Grid item xs={12} md={4} key={index}>
              <ProductPlaceholder />
            </Grid>
          ))}

          {!isLoading && amenities.length > 0 && amenities.map(amenity => (
            <Grid item xs={12} md={4} key={amenity._id}>
              <AmenityCard
                amenityData={amenity}
                onView={() => navigate(`/portal/amenities/details/${amenity._id}`)}
                onEdit={() => navigate(`/portal/amenities/form?id=${amenity?._id}&isEditMode=true&type=${amenity?.type}`)}
                onDelete={() => setDeleteConfigs({ id: amenity?._id, open: true })}
                isOnPortal={true}
              />
            </Grid>
          ))}

          {!isLoading && amenities.length === 0 && (
            <EmptyUserCard title="No amenities found at the moment" />
          )}
        </Grid>

        {totalPages > 1 && !isLoading && (
          <Stack alignItems='center' marginBlockStart={3}>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Showing {amenities.length} of {totalAmenities} amenities
            </Typography>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="medium"
              sx={{
                '& .MuiPaginationItem-root': {
                  fontWeight: 'bold',
                  borderRadius: 2,
                  fontSize: '0.875rem',
                  minWidth: 32,
                  height: 32
                }
              }}
            />
          </Stack>
        )}
      </MainCard>

      <ConfirmationDialog
        title="Delete Amenity"
        description="Are you sure you want to delete this amenity?"
        handleConfirm={handleDelete}
        open={deleteConfigs.open}
        handleClose={() => setDeleteConfigs({ ...deleteConfigs, open: false })}
      />
    </React.Fragment>
  );
};

export default AmenitiesGroup;