import googletrans
from googletrans import Translator
# print(googletrans.LANGUAGES)

text1 = '''
我是一只Osama
'''
text2 = '''
我是一只小小小鸟
'''

translator = Translator()

dt = translator.detect(text1)

translated = translator.translate(text2, src='zh-cn', dest='en')

print(translated.text)

