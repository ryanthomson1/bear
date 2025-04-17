# **App Name**: ThreadForge AI

## Core Features:

- AI Post Generation: Generate multiple Threads posts based on a user-provided idea, text, or URL using Gemini 2.0-flash. Allow users to select the best option or regenerate alternatives. If the input is blank, a post is generated according to default system instructions. Uses an AI tool to choose the best moment to incorporate certain details.
- AI Image Generation: Generate corresponding images using Leonardo.ai based on the generated text post, with options to select, regenerate, or opt-out of using an image. Uses an AI tool to decide the right type of image prompt to use.
- Reply Suggestion: Display a feed of existing Threads posts and generate suggested replies for each using Gemini. User can edit replies before posting.
- Application Control Panel: Provide a control panel to manage AI model selection (Gemini, Leonardo.AI), system instructions, and Threads accounts.
- Manage System Instructions: Allow the user to store system instructions that are used for AI post generation.

## Style Guidelines:

- Primary color: White or light gray for a clean and modern look.
- Secondary color: Dark gray or black for text and important elements.
- Accent: Teal (#008080) for interactive elements and highlights.
- Clean and readable font for body text.
- Simple and modern icons for navigation and actions.
- Grid-based layout for a structured and organized presentation.
- Subtle animations for transitions and feedback.

## Original User Request:
Development Specification Document: Bear Threads Generator
1. Introduction
This document outlines the specifications for the Bear Threads Generator, a Python application built with Gradio controls. The application provides an intuitive UX/UI for generating and managing Threads posts, integrating Gemini 2.0-flash for text generation and Leonardo.ai for image prompts.
2. Application Overview
The application will be organized into four main tabs:
Tab 1: Generate Threads Posts


Tab 2: Reply to Posts


Tab 3: Image Control Panel/Browser


Tab 4: Application Control Panel


3. Detailed Tab Specifications
3.1 Tab 1: Generate Threads Posts
Purpose: Allow users to generate new Threads posts.


Inputs:


Input box accepting an idea, text, or URL as the basis for a new post.


If left blank, a the post will be generated according to system instructions (blank prompt section)


A checkbox indicating if images should be generated or not


A pull down box that allows the user to select the user instructions

Generation Process:


Text Generation: Gemini 2.0-flash generates five new Threads posts according to selected set of system instructions..


Image Generation: In parallel, five Leonardo.ai Flux Dev image prompts are generated with corresponding images retrieved.


Storage: Generated images are saved to a designated Google Cloud Platform (GCP) storage bucket.


Output: All output boxes update in real time, displaying data as soon as it's available.


Selection & Posting:


Users can select one post (with an option to regenerate alternatives).


Users can select one image, opt for no image, or regenerate images.


The final selected post and image (if any) are posted to the “bearwithabite” Threads account (or other account selected in Tab 4 - Control Panel) via the Threads API.


3.2 Tab 2: Reply to Posts
Purpose: Facilitate replies to existing Threads posts.


Feed Display:


A feed mimicking Threads’ format (captions below media).


If the displayed post is a reply to a parent post, then it is displayed with the parent post in italics above.


Reply Panel:


Each post has an associated panel (box of controls)  that displays directly underneath it with:


An editable text box pre-filled with a Gemini-generated reply suggestion.


A Post button.


A Generate New Reply button.


Pagination: Feed displays 10 posts per page.


Post Query:


Dropdown menu options including:


Users: A list of accounts managed in the Application Control Panel (Tab 4).


Topics: Categories such as “AI,” “Politics,” “Music” (also managed in Tab 4).


Functionality:


The system displays 10 retrieved Threads posts and generates a suggested reply to each.


Users have the flexibility to edit and post the replies immediately. Or to do nothing.


3.3 Tab 3: Image Control Panel/Browser
Purpose: Provide a control panel and browser for images stored in the “bearpics” GCP storage bucket.


Future Development:


Expand to include an Instagram posting function.


3.4 Tab 4: Application Control Panel
Purpose: Offer comprehensive controls for various application settings and monitoring.


Features:


AI Model Selection: Choose which AI models to use. (GhatGPT, Gemini - text; Leonardo.AI, Dalle, Imagen - Images)


Threads Account Selection:


Ability to select a different Threads account for posting, enabling multiple account management.


System Instructions Management:


Ability to view, update, and select different system instructions for various contexts or purposes.


Account Management: View and manage Threads accounts.


Monitoring: View debugging logs and code status outputs.


4. Further System Ideas and Features
Error Handling & Logging:


Implement robust error handling and logging display mechanisms. 


Performance & Scalability:


Provide asynchronous processing for text and image generation to minimize wait times.


Implement caching strategies for repeated image queries.
  