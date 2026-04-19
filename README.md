Salor
Automated AI negotiation for freight logistics. Built for the HappyRobot Challenge at the TUM Makeathon 2026.

Calling carriers one by one takes too much time. By the time you reach the last person on your list, the first person has already taken another job.

Salor is an automated sales dashboard. Instead of making one call at a time, it uses HappyRobot voice and text agents to talk to many carriers at the exact same time. When one carrier lowers their price, our central Memory Agent tells the other active agents right away. This drives the price down quickly.

How It Works
Smart Updates: If one carrier lowers their price to 1350 Euros over text, the other voice agents are updated immediately to use that new price to negotiate.

Live Screen: A smooth, interactive screen shows the live auction. You can watch data flow between the central system and the active carriers.

Human Control: Click on any active call to read the live text, check if the carrier is losing patience, and type a command to take over the call.

Carrier Trust: After the auction, data is saved to Cognee. This builds a trust score so the AI knows exactly who it is dealing with next time.

Tools We Used
Frontend: Next.js 14, React, Tailwind CSS

Animations: Framer Motion

Visuals: Lucide React

AI Phone System: HappyRobot

Long Term Memory: Cognee

How to Run It
Make sure you have Node 20 or higher installed on your computer.

1. Download the code

Bash
git clone https://github.com/Sai-Krishna-Sriyash/salor-dashboard.git
cd salor-dashboard
2. Install the required files

Bash
npm install
3. Start the server

Bash
npm run dev
Open http://localhost:3000 in your web browser.

Presentation Mode
For the presentation, the screen has a hidden button in the bottom right corner. Clicking it moves the screen through a planned script. This shows the visual animations and ranking changes safely without risking live internet delays on stage.
