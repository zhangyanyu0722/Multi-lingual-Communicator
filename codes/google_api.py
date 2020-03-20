import  requests
# https://cloud.google.com/translate/docs/languages
def translate_text(content, target):
	url = "https://translation.googleapis.com/language/translate/v2"
	data = {
	    'key':"*************",
	    'source': "",
	    'target': target,
	    'q': content,
	    'format': "text"
	}
	response = requests.post(url, data)
	res = response.json()
	result = res["data"]["translations"][0]["translatedText"]
	return result

if __name__ == '__main__':
	content = "床前明月光,疑是地上霜,举头望明月,低头思故乡."
	target = 'en'
	result = translate_text(content, target)
	print(result)

