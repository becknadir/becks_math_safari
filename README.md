# Beck's Math Safari

A fun and educational math game for children with accessibility features designed to make learning math enjoyable for all.

## Features

- Multiple operation modes: addition, subtraction, multiplication, and division
- Accessibility options:
  - Dyslexia-friendly text
  - Visual aids for counting
  - Focus mode to reduce distractions
  - Optional timer
  - Text-to-speech support
- Interactive game mechanics with instant feedback
- Score tracking and three lives per game

## Demo

![Beck's Math Safari](demo-screenshot.png)

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/becknadir/becks_math_safari.git
   cd becks-math-safari
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

To create an optimized production build:

```
npm run build
```

The built files will be in the `build` directory, ready to be deployed.

## Customization

You can easily customize the game by modifying the following:

- Difficulty levels: Adjust the range of numbers in the `generateProblem` function
- Timer duration: Change the initial `timeLeft` state
- Number of tries: Modify the initial `triesLeft` state
- Visual elements: Edit CSS classes to match your preferred design

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by the need for accessible math games for all children
- Special thanks to educators who provided feedback during development 
