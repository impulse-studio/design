class MultiStepModalBuilder {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(steps) {
    this.steps = steps;
  }
  /**
   * @typeParam Next - The type of the result of the provided step
   */
  addStep(step) {
    return new MultiStepModalBuilder([...this.steps, step]);
  }
  /**
   * @typeParam Input - The type of the input prop for the first step
   * @typeParam Output - The type of the result of the first step
   */
  static create(firstStep) {
    return new MultiStepModalBuilder([firstStep]);
  }
  build() {
    return this.steps;
  }
}
export {
  MultiStepModalBuilder
};
