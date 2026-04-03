export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function shareScore(levelId, levelName, score, rank, totalXp) {
  const text = `I scored ${score} pts on Level ${levelId} (${levelName}) — Alam Mo Ba?! Pinoy Quiz! I'm a ${rank.icon} ${rank.name} with ${totalXp} XP. Subukan mo rin! 🇵🇭`;
  if (navigator.share) {
    navigator.share({ title: "Alam Mo Ba?!", text, url: window.location.href }).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(`${text} ${window.location.href}`).then(() => alert("Score copied!")).catch(() => alert(text));
  } else {
    alert(text);
  }
}
