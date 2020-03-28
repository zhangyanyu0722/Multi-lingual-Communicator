# Copyright (c) 2020 Yanyu Zhang zhangya@bu.edu All rights reserved.
import requests
import speech_recognition as sr
import pyaudio
import wave

def translate_voice(source_language, target_language):
    r = sr.Recognizer()
    with sr.Microphone() as source:
        audio_data = r.record(source, duration=5)
        print("Translating...")
        content = r.recognize_google(audio_data, language=source_language)

    url = "https://translation.googleapis.com/language/translate/v2"
    data = {
        'key':"",
        'source': source_language,
        'target': target_language,
        'q': content,
        'format': "text"
    }

    response = requests.post(url, data)
    res = response.json()
    result = res["data"]["translations"][0]["translatedText"]
    print(str(content)+"  --->  "+str(result))
    return result

if __name__ == '__main__':
	# https://cloud.google.com/translate/docs/languages   -->  查询语言的简称
    source = 'zh'
    target = 'en'
    result = translate_voice(source, target)

