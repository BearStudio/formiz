import * as mixins from '~utils/mixins'

export const wrapper = {
  bg: 'dark',
  position: 'relative',
  borderBottom: t => `1px solid ${t.colors.border}`,
}

export const innerContainer = {
  ...mixins.centerAlign,
  px: 4,
  py: '24px',
  position: 'relative',
  justifyContent: 'space-between',
}

export const headerButton = {
  ...mixins.centerAlign,
  outline: 'none',
  p: '12px',
  border: 'none',
  borderRadius: 9999,
  color: 'white',
  bg: 'blue',
  fontSize: 0,
  fontWeight: 600,
  ':hover': {
    cursor: 'pointer',
    bg: 'white',
    color: 'blue',
  },
}

export const editButton = {
  ...mixins.centerAlign,
  position: 'absolute',
  bottom: -40,
  right: 30,
  bg: 'transparent',
  color: 'muted',
  fontSize: 1,
  textDecoration: 'none',
  borderRadius: 'radius',
}