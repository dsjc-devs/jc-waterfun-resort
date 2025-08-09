import React from 'react'
import { Box, Stack, Typography, Chip, Tooltip } from '@mui/material'
import Avatar from 'components/@extended/Avatar'
import IconButton from 'components/@extended/IconButton'
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { USER_ROLES } from 'constants/constants'
import AnimateButton from './@extended/AnimateButton'

const SimpleUserCard = ({ user, currentUser, onView, onEdit, onDelete }) => {
  const _position = user?.position?.[0]?.value
  const currentPosition = currentUser?.position?.[0]?.value

  const isSameUser = currentUser?.userId === user.userId
  const isSameRole = _position === currentPosition
  const isTargetMasterAdmin = _position === USER_ROLES.MASTER_ADMIN.value

  const canEdit = isSameUser || (!isSameRole && !isTargetMasterAdmin)
  const canDelete = !isSameUser && !isSameRole && !isTargetMasterAdmin

  return (
    <Box
      sx={{
        borderRadius: 2,
        p: 2,
        mb: 2,
        boxShadow: 1,
        height: '100%',
      }}
    >
      <Stack alignItems="center" spacing={1}>
        <Avatar size="lg" src={user.avatar} />
        <Typography variant="subtitle1">
          {user.firstName} {user.lastName}
        </Typography>
        <Chip
          label={{
            MASTER_ADMIN: USER_ROLES.MASTER_ADMIN.label,
            ADMIN: USER_ROLES.ADMIN.label,
            RECEPTIONIST: USER_ROLES.RECEPTIONIST.label,
            CUSTOMER: USER_ROLES.CUSTOMER.label,
          }[_position]}
          color={{
            MASTER_ADMIN: 'primary',
            ADMIN: 'info',
            RECEPTIONIST: 'success',
            CUSTOMER: 'success',
          }[_position] || 'default'}
          size="small"
        />
        <Typography variant="body2" color="textSecondary">
          {user.emailAddress}
        </Typography>

        <Stack direction="row" spacing={1} mt={2}>
          <Tooltip title="View">
            <span>
              <AnimateButton>
                <IconButton
                  variant="contained"
                  size="small"
                  color="primary"
                  onClick={() => onView(user)}
                >
                  <EyeOutlined />
                </IconButton>
              </AnimateButton>
            </span>
          </Tooltip>

          <Tooltip title={canEdit ? "Edit" : "Not authorized to edit"}>
            <span>
              <AnimateButton>
                <IconButton
                  variant="contained"
                  size="small"
                  color="info"
                  onClick={() => canEdit && onEdit(user)}
                  disabled={!canEdit}
                >
                  <EditOutlined />
                </IconButton>
              </AnimateButton>
            </span>
          </Tooltip>

          <Tooltip title={canDelete ? "Delete" : "Not authorized to delete"}>
            <span>
              <AnimateButton>
                <IconButton
                  variant="contained"
                  size="small"
                  color="error"
                  onClick={() => canDelete && onDelete(user)}
                  disabled={!canDelete}
                >
                  <DeleteOutlined />
                </IconButton>
              </AnimateButton>
            </span>
          </Tooltip>
        </Stack>
      </Stack>
    </Box>
  )
}

export default SimpleUserCard
