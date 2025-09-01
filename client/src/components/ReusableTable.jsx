import PropTypes from "prop-types";
import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import TablePagination from "@mui/material/TablePagination";
import MainCard from "./MainCard";
import {
  InputAdornment,
  TextField,
  Typography,
  TableSortLabel,
  Skeleton,
  IconButton,
  Menu,
  MenuItem,
  Checkbox,
} from "@mui/material";
import { SearchOutlined, MoreOutlined } from "@ant-design/icons";
import { useTheme } from "@mui/material/styles";

const ReusableTable = ({
  columns,
  rows,
  settings,
  isLoading,
  searchableColumns = [],
  noMessage = "No Matching Records found",
}) => {
  const {
    order: defaultOrder = "asc",
    orderBy: defaultOrderBy = "createdAt",
    otherActionButton,
  } = settings || {};

  const theme = useTheme();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = useState(defaultOrder);
  const [orderBy, setOrderBy] = useState(defaultOrderBy);
  const [visibleColumns, setVisibleColumns] = useState(
    columns.map((col) => col.id)
  );
  const [anchorEl, setAnchorEl] = useState(null);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const descendingComparator = (a, b, property) => {
    const colDef = columns.find((col) => col.id === property);
    const aValue = colDef?.sortValue ? colDef.sortValue(a) : a[property];
    const bValue = colDef?.sortValue ? colDef.sortValue(b) : b[property];
    if (bValue < aValue) return -1;
    if (bValue > aValue) return 1;
    return 0;
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const getComparator = (order, property) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, property)
      : (a, b) => -descendingComparator(a, b, property);
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const cmp = comparator(a[0], b[0]);
      if (cmp !== 0) return cmp;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  const filteredRows = rows.filter((row) =>
    searchableColumns.some((col) => {
      const value = getNestedValue(row, col);
      return value?.toString().toLowerCase().includes(searchQuery.toLowerCase());
    })
  );

  const sortedRows = stableSort(filteredRows, getComparator(order, orderBy));
  const paginatedRows = sortedRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const toggleColumnVisibility = (columnId) => {
    setVisibleColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId]
    );
  };

  return (
    <MainCard>
      {/* Search + Actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1em",
          alignItems: "center",
          mt: 1,
          mb: 3,
        }}
      >
        <TextField
          placeholder={`Search for ${rows?.length} records...`}
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined style={{ color: "#6b7280" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            width: "300px",
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#e5e7eb" },
              "&:hover fieldset": { borderColor: "#6366f1" },
              "&.Mui-focused fieldset": {
                borderColor: "#4f46e5",
                boxShadow: "0 0 0 3px rgba(79,70,229,0.15)",
              },
            },
          }}
        />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {otherActionButton}
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <MoreOutlined />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            {columns
              .filter((col) => col.label)
              .map((col) => (
                <MenuItem key={col.id}>
                  <Checkbox
                    checked={visibleColumns.includes(col.id)}
                    onChange={() => toggleColumnVisibility(col.id)}
                  />
                  {col.label}
                </MenuItem>
              ))}
          </Menu>
        </Box>
      </Box>

      {/* Table */}
      <TableContainer
        sx={{
          width: "100%",
          overflowX: "auto",
          borderRadius: "12px",
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          sx={{ minWidth: columns.length * 250 }}
        >
          <TableHead>
            <TableRow
              sx={{
                background:
                  theme.palette.mode === "light"
                    ? theme.palette.grey[100]
                    : theme.palette.background.default,
              }}
            >
              {columns
                .filter((col) => visibleColumns.includes(col.id))
                .map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align || "left"}
                    sortDirection={orderBy === column.id ? order : false}
                    sx={{
                      fontWeight: "bold",
                      color: theme.palette.primary.dark,
                      backgroundColor:
                        orderBy === column.id
                          ? theme.palette.action.hover
                          : "transparent",
                      borderRight: `1px solid ${theme.palette.divider}`,
                      "&:last-of-type": { borderRight: "none" },
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : "asc"}
                      onClick={() => handleRequestSort(column.id)}
                      sx={{
                        "&.Mui-active": { color: theme.palette.primary.main },
                        "&:hover": { color: theme.palette.primary.dark },
                      }}
                    >
                      <Typography variant="subtitle1">
                        {column.label}
                      </Typography>
                    </TableSortLabel>
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {isLoading ? (
              Array.from(new Array(rowsPerPage)).map((_, index) => (
                <TableRow key={index}>
                  {visibleColumns.map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton animation="wave" height={30} width="80%" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filteredRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={visibleColumns.length} align="center">
                  <Typography
                    variant="body1"
                    sx={{ py: 3, color: theme.palette.text.secondary }}
                  >
                    {noMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedRows.map((row, index) => (
                <TableRow
                  hover
                  sx={{
                    backgroundColor:
                      index % 2 === 0
                        ? theme.palette.background.paper
                        : theme.palette.action.hover,
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                    animation: "fadeIn 0.3s ease-in-out",
                    "@keyframes fadeIn": {
                      from: { opacity: 0, transform: "translateY(5px)" },
                      to: { opacity: 1, transform: "translateY(0)" },
                    },
                    "&:hover": {
                      backgroundColor: theme.palette.action.selected,
                      transform: "translateY(-2px)",
                      boxShadow: theme.shadows[1],
                    },
                  }}
                  key={row.id || index}
                >
                  {columns
                    .filter((col) => visibleColumns.includes(col.id))
                    .map((column) => (
                      <TableCell key={column.id} align={column.align || "left"} sx={{
                        borderRight: `1px solid ${theme.palette.divider}`,
                        "&:last-of-type": { borderRight: "none" },
                      }}>
                        {column.renderCell
                          ? column.renderCell(row)
                          : row[column.id]}
                      </TableCell>
                    ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ my: 1 }} >
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Rows:"
          sx={{
            paddingRight: "2rem !important",
            backgroundColor: theme.palette.background.default,
            borderTop: `1px solid ${theme.palette.divider}`,
            "& .MuiTablePagination-actions button": {
              borderRadius: "12px",
              transition: "all 0.25s ease",
              marginRight: "0.5rem",
              backgroundColor: theme.palette.action.hover,
              color: theme.palette.primary.dark,
              "&:hover": {
                backgroundColor: theme.palette.primary.light,
                transform: "scale(1.15)",
                boxShadow: `0px 3px 6px ${theme.palette.primary.main}50`,
              },
            },
          }}
        />
      </Box>
    </MainCard>
  );
};

ReusableTable.propTypes = {
  columns: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  settings: PropTypes.object,
  isLoading: PropTypes.bool,
  searchableColumns: PropTypes.array,
};

export default ReusableTable;
