# BlockList: Block Websites & Stay Focused

Stay focused and efficient while browsing the web. Block distracting domains with always-on or scheduled rules, pause domains without deleting them, and back up your list with one click.

![Project Image](https://github.com/ImSeanConroy/blocklist/blob/main/.github/repo-img.png)

## Table of Contents

- [Getting Started](#getting-started)
- [Usage](#usage)
- [Development](#development)
- [Testing](#testing)
- [Features](#features)
- [License](#license)
- [Support](#support)

## Getting Started

### Prerequisites
Before getting started, ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/imseanconroy/blocklist.git
cd blocklist
```

2. **Install dependencies:**

Inside the project directory, run:

```bash
npm install
```

3. **Build the extension:**

Use the following command to build the extension bundle:

```bash
npm run build
```

This will generate the required files in the `dist/` folder.

### Load the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** (toggle in the top right corner).
3. Click **Load unpacked** and select the `dist/` folder created from the build step.
4. The extension is now loaded and ready to be configured!

## Usage

1. Open extension options and add domains such as `example.com` or wildcard patterns like `*.news.com`.
2. Configure each domain rule:
	- enable/disable blocking per domain
	- set start and end hour (`0` to `23`)
	- use `start == end` to block all day
3. Use search to filter large lists quickly.
4. Import/export your blocklist as JSON for backup and migration.

## Development

To make modifications and see changes in real-time:

1. Run the following command for local development:

```bash
npm run dev
```

2. For extension testing, run a production build and load `dist/` in `chrome://extensions/`.

## Testing

Use the following command to run all tests:
```bash
npm run test
```

Run lint checks:

```bash
npm run lint
```

## Features
- Block exact domains and wildcard domain patterns.
- Supports daytime, overnight, and always-on blocking windows.
- Per-domain pause/resume without losing schedule settings.
- Import/export blocklist JSON backups.
- Search and quick stats in the options page.
- Dedicated blocked page with schedule-aware messaging.

## License

This project is Distributed under the MIT License - see the [LICENSE](LICENSE) file for information.

## Support

If you are having problems, please let me know by [raising a new issue](https://github.com/ImSeanConroy/blocklist/issues/new/choose).
