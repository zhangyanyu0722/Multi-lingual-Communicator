import json
from ibm_watson import LanguageTranslatorV3
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
# https://cloud.ibm.com/docs/language-translator?topic=language-translator-identifiable-languages&locale=en-US
url = '*****'

authenticator = IAMAuthenticator('*****')
language_translator = LanguageTranslatorV3(
    version='2018-05-01',
    authenticator=authenticator
)

language_translator.set_service_url(url)

# translation = language_translator.translate(
#     text='床前明月光,疑是地上霜,举头望明月,低头思故乡.',
#     model_id='zh-en').get_result()
text='床前明月光,疑是地上霜,举头望明月,低头思故乡.'

translation = language_translator.translate(text, model_id=None, source='zh', target='en').get_result()

print(json.dumps(translation, indent=2, ensure_ascii=False))

# languages = language_translator.list_identifiable_languages().get_result()
# print(json.dumps(languages, indent=2))

# language = language_translator.identify(
#     'Language translator translates text from one language to another').get_result()
# print(json.dumps(language, indent=2))

# models = language_translator.list_models().get_result()
# print(json.dumps(models, indent=2))

