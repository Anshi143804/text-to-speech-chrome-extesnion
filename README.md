# Speech to Text and Text Summarizer Chrome Extension

This project is a Chrome extension that allows users to convert speech to text and summarize large text passages into shorter versions (short, medium, and large) to make reading easier. It uses a **Flask API** that integrates with a **transformer-based summarization model** to perform the text summarization.

## Features

- **Speech-to-Text:** Converts spoken words into text using a simple interface.
- **Text Summarization:** Summarizes large chunks of text into three different lengths:
  - Short (30-40 words)
  - Medium (80-100 words)
  - Large (120-150 words)
- **Easy Integration:** The project exposes an API for summarization that can be integrated into the Chrome extension.

## Requirements

- **Python 3.x** or above
- **Flask** (for API development)
- **Flask-CORS** (for Cross-Origin Requests)
- **Transformers Library** from Hugging Face (for text summarization)
- **Torch** (PyTorch, required for transformer models)
  
### Install Dependencies

To set up the project locally, clone the repository and install the required dependencies using:

```bash
git clone https://github.com/Anshi143804/text-to-speech-chrome-extesnion.git
cd text-to-speech-chrome-extesnion
pip install -r requirements.txt
```

### Setup Instructions

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/Anshi143804/text-to-speech-chrome-extesnion.git
   cd text-to-speech-chrome-extesnion
   ```

2. **Install the Dependencies:**

   Run the following command to install all necessary dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. **Run the Flask API Server:**

   After installing the dependencies, you can start the Flask server to use the summarization API.

   ```bash
   python app.py
   ```

   The API server will run locally on `http://127.0.0.1:5000/`.

4. **Integrate with Chrome Extension:**

   The Chrome extension will communicate with the Flask API to convert speech to text and summarize the text.

---

## API Documentation

### `POST /summarize`

Summarizes the provided text into short, medium, or long summaries based on the `word_count` parameter.

#### Request Body:

```json
{
  "text": "Your input text goes here.",
  "word_count": "short"  // or "medium", "large"
}
```

- `text`: The text you want to summarize.
- `word_count`: The length of the summary. Can be one of the following:
  - "short" (30-40 words)
  - "medium" (80-100 words)
  - "large" (120-150 words)

#### Response:

```json
{
  "summary": "The summarized text will appear here."
}
```

#### Example Request:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"text": "Your long text here.", "word_count": "medium"}' http://127.0.0.1:5000/summarize
```

#### Example Response:

```json
{
  "summary": "This is the summarized version of your text."
}
```

---

## Model

This project uses the **DistilBART model** from Hugging Face to generate the summaries. It is a distilled version of the BART model fine-tuned for CNN/Daily Mail summarization.

- Model: `sshleifer/distilbart-cnn-12-6`
- Framework: PyTorch

### How Summarization Works

The text is preprocessed (e.g., removing URLs), and the text is then split into chunks if it exceeds the maximum input length for the model (2000 characters). Each chunk is passed to the summarization pipeline, which returns a summary. The summaries are cleaned and formatted before being combined into one final summary.

---

## Contributing

If you want to contribute to this project, feel free to open a pull request! Contributions are always welcome.

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Create a new pull request.

---


### Contact

For any queries or support, feel free to open an issue on GitHub, and I'll be happy to help!

