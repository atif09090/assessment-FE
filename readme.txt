
# Next.js App Setup Instructions

Follow these steps to set up and run the Next.js application on your local machine:

---

## Prerequisites
- Ensure your local machine has **Node.js** installed, as it includes `npm`. Alternatively, ensure **Yarn** is installed if you prefer using it.

### To check for installed versions:
```bash
node -v
npm -v
yarn -v
```

If not installed, download and install Node.js from [nodejs.org](https://nodejs.org) (Yarn can be installed via `npm install -g yarn`).

---

## Setup Steps

1. **Delete Dependency Lock Files**  
   If the project contains `yarn.lock` or `package-lock.json` files, delete them to avoid potential dependency conflicts.  
   **Command:**
   ```bash
   rm -f yarn.lock package-lock.json
   ```

2. **Clear Cache**  
   Clear the package manager cache to ensure a clean installation.  
   **For npm:**  
   ```bash
   npm cache clean --force
   ```  
   **For Yarn:**  
   ```bash
   yarn cache clean --force
   ```

3. **Install Dependencies**  
   Install the required packages using your preferred package manager.  
   **For npm:**  
   ```bash
   npm install
   ```  
   **For Yarn:**  
   ```bash
   yarn
   ```

4. **Run the Development Server**  
   Start the local server to run the application.  
   **For npm:**  
   ```bash
   npm run dev
   ```  
   **For Yarn:**  
   ```bash
   yarn run dev
   ```

5. **Ensure Port 3000 Is Available**  
   By default, the frontend runs on **PORT 3000**. Check if it's available before starting the server.  
   If PORT 3000 is in use, terminate the conflicting process.  
   **To kill a process using PORT 3000:**  
   - **On macOS/Linux:**  
     ```bash
     lsof -i :3000
     kill -9 <PID>
     ```  
   - **On Windows (PowerShell):**  
     ```bash
     netstat -ano | findstr :3000
     Taskkill /PID <PID> /F
     ```

---

## Verify Setup
Once the server is running, open your browser and navigate to:  
[http://localhost:3000](http://localhost:3000)  

You should see the application running!
