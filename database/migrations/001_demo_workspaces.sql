-- Isolated demonstration storage. No business production records belong here.
create table public.demo_workspaces (
 user_id uuid not null references auth.users(id) on delete cascade,
 module text not null check (module in ('menu','agenda','inventario','commerce','proyectos','search')),
 payload jsonb not null check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 65536),
 version integer not null default 1 check (version > 0),
 updated_at timestamptz not null default now(),
 primary key (user_id,module)
);
alter table public.demo_workspaces enable row level security;
revoke all on public.demo_workspaces from anon;
grant select,insert,update,delete on public.demo_workspaces to authenticated;
create policy "read_own_demo" on public.demo_workspaces for select to authenticated using ((select auth.uid())=user_id);
create policy "create_own_demo" on public.demo_workspaces for insert to authenticated with check ((select auth.uid())=user_id);
create policy "update_own_demo" on public.demo_workspaces for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "delete_own_demo" on public.demo_workspaces for delete to authenticated using ((select auth.uid())=user_id);
comment on table public.demo_workspaces is 'Versioned prototype state. Each session can own at most six bounded demo documents. Production products require dedicated relational models and business validation.';
