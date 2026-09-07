-- Expand the existing private prototype; public demos continue to use local storage.
alter table public.demo_workspaces drop constraint demo_workspaces_module_check;
alter table public.demo_workspaces add constraint demo_workspaces_module_check
check (module in ('menu','agenda','inventario','commerce','proyectos','search','finanzas','crm','cotizaciones','servicios'));
comment on table public.demo_workspaces is 'Versioned prototype state. Each authenticated owner can own at most ten bounded demo documents. Production products require dedicated relational models and business validation.';
