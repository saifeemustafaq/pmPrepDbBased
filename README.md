# PM Interview Prep

[![PM Interview Prep Logo](/public/logo/LogoDark.svg)](https://pm-prep.vercel.app/)

A modern web application designed to help Product Managers prepare for interviews through structured practice questions and note-taking capabilities.

[Visit the live version of the app](https://pm-prep.vercel.app/).

## Features

- 📝 **Comprehensive Question Bank**: Organized by categories including Behavioral, Product Design, Strategy, Execution, and Estimation
- 🎯 **Progress Tracking**: Visual progress indicators for each category and overall completion
- 📓 **Smart Note-Taking**: Built-in Markdown editor for both question-specific and overall notes
- 💾 **Persistent Storage**: Local storage for progress and notes
- 📱 **Responsive Design**: Optimized for both desktop and mobile viewing
- 📊 **Analytics Integration**: Built-in Google Analytics for tracking user engagement

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **UI Components**: Custom components with [Tailwind CSS](https://tailwindcss.com/)
- **Rich Text Editing**: [Tiptap](https://tiptap.dev/)
- **Markdown Support**: [React Markdown](https://github.com/remarkjs/react-markdown)
- **Analytics**: Google Analytics 4
- **Type Safety**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB database

### Installation

1. Clone the repository:

```bash
git clone https://github.com/saifeemustafaq/pmPrepDbBased.git
cd pmPrepDbBased
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory with your MongoDB connection string:

```
MONGODB_URI=your_mongodb_connection_string
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

*Subject to change*

```
pmPrepDbBased/
├── app/
│   ├── api/           # API routes
│   ├── components/    # React components
│   ├── hooks/         # Custom React hooks
│   ├── lib/          # Utility functions
│   └── types/        # TypeScript types
├── public/           # Static assets
└── ...config files
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Issues and Feature Requests

Found a bug? Have a brilliant feature idea? Want to tell us our code looks like it was written by a caffeinated monkey? 🐒

We'd love to hear from you! Please create an issue on our GitHub repository:

1. Go to the Issues tab
2. Click on "New Issue"
3. Give your issue a title and description with as much detail as possible
4. Click "Submit new issue"

We promise to read every issue with the utmost seriousness (even the funny ones 😄). Just remember to:

- Be as detailed as possible
- Include steps to reproduce bugs
- Add screenshots if relevant
- Keep it friendly and constructive

Your feedback helps make PM Prep better for everyone! Plus, it gives our dev team something to do besides drinking coffee ☕


## Feedback and Support

- Want to add a question to the PM Prep DB? Submit questions through our [Question Submission Form](https://forms.gle/PhLhrwWxjffaN7JM6)
- Provide feedback through our [Feedback Form](https://forms.gle/Avnvb14BJ15HQwWZ7)

## Acknowledgments

- Thanks to all contributors who have helped shape this project
- Special thanks to the PM community for their valuable input and feedback
