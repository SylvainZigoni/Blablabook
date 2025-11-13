export async function load({ cookies }) {
  return {
    user_id: cookies.get('user_id'),
    token: cookies.get('token')
  };
}
