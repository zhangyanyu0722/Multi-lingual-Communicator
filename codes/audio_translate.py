import speech_recognition as sr
import googletrans
from googletrans import Translator

r = sr.Recognizer()

with sr.Microphone() as source:
    audio_data = r.record(source, duration=5)
    print("Recognizing...")
    text = r.recognize_google(audio_data)
    print(text)

text = r.recognize_google(audio_data, language="es-ES")

translator = Translator()

dt = translator.detect(text)

translated = translator.translate(text, src='en', dest='zh-cn')

print(translated.text)