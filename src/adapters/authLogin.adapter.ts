export const authLoginAdapter = (data: any) => ({
  token: data.stsTokenManager.token,
  menu: data.data.menu,
  user: data.data.user
});
