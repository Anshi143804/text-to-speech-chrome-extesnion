from flask import Flask, request, jsonify
from flask_cors import CORS 
from transformers import pipeline, AutoModelForSeq2SeqLM, AutoTokenizer
import re  

app = Flask(__name__)
CORS(app)  

model_name = "sshleifer/distilbart-cnn-12-6"
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)  
tokenizer = AutoTokenizer.from_pretrained(model_name)

summarizer = pipeline("summarization", model=model, tokenizer=tokenizer, framework="pt")

def clean_summary(text):
    cleaned_text = re.sub(r'\.+', '.', text) 
    cleaned_text = re.sub(r'\s*\.\s*', '. ', cleaned_text)  
    cleaned_text = cleaned_text.replace(' .', '.').strip()  
    return cleaned_text

def format_summary(text):
    text = re.sub(r'\s+', ' ', text)
    text = text.capitalize() 
    return text.strip()

def preprocess_text(text):
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
    return text.strip()

 # min_length, max_length
def get_summary_lengths(word_count):
    if word_count == 'short':
        return 30, 40  
    elif word_count == 'mid':
        return 80, 100  
    elif word_count == 'large':
        return 120, 150  
    else:
        return 30, 40  

@app.route('/summarize', methods=['POST'])
def summarize_text():
    data = request.json
    text = data.get('text', '')
    word_count = data.get('word_count', 'short') 

    if not text:
        return jsonify({'error': 'No text provided'}), 400

    processed_text = preprocess_text(text)

    max_input_length = 2000  
    chunks = [processed_text[i:i + max_input_length] for i in range(0, len(processed_text), max_input_length)]
    
    summaries = []

    min_length, max_length = get_summary_lengths(word_count)

    try:
        for chunk in chunks:
            summary = summarizer(chunk, 
                                 max_length=max_length, 
                                 min_length=min_length,
                                 do_sample=False)  
            summarized_text = summary[0]['summary_text']
            cleaned_summary = clean_summary(summarized_text) 
            formatted_summary = format_summary(cleaned_summary)  
            summaries.append(formatted_summary) 

        # Combine the summaries
        combined_summary = " ".join(summaries)
        return jsonify({'summary': combined_summary}) 
    except Exception as e:
        return jsonify({'error': str(e)}), 500  

if __name__ == '__main__':
    app.run(debug=True)
