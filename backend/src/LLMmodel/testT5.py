# T5 for text simplification
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

tokenizer = AutoTokenizer.from_pretrained("google/flan-t5-large")
model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-large")

input_text = "Simplify this text: The patient, a 67-year-old male with a history of chronic obstructive pulmonary disease (COPD) and type 2 diabetes mellitus, presented to the emergency department with complaints of dyspnea, diaphoresis, and chest discomfort radiating to the left arm. Initial electrocardiography (ECG) indicated ST-segment elevation, suggestive of an acute myocardial infarction. The patient was immediately administered 325 mg of aspirin and 4 mg of morphine sulfate, followed by an urgent coronary angiography revealing a 95% occlusion in the left anterior descending (LAD) artery. A drug-eluting stent was placed to restore perfusion. Post-procedure, the patient was started on dual antiplatelet therapy with aspirin and clopidogrel."
input_ids = tokenizer(input_text, return_tensors="pt").input_ids

outputs = model.generate(input_ids, max_length=150, num_beams=5, early_stopping=True)
print(tokenizer.decode(outputs[0], skip_special_tokens=True))
