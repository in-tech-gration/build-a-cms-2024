# First Steps

Get access to the repo (after the lectures)

git clone git@github.com:in-tech-gration/build-a-cms-2024.git

Branch:
  - Production: main
  - Development: dev

# Set up a Node.js + TypeScript environment

(Based on: https://www.learnwithjason.dev/blog/modern-node-server-typescript-2024/)

Requirement: "node": ">=20.6.0"

You can run `node --version` to check your version.

- Initialize an npm project (create a `package.json`)
- `npm init -y`
- Install dependencies:
  - `npm i -D typescript ts-node @types/node`
  - Review npm packages: `npm view typescript` or `npm view ts-node description`
  - You can also check about the security (before installing): `npq i typescript`