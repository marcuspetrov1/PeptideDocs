import peptides from './peptides.json'

export function getAllPeptides() {
  return peptides
}

export function getPeptideBySlug(slug) {
  return peptides.find(p => p.slug === slug) ?? null
}
