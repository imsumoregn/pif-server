Backend (version 2) for SheCodes Mentorship Platform

* How to run project:
    - If you already setup before: "npm run dev"
    - Else:
        + Step 1: Create new file named "environment.local.js" in environments folder.
        + Step 2: Depend on current environment, you copy suitable file ("environment.dev.js" or "environment.prod.js") into "environment.local.js". In development, recommend using "environment.dev.js".
        + Step 3: Run "npm run init:db" to initialize database structure. Besure that you have postgres service on your machine.
        + Step 4: "npm run dev"