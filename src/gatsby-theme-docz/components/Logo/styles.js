export const logo = {
  display: 'flex',
  alignItems: [null, 'flex-end'],
  flexDirection: ['column', 'row', 'row'],
};

export const link = {
  color: 'header.text',
  textDecoration: 'none',
  fontWeight: 600,
  letterSpacing: '-0.02em',
  lineHeight: 1,
  mr: [null, 3],
  mb: [null, '-9px'],
  fontSize: 4,
  ':hover': {
    color: 'primary',
  },
  ' img': {
    display: 'block',
    width: 200,
    maxWidth: '100%',
  },
};

export const description = {
  color: 'header.text',
  fontSize: 2,
  lineHeight: 1.3,
  opacity: 0.7,
};
