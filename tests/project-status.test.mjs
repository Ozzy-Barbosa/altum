import test from 'node:test';
import assert from 'node:assert/strict';
import { getProjectFilters } from '../src/lib/project-status.ts';
import { projects } from '../src/data/catalog.ts';

test('public work in progress appears both online and in development', () => {
  const project = projects.find((item) => item.slug === 'proyectcons');
  assert.equal(project.url, 'https://ozzy-barbosa.github.io/proyectcons/index.html');
  assert.deepEqual(getProjectFilters(project), ['all', 'online', 'development']);
  assert.match(project.statusNote, /requerimientos y dominio propio pendientes/);
  assert.equal(project.progress.updatedAt, '2026-09-29');
  assert.deepEqual(
    project.progress.milestones.map((item) => item.state),
    ['Disponible', 'En curso', 'Pendiente'],
  );
});

test('published review, finished sites and unpublished development retain their filters', () => {
  const filtersFor = (slug) => getProjectFilters(projects.find((item) => item.slug === slug));
  assert.deepEqual(filtersFor('am-personalizados'), ['all', 'online', 'review']);
  assert.deepEqual(filtersFor('orthomax'), ['all', 'online']);
  assert.deepEqual(filtersFor('alexa-lara'), ['all', 'development']);
});

test('a status label without a usable public URL is not treated as online', () => {
  assert.deepEqual(getProjectFilters({ status: 'Publicado', url: '  ' }), ['all']);
  assert.deepEqual(getProjectFilters({ status: 'En desarrollo' }), ['all', 'development']);
});
