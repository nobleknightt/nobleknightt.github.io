// TypeScript's bundler moduleResolution doesn't resolve non-JS side-effect imports (e.g. CSS).
// These wildcard declarations tell the type checker to accept them without type information.
declare module "*.css";
