import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  CardMedia,
  alpha,
  useTheme,
  useMediaQuery,
  Chip
} from '@mui/material';
import { ArrowRightOutlined, EyeOutlined, CalendarOutlined } from '@ant-design/icons';
import { useGetMarketingMaterials } from 'api/marketing-materials';
import TitleTag from 'components/TitleTag2';
import EmptyUserCard from 'components/cards/skeleton/EmptyUserCard';

const ArticleOverviewSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const { data, isLoading } = useGetMarketingMaterials({
    status: "POSTED",
    limit: 3,
    page: 1
  });

  const articles = data?.marketingMaterials || [];

  const handleViewAll = () => {
    navigate('/articles');
  };

  const handleViewArticle = (id) => {
    navigate(`/articles/details/${id}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return 'Discover the latest news and insights from our resort.';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(180deg, #f0f7ff 0%, #ffffff 50%, #f8fbff 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 70% 30%, rgba(25, 118, 210, 0.02) 0%, transparent 60%)',
          pointerEvents: 'none',
        }
      }}
    >
      <Container sx={{ paddingBlock: 4 }}>
        <React.Fragment>
          <Box paddingBlock={4}>
            <TitleTag
              title="Latest Articles"
              subtitle="Discover the latest updates, tips, and stories from JC Waterfun Resort to enhance your experience with us"
            />
          </Box>

          {isLoading && (
            <Grid container spacing={3} justifyContent="center">
              {Array.from({ length: 6 }).map((_, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <EmptyUserCard />
                </Grid>
              ))}
            </Grid>
          )}

          {!isLoading && articles.length > 0 && (
            <Grid container spacing={1} paddingBlock={4} justifyContent="center">
              {articles.slice(0, 6).map((article, index) => (
                <Grid item xs={12} sm={6} md={4} key={article._id || index} marginBlock={1}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      overflow: 'hidden',
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
                        '& .article-image': {
                          transform: 'scale(1.05)',
                        },
                        '& .view-button': {
                          opacity: 1,
                          transform: 'translateY(0)',
                        }
                      }
                    }}
                  >
                    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                      <CardMedia
                        component="img"
                        height={200}
                        image={article.thumbnail || '/placeholder-article.jpg'}
                        alt={article.title}
                        className="article-image"
                        sx={{
                          transition: 'transform 0.3s ease',
                          objectFit: 'cover'
                        }}
                      />

                      <Box
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          bgcolor: 'rgba(255, 255, 255, 0.9)',
                          borderRadius: 2,
                          px: 1.5,
                          py: 0.5
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'primary.main',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            textTransform: 'capitalize'
                          }}
                        >
                          {article.type?.replace('-', ' ') || 'Article'}
                        </Typography>
                      </Box>

                      <Button
                        className="view-button"
                        variant="contained"
                        size="small"
                        startIcon={<EyeOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewArticle(article._id);
                        }}
                        sx={{
                          position: 'absolute',
                          bottom: 12,
                          left: 12,
                          opacity: 0,
                          transform: 'translateY(10px)',
                          transition: 'all 0.3s ease',
                          borderRadius: 2,
                          minWidth: 'auto',
                          px: 2
                        }}
                      >
                        Read
                      </Button>
                    </Box>

                    <CardContent
                      sx={{
                        p: { xs: 2, md: 3 },
                        '&:last-child': { pb: { xs: 2, md: 3 } }
                      }}
                      onClick={() => handleViewArticle(article._id)}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: 'Cinzel',
                          fontWeight: 600,
                          color: 'text.primary',
                          mb: 1,
                          fontSize: { xs: '1.1rem', md: '1.25rem' },
                          lineHeight: 1.3,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {article.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontSize: { xs: '0.875rem', md: '0.9rem' },
                          lineHeight: 1.5,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          mb: 2
                        }}
                      >
                        {truncateText(article.description)}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <CalendarOutlined style={{ fontSize: '0.875rem', color: theme.palette.text.secondary }} />
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: '0.75rem' }}
                          >
                            {formatDate(article.createdAt)}
                          </Typography>
                        </Box>

                        {article.featured && (
                          <Chip
                            label="Featured"
                            size="small"
                            color="primary"
                            sx={{
                              height: 20,
                              fontSize: '0.7rem',
                              fontWeight: 600
                            }}
                          />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {!isLoading && articles.length === 0 && (
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: 'Cinzel',
                  fontWeight: 600,
                  color: 'text.primary',
                  mb: 2
                }}
              >
                No Articles Available
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: '400px', mx: 'auto' }}
              >
                We're working on bringing you exciting articles and updates. Check back soon!
              </Typography>
            </Box>
          )}

          {!isLoading && articles.length > 0 && (
            <Box sx={{ textAlign: 'center', pt: 2 }}>
              <Button
                variant="contained"
                size={isMobile ? "medium" : "large"}
                endIcon={<ArrowRightOutlined />}
                onClick={handleViewAll}
                sx={{
                  borderRadius: 3,
                  px: { xs: 3, md: 4 },
                  py: { xs: 1.5, md: 2 },
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                  boxShadow: '0 8px 25px rgba(25, 118, 210, 0.3)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 35px rgba(25, 118, 210, 0.4)',
                    background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                  }
                }}
              >
                View All Articles
              </Button>
            </Box>
          )}

          {!isLoading && articles.length > 0 && (
            <Box sx={{ textAlign: 'center', pt: 2 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: '0.9rem',
                  fontStyle: 'italic'
                }}
              >
                Showing {Math.min(6, articles.length)} of {data?.totalMarketingMaterials || articles.length} articles
              </Typography>
            </Box>
          )}
        </React.Fragment>
      </Container>
    </Box>
  );
};

export default ArticleOverviewSection;