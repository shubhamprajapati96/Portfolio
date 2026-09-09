export class AnimationHelper {
  static staggerDelay(index: number, baseDelay = 70): string {
    return `${index * baseDelay}ms`;
  }
}
