const codeSample = `function abortTaskSoft(task: Task): void {
  const request: Request = this;
  const boundary = task.blockedBoundary;
  const segment = task.blockedSegment;
  segment.status = ABORTED;
  finishedTask(request, boundary, segment);
}
`

export { codeSample }
