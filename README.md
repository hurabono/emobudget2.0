# Emobudget
![Thumnail](https://ik.imagekit.io/stephanie/git-thum/emobudget.png?updatedAt=1786471498909)
A mobile expense tracker that connects to real bank accounts and shows people where their money actually goes, including the spending they do because of how they feel.

Most young adults asking "why am I always out of money?" cannot answer it from a banking app. Transactions arrive as a flat list with no shape, and the spending that hurts most, the impulse purchase after a bad day, looks identical to groceries. Emobudget connects the account, groups what comes back, and surfaces the pattern.

## Preview
<img width="300" height="583" alt="emobudget-demo" src="https://github.com/user-attachments/assets/96fdf76b-5d68-4ce2-9831-51b165611f20" />


## What it does

- **Bank connection through Plaid.** Users link a real account through the Plaid Link SDK rather than typing transactions in by hand.
- **Account selection.** Multiple linked accounts, the user chooses which ones the dashboard reads from.
- **Transaction overview with emotional spending analysis.** Spending is grouped and charted so patterns are visible at a glance instead of buried in a list.
- **Important expense alerts.** Users register upcoming transactions that must not be missed, and the app tracks them against the balance.
- **Full authentication flow.** Sign up, email verification, login, forgot password, and reset password, all implemented rather than stubbed.

## Architecture

This repository is the **mobile client**. It talks to a Spring Boot REST API deployed on **Azure App Service (Canada Central)**.

```
Expo / React Native client  ──►  Spring Boot REST API (Azure App Service)
        │                                    │
        │                                    ├── PostgreSQL
   Plaid Link SDK                            ├── Spring Security (JWT)
                                             └── Python service for spending analysis
```

Authentication is JWT based. The token is held in `AsyncStorage` and attached by an Axios request interceptor in [`api/index.ts`](./api/index.ts), so every authenticated call carries it without the screens having to think about it.

Routing is file based through Expo Router, split into an `(auth)` group and an `(app)` group, so unauthenticated users cannot reach application screens by navigating.

## Built with

| | |
|---|---|
| Client | React Native, Expo, Expo Router, TypeScript |
| Styling | NativeWind (Tailwind CSS for React Native) |
| Banking | Plaid Link SDK (`react-native-plaid-link-sdk`) |
| Charts | `react-native-chart-kit` |
| HTTP | Axios with a JWT request interceptor |
| Backend | Spring Boot, PostgreSQL, Spring Security, Docker, deployed to Azure App Service |
| Analysis | Python, for spending pattern analysis |
| API testing | Postman, every endpoint verified before it was wired to the client |

## Run it locally

```bash
npm install
npx expo start
```

Then open it in Expo Go, an Android emulator, or an iOS simulator. The client points at the deployed Azure backend by default, so no local backend is required to try it.

## What I took from it

Connecting real financial accounts changes how you write everything else. Once actual bank data is moving through the app, every decision about where a token lives, which routes are protected, and what gets logged stops being theoretical. Wiring Plaid, then putting Spring Security in front of the paths that touch financial data, taught me more about handling sensitive data than any amount of reading would have.

---

Built by Stephanie (Heesu) Cho. September 2025.
