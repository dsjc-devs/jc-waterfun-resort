const toSlug = (str) => {
  return str
    ?.trim()
    ?.toLowerCase()
    ?.replace(/[^a-z0-9\s-]/g, '')
    ?.replace(/\s+/g, '_')
    ?.replace(/-+/g, '_');
};

const fromSlug = (slug) => {
  return slug
    ?.replace(/_/g, ' ')
    ?.replace(/\b\w/g, (char) => char.toUpperCase())
    ?.replace(/s$/, '')
};

export default {
  fromSlug,
  toSlug
};