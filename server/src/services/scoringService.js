const ignoredWords = new Set(['about', 'after', 'again', 'against', 'because', 'before', 'being', 'could', 'their', 'there', 'these', 'those', 'which', 'would', 'where', 'while', 'with', 'from', 'that', 'this', 'when', 'what', 'were', 'they', 'them', 'then', 'into', 'have', 'does', 'your', 'only', 'than', 'also', 'very']);

export function calculateScore({ isCorrect, inspectedEvidenceIds, keyEvidenceIds, explanation, keyEvidence = [] }) {
  const relevant = [...new Set(keyEvidenceIds)];
  const inspected = new Set(inspectedEvidenceIds);
  const reviewed = relevant.filter((id) => inspected.has(id)).length;
  const evidenceCoverage = relevant.length ? Math.round(20 * reviewed / relevant.length) : 0;
  const words = new Set((explanation || '').toLowerCase().match(/[a-z0-9]{4,}/g)?.filter((word) => !ignoredWords.has(word)) || []);
  const mentioned = relevant.filter((id) => {
    const evidence = keyEvidence.find((item) => item.id === id);
    const concepts = `${evidence?.title || ''} ${evidence?.clueSummary || ''} ${evidence?.description || ''}`.toLowerCase().match(/[a-z0-9]{4,}/g) || [];
    return concepts.some((word) => !ignoredWords.has(word) && words.has(word));
  }).length;
  const explanationScore = !explanation?.trim() ? 0 : Math.min(10, mentioned * 5);
  const accuracy = isCorrect ? 70 : 0;
  return { total: accuracy + evidenceCoverage + explanationScore, accuracy, evidenceCoverage, explanation: explanationScore };
}
