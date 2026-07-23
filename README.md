# GoodFirstFind

## Why GoodFirstFind?
Jumping into open source can feel overwhelming - thousands of repositories, unfamiliar codebases, and issues that are either too complex or already taken. GoodFirstFind bridges that gap for aspiring developers:
- Tailored Matchmaking: Finds open-source issues aligned directly with your current programming languages and comfort level.
- Streamlined Discovery: Searches GitHub live so you can skip endless filtering and start tackling beginner-friendly (good-first-issue) tasks immediately.
- Quest Tracking: Organize your open-source journey by saving issues into a personal quest board, keeping you motivated as you move from your first commit to a merged PR.

## Backend setup
```bash
cd server
npm install
npm run dev
```

## Frontend setup
```bash
cd client
npm install
npm run dev
```
This is a complete Vite project now — no manual scaffolding needed, just `npm install` and go.

## Try it end-to-end
1. Start both servers, log in with GitHub as before
2. From the dashboard, click **Edit Skills** - add a language (e.g. "JavaScript") with a comfort level, save
3. Click **Browse Issues** - search a language (try one with a lot of open-source activity, e.g. JavaScript or Python), save a couple as quests
4. Click **My Quests** - change status on a saved quest (Saved → In Progress → PR Submitted → Completed), or remove one

## Features to be Added
1. Simple match score: weight by language overlap, label match, maybe repo star count/activity as a "not too intimidating" signal
2. "Recommended for you" section on dashboard using that score
3. Background job (node-cron) to periodically sync/cache issues instead of live-querying GitHub on every page load - solves rate limits and speeds up the UI