from transformers import AutoTokenizer, BartForConditionalGeneration

tokenizer = AutoTokenizer.from_pretrained("facebook/bart-large-cnn")
model = BartForConditionalGeneration.from_pretrained("facebook/bart-large-cnn")

input_text = "Simplify: The patient was admitted to the emergency department due to a myocardial infarction."
inputs = tokenizer(input_text, return_tensors="pt")

summary_ids = model.generate(inputs["input_ids"], max_length=100, num_beams=4, early_stopping=True)
print(tokenizer.decode(summary_ids[0], skip_special_tokens=True))
