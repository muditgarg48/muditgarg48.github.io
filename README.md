# My Portfolio Website [🔗](https://muditgarg48.github.io)

A clean, responsive React Single Page Application (SPA) which showcases my education, work, experience and achieved certifications.

## Motivation

- I always wanted to have a online front, an online portfolio to depict myself, avoiding templated portfolio builders and limitations. 
- I wanted to have the full control over my portfolio website, continuously improving the design, content, gaining hands-on experience on UI/UX design, responsive and performant development and SEO optimisation.
- Just after my postgraduation in 2024, I started picking up React in an attempt to broaded my skillset and wanted to practise it. 
- Ever since the completion of Portfolio Website v1 in 2020, I always wanted to replace my static portfolio website (based on pure HTML-CSS-JavaScript) to a more framework based single page application.

## Key Feature Evolution

#### v1 (2020) (Static HTML-CSS-JS)

- Clear tab based view for separate static pages with necessary information including skills, education history, projects and certifications.
- Points of contact redirects

#### v2 (2024) (Dynamic React SPA)

- Responsive UI with optimised assets, insights delivery and real-estate usage for all devices.
- Modern UI elements like timelines, marquees, cards, hover effects for better storytelling.
- Introduction of [portfolio data store](https://github.com/muditgarg48/portfolio_data) utilising GitHub CDN to provide website data dynamically and avoid hard coded data in the main portfolio repository.
- Introduction of [A.L.F.R.E.D.](https://github.com/muditgarg48/self-rag-system), RAG (Retrieval Augmented Generation) based chatbot, responsive for ingested all the information on the website to answer any queries by the visitor in a human conversation format.
- Introduction of realtime insights like "Last Updated" timestamps of projects using the GitHub API for insights into project's age and status.

## Tech Stack

Hosted via Jenkyll and GitHub Pages

- React
- JavaScript (JSX)
- [A.L.F.R.E.D. Tech Stack](https://github.com/muditgarg48/self-rag-system)
- Packages from [npm](https://www.npmjs.com/)
- Icons from [lordicon](https://lordicon.com/)

## Future Ideas

- Introduction of a new blog section which will be my platform to convey my thoughts.
- Introduction of a project journey and project KPIs (Key Performance Indicators) that showcase the journey of a project from `git init` to the current state and in-depth insights into the project's current state

## Setup

To replicate the project

- Fork the correct branch of this repository (refer [here](#branches))
- Install all the dependencies `npm install` in the root folder (same as `package.json`)
- Run the local instance by the command `npm start`

## Branches

##### master
The SPA React Application codebase

##### gh-pages
The compiled React Application codebase deployed using GitHub Pages

##### v1
The HTML-CSS-JS based version 1 codebase of my portfolio website

##### v2_pure_html_css
The unsuccessful attempt from 2021 to 2023 of making a second version of the website, still utilising pure HTML-CSS-JS