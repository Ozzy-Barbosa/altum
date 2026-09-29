export type ProjectFilter = 'all' | 'online' | 'review' | 'development';

// Publication and delivery are independent: a public site can still be in development.
export function getProjectFilters(project: { url?: string; status: string }): ProjectFilter[] {
  const filters: ProjectFilter[] = ['all'];
  const status = project.status.toLocaleLowerCase('es');
  if (project.url?.trim()) filters.push('online');
  if (status.includes('revisión')) filters.push('review');
  if (status.includes('desarrollo')) filters.push('development');
  return filters;
}
