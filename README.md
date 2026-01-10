# dev-ai-tools
repository for my advances and homework for the datatalksclub AI Coding Tools

#### AI Coding Tools Compared: ChatGPT, Claude, Copilot, Cursor, Lovable and AI Agents

* `create snake game using react`

* `how do I run it locally` min 10:36

```bash npm create vite@latest snake-chatgpt --template react
cd snake-game
npm install
``` 

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

In this case the `npx tailwindcss init -p` will fail that's because the LLM basically looks everything they can access on the internet, then. They process all this information (I think Alexey meant the time of training). So this was some time back when 
tailwind was initialized with that command but now is different.

Solution: Tell chatgpt to use search to find the most up to date instructions for tailwindcss
Answer: `npm install tailwindcss @tailwindcss/postcss`


# Coding Assistants / IDEs

- [Claude Code](https://www/anthropic.com/claude-code)

```bash
npm install -g @anthropic-ai/claude-code 
``` 
# Antigravity

#### Must Have 
* github cli
* antigravity
* The goal is to connect through ssh
  
  - `gh auth login`
    - `Where do you use GitHub? GitHub.com`
    - `What is your preferred protocol for Git operations on this host? SSH`
    - `Upload your SSH publick key to your GitHub account? <public_key_path>`
    - `Title for your SSH key: GitHub CLI`
    - `How would you like to autheticate GitHub CLI? Login with a web browser`

    We should expect a
    - `First copy your one-time code: `
   
#### Create codespaces
  - run `gh cs create`
  - Repository: <github_handler>/<repo_name>
  - Branch
  - Choose Machine Type

#### Connect Antigravity
  - must add new record to `.ssh/codespaces.auto` using `gh cs ssh --config -c <codespaces_name>` this command will return the host information to be added int he `.ssg/config` file all you need is a codespace instance name that's it
