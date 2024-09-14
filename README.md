# Website Blocker - 

Stay Focused and Efficient. A simple Chrome extension that helps you stay productive by blocking distracting websites during specific times. Control your browsing habits and stay focused on what matters!

## Getting Started

### Prerequisites
Before getting started, ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/imseanconroy/website-blocking-extension.git
cd website-blocking-extension
```

2. **Install dependencies:**

Inside the project directory, run:

```bash
npm install
```

3. **Build the extension:**

Use the following command to build the project with Webpack:

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

1. Click the extension icon in your browser to open the settings page.
2. Add the websites you want to block and specify the time range during which you want them blocked.
3. Save your settings, and the extension will handle the rest!

## Development

To make modifications and see changes in real-time:

1. Run the following command to watch for changes and rebuild automatically:

```bash
npm run watch
```

2. Reload the extension in Chrome by going to `chrome://extensions/` and clicking the reload button next to the extension.

## Features
- Block specific websites during designated hours.
- Customizable time intervals for each blocked website.
- Simple interface to manage your blocked sites and schedule.
- Lightweight and efficient to keep your browser running smoothly.

## License

This project is Distributed under the MIT License - see the [LICENSE.md](LICENSE.md) file for information.

## Support

If you are having problems, please let me know by [raising a new issue](https://github.com/ImSeanConroy/website-blocking-extension/issues/new/choose).
