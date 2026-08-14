export default {
  async getReleaseLine(changeset) {
    return '\n\n' + changeset.summary.trim()
  },
  async getDependencyReleaseLine() {
    return ''
  },
}
