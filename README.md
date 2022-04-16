Backend (version 2) for SheCodes Mentorship Platform

* How to run project:
    - If you already setup before: "npm run dev"
    - Else:
        + Step 1: Create new file named "environment.local.js" in environments folder.
        + Step 2: Depend on current environment, you copy suitable file ("environment.dev.js" or "environment.prod.js") into "environment.local.js". In development, recommend using "environment.dev.js".
        + Step 3: Run "npm run init:db" to initialize database structure. Besure that you have postgres service on your machine.
        + Step 4: "npm run dev"

* Folder structure:
    - config: contains json config of services (migrations, firebase, ...)
    - environments: where to put application config for specified environment (development, production, ...)
    - logs: store all activities of entire application.
    - middlewares: includes code that provides common services before request come into routes.
    - migrations: contains file to change database structure.
    - models: where to put database model.
    - modules: includes all main modules of application.
    - node_modules: third party libraries.
    - setup: js config of services for init application.
    - templates: contains html templates.