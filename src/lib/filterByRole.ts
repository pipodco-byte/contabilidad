export function getFilterByRole(query: any, userId: string, userRole: string) {
  if (userRole === 'admin') {
    return query;
  }
  return query.eq('user_id', userId);
}
