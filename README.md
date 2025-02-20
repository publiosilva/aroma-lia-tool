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

## 📖 License
This project is licensed under [MIT License](LICENSE).

## 🤝 Contributing
We welcome contributions! Feel free to submit issues or pull requests.

## 📬 Contact
For questions or support, please reach out via [GitHub Issues](https://github.com/publiosilva/aromalia/issues).
