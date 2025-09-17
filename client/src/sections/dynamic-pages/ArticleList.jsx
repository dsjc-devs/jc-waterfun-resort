import { Grid, Typography } from '@mui/material'

import React from 'react'
import GridCard from 'components/GridCard'
import EmptyUserCard from 'components/cards/skeleton/EmptyUserCard'

const ArticleList = ({ articles = [], isOnPortal = false, onDelete, onEdit }) => {

  return (
    <Grid container spacing={2}>
      {articles.length ? (
        articles.map((material) => (
          <Grid key={material._id} item xs={12} sm={6} md={4}>
            <GridCard material={material} isOnPortal={isOnPortal} onDelete={onDelete} onEdit={onEdit} />
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <EmptyUserCard title='No articles found.' />
        </Grid>
      )}
    </Grid>
  )
}

export default ArticleList