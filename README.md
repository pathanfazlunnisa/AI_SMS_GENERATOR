# AI Content Generator (Java + Spring Boot)

A responsive content-generation UI inspired by the supplied screenshot, with a Java 17 / Spring Boot REST API and plain HTML, CSS and JavaScript frontend.

## Requirements
- Java 17 or newer
- Maven 3.9+ (or use an IDE with Maven support)
- Git for publishing to GitHub

## Run locally
1. Unzip the project.
2. Open a terminal in the `ai-content-generator` folder.
3. Run `mvn spring-boot:run`.
4. Open http://localhost:8080 in your browser.
5. Choose a campaign type and tone, set the switches, enter a prompt and click **Generate 3 variants**.

The API is `POST /api/generate`. This starter uses a deterministic template-based generator, so it runs without an AI key or paid service. It is not connected to a real large language model. To use an actual AI provider, replace the logic in `ContentController.generate()` with a provider SDK/API call and keep API keys in environment variables, never in frontend JavaScript or a public GitHub repository.

## Build a runnable JAR
```bash
mvn clean package
java -jar target/ai-content-generator-1.0.0.jar
```

## Publish to GitHub
1. Create a new empty repository on https://github.com/new (do not add a README if you already have this one).
2. In a terminal inside this project folder, run:
```bash
git init
git add .
git commit -m "Initial AI Content Generator project"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```
3. Replace `YOUR-USERNAME` and `YOUR-REPOSITORY` with your GitHub username and repository name.
4. On GitHub, refresh the repository page to confirm the files are uploaded.

## Deploying the app
GitHub stores your source code; it does not automatically run a Spring Boot backend. For a live website, deploy the project to a Java-compatible host or build a frontend-only version for static hosting. A Spring Boot deployment needs a Java 17 runtime and should expose port 8080 (or respect the host's assigned port).

## Project structure
```text
ai-content-generator/
├── pom.xml
├── README.md
└── src/
    └── main/
        ├── java/com/example/contentgenerator/
        │   ├── ContentGeneratorApplication.java
        │   └── ContentController.java
        └── resources/
            ├── application.properties
            └── static/
                ├── index.html
                ├── styles.css
                └── app.js
```
