import time
from transformers import pipeline

class NShotMedicalClassifier:
    def __init__(self, model_name="facebook/bart-large-mnli", candidate_labels=None):
        self.classifier = pipeline("zero-shot-classification", model=model_name)
        self.labels = candidate_labels or [
            "medical report", "technical documentation", "news article", "personal message",
            "social media post", "casual conversation", "legal text", "educational content",
            "code or programming request", "AI prompt engineering"
        ]

    def classify(self, text: str, labels=None) -> dict:
        used_labels = labels if labels else self.labels
        result = self.classifier(text, used_labels)
        return dict(zip(result["labels"], result["scores"]))

    def is_medical(self, text: str) -> bool:
        used_labels = self.labels
        result = self.classifier(text, used_labels)
        top_labels = result["labels"][:3]
        return "medical report" in top_labels

    def top_labels(self, text: str, top_k=3):
        result = self.classifier(text, self.labels)
        return result["labels"][:top_k], result["scores"][:top_k]


classifier = NShotMedicalClassifier()

def stream_classification_result(prompt: str):
    yield "Running classification task...\n"

    labels, scores = classifier.top_labels(prompt)
    yield "\nTop Predictions:\n"
    for label, score in zip(labels, scores):
        yield f"- {label}: {score:.2%}\n"

    if "medical report" in labels:
        yield "\nThis looks like a medical report.\n"
    else:
        yield "\nThis input does not appear to be a medical report.\n"
