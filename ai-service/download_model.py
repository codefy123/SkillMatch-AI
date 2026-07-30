from sentence_transformers import SentenceTransformer

print("Downloading model...")

model = SentenceTransformer('all-MiniLM-L6-v2')

model.save('./model')

print("Model downloaded and saved locally!")