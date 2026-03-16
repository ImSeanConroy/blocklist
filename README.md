# BlockList: Block Websites & Stay Focused

BlockList is a Chrome extension that helps you stay focused by blocking distracting websites. Configure always-on or time-based blocking rules per domain, pause domains without losing your settings, and back up your entire list with a single click.

![Project Image](/.github/repo-img.png)

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Development](#development)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## About the Project

BlockList is a Manifest V3 Chrome extension built with TypeScript, React, Vite, and Tailwind CSS. It intercepts navigation requests via a background service worker and redirects matching URLs to a built-in blocked page before they load.

Blocking rules are stored in `chrome.storage.sync`, so your list is automatically synced across devices where you're signed into Chrome. Each rule supports exact domains (`example.com`), wildcard subdomains (`*.example.com`), configurable time windows, specific days of the week, and a pause/resume toggle — all without removing the entry from your list.

## Features

- Block exact domains and wildcard patterns (e.g., `*.example.com`).
- Flexible time-based blocking: daytime, overnight, and always-on schedules.
- Per-domain pause/resume without losing schedule settings.
- Import/export your blocklist as a JSON backup.
- Search and at-a-glance stats in the options page.
- Dedicated blocked page with schedule-aware messaging.

## Getting Started

### Prerequisites

Before getting started, ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Google Chrome](https://www.google.com/chrome/) or any Chromium-based browser

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/imseanconroy/blocklist.git
cd blocklist
```

2. **Install project dependencies:**
```bash
npm install
```

3. **Build the extension:**
```bash
npm run build
```

This will generate the required files in the `dist/` folder.

### Load the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** (toggle in the top right corner).
3. Click **Load unpacked** and select the `dist/` folder created from the build step.

## Usage

1. Open extension options and add domains such as `example.com` or wildcard patterns like `*.example.com`.
2. Configure each domain rule:
	- enable/disable blocking per domain
	- set start and end hour (`0` to `23`)
	- use `start == end` to block all day
3. Use search to filter large lists quickly.
4. Import/export your blocklist as JSON for backup and migration.

The exported file (`blocklist-backup.json`) uses the following format:

```json
{
  "sites": {
    "example.com": {
      "enabled": true,
      "startHour": 9,
      "endHour": 17,
      "days": [1, 2, 3, 4, 5]
    },
    "*.social.com": {
      "enabled": true,
      "startHour": 0,
      "endHour": 0,
      "days": [0, 1, 2, 3, 4, 5, 6]
    }
  }
}
```

- `startHour` / `endHour`: hours in 24-hour format (`0`–`23`). Setting both to the same value blocks all day.
- `days`: array of day indices — `0` = Sunday, `1` = Monday, ..., `6` = Saturday.
- `enabled`: set to `false` to pause a domain without removing it.

## Development

To make modifications and see changes in real-time:

1. Run the following command for local development:

```bash
npm run dev
```

2. For extension testing, run a production build and reload `dist/` in `chrome://extensions/`.

## Testing

Use the following command to run all tests:
```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate a coverage report:

```bash
npm run coverage
```

Run lint checks:

```bash
npm run lint
```

## Contributing

Contributions are welcome. Please open an issue to discuss your proposed change, or fork the repository, create a feature branch (`feature/your-feature-name`), and submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please [raise a new issue](https://github.com/ImSeanConroy/blocklist/issues/new/choose).
