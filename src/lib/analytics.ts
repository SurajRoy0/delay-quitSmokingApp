export type EventSource = "browser" | "pwa";

/**
 * Tracks the app_opened event, detailing whether it was launched from a standard browser or installed standalone PWA.
 */
export function trackAppOpened(source: EventSource) {
  console.log(`[PWA Analytics] app_opened | source: ${source}`);
  // We log this locally. In production, this can connect to your tracking provider.
}

/**
 * Tracks when the PWA installation prompt is first detected and displayed.
 */
export function trackPWAInstallPromptShown() {
  console.log("[PWA Analytics] pwa_install_prompt_shown");
}

/**
 * Tracks when the user clicks the custom "Install App" button.
 */
export function trackPWAInstallClicked() {
  console.log("[PWA Analytics] pwa_install_clicked");
}

/**
 * Tracks when the application installation is successfully completed by the user.
 */
export function trackPWAInstalled() {
  console.log("[PWA Analytics] pwa_installed");
}
