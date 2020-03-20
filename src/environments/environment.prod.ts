export const environment = {
  production: true,
  HOST_URL: 'http://localhost:8080',
  TOKEN_AUTH_USERNAME: 'mitomediapp', //es el security.jwt.client-id de spring boot
  TOKEN_AUTH_PASSWORD: 'mito89codex', //es el security.jwt.client-secret de spring boot
  TOKEN_NAME: 'access_token',  //apodo para obtener el token
  REINTENTOS: 3
};
