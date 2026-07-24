const COMFORT_BONUS = {
  learning: 15,
  comfortable: 5,
  confident: 0,
};

const LABEL_WEIGHTS = {
  "good first issue": 30,
  "help wanted": 20,
};


function scoreIssue(skills, issue) {
  const matchedSkill = skills.find(
    (s) => s.language.toLowerCase() === issue.language.toLowerCase()
  );

  if (!matchedSkill) return 0;

  let score = 50;

  score += COMFORT_BONUS[matchedSkill.comfortLevel] ?? 0;

  const bestLabelWeight = issue.labels.reduce((max, label) => {
    const weight = LABEL_WEIGHTS[label.toLowerCase()] || 0;
    return Math.max(max, weight);
  }, 0);
  score += bestLabelWeight;

  if (issue.commentsCount === 0) score += 10;
  else if (issue.commentsCount <= 3) score += 5;

  return Math.min(score, 100);
}

function rankIssues(skills, issues, limit = 20) {
  return issues
    .map((issue) => ({ issue, score: scoreIssue(skills, issue) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

module.exports = { scoreIssue, rankIssues };
