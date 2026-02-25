/**
 * Type declarations for SCSS modules so TypeScript accepts import styles from '*.module.scss'
 */
declare module '*.module.scss' {
  const classes: { readonly [key: string]: string }
  export default classes
}
