# AromaLIA - Language-Independent Test Smell Analyzer

AromaLIA is a tool designed to analyze test smells in a language-independent manner, providing insights into improving test quality.

## 🚀 Getting Started

### Prerequisites
Ensure you have [Docker](https://www.docker.com/get-started) installed on your system.

### Build the Docker Image
To build the AromaLIA Docker image, run the following command:

```sh
docker build -t aromalia .
```

### Run the Container
Execute the following command to start AromaLIA:

```sh
docker run --rm -it -p 3000:3000 -p 8000:8000 aromalia
```

### Access the Application
Once the container is running, open your browser and navigate to:

```
http://localhost:8000
```

## AromaLIA API

When the Docker image is running, an API is available on port 3000. You can use the API by making the following request:

```bash
curl --location 'http://localhost:3000/test-smells/detect' \
--header 'Content-Type: application/json' \
--data '{
    "language": "csharp | java | python",
    "framework": "xunit | junit | pytest",
    "repositoryURL": "https://github.com/public/repository/url"
}'
```

### Parameters:
- **`language`**: The programming language of the repository (`csharp`, `java`, or `python`).
- **`framework`**: The testing framework used (`xunit`, `junit`, or `pytest`).
- **`repositoryURL`**: The URL of the public repository to analyze.

## 🤝 Contributing
We welcome contributions! Feel free to submit issues or pull requests.

## 📬 Contact
For questions or support, please reach out via [GitHub Issues](https://github.com/publiosilva/aromalia/issues).
