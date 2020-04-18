export const getRoundRobinStage = (stages) => {
  const result = stages.filter((s) => s.type === 'roundrobin')
  return result
}
