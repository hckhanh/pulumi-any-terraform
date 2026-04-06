async function getReleaseLine(changeset) {
  return '\n\n' + changeset.summary.trim()
}

async function getDependencyReleaseLine() {
  return ''
}

module.exports = { getReleaseLine, getDependencyReleaseLine }
