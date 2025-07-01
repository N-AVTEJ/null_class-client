# SkillStream – Learning & Video Platform

A full Stack web application for a simulated learning and video platform, built with HTML, Tailwind CSS, and Vanilla JavaScript. This project focuses on creating a responsive, mobile-first user interface with a clean, modern design inspired by platforms like Coursera and Skillshare.

## Features

-   **Responsive Design:** Optimized for various devices, with a mobile-first approach.
-   **Modern UI/UX:** Clean, modern interface with animations and transitions.
-   **Simulated Backend:** Uses `localStorage` for persistent data handling.
-   **Theme & Location Logic:** Dynamic theme switching based on time and simulated location.
-   **Pages:**
    -   Home Page (Landing, Navbar, Theme Switcher)
    -   Group Management (Create, List, Search)
    -   Plan Upgrade (Plan Cards, Payment Simulation)
    -   Video Library (Grid, Player Modal)
    -   Dashboard/Profile (User Info, Stats, Groups, Videos)
    -   Mock Video Call
    -   Login/Signup pages

## Technologies Used

-   HTML
-   Tailwind CSS
-   Vanilla JavaScript
-   localStorage
-   Animate.css (for animations)
-   Inter font

## Project Structure

```
.
├── css/
│   └── style.css
├── js/
│   └── app.js
├── call.html
├── groups.html
├── index.html
├── login.html
├── plans.html
├── profile.html
├── signup.html
└── video.html
```

## Setup and Running

Since this is a frontend-only application, you can run it by simply opening the HTML files (`index.html`, `groups.html`, etc.) in your web browser. No server or build process is required.

1.  Clone or download the project files.
2.  Navigate to the project directory.
3.  Open any of the `.html` files in your preferred web browser.

**Note:** Some features like the theme based on location and OTP simulation are simplified or mocked for this frontend-only implementation. 