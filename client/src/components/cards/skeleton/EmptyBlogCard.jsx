import { Box, Skeleton, Stack } from '@mui/material'
import React from 'react'

const EmptyBlogCard = (props) => {
    return (
        <div className='skeleton-blog'>
            {Array.from({ length: props.length }).map((_, index) => (
                <Box key={index}>
                    <Stack spacing={3} sx={{ margin: '1rem', padding: '1rem' }}>
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                        <Skeleton variant="rectangular" width={200} height={60} />
                    </Stack>
                </Box>
            ))}
        </div>
    )
}

export default EmptyBlogCard